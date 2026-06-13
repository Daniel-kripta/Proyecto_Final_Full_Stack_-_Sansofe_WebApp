import os
import psycopg2
from google import genai
from google.genai import types


def _embed_query(text: str) -> list[float]:
    client = genai.Client(
        vertexai=True,
        project=os.environ["GCP_PROJECT"],
        location=os.getenv("GCP_LOCATION", "europe-west4"),
    )
    result = client.models.embed_content(
        model="text-multilingual-embedding-002",
        contents=[text],
        config=types.EmbedContentConfig(task_type="RETRIEVAL_QUERY"),
    )
    return result.embeddings[0].values


UMBRALES = {"exacto": 0.40, "cercano": 0.55, "similar": 0.70}
UMBRAL_BASE = 0.60


def similarity_search(
    query: str,
    k: int = 10,
    year: int | None = None,
    publicacion: str | None = None,
    umbral: str | None = None,
) -> list[dict]:
    vec = _embed_query(query)
    vec_str = "[" + ",".join(str(v) for v in vec) + "]"

    where_clauses = ["embedding IS NOT NULL"]
    where_params: list = []

    if year is not None:
        where_clauses.append("EXTRACT(YEAR FROM date) = %s")
        where_params.append(year)
    if publicacion is not None:
        where_clauses.append("publication ILIKE %s")
        where_params.append(f"%{publicacion}%")

    where = "WHERE " + " AND ".join(where_clauses)
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    if umbral:
        threshold = UMBRALES.get(umbral, 0.35)
        params = where_params + [vec_str, threshold, vec_str]
        cur.execute(
            f"""
            SELECT id, headline, date, publication, body
            FROM articulos
            {where}
            AND embedding <=> %s::vector <= %s
            ORDER BY embedding <=> %s::vector
            LIMIT 10
            """,
            params,
        )
    else:
        params = where_params + [vec_str, UMBRAL_BASE, vec_str, k]
        cur.execute(
            f"""
            SELECT id, headline, date, publication, body
            FROM articulos
            {where}
            AND embedding <=> %s::vector <= %s
            ORDER BY embedding <=> %s::vector
            LIMIT %s
            """,
            params,
        )

    rows = cur.fetchall()
    cur.close()
    conn.close()

    return [
        {
            "id": str(row[0]),
            "headline": row[1] or "",
            "date": str(row[2]),
            "publication": row[3] or "",
            "body": row[4] or "",
            "url": f"/articulo/{row[0]}",
        }
        for row in rows
    ]

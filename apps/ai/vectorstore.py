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


def similarity_search(query: str, k: int = 10) -> list[dict]:
    vec = _embed_query(query)
    vec_str = "[" + ",".join(str(v) for v in vec) + "]"

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()
    cur.execute(
        """
        SELECT id, headline, date, publication, body
        FROM articulos
        WHERE embedding IS NOT NULL
        ORDER BY embedding <=> %s::vector
        LIMIT %s
        """,
        (vec_str, k),
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

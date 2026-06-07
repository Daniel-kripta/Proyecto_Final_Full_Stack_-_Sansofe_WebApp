import os
import time
from dotenv import load_dotenv
from google import genai
from google.genai import types
import psycopg2

load_dotenv()

CLIENTE = genai.Client(
    vertexai=True,
    project=os.environ["GCP_PROJECT"],
    location=os.getenv("GCP_LOCATION", "europe-west4"),
)

BATCH = 5

conn = psycopg2.connect(os.environ["DATABASE_URL"])
cur = conn.cursor()

cur.execute("SELECT COUNT(*) FROM articulos WHERE embedding IS NULL")
total = cur.fetchone()[0]
print(f"{total} artículos sin embedding")
procesados = 0

while True:
    cur.execute("""
        SELECT id, headline, body FROM articulos
        WHERE embedding IS NULL LIMIT %s
    """, (BATCH,))
    rows = cur.fetchall()
    if not rows:
        break

    ids = [r[0] for r in rows]
    textos = [f"{r[1]}. {r[2][:1000]}" for r in rows]

    try:
        result = CLIENTE.models.embed_content(
            model="text-multilingual-embedding-002",
            contents=textos,
            config=types.EmbedContentConfig(task_type="RETRIEVAL_DOCUMENT"),
        )
        for id_, emb in zip(ids, result.embeddings):
            vec_str = "[" + ",".join(str(v) for v in emb.values) + "]"
            cur.execute("UPDATE articulos SET embedding = %s WHERE id = %s", (vec_str, id_))
        conn.commit()
        procesados += len(rows)
        print(f"[{procesados}/{total}]")
        time.sleep(0.1)
    except Exception as e:
        print(f"Error: {e}")
        conn.rollback()
        time.sleep(2)

cur.close()
conn.close()
print("Completado.")

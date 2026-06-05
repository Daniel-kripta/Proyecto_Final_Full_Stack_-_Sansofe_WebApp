import json
import os
from pathlib import Path

import psycopg2
import psycopg2.extras
from dotenv import load_dotenv

load_dotenv()

CORPUS_DIR = Path(__file__).parent / "corpus" / "json"
STATE_FILE = Path(__file__).parent / "logs" / "import_state.txt"

FIELDS = [
    "publication", "date", "edition", "source_id", "headline",
    "subheadline", "body", "byline", "section", "genre",
    "topics", "people", "entities", "places", "summary",
    "has_image", "uncertain_fields",
]

INSERT_SQL = f"""
    INSERT INTO articulos ({", ".join(FIELDS)})
    VALUES %s
"""


def load_state() -> set:
    if not STATE_FILE.exists():
        return set()
    return set(STATE_FILE.read_text().splitlines())


def save_state(processed: set) -> None:
    STATE_FILE.parent.mkdir(exist_ok=True)
    STATE_FILE.write_text("\n".join(sorted(processed)))


def normalize_list(val) -> list | None:
    if not isinstance(val, list):
        return val
    return [item["name"] if isinstance(item, dict) else item for item in val]


def article_to_row(art: dict) -> tuple:
    row = []
    list_fields = {"topics", "people", "entities", "places", "uncertain_fields"}
    for f in FIELDS:
        val = art.get(f)
        row.append(normalize_list(val) if f in list_fields else val)
    return tuple(row)


def main() -> None:
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()
    processed = load_state()
    json_files = sorted(CORPUS_DIR.glob("**/*.json"))
    total = len(json_files)

    for i, path in enumerate(json_files, 1):
        key = str(path.relative_to(CORPUS_DIR))
        if key in processed:
            continue

        articles = json.load(open(path, encoding="utf-8"))
        rows = [article_to_row(art) for art in articles]
        psycopg2.extras.execute_values(cur, INSERT_SQL, rows)
        conn.commit()

        processed.add(key)
        save_state(processed)
        print(f"[{i}/{total}] {len(rows)} artículos — {path.name}")

    cur.close()
    conn.close()
    print("Importación completada.")


if __name__ == "__main__":
    main()

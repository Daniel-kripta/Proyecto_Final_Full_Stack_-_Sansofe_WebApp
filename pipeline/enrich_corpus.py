import json
import os
import time
from pathlib import Path

from google import genai
from dotenv import load_dotenv

load_dotenv()

CLIENTE = genai.Client(
    vertexai=True,
    project=os.environ["GOOGLE_CLOUD_PROJECT"],
    location=os.getenv("GOOGLE_CLOUD_LOCATION", "europe-west4"),
)

CORPUS_DIR = Path(__file__).parent / "corpus" / "json"
STATE_FILE = Path(__file__).parent / "logs" / "enrich_state.txt"
FAILURES_FILE = Path(__file__).parent / "logs" / "enrich_failures.jsonl"

MAX_REINTENTOS = 3
PAUSA = 0.5

PROMPT_TEMPLATE = """Analiza este artículo de prensa histórica española de 1926 y extrae la siguiente información en JSON.

ARTÍCULO:
Titular: {headline}
Texto: {body}

Devuelve ÚNICAMENTE un objeto JSON con esta estructura exacta:
{{
  "people": [...],
  "entities": [...],
  "places": [...],
  "topics": [...]{summary_field}
}}

Instrucciones:
- "people": lista de personas históricamente relevantes mencionadas (figuras públicas internacionales, nacionales, regionales o locales reconocibles). Usa el nombre canónico completo cuando el contexto lo permita. Si no hay ninguna, devuelve [].
- "entities": lista de entidades no personales relevantes mencionadas: instituciones (Cabildo Insular, Diputación, Ayuntamiento), clubes deportivos, empresas, asociaciones, organismos oficiales. Usa el nombre canónico. Si no hay ninguna, devuelve [].
- "places": lista de lugares geográficos reconocibles (ciudades, regiones, países). Usa el nombre canónico. Si no hay ninguno relevante, devuelve [].
- "topics": entre 1 y 4 categorías temáticas de esta lista: política, economía, sociedad, cultura, deportes, sucesos, internacional, local, religión, anuncios, agricultura, militar. Elige las más apropiadas.{summary_instructions}

No incluyas personas mencionadas de pasada sin identificación posible.
No incluyas lugares vagos o sin identificación geográfica clara.
No incluyas entidades genéricas sin nombre propio ("el gobierno", "las autoridades").
"""

SUMMARY_FIELD = ',\n  "summary": "..."'
SUMMARY_INSTRUCTIONS = '\n- "summary": resumen en una o dos frases del contenido del artículo.'


class EnrichError(Exception):
    def __init__(self, message: str, raw: str):
        super().__init__(message)
        self.raw = raw


def enrich_article(art: dict) -> dict:
    needs_summary = not art.get("summary")
    prompt = PROMPT_TEMPLATE.format(
        headline=art.get("headline", ""),
        body=art.get("body", "")[:3000],
        summary_field=SUMMARY_FIELD if needs_summary else "",
        summary_instructions=SUMMARY_INSTRUCTIONS if needs_summary else "",
    )
    response = CLIENTE.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config={"response_mime_type": "application/json", "thinking_config": {"thinking_budget": 0}},
    )
    try:
        data = json.loads(response.text)
    except json.JSONDecodeError as e:
        raise EnrichError(str(e), response.text)

    updated = {
        **art,
        "people": data.get("people", []),
        "entities": data.get("entities", []),
        "places": data.get("places", []),
        "topics": data.get("topics", []),
    }
    if needs_summary and data.get("summary"):
        updated["summary"] = data["summary"]
    return updated


def enrich_with_retry(art: dict) -> tuple[dict, bool]:
    for intento in range(1, MAX_REINTENTOS + 1):
        try:
            return enrich_article(art), True
        except EnrichError as e:
            if intento == MAX_REINTENTOS:
                log_failure(art, str(e), e.raw)
                return art, False
            time.sleep(intento * PAUSA)
        except Exception as e:
            if intento == MAX_REINTENTOS:
                log_failure(art, str(e), None)
                return art, False
            time.sleep(intento * PAUSA)
    return art, False


def log_failure(art: dict, error: str, raw: str | None) -> None:
    FAILURES_FILE.parent.mkdir(exist_ok=True)
    with open(FAILURES_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps({
            "source_id": art.get("source_id"),
            "headline": art.get("headline"),
            "error": error,
            "raw_response": raw,
        }, ensure_ascii=False) + "\n")


def load_state() -> set:
    if not STATE_FILE.exists():
        return set()
    return set(STATE_FILE.read_text().splitlines())


def save_state(processed: set) -> None:
    STATE_FILE.parent.mkdir(exist_ok=True)
    STATE_FILE.write_text("\n".join(sorted(processed)))


def main() -> None:
    processed = load_state()
    json_files = sorted(CORPUS_DIR.glob("**/*.json"))
    total = len(json_files)
    total_arts = 0
    total_fallos = 0

    for i, path in enumerate(json_files, 1):
        key = str(path.relative_to(CORPUS_DIR))
        if key in processed:
            continue

        articles = json.load(open(path, encoding="utf-8"))
        enriched = []
        fallos = 0

        for art in articles:
            art, ok = enrich_with_retry(art)
            if not ok:
                fallos += 1
            enriched.append(art)
            time.sleep(PAUSA)

        with open(path, "w", encoding="utf-8") as f:
            json.dump(enriched, f, ensure_ascii=False, indent=2)

        processed.add(key)
        save_state(processed)
        total_arts += len(articles)
        total_fallos += fallos
        estado = f" ({fallos} fallos)" if fallos else ""
        print(f"[{i}/{total}] {len(articles)} artículos{estado} — {path.name}")

    print(f"\nCompletado. {total_arts} artículos procesados, {total_fallos} fallos guardados en {FAILURES_FILE}")


if __name__ == "__main__":
    main()

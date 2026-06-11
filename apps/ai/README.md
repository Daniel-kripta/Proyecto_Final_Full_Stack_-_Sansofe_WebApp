# Microservicio IA — Python + FastAPI + LangGraph

Agente RAG para el proyecto Sansofé. Clasifica la consulta del usuario y responde con artículos relevantes del corpus histórico o con una síntesis generada por Gemini 2.5 Flash.

**Puerto**: `8001`

---

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/health` | Estado del servicio |
| POST | `/chat` | Enviar consulta al agente |

### POST `/chat`

```json
{
  "query": "¿Qué se decía sobre la huelga de portuarios?",
  "session_id": "uuid-del-usuario",
  "k": 10
}
```

El campo `k` (1–50, por defecto 10) controla cuántos artículos recupera el vectorstore.

**Respuesta**: lista de artículos relevantes o síntesis con fuentes citadas, según el tipo de consulta.

---

## Arquitectura del agente

```
consulta → Router ┬→ retrieve_only      → lista de artículos relevantes
                  └→ retrieve_and_synth → síntesis con fuentes citadas
```

El Router clasifica la intención con Gemini antes de enrutar. Si la consulta pide una lista, devuelve los artículos directamente. Si pide análisis o resumen, recupera artículos y sintetiza.

---

## Variables de entorno

```env
DATABASE_URL=postgresql://...
GOOGLE_APPLICATION_CREDENTIALS=/ruta/a/credenciales.json
GCP_PROJECT=nombre-del-proyecto
```

## Arrancar en local

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

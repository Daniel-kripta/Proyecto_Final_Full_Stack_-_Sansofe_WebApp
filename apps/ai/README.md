# Microservicio IA — Python + FastAPI + LangGraph

Agente RAG para el proyecto Sansofé. Clasifica la consulta del usuario y responde con artículos relevantes del corpus histórico o con una síntesis generada por Gemini 2.5 Flash.

**Puerto**: `8001` (solo accesible desde la red interna Docker en producción)

---

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/health` | Estado del servicio |
| POST | `/chat` | Enviar consulta al agente RAG |

### POST `/chat`

```json
{
  "query": "¿Qué se decía sobre la huelga de portuarios?",
  "session_id": "uuid-del-usuario",
  "k": 10,
  "umbral": null
}
```

| Campo | Tipo | Descripción |
|---|---|---|
| `query` | string | Consulta en lenguaje natural |
| `session_id` | string | UUID del usuario autenticado |
| `k` | number | Artículos máximos a recuperar en modo Cantidad (1–50, por defecto 10) |
| `umbral` | string \| null | Modo Similitud: `"exacto"`, `"cercano"` o `"similar"`. `null` activa el modo Cantidad |
| `gemini_api_key` | string | Clave de API de Gemini del usuario (inyectada por el backend Fastify) |

**Respuesta**:

```json
{
  "type": "lista" | "sintesis" | "irrelevante",
  "content": "texto de respuesta",
  "sources": [{ "id": "...", "headline": "...", "date": "...", "publication": "..." }]
}
```

---

## Arquitectura del agente

```
consulta → Router ┬→ retrieve_only      → lista de artículos relevantes
                  └→ retrieve_and_synth → síntesis con fuentes citadas
```

El Router clasifica la intención con Gemini antes de enrutar:
- Consultas factuales o de listado → `retrieve_only` → devuelve artículos directamente
- Consultas analíticas o de síntesis → `retrieve_and_synth` → recupera y sintetiza con fuentes

---

## Modos de recuperación vectorial

El vectorstore usa pgvector con distancia coseno (`<=>`):

| Modo | Parámetro | Comportamiento |
|---|---|---|
| Cantidad | `k` (entero) | Devuelve los k artículos más cercanos que superen un umbral base de calidad (distancia ≤ 0.60) |
| Similitud Exacto | `umbral="exacto"` | Solo artículos con distancia ≤ 0.40 |
| Similitud Cercano | `umbral="cercano"` | Artículos con distancia ≤ 0.55 |
| Similitud Similar | `umbral="similar"` | Artículos con distancia ≤ 0.70 |

---

## Variables de entorno

```env
DATABASE_URL=postgresql://usuario:contraseña@db:5432/sansofe
GCP_PROJECT=nombre-del-proyecto-gcp
GCP_LOCATION=europe-west4
GEMINI_API_KEY=opcional_clave_gemini_global
```

La clave de Gemini se recibe por petición desde el backend Fastify (descifrada de la BD del usuario). La variable `GEMINI_API_KEY` del entorno es un fallback opcional.

---

## Arrancar en local

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

## Notas técnicas

- Los embeddings se generan con Vertex AI (`text-multilingual-embedding-002`, 768 dimensiones)
- El índice HNSW sobre el campo `embedding` está creado en la migración de BD
- La conexión a PostgreSQL es directa con `psycopg2` (no ORM) para las búsquedas vectoriales
- El agente LangGraph mantiene el grafo: `router → retrieve → [synth]`

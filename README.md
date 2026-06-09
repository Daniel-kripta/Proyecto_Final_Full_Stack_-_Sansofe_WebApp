# Sansofé. Repositorio de Prensa de Canarias

Web App para la consulta e investigación de prensa histórica canaria, con búsqueda de texto completo y asistente de investigación basado en RAG (*Retrieval-Augmented Generation*). El proyecto es un MVP de demostración de servicio.

Proyecto final del bootcamp Full Stack (junio 2026), construido con **Node.js + Fastify + Prisma**, **React 18 + Vite**, **Python + FastAPI**, **PostgreSQL + pgvector**, **Docker Compose**, **N8N** y un agente **LangGraph** con búsqueda semántica sobre el corpus histórico vía **Vertex AI (Gemini + Embeddings)**.

---

## Motivación

Los archivos históricos de prensa están digitalizados con OCR pero son difíciles de consultar: búsquedas básicas, sin contexto, sin cruce de fuentes, con textos truncados y palabras mal reconocidas. Este proyecto aborda ese problema aplicando Inteligencia Artificial tanto en la extracción del corpus como en la recuperación semántica de información, facilitando el acceso a investigadores en humanidades y periodismo con consultas como *"¿qué se decía en 1926 sobre la huelga de portuarios?"* o *"Dame todos los artículos donde se nombre a Pérez Galdós"*.

El MVP incluye publicaciones canarias de 1926 de dos periódicos, La Provincia y Gaceta de Tenerife — año elegido por corresponder al centenario. El proyecto está diseñado para ampliarse con nuevas publicaciones y períodos históricos.

---

## Funcionalidades

### Portal público
- **Portada histórica**: artículos publicados exactamente hace 100 años, generados una vez al día con N8N como contenido estático.
- **Búsqueda full-text**: titulares y cuerpos de artículos, con filtros por publicación, sección y género periodístico.
- **Detalle de artículo**: cuerpo completo con metadatos y publicación de origen.

### Asistente de investigación (requiere registro)
Responde consultas en lenguaje natural sobre el corpus histórico:
- **Búsqueda por relevancia**: devuelve una lista de artículos relevantes con enlace directo.
- **Síntesis con fuentes**: genera un resumen a partir de los artículos más relevantes, citando cada fuente.

### Área privada
- Registro y autenticación con JWT.
- Colecciones: guardar artículos en carpetas temáticas.
- Exportación de colecciones a CSV.

---

## Stack técnico

| Capa | Tecnología | Justificación |
|---|---|---|
| Frontend | React 18 + Vite + CSS Modules | SPA con tema vintage/moderno. Responsive: móvil (<600px), tablet (600–1023px), PC (≥1024px) |
| Backend CRUD | Node.js + Fastify + Prisma | Artículos, búsqueda, auth, colecciones |
| Microservicio IA | Python + FastAPI + LangGraph | Agente RAG con enrutamiento condicional |
| Base de datos | PostgreSQL 18.4 + pgvector | FTS nativo en español + búsqueda vectorial en una sola instancia |
| Embeddings | Vertex AI (`text-multilingual-embedding-002`) | 768 dimensiones, optimizado para español |
| LLM | Gemini 2.5 Flash (Google AI Studio) | Síntesis RAG (API key aportada por el usuario) y extracción del corpus |
| Automatización | N8N | Generación diaria de la portada histórica |
| Despliegue | Docker Compose + Nginx + kripta.dev | Servidor propio, sin dependencias de pago adicionales |

---

## Arquitectura

```
Usuario
    │
    ▼
┌─────────────────────────────────────────────┐
│           FRONTEND (React + Vite)           │
│  Portada │ Búsqueda │ Chat │ Área privada   │
└──────────────────────┬──────────────────────┘
                       │ HTTP/JSON
                       ▼
          ┌────────────────────────┐
          │  BACKEND               │
          │  Node.js + Fastify     │
          │                        │
          │  GET  /articulos       │
          │  GET  /portada         │
          │  POST /auth            │
          │  GET  /colecciones     │
          │  POST /chat ───────────┼──→ MICROSERVICIO IA
          └──────────┬─────────────┘     Python + FastAPI
                     │                   LangGraph agent
                     ▼                   (red interna Docker)
     ┌──────────────────────────┐
     │  PostgreSQL + pgvector   │
     │  articulos (FTS + vector)│
     │  usuarios │ colecciones  │
     └──────────────────────────┘
```

El agente LangGraph clasifica la consulta antes de responder:

```
consulta → Router ┬→ retrieve_only     → lista de artículos relevantes
                  └→ retrieve_and_synth → síntesis con fuentes citadas
```

---

## Corpus

| Publicación | Año | Ejemplares | Artículos |
|---|---|---|---|
| La Provincia | 1926 | 295 | ~19.000 |
| Gaceta de Tenerife | 1926 | 310 | ~19.800 |
| **Total** | | **605** | **~38.800** |

Los artículos se extraen de PDF mediante Gemini 2.5 Flash y se almacenan con su embedding vectorial para búsqueda semántica. El pipeline completo está en `pipeline/`.

---

## Estructura del repositorio

```
sansofe-webapp/
├── apps/
│   ├── api/          # Node.js + Fastify + Prisma (backend CRUD/auth)
│   ├── web/          # React 18 + Vite + CSS Modules (frontend)
│   └── ai/           # Python + FastAPI + LangGraph (microservicio IA)
├── db/
│   └── migrations/   # Migraciones SQL
├── pipeline/         # Scripts de extracción e importación del corpus
├── n8n-workflows/    # Workflows N8N exportados como JSON
├── docs/
│   ├── postman.json  # Colección Postman
│   └── uso-ia.md    # Informe de uso de IA
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Puesta en marcha

### Requisitos

- Docker y Docker Compose
- Node.js 20+ y pnpm
- Python 3.11+
- Cuenta de Google Cloud con Vertex AI habilitado (solo para regenerar el corpus; no necesario para ejecutar la app)

### Instalación

```bash
git clone https://github.com/Daniel-kripta/Proyecto_Final_Full_Stack_-_Sansofe_WebApp
cd Proyecto_Final_Full_Stack_-_Sansofe_WebApp
cp .env.example .env
# Rellenar variables en .env
```

### Levantar el entorno

```bash
# Base de datos
docker compose up -d db

# Backend
cd apps/api && pnpm install && pnpm dev

# Frontend
cd apps/web && pnpm install && pnpm dev

# Microservicio IA
cd apps/ai && python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

---

## Despliegue

El proyecto se despliega en servidor propio (Hetzner CX23, `kripta.dev`) con Docker Compose y Nginx como reverse proxy. No hay dependencia de servicios externos de pago salvo Google Cloud (Vertex AI).

---

## Metodología de trabajo

El proyecto se desarrolla en 15 días (3–15 junio 2026) dividido en fases. Las cuatro primeras son secuenciales. A partir de la fase 03 se abren cuatro tracks que avanzan en paralelo y convergen en el bloque de despliegue final.

```mermaid
graph TD
    P00("00 · Pipeline ✅"):::done --> P01("01 · Monorepo ✅"):::done
    P01 --> P02("02 · Docker DB ✅"):::done
    P02 --> P03("03 · Schema ✅"):::done

    P03 --> A1("A1 · Fastify+Prisma ✅"):::done
    P03 --> B1("B1 · Import JSON ✅"):::done
    P03 --> C1("C1 · React+Router ✅"):::done

    A1 --> A2("A2 · GET artículo ✅"):::done
    A2 --> A3("A3 · GET portada ✅"):::done
    A3 --> A4("A4 · Búsqueda FTS ✅"):::done
    A4 --> A5("A5 · Auth JWT"):::backend
    A5 --> A6("A6 · Colecciones"):::backend
    A6 --> A7("A7 · Export CSV"):::backend
    A7 --> A8("A8 · Proxy chat"):::backend

    B1 --> B2("B2 · Embeddings ✅"):::done
    B2 --> B3("B3 · Normalización datos"):::data

    C1 --> C2("C2 · Layout"):::frontend
    C2 --> C3("C3 · Portada"):::frontend
    C3 --> C4("C4 · Búsqueda"):::frontend
    C4 --> C5("C5 · Artículo"):::frontend
    C5 --> C6("C6 · Auth"):::frontend
    C6 --> C7("C7 · Colecciones"):::frontend
    C7 --> C8("C8 · Páginas legales"):::frontend

    B2 --> D1("D1 · FastAPI ✅"):::done
    D1 --> D2("D2 · Vectorstore ✅"):::done
    D2 --> D3("D3 · Router ✅"):::done
    D3 --> D4("D4 · Recuperar ✅"):::done
    D4 --> D5("D5 · Síntesis ✅"):::done
    D5 --> D6("D6 · Chat endpoint ✅"):::done

    A8 --> F1("F1 · Dockerfiles"):::deploy
    C8 --> F1
    D6 --> F1

    F1 --> F2("F2 · Docker Compose"):::deploy
    F2 --> F3("F3 · N8N"):::deploy
    F3 --> F4("F4 · Nginx+SSL"):::deploy
    F4 --> F5("F5 · Deploy 🚀"):::deploy

    classDef done fill:#4ade80,stroke:#16a34a,color:#000
    classDef setup fill:#94a3b8,stroke:#475569,color:#000
    classDef backend fill:#60a5fa,stroke:#2563eb,color:#000
    classDef data fill:#f59e0b,stroke:#d97706,color:#000
    classDef frontend fill:#a78bfa,stroke:#7c3aed,color:#000
    classDef ai fill:#f472b6,stroke:#db2777,color:#000
    classDef deploy fill:#34d399,stroke:#059669,color:#000
```

| Color | Track | Descripción |
|---|---|---|
| 🟦 Azul | Backend (A) | API REST con Fastify, Prisma y autenticación JWT |
| 🟡 Amarillo | Datos (B) | Importación del corpus y generación de embeddings |
| 🟣 Morado | Frontend (C) | Interfaz React con React Router y CSS Modules |
| 🩷 Rosa | IA (D) | Microservicio FastAPI con agente LangGraph y RAG |
| 🟩 Verde | Despliegue (F) | Docker Compose, Nginx, N8N y despliegue en kripta.dev |

---

## Documentación adicional

- [Colección Postman](docs/postman.json)
- [Informe de uso de IA](docs/uso-ia.md)
- [Workflows N8N](n8n-workflows/)

---

## Licencias

**Contenido histórico** (artículos de prensa, 1926): dominio público — [Public Domain Mark 1.0](https://creativecommons.org/publicdomain/mark/1.0/).

**Plataforma** (código, diseño y base de datos): [CC BY-NC-SA 4.0 EU](https://creativecommons.org/licenses/by-nc-sa/4.0/) — libre para uso no comercial con atribución; los derivados heredan esta licencia.

**Fuentes documentales**: [Jable](https://jable.ulpgc.es/) (mdC - ULPGC) y [Marasía](https://marasia.ull.es/) (ULL).

---

## Autor

Daniel Kripta — Proyecto final de bootcamp Full Stack, junio 2026.

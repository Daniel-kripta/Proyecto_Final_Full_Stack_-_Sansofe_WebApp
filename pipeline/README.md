# Pipeline — Extracción e importación del corpus

Scripts Python para construir el corpus de Sansofé a partir de los archivos digitales de Jable (ULPGC) y Maresía (ULL).

El pipeline se ejecutó una sola vez para construir el MVP. No forma parte del despliegue continuo.

---

## Scripts

| Script | Descripción |
|---|---|
| `enrich_corpus.py` | Enriquece los JSON del corpus llamando a Gemini 2.5 Flash: extrae metadatos (topics, personas, lugares, resumen, género) de cada artículo |
| `import_db.py` | Importa los artículos JSON enriquecidos a PostgreSQL |
| `generate_embeddings.py` | Genera embeddings vectoriales para cada artículo con `text-multilingual-embedding-002` (Vertex AI) y los almacena en la columna `embedding` (pgvector) |

Los scripts de descarga y extracción de PDFs (discover, download, extract) no están en el repositorio.

---

## Orden de ejecución

```
1. enrich_corpus.py        # Requiere: corpus/json/ con artículos crudos
2. import_db.py            # Requiere: BD levantada con schema aplicado
3. generate_embeddings.py  # Requiere: artículos ya importados en BD
```

Cada script es reanudable: guarda el progreso en `logs/` y continúa desde el último artículo procesado si se interrumpe.

---

## Corpus

El corpus completo no está en el repositorio por su tamaño (~38.800 artículos en JSON, ~600 PDFs).

En `corpus/json_example/` y `corpus/raw_example/` hay una muestra del 1 de enero de 1926 por publicación, como referencia del formato.

---

## Variables de entorno

```env
DATABASE_URL=postgresql://...
GCP_PROJECT=nombre-del-proyecto
GOOGLE_CLOUD_PROJECT=nombre-del-proyecto
GOOGLE_APPLICATION_CREDENTIALS=/ruta/a/credenciales.json
```

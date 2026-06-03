# pipeline

Scripts Python para la extracción e importación del corpus histórico.

- `discover.py` / `discover_ull.py` — catalogar ejemplares disponibles en los portales Jable y ULL
- `download.py` / `download_ull.py` — descargar los PDFs
- `extract.py` — extraer artículos de los PDFs usando Gemini 2.5 Flash
- `import_db.py` — importar los artículos JSON a PostgreSQL
- `generate_embeddings.py` — generar embeddings vectoriales con Vertex AI

El corpus completo (PDFs y JSONs) no está en el repositorio por su tamaño. En `corpus/json_example/` y `corpus/raw_example/` hay ejemplares del 1 de enero de 1926 de cada publicación como muestra del formato.

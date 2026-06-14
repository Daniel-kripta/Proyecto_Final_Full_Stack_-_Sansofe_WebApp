# Metodología

Sansofé construye su corpus a través de un pipeline automático en cinco etapas, desde la descarga de los PDFs originales hasta la generación de embeddings vectoriales para búsqueda semántica.

## 1. Descubrimiento y descarga

Un script recorre los catálogos de Jable y Maresía e identifica los PDFs disponibles para el período seleccionado. Los archivos se descargan y almacenan localmente.

## 2. Extracción de contenido con Gemini

Cada PDF se envía directamente a **Gemini 2.5 Flash** como contenido multimodal. El modelo lee el documento de forma nativa, sin conversión previa a imagen, y devuelve un JSON estructurado con los artículos del ejemplar: titular, cuerpo, sección, género, firma y otros campos. El resultado se almacena en ficheros JSON locales.

## 3. Enriquecimiento con IA

Cada artículo se envía a **Gemini 2.5 Flash** con un prompt estructurado que extrae:

- Título normalizado
- Sección temática (Política, Economía, Sociedad, Cultura, Deportes, Sucesos, etc.)
- Género periodístico (noticia, crónica, editorial, artículo de opinión, anuncio...)
- Personas, lugares y entidades mencionadas
- Resumen breve

El proceso incluye reintentos con *backoff* exponencial para respetar los límites de la API.

## 4. Importación a la base de datos

Los artículos enriquecidos se importan a **PostgreSQL 18** mediante inserciones masivas. La base de datos incluye un índice de búsqueda de texto completo en español (`tsvector` con `websearch_to_tsquery`) y la extensión **pgvector** para almacenar los embeddings.

## 5. Generación de embeddings

Cada artículo se vectoriza con el modelo **text-multilingual-embedding-002** de Vertex AI (768 dimensiones). Los embeddings se almacenan en la columna `embedding vector(768)` y permiten la búsqueda semántica mediante similitud coseno.

## El agente de búsqueda asistida

La búsqueda asistida usa un agente **LangGraph** con siete nodos y enrutamiento condicional. Ante una consulta en lenguaje natural:

1. **Router**: clasifica la consulta como *lista*, *síntesis* o *irrelevante*
2. **Extractor**: extrae el término de búsqueda, publicación objetivo y año de los metadatos
3. **Retrieval**: recupera los artículos más similares de pgvector con umbrales configurables
4. **Output**: genera la respuesta citando los artículos fuente

El agente mantiene memoria conversacional entre turnos gracias al `MemorySaver` de LangGraph.

# Uso de Inteligencia Artificial — Sansofé

## Herramientas utilizadas

- **Claude Code** (Anthropic, Claude Sonnet 4.6) — asistente de desarrollo durante todo el proyecto
- **Gemini 2.5 Flash** (Google AI Studio) — extracción y estructuración del corpus histórico
- **Vertex AI `text-multilingual-embedding-002`** — generación de embeddings para búsqueda semántica
- **Gemini 2.5 Flash** (runtime) — síntesis RAG en el producto final, con clave API aportada por el usuario

---

## 1. IA para la construcción del corpus

El punto de partida del proyecto es un corpus de ~38.800 artículos extraídos de PDFs de prensa histórica canaria de 1926. Esta fase fue la más intensiva en uso de IA.

### Qué se hizo

Los PDFs (La Provincia y Gaceta de Tenerife, 605 ejemplares) se procesaron con Gemini 2.5 Flash mediante un pipeline Python que segmentaba cada página en artículos individuales, extraía los metadatos estructurados (titular, fecha, sección, género periodístico, resumen, personas, lugares, temas) y normalizaba el texto con los artefactos habituales del OCR histórico.

### Cómo intervino la IA

Gemini actuó como motor de extracción: recibía el texto crudo de cada página y devolvía JSON estructurado. El pipeline de llamadas, el manejo de errores, los reintentos y el almacenamiento fueron desarrollados con asistencia de Claude Code y ajustados iterativamente.

### Mi rol

La mayor parte del tiempo invertido en esta fase fue de revisión y corrección de resultados: comprobar la calidad de la extracción sobre muestras representativas, identificar patrones de error, ajustar los prompts y los parámetros hasta alcanzar una calidad suficiente para el MVP. No se revisaron los 38.800 artículos individualmente — se validó por muestreo y se estableció un umbral de calidad aceptable.

El criterio final de "suficiente" fue mío: hubo que decidir cuándo parar de afinar y avanzar con el material disponible.

---

## 2. IA como asistente de desarrollo

### Metodología

Durante las dos semanas de desarrollo usé Claude Code como asistente de pair-programming. El flujo habitual era:

1. Yo definía el objetivo, la restricción técnica o el comportamiento esperado
2. El asistente proponía una implementación
3. Yo la revisaba, la probaba en el navegador o en el servidor, y decidía si aceptarla, ajustarla o rechazarla
4. Las decisiones de arquitectura, las elecciones de tecnología y los criterios de calidad partieron de mí

Este modo de trabajo es equivalente a tener un compañero que escribe código rápido mientras tú diriges: acelera la ejecución, pero la comprensión y el criterio siguen siendo del desarrollador que revisa.

### Qué aporté yo

- La definición del producto y sus funcionalidades
- Las decisiones de arquitectura: monorepo, dos backends separados (Fastify + FastAPI), pgvector en lugar de ChromaDB, LangGraph como motor del agente
- El diseño visual y la línea estética del frontend
- La validación funcional de cada feature en el navegador y en producción
- La detección de bugs y la dirección de las correcciones
- El ajuste del agente RAG: umbrales de similitud, prompt del sistema, lógica de enrutamiento

### Áreas donde la IA fue más protagonista

El microservicio de IA (LangGraph, vectorstore, integración con Vertex AI) fue el área de mayor asistencia, dado que implica tecnologías que estaba aprendiendo durante el propio desarrollo. El código resultante funciona y está en producción, y lo estoy estudiando en detalle para la presentación.

### Qué aprendí

- Arquitectura de agentes con LangGraph: nodos, estado compartido, enrutamiento condicional
- Búsqueda vectorial con pgvector: distancias coseno, índices HNSW, umbrales de similitud
- Fastify v5 con ESM: registro de plugins, middleware JWT con cookies HttpOnly
- Gestión de sesión con JWT + cookies en un contexto React SPA
- Docker Compose con servicios interdependientes y healthchecks
- Rate limiting, cifrado AES-256 para claves de API de usuario

---

## 3. IA para administración del servidor (fuera del proyecto)

Aunque no forma parte del proyecto en sí, el entorno de producción donde corre Sansofé es un VPS propio (Hetzner CX23) que configuré con asistencia de Claude: instalación y hardening del sistema, configuración de Nginx como reverse proxy, SSL con Let's Encrypt, reglas de firewall, Docker en producción y ajustes de seguridad del servidor. Esta parte no aparece en el repositorio pero fue trabajo real que también se apoyó en IA de forma similar al desarrollo: yo tomaba las decisiones y entendía lo que se ejecutaba, el asistente reducía el tiempo de búsqueda y evitaba errores de sintaxis en configuraciones.

---

## 4. Lo que la IA no hizo

- No tomó decisiones de producto
- No eligió las tecnologías del stack
- No validó que las features funcionaran correctamente — eso requirió pruebas manuales iterativas
- No generó los tests de forma autónoma: los tests responden a decisiones previas sobre qué cubrir y cómo estructurar los mocks
- No desplegó ni configuró el servidor (VPS Hetzner, Nginx, SSL, Docker en producción)

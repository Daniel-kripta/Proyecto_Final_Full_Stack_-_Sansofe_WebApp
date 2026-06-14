# Cómo usar Sansofé

## La portada: prensa de hace cien años

Al entrar en Sansofé se muestra la portada del día: los artículos publicados en *La Provincia* y *Gaceta de Tenerife* exactamente cien años antes de la fecha actual. Si hoy es 15 de junio de 2026, la portada muestra los artículos del 15 de junio de 1926.

El selector de fecha situado en la cabecera permite navegar hacia atrás hasta siete días. Los días en que no hubo prensa —domingos o festivos sin edición— no aparecen en el selector. La portada se genera automáticamente cada medianoche mediante un workflow de automatización que prepara el contenido del día siguiente.

## Búsqueda de artículos

La búsqueda simple de texto completo permite consultar los cerca de 38.800 artículos del corpus mediante lenguaje natural. El motor de búsqueda opera sobre el titular y el cuerpo del artículo, con soporte para español (lematización, variantes morfológicas).

El corpus actual cubre exclusivamente el año 1926 y dos publicaciones: *La Provincia* (Las Palmas de Gran Canaria) y *Gaceta de Tenerife* (Santa Cruz de Tenerife). Ampliar el corpus a otros años o cabeceras es técnicamente posible con la infraestructura existente, pero queda fuera del alcance de esta primera versión.

Están disponibles los siguientes filtros, combinables entre sí:

- **Publicación**: *La Provincia* (Las Palmas de Gran Canaria) o *Gaceta de Tenerife* (Santa Cruz de Tenerife)
- **Sección**: categoría temática del artículo (Política, Sociedad, Economía, Cultura, Deportes, Sucesos, etc.)
- **Género periodístico**: noticia, crónica, editorial, artículo de opinión, anuncio, entre otros
- **Rango de fechas**: acota los resultados a un período concreto dentro del año 1926

Los resultados muestran el titular, la publicación, la sección, la fecha y un extracto del cuerpo. Al hacer clic sobre cualquier resultado se accede al texto completo del artículo.

## Exploración por sección

Desde las páginas de sección es posible explorar los artículos de una categoría temática concreta para la fecha actual hace 100 años. La lista de artículos se carga de forma progresiva hacia atrás en el tiempo conforme se desciende por la página, sin necesidad de paginar manualmente.

## Registro y cuenta

El registro es gratuito. Solo requiere elegir un nombre de persona usuaria, un correo electrónico y una contraseña. Una vez dentro, se habilitan las funciones de colecciones y búsqueda asistida con IA.

La sesión se mantiene activa durante treinta días mediante una cookie segura. No es necesario volver a iniciar sesión en cada visita.

## Colecciones

Las colecciones permiten organizar artículos en carpetas temáticas propias. Desde la página de cualquier artículo es posible añadirlo a una colección existente o crear una nueva. Los artículos pueden eliminarse de la colección en cualquier momento, y las colecciones pueden borrarse en su totalidad desde la página de Colecciones.

Cada colección puede exportarse en formato CSV, con todos los campos del artículo (titular, publicación, fecha, sección, género, cuerpo y resumen). Esto permite trabajar con los resultados en hojas de cálculo o importarlos a otras herramientas de análisis.

## Búsqueda asistida con IA

La búsqueda asistida es una interfaz de conversación con un agente de inteligencia artificial que tiene acceso al corpus completo de Sansofé. Permite hacer preguntas en lenguaje natural y obtener dos tipos de respuesta:

- **Lista de artículos relevantes**: el agente identifica los artículos más pertinentes para la consulta y los presenta con sus metadatos y un enlace al texto completo.
- **Síntesis con fuentes**: el agente recupera los artículos relevantes y genera una respuesta elaborada, citando explícitamente los artículos en los que se basa. Esta modalidad es útil para obtener una visión de conjunto sobre un tema, persona o acontecimiento.

El agente decide internamente qué modalidad aplicar en función de cómo está formulada la pregunta. La conversación mantiene memoria entre turnos, por lo que es posible hacer preguntas de seguimiento sin necesidad de repetir el contexto.

El número máximo de artículos recuperados en cada consulta es diez, lo que garantiza respuestas coherentes dentro de los límites del modelo.

### Requisito: clave de API de Gemini

Para usar la búsqueda asistida es necesario disponer de una clave de API de Gemini, que puede obtenerse gratuitamente en [Google AI Studio](https://aistudio.google.com/apikey). Una vez obtenida, debe introducirse en la página de Ajustes. La clave se almacena cifrada y solo se usa para enviar las consultas al modelo de lenguaje —el sistema no puede leerla ni utilizarla para ningún otro fin.

El coste de las llamadas al modelo corre a cargo de la persona usuaria, no del proyecto. El tier gratuito de Google AI Studio es suficiente para un uso de investigación normal.

La razón por la que Sansofé solo admite Gemini y no otras IA es técnica: los artículos del corpus están vectorizados con un modelo de embeddings de Google (`text-multilingual-embedding-002`). Para que la búsqueda semántica funcione correctamente, la consulta de la persona usuaria debe vectorizarse con ese mismo modelo. Soportar otros proveedores como OpenAI o Anthropic requeriría generar y mantener un segundo juego de embeddings para todo el corpus, lo que está fuera del alcance de esta versión.

## Historial de investigaciones

Las conversaciones de la búsqueda asistida pueden guardarse como investigaciones. Cada investigación conserva el hilo completo de preguntas y respuestas, y puede recuperarse en cualquier sesión posterior desde la sección de investigaciones del área privada.

## Perfil y ajustes

Desde la página de Perfil es posible editar el nombre, los apellidos y cambiar la contraseña. Desde Ajustes se gestiona la clave de API de Gemini: añadirla, actualizarla o eliminarla. Al eliminar la clave, la búsqueda asistida queda desactivada hasta que se introduzca una nueva.

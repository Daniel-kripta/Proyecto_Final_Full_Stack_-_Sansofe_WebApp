# Sobre el proyecto

Sansofé es un repositorio digital de prensa histórica canaria que permite consultar, buscar e investigar artículos de periódicos publicados en las Islas Canarias durante el siglo XX.

## Origen

El proyecto nació de la voluntad de hacer accesible un patrimonio periodístico que hasta ahora solo podía consultarse de forma fragmentaria en hemerotecas físicas o portales de digitalización sin capacidades de búsqueda avanzada.

## Qué contiene

El corpus inicial incluye cerca de 38.800 artículos correspondientes al año 1926, extraídos de dos de las publicaciones más representativas de la prensa canaria de la época: *La Provincia* (Las Palmas de Gran Canaria) y *Gaceta de Tenerife* (Santa Cruz de Tenerife).

Los PDFs de Jable y Maresía se procesan enviándolos directamente a Gemini 2.5 Flash, que extrae y estructura el contenido de cada artículo de forma nativa. Cada artículo se enriquece además con metadatos generados por inteligencia artificial —personas, lugares, entidades, temas, género periodístico y resumen— y se convierte en una representación vectorial que permite la búsqueda semántica.

## El agente de IA

Sansofé integra un agente de inteligencia artificial basado en LangGraph y Gemini 2.5 Flash que permite realizar consultas en lenguaje natural sobre el corpus. El agente utiliza RAG (*Retrieval-Augmented Generation*) para localizar los artículos más relevantes antes de generar una respuesta, citando siempre las fuentes.

## Autoría

Sansofé es el proyecto final de bootcamp de **Daniel Kripta**, desarrollador full stack formado en el bootcamp Desarrollo Web Full Stack + IA de Ironhack, en el marco de un proyecto de la Fundación Universitaria de Las Palmas financiado por el Cabildo Insular de Gran Canaria (2026).

El código es de código abierto y está disponible en [GitHub](https://github.com/Daniel-kripta/Proyecto_Final_Full_Stack_-_Sansofe_WebApp).

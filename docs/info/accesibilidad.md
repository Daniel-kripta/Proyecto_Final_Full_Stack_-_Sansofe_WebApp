# Accesibilidad

Sansofé aspira a ser una aplicación usable por el mayor número de personas posible. Esta página describe el estado actual de accesibilidad de la plataforma.

## Medidas implementadas

- Estructura semántica HTML5 con elementos `header`, `main`, `footer`, `nav`, `article` y `section`
- Etiquetas `aria-label` en controles interactivos sin texto visible (botones de navegación, iconos)
- Contraste de color revisado entre el texto y los fondos principales
- Tamaño mínimo de área táctil de 44×44 px en botones y controles de navegación
- Diseño responsive adaptado a dispositivos móviles y escritorio
- Fuentes escalables mediante unidades relativas (`rem`, `em`)

## Limitaciones conocidas

- La navegación completa por teclado no ha sido verificada en todos los componentes
- El chat de búsqueda asistida no anuncia las respuestas del agente a lectores de pantalla
- Algunos formularios carecen de mensajes de error asociados mediante `aria-describedby`

## Estado actual y hoja de ruta

Sansofé es un proyecto en su primera versión, desarrollado en el contexto de una entrega académica con plazo fijo. En esta etapa, la prioridad ha sido construir una aplicación funcional que cubra todos los requisitos del proyecto. La accesibilidad se ha tenido en cuenta en las decisiones de diseño básicas, pero no ha podido recibir la dedicación que merece.

Las limitaciones indicadas arriba están identificadas y serán abordadas en iteraciones futuras, una vez que el proyecto supere la fase de entrega y pueda crecer con más calma.

Para reportar cualquier barrera de accesibilidad, contacta en danielkriptaprofesional@gmail.com.

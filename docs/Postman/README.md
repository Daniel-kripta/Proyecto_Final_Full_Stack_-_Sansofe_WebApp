# Guía de uso — Colección Postman

Colección para probar los endpoints de la API de Sansofé contra el entorno de producción (`https://sansofe.kripta.dev`).

## Importar la colección

1. Abrir Postman Desktop
2. Botón **Import** → seleccionar `postman.json`
3. La colección aparece con todas las carpetas y variables configuradas

La colección incluye una cuenta de demo ya configurada, consultas de ejemplo listas para ejecutar y un UUID de artículo real del corpus. No es necesario modificar nada para seguir el flujo básico.

> **Nota sobre la clave API:** para probar el endpoint `/chat` deberás guardar tu propia clave de Gemini mediante el endpoint «Guardar clave API Gemini». La clave se almacena cifrada y nunca se expone en texto plano. **Una vez terminadas las pruebas, elimínala** ejecutando el mismo endpoint con el body `{ "geminiApiKey": null }` — la cuenta es compartida y la cuota gratuita de Gemini es limitada.

## Obtener una clave API de Gemini (gratuita)

El asistente de investigación requiere una clave API de Google Gemini. El plan gratuito es suficiente para las pruebas.

1. Ir a [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey) (requiere cuenta de Google)
2. Pulsar **Create API key**
3. Copiar la clave generada

---

## Flujo recomendado

El orden importa: el login debe ir primero porque el resto de endpoints protegidos dependen de la cookie que Postman guarda automáticamente tras autenticarse.

```
Login → Explorar artículos → Guardar clave Gemini → Chat → Colecciones → Investigaciones
```

### 1. Login

Carpeta **1. Auth** → ejecutar **Login (cuenta demo)**.

Las credenciales de la cuenta demo ya vienen rellenas en el JSON (`test_postman@test.com`). Postman guarda la cookie JWT automáticamente al recibir la respuesta. A partir de aquí todos los endpoints protegidos funcionan sin ninguna configuración adicional.

### 2. Explorar artículos (sin auth)

Carpeta **2. Artículos**. Estos endpoints son públicos y no requieren login.

- **Publicaciones disponibles** — lista los dos periódicos del corpus (*La Provincia* y *Gaceta de Tenerife*)
- **Buscar artículos** — viene con `q=huelga` como ejemplo; el parámetro acepta cualquier texto libre. Los filtros opcionales (publicación, sección, tema, fechas) están incluidos como parámetros desactivados, listos para activar
- **Detalle de artículo** — usa un UUID real del corpus ya incluido en la variable `articulo_id`

### 3. Guardar la clave API de Gemini

Antes de usar el chat es necesario registrar la clave en el perfil.

Carpeta **6. Perfil** → ejecutar **Guardar clave API Gemini**.

Sustituir `AIza...` en el body por la clave obtenida en el paso anterior y enviar. La clave se almacena cifrada en la base de datos y nunca se devuelve en texto plano.

Para verificar que la clave es válida: **Verificar clave API Gemini** — devuelve `{ "ok": true }` si Gemini la acepta.

### 4. Chat — asistente de investigación

Carpeta **3. Chat** → ejecutar **Consulta al agente RAG**.

La consulta de ejemplo ya viene rellena en el JSON. El agente recupera los artículos más relevantes del corpus mediante búsqueda semántica y decide solo si devolver una lista de fuentes o una síntesis elaborada — esa decisión la toma LangGraph internamente en función de la pregunta. La clave Gemini no va en el body: el servidor la recupera del perfil del usuario y la usa internamente.

Otras consultas para probar:

```
Artículos sobre Pérez Galdós
¿Cómo era la situación política en Canarias en 1926?
```

### 5. Colecciones

Carpeta **4. Colecciones**:

1. **Crear colección** — el nombre de ejemplo ya viene relleno. Devuelve un objeto con el campo `id` (UUID). Copiar ese valor y pegarlo en la variable de colección `coleccion_id` (pestaña *Variables* de la colección en Postman)
2. **Añadir artículo a colección** — usa `coleccion_id` y `articulo_id` (ya configurado con un UUID real del corpus)
3. **Ver colección** — devuelve la colección con sus artículos
4. **Exportar colección a CSV** — descarga un CSV con los metadatos de todos los artículos guardados
5. **Eliminar artículo de colección** / **Eliminar colección**

### 6. Investigaciones

Carpeta **5. Investigaciones**:

1. **Crear investigación** — devuelve el `id` (UUID). Copiar en la variable `investigacion_id`
2. **Ver investigación** — recupera el historial de mensajes guardado
3. **Eliminar investigación**

### 7. Perfil

Carpeta **6. Perfil**:

- **Ver perfil** — datos del usuario y si tiene clave Gemini configurada (`tieneApiKey`)
- **Actualizar datos personales** — nombre, apellidos y alias
- **Cambiar contraseña** — requiere la contraseña actual

---

## Variables de colección

| Variable | Valor por defecto | Descripción |
|---|---|---|
| `base_url` | `https://sansofe.kripta.dev/api` | URL base de la API |
| `articulo_id` | UUID real del corpus | ID de ejemplo para detalle y colecciones |
| `coleccion_id` | *(vacío)* | Rellenar tras ejecutar «Crear colección» |
| `investigacion_id` | *(vacío)* | Rellenar tras ejecutar «Crear investigación» |

# Backend API — Node.js + Fastify + Prisma

API REST del proyecto Sansofé. Gestiona artículos, autenticación JWT, colecciones de usuario, perfil con clave de API de Gemini, y actúa como proxy hacia el microservicio de IA.

**Puerto**: `3002`

---

## Endpoints

### Artículos (públicos)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/publicaciones` | Lista de publicaciones distintas en el corpus |
| GET | `/articulos` | Búsqueda paginada con filtros |
| GET | `/articulos/:id` | Detalle completo de un artículo por UUID |

#### Parámetros de `GET /articulos`

| Parámetro | Tipo | Descripción |
|---|---|---|
| `q` | string | Búsqueda full-text (FTS en español) |
| `publication` | string | Filtrar por publicación exacta |
| `genre` | string | Filtrar por género periodístico |
| `topic` | string | Filtrar por tema (coincidencia en array `topics`) |
| `desde` | date | Fecha mínima (`YYYY-MM-DD`) |
| `hasta` | date | Fecha máxima (`YYYY-MM-DD`) |
| `pagina` | number | Página (por defecto: 1) |
| `limite` | number | Resultados por página (por defecto: 20, máximo: 50) |

### Autenticación

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/registro` | Crear cuenta (email + contraseña mínimo 8 caracteres) |
| POST | `/auth/login` | Iniciar sesión — devuelve access token + refresh token en cookie httpOnly |
| POST | `/auth/logout` | Cerrar sesión — invalida la cookie de refresh |
| POST | `/auth/refresh` | Renovar access token usando la cookie de refresh |
| GET | `/auth/me` | Datos del usuario autenticado |

### Perfil (requiere auth)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/perfil` | Datos del perfil: email, fecha de registro, `tieneApiKey` |
| PUT | `/perfil` | Guardar o eliminar clave de API de Gemini (cifrada AES-256) |
| GET | `/perfil/test-key` | Verificar si la clave de Gemini guardada es válida |
| PUT | `/perfil/password` | Cambiar contraseña |

### Colecciones (requiere auth)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/colecciones` | Listar colecciones del usuario con conteo de artículos |
| POST | `/colecciones` | Crear colección |
| DELETE | `/colecciones/:id` | Eliminar colección y sus artículos |
| GET | `/colecciones/:id` | Detalle de colección con artículos completos |
| POST | `/colecciones/:id/articulos` | Añadir artículo a una colección |
| DELETE | `/colecciones/:id/articulos/:aid` | Eliminar artículo de una colección |
| GET | `/colecciones/:id/export` | Exportar colección como CSV |

### Chat (requiere auth)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/chat` | Proxy hacia el microservicio IA. Adjunta `session_id` del usuario autenticado y la clave de Gemini descifrada |

---

## Variables de entorno

```env
DATABASE_URL=postgresql://usuario:contraseña@localhost:5433/sansofe
JWT_SECRET=clave_jwt_secreta
AES_ENCRYPTION_KEY=64_caracteres_hex_para_cifrar_api_keys
AI_SERVICE_URL=http://localhost:8001
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

---

## Arrancar en local

```bash
pnpm install
pnpm dev
```

## Notas técnicas

- Prisma 7.8 con `prisma.config.ts` y `@prisma/adapter-pg` (pg.Pool)
- `apps/api/.env` es un symlink al `.env` raíz del monorepo
- `$queryRaw` con template literal para todas las queries manuales
- La clave de Gemini se cifra con AES-256-CBC antes de guardarla en BD

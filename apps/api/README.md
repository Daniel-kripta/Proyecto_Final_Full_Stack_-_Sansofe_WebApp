# Backend API — Node.js + Fastify + Prisma

API REST del proyecto Sansofé. Gestiona artículos, autenticación JWT, colecciones de usuario y actúa como proxy hacia el microservicio de IA.

**Puerto**: `3002`

---

## Endpoints

### Artículos (públicos)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/articulos` | Búsqueda paginada con filtros (`q`, `publicacion`, `seccion`, `genero`, `pagina`) |
| GET | `/articulos/:id` | Detalle completo de un artículo por UUID |
| GET | `/portada` | Artículos del día equivalente hace 100 años (por fecha) |

### Autenticación

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/registro` | Crear cuenta (email + contraseña) |
| POST | `/auth/login` | Iniciar sesión — devuelve access token + refresh token en cookie |
| POST | `/auth/refresh` | Renovar access token usando la cookie de refresh |
| POST | `/auth/logout` | Cerrar sesión — borra la cookie de refresh |

### Colecciones (requieren auth)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/colecciones` | Listar colecciones del usuario autenticado |
| POST | `/colecciones` | Crear colección |
| POST | `/colecciones/:id/articulos` | Añadir artículo a una colección |
| DELETE | `/colecciones/:id/articulos/:aid` | Eliminar artículo de una colección |
| GET | `/colecciones/:id/export` | Exportar colección como CSV |

### Chat (requiere auth)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/chat` | Proxy hacia el microservicio IA con `session_id` del usuario autenticado |

---

## Variables de entorno

```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
AI_SERVICE_URL=http://localhost:8001
NODE_ENV=development
```

## Arrancar en local

```bash
pnpm install
pnpm dev
```

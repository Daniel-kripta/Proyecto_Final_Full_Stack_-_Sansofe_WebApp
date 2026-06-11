# Frontend — React 18 + Vite + CSS Modules

Interfaz web del proyecto Sansofé. SPA con tema de hemeroteca histórica, diseño responsive y navegación por secciones temáticas.

**Puerto en desarrollo**: `3000`

---

## Páginas

| Ruta | Componente | Descripción |
|---|---|---|
| `/` | `Portada` | Artículos del día de hace 100 años, agrupados por sección |
| `/resultados` | `Resultados` | Resultados de búsqueda paginados |
| `/articulo/:id` | `Articulo` | Detalle completo de un artículo |
| `/busqueda-asistida` | `BusquedaAsistida` | Chat RAG con el corpus histórico (requiere auth) — pendiente de implementar |
| `/colecciones` | `Colecciones` | Colecciones del usuario (requiere auth) |
| `/login` | `Login` | Inicio de sesión |
| `/registro` | `Registro` | Crear cuenta |
| `*` | `PaginaNoEncontrada` | 404 |

---

## Estructura

```
src/
├── api/            # Funciones de fetch (articulos, auth, portada)
├── components/     # Componentes reutilizables
│   ├── ArticuloCard/
│   ├── BloqueSeccion/
│   └── Navigators/ # Navbar, NavUser, NavFooter
├── pages/          # Una carpeta por página
└── App.tsx         # Router principal
```

## Variables de entorno

```env
VITE_API_URL=http://localhost:3002
```

## Arrancar en local

```bash
pnpm install
pnpm dev
```

## Build de producción

```bash
pnpm build   # genera dist/
```

# Frontend — React 18 + Vite + CSS Modules

Interfaz web del proyecto Sansofé. SPA con estética de hemeroteca histórica, diseño responsive (móvil / tablet / escritorio) y navegación por secciones temáticas.

**Puerto en desarrollo**: `3000`

---

## Páginas

| Ruta | Componente | Auth | Descripción |
|---|---|---|---|
| `/` | `Portada` | No | Artículos del día de hace 100 años, agrupados por sección, con selector de fecha ← → |
| `/seccion/:seccion` | `Seccion` | No | Scroll infinito de artículos por sección temática, limitado a la fecha equivalente |
| `/buscar` | `Busqueda` | No | Búsqueda con filtros: texto libre (FTS), publicación, sección y rango de fechas |
| `/articulo/:id` | `Articulo` | No | Cuerpo completo del artículo con metadatos y artículos relacionados |
| `/login` | `Login` | No | Inicio de sesión |
| `/registro` | `Registro` | No | Crear cuenta |
| `/colecciones` | `Colecciones` | Sí | Gestión de colecciones: crear, ver artículos, exportar CSV |
| `/busqueda-asistida` | `BusquedaAsistida` | Sí | Chat RAG. Panel lateral con historial de investigaciones y colecciones. Permite sintetizar una selección manual de artículos |
| `/ajustes` | `Ajustes` | Sí | Configurar clave de API de Gemini |
| `/perfil` | `Perfil` | Sí | Datos de cuenta: username/alias, nombre, apellidos. Cambio de contraseña |
| `*` | `PaginaNoEncontrada` | No | 404 |

---

## Estructura

```
src/
├── api/                  # Funciones de fetch
│   ├── articulos.ts      # GET /articulos, /publicaciones, helpers por sección
│   ├── portada.ts        # Fetch de JSON estático por fecha + fechaHace100()
│   ├── auth.ts
│   ├── colecciones.ts
│   ├── chat.ts
│   ├── investigaciones.ts
│   └── perfil.ts
├── components/
│   ├── Assets/           # SVGs, logos, sección de licencias
│   ├── Layout/
│   │   ├── Header/       # Cabecera con logo y navegación
│   │   └── Footer/       # Pie con licencias y navegación secundaria
│   ├── Content/
│   │   ├── ArticuloCard/ # Tarjeta de artículo. Prop mostrarFecha para /seccion
│   │   ├── BloqueSeccion/# Bloque de sección en Portada; id={seccion} en h2 para anclas
│   │   └── UltimasNoticias/ # 3 artículos de la misma sección, bajo el artículo
│   ├── Navigators/
│   │   ├── Navbar/       # Menú principal: Hace 100 años · Secciones ▾ · Búsqueda ▾
│   │   ├── NavUser/      # Menú de usuario autenticado
│   │   ├── NavFooter/
│   │   ├── NavSecciones/ # Links a secciones con artículos ese día (fetcha portada.json)
│   │   └── SelectorDia/  # Navegación ← → entre días con portada disponible
│   ├── UX/
│   │   ├── BotonInicio/  # Botón flotante (position:fixed) que ancla a #main
│   │   └── Guia/         # Ayuda contextual por id, cerrable, persiste en localStorage
│   ├── RutaProtegida/    # Wrapper de rutas privadas con JWT
│   └── ChatComponents/
│       ├── Chat/         # Interfaz de chat con modos Cantidad / Similitud
│       ├── ChatHistorial/# Panel lateral con historial de investigaciones guardadas
│       ├── ChatColecciones/ # Panel lateral con colecciones + formulario de creación
│       ├── ChatEstado/   # Estado del servicio + botones Guardar/Cerrar investigación
│       ├── ChatUserInfo/
│       └── ModalArticulo/# Modal de detalle de artículo desde el chat
├── constants/
│   └── secciones.ts      # SECCIONES compartido entre Navbar y Seccion
├── context/
│   └── AuthContext.tsx
├── pages/                # Una carpeta por página
├── types/
│   └── chat.ts
└── App.tsx               # Router principal; <main id="main">
```

---

## Variables de entorno

```env
VITE_API_URL=http://localhost:3002
```

---

## Arrancar en local

```bash
pnpm install
pnpm dev
```

## Build de producción

```bash
pnpm build   # genera dist/ (emptyOutDir: false para no borrar estáticos)
```

## Notas técnicas

- La Portada consume JSON estático servido por Nginx desde `/static/portada/YYYY-MM-DD.json`, generado diariamente por N8N.
- Las páginas `/seccion/:seccion` y `UltimasNoticias` filtran con `hasta=fechaHace100(0)` para respetar la lógica de "hace 100 años".
- Los mensajes del chat se persisten en `localStorage` (clave `chat_mensajes`).
- `Guia` muestra ayuda contextual por `id`; el usuario puede cerrarla (se guarda en `localStorage`).

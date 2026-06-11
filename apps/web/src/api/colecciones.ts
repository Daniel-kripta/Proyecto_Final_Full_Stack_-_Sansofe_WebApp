const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3002'

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API}${path}`, { credentials: 'include', ...options })
  if (!res.ok) throw new Error('Error')
  return res.json()
}

export const getColecciones = () => apiFetch('/colecciones')

export const getColeccion = (id: string) => apiFetch(`/colecciones/${id}`)

export const crearColeccion = (nombre: string) =>
  apiFetch('/colecciones', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre }),
  })

export const eliminarColeccion = (id: string) =>
  apiFetch(`/colecciones/${id}`, { method: 'DELETE' })

export const guardarEnColeccion = (coleccionId: string, articuloId: string) =>
  apiFetch(`/colecciones/${coleccionId}/articulos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ articuloId }),
  })

export const eliminarDeColeccion = (coleccionId: string, articuloId: string) =>
  apiFetch(`/colecciones/${coleccionId}/articulos/${articuloId}`, { method: 'DELETE' })

export const exportarColeccion = (id: string) =>
  fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:3002'}/colecciones/${id}/export`, {
    credentials: 'include',
  })

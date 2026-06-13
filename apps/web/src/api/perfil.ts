const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3002'

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API}${path}`, { credentials: 'include', ...options })
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  if (!res.ok) throw new Error('Error')
  return res.json()
}

export const getPerfil = () => apiFetch('/perfil')

export const testApiKey = (): Promise<{ ok: boolean }> => apiFetch('/perfil/test-key')

export const guardarApiKey = (geminiApiKey: string | null) =>
  apiFetch('/perfil', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ geminiApiKey }),
  })

export const actualizarDatos = (datos: { username: string; nombre?: string; apellidos?: string }) =>
  apiFetch('/perfil/datos', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  })

export const cambiarPassword = (passwordActual: string, passwordNuevo: string) =>
  apiFetch('/perfil/password', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passwordActual, passwordNuevo }),
  })

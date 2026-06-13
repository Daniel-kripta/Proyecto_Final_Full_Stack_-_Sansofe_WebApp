const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3002'

export async function getInvestigaciones() {
  const res = await fetch(`${API}/investigaciones`, { credentials: 'include' })
  if (!res.ok) throw new Error('Error')
  return res.json()
}

export async function getInvestigacion(id: string) {
  const res = await fetch(`${API}/investigaciones/${id}`, { credentials: 'include' })
  if (!res.ok) throw new Error('Error')
  return res.json()
}

export async function crearInvestigacion(titulo: string, mensajes: unknown[]) {
  const res = await fetch(`${API}/investigaciones`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ titulo, mensajes }),
  })
  if (!res.ok) throw new Error('Error')
  return res.json()
}

export async function eliminarInvestigacion(id: string) {
  const res = await fetch(`${API}/investigaciones/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Error')
  return res.json()
}

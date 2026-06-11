const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3002'

export async function enviarMensaje(query: string, k: number, umbral: string | null = null) {
  const res = await fetch(`${API}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ query, k, ...(umbral ? { umbral } : {}) }),
  })
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  if (!res.ok) throw new Error('Error en el servicio IA')
  return res.json()
}

export async function checkSalud(): Promise<boolean> {
  try {
    const res = await fetch(`${API}/health`, { credentials: 'include' })
    return res.ok
  } catch {
    return false
  }
}

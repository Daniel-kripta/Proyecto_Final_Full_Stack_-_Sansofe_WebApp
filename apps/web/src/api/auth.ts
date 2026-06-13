const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3002'

const opts = (body: object) => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include' as RequestCredentials,
  body: JSON.stringify(body),
})

async function post(path: string, body: object) {
  const res = await fetch(`${API}${path}`, opts(body))
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Error')
  return data
}

export const login    = (email: string, password: string) => post('/auth/login',    { email, password })
export const registro = (email: string, password: string, username: string) => post('/auth/registro', { email, password, username })
export const logout   = () => fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' })

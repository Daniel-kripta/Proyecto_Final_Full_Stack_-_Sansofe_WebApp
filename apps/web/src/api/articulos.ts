const API = import.meta.env.VITE_API_URL

export async function getPortada() {
  const hace100 = new Date()
  hace100.setFullYear(hace100.getFullYear() - 100)
  const fecha = hace100.toISOString().split('T')[0]
  const res = await fetch(`${API}/portada?fecha=${fecha}`)
  return res.json()
}
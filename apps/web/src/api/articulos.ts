import { fechaHace100 } from './portada'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3002'

export async function getPublicaciones(): Promise<string[]> {
  const res = await fetch(`${API}/publicaciones`)
  if (!res.ok) return []
  return res.json()
}

export async function buscarArticulos(params: Record<string, string>) {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v))
  )
  const res = await fetch(`${API}/articulos?${qs}`)
  if (!res.ok) throw new Error('Error en la búsqueda')
  return res.json()
}

export async function getArticulo(id: string) {
  const res = await fetch(`${API}/articulos/${id}`)
  if (!res.ok) throw new Error('Artículo no encontrado')
  return res.json()
}

export async function getArticulosPorSeccion(seccion: string, tipo: string, pagina: number): Promise<any[]> {
  const qs = new URLSearchParams({ [tipo]: seccion, pagina: String(pagina), hasta: fechaHace100(0) })
  const res = await fetch(`${API}/articulos?${qs}`)
  if (!res.ok) return []
  return res.json()
}

export async function getUltimasNoticias(topic: string, excluirId: string): Promise<any[]> {
  const qs = new URLSearchParams({ topic, limite: '4', hasta: fechaHace100(0) })
  const res = await fetch(`${API}/articulos?${qs}`)
  if (!res.ok) return []
  const articulos = await res.json()
  return articulos.filter((a: any) => a.id !== excluirId).slice(0, 3)
}

export async function getPortada() {
  const hace100 = new Date()
  hace100.setFullYear(hace100.getFullYear() - 100)

  for (let i = 0; i < 3; i++) {
    const fecha = new Date(hace100)
    fecha.setDate(fecha.getDate() - i)
    const fechaStr = fecha.toISOString().split('T')[0]
    const res = await fetch(`/portada/${fechaStr}.json`)
    if (res.ok) return res.json()
  }

  return []
}

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

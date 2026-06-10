export const LABELS: Record<string, string> = {
  anuncios:      'Anuncios',
  sucesos:       'Sucesos',
  sociedad:      'Sociedad',
  'política':    'Política',
  internacional: 'Internacional',
  'economía':    'Economía',
  cultura:       'Cultura',
  deportes:      'Deportes',
  'religión':    'Religión',
  agricultura:   'Agricultura',
  militar:       'Militar',
  otros:         'Otros',
}

async function fetchPortadaJson(): Promise<Record<string, any[]>> {
  const base = new Date()
  base.setFullYear(base.getFullYear() - 100)

  for (let i = 0; i < 3; i++) {
    const d = new Date(base)
    d.setDate(d.getDate() - i)
    const fecha = d.toISOString().split('T')[0]
    const res = await fetch(`/portada/${fecha}.json`)
    if (res.ok) return res.json()
  }
  return {}
}

let cache: Promise<Record<string, any[]>> | null = null

export function getPortadaAgrupada(): Promise<Record<string, any[]>> {
  if (!cache) cache = fetchPortadaJson()
  return cache
}

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

const cache = new Map<string, Promise<Record<string, any[]>>>()

export function getPortadaParaFecha(fecha: string): Promise<Record<string, any[]>> {
  if (!cache.has(fecha)) {
    cache.set(fecha, fetch(`/static/portada/${fecha}.json`)
      .then(res => res.ok ? res.json() : {})
      .catch(() => ({})))
  }
  return cache.get(fecha)!
}

export function fechaHace100(offsetDias = 0): string {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 100)
  d.setDate(d.getDate() - offsetDias)
  return d.toISOString().split('T')[0]
}

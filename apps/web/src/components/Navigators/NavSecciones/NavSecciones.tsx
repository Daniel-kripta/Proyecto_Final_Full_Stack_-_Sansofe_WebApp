import { useState, useEffect } from 'react'
import { getPortadaParaFecha, LABELS } from '../../api/portada'

const SECCIONES = [
  'sucesos', 'sociedad', 'política', 'internacional', 'economía',
  'cultura', 'deportes', 'anuncios', 'religión', 'agricultura', 'militar', 'otros',
]

interface Props {
  fecha: string
}

export default function NavSecciones({ fecha }: Props) {
  const [disponibles, setDisponibles] = useState<string[]>([])

  useEffect(() => {
    setDisponibles([])
    getPortadaParaFecha(fecha).then(data => {
      setDisponibles(SECCIONES.filter(s => (data[s]?.length ?? 0) > 0))
    })
  }, [fecha])

  if (disponibles.length === 0) return null

  return (
    <nav>
      {disponibles.map(s => (
        <a key={s} href={`#${s}`}>{LABELS[s] ?? s}</a>
      ))}
    </nav>
  )
}

import { useState, useEffect } from 'react'
import { fechaHace100, getPortadaParaFecha } from '../../../api/portada'
import { ChevronLeftIcon, ChevronRightIcon } from '../../Assets/Iconos/Iconos'
import styles from './SelectorDia.module.css'

const candidatos = Array.from({ length: 7 }, (_, i) => {
  const fecha = fechaHace100(i)
  const d = new Date(fecha + 'T00:00:00')
  return {
    fecha,
    labelLargo: d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
  }
})

interface Props {
  onFechaChange: (fecha: string) => void
}

export default function SelectorDia({ onFechaChange }: Props) {
  const [diasDisponibles, setDiasDisponibles] = useState<typeof candidatos>([])
  const [diaIdx, setDiaIdx] = useState(0)

  useEffect(() => {
    Promise.all(
      candidatos.map(d => getPortadaParaFecha(d.fecha).then(data => Object.keys(data).length > 0 ? d : null))
    ).then(resultados => {
      setDiasDisponibles(resultados.filter(Boolean) as typeof candidatos)
    })
  }, [])

  useEffect(() => {
    const dia = diasDisponibles[diaIdx]
    if (dia) onFechaChange(dia.fecha)
  }, [diaIdx, diasDisponibles, onFechaChange])

  const dia = diasDisponibles[diaIdx]
  if (!dia) return null

  const hayAnterior = diaIdx < diasDisponibles.length - 1
  const haySiguiente = diaIdx > 0

  return (
    <div className={styles.cabeceraDia}>
      <button
        className={styles.flechaNav}
        onClick={() => setDiaIdx(i => i + 1)}
        disabled={!hayAnterior}
        aria-label="Día anterior"
      >
        <ChevronLeftIcon />
      </button>
      <h1>{dia.labelLargo}</h1>
      <button
        className={styles.flechaNav}
        onClick={() => setDiaIdx(i => i - 1)}
        disabled={!haySiguiente}
        aria-label="Día siguiente"
      >
        <ChevronRightIcon />
      </button>
    </div>
  )
}

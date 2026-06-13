import { useState, useEffect } from 'react'
import BloqueSeccion from '../../components/BloqueSeccion/BloqueSeccion'
import { fechaHace100, getPortadaParaFecha, LABELS } from '../../api/portada'
import styles from './Portada.module.css'

const SECCIONES_PORTADA = [
  'sucesos', 'sociedad', 'política', 'internacional', 'economía',
  'cultura', 'deportes', 'anuncios', 'religión', 'agricultura', 'militar', 'otros',
]

const candidatos = Array.from({ length: 7 }, (_, i) => {
  const fecha = fechaHace100(i)
  const d = new Date(fecha + 'T00:00:00')
  return {
    fecha,
    labelLargo: d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
  }
})

export default function Portada() {
  const [diasDisponibles, setDiasDisponibles] = useState<typeof candidatos>([])
  const [diaIdx, setDiaIdx] = useState(0)

  useEffect(() => {
    Promise.all(
      candidatos.map(d => getPortadaParaFecha(d.fecha).then(data => Object.keys(data).length > 0 ? d : null))
    ).then(resultados => {
      setDiasDisponibles(resultados.filter(Boolean) as typeof candidatos)
    })
  }, [])

  const dia = diasDisponibles[diaIdx]
  if (!dia) return null

  const hayAnterior = diaIdx < diasDisponibles.length - 1
  const haySiguiente = diaIdx > 0

  return (
    <>
      <div id="portada-inicio" className={styles.cabeceraDia}>
        <button
          className={styles.flechaNav}
          onClick={() => setDiaIdx(i => i + 1)}
          disabled={!hayAnterior}
          aria-label="Día anterior"
        >
          🡄
        </button>
        <h1>{dia.labelLargo}</h1>
        <button
          className={styles.flechaNav}
          onClick={() => setDiaIdx(i => i - 1)}
          disabled={!haySiguiente}
          aria-label="Día siguiente"
        >
          🡆
        </button>
      </div>

      <nav className={styles.navSecciones}>
        {SECCIONES_PORTADA.map(s => (
          <a key={s} href={`#seccion-${s}`} className={styles.navSeccion}>
            {LABELS[s] ?? s}
          </a>
        ))}
      </nav>

      <div className={styles.contentBloques}>
        {SECCIONES_PORTADA.map(s => (
          <BloqueSeccion key={s} seccion={s} fecha={dia.fecha} id={`seccion-${s}`} />
        ))}
        <a href="#portada-inicio" className={styles.volverInicio}>Volver al inicio</a>
      </div>
    </>
  )
}

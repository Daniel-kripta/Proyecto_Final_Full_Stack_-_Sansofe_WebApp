import { useState, useEffect } from 'react'
import BloqueSeccion from '../../components/BloqueSeccion/BloqueSeccion'
import { fechaHace100, getPortadaParaFecha } from '../../api/portada'
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
    label: d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }),
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
      const disponibles = resultados.filter(Boolean) as typeof candidatos
      setDiasDisponibles(disponibles)
    })
  }, [])

  const dia = diasDisponibles[diaIdx]

  if (!dia) return null

  return (
    <>
      <div className={styles.cabeceraDia}>
        <h1>{dia.labelLargo}</h1>
        {diasDisponibles.length > 1 && (
          <div className={styles.selectorFecha}>
            {diasDisponibles.map((d, i) => (
              <button
                key={d.fecha}
                className={`${styles.diaBtn} ${i === diaIdx ? styles.diaBtnActivo : ''}`}
                onClick={() => setDiaIdx(i)}
              >
                {d.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.contentBloques}>
        {SECCIONES_PORTADA.map(s => <BloqueSeccion key={s} seccion={s} fecha={dia.fecha} />)}
      </div>
    </>
  )
}

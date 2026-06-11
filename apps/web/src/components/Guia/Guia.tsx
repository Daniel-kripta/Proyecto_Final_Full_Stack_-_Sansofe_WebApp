import { useState } from 'react'
import styles from './Guia.module.css'

const GUIAS: Record<string, React.ReactNode> = {
  UsoChat:
    'El asistente responde de dos formas según tu consulta: lista de artículos cuando buscas noticias concretas, o síntesis con fuentes cuando quieres entender un tema. El sistema decide automáticamente. El selector de artículos a consultar solo se aplica a las respuestas de síntesis.',
  Colecciones:
    'Guarda artículos en tus colecciones usando el selector "Guardar en..." que aparece en cada tarjeta de resultado del chat. El botón Síntesis genera un informe a partir de los artículos de esa colección: el asistente los toma como fuente y responde a la consulta que escribas.',
  SetupServicio: (
    <p>
      Para usar el asistente, ve a <a href="/ajustes">Ajustes</a> e introduce una clave de API de Gemini válida.
    </p>
  ),
}

interface GuiaProps {
  id: string
  cerrable?: boolean
}

export function Guia({ id, cerrable = true }: GuiaProps) {
  const storageKey = `guia_cerrada_${id}`
  const [cerrada, setCerrada] = useState(() => cerrable && localStorage.getItem(storageKey) === 'true')
  const [plegada, setPlegada] = useState(false)

  if (cerrada) return null
  const contenido = GUIAS[id]
  if (!contenido) return null

  return (
    <div className={styles.guia}>
      <div className={styles.guiaCabecera}>
        <span className={styles.guiaTitulo}>Guía</span>
        <div className={styles.guiaAcciones}>
          <button className={styles.boton} onClick={() => setPlegada(v => !v)}>
            {plegada ? '▾' : '▴'}
          </button>
          {cerrable && (
            <button
              className={styles.boton}
              onClick={() => {
                localStorage.setItem(storageKey, 'true')
                setCerrada(true)
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>
      {!plegada && <div className={styles.guiaContenido}>{contenido}</div>}
    </div>
  )
}

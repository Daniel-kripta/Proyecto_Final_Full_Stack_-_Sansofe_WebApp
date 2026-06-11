import { useState } from 'react'
import styles from './Guia.module.css'

interface EntradaGuia {
  titulo: string
  contenido: React.ReactNode
}

const GUIAS: Record<string, EntradaGuia> = {
  UsoChat: {
    titulo: 'Consultas',
    contenido: (
      <div>
        <p>El asistente responde de dos formas según tu consulta: lista de artículos cuando buscas noticias concretas, o síntesis con fuentes cuando quieres entender un tema. El sistema decide automáticamente.</p>
        <p>En estos momentos el corpus incluye prensa de 1926 de <strong>La Provincia</strong> y la <strong>Gaceta de Tenerife</strong>.</p>
      </div>
    ),
  },
  Colecciones: {
    titulo: 'Colecciones',
    contenido: 'Guarda artículos en tus colecciones usando el selector "Guardar en..." que aparece en cada tarjeta de resultado del chat. El botón Síntesis genera un informe a partir de los artículos de esa colección: el asistente los toma como fuente y responde a la consulta que escribas.',
  },
  SetupServicio: {
    titulo: 'Configuración',
    contenido: (
      <p>
        Para usar el asistente, ve a <a href="/ajustes">Ajustes</a> e introduce una clave de API de Gemini válida.
      </p>
    ),
  },
  ModoRecuperacion: {
    titulo: 'Artículos a consultar',
    contenido: (
      <div>
        <p><strong>Cantidad</strong>: recupera exactamente los N artículos más cercanos a tu consulta. Predecible y rápido. Usa valores bajos (5-10) para síntesis precisas y valores altos para exploración.</p>
        <p><strong>Similitud</strong>: recupera todos los artículos que superen el umbral de cercanía semántica, sin límite de cantidad. <em>Exacto</em> devuelve solo coincidencias muy directas; <em>Similar</em> amplía la red. Ten en cuenta que consultas genéricas en modo Similar pueden devolver cientos de artículos, lo que incrementa el coste en tokens de tu API.</p>
      </div>
    ),
  },
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
  const entrada = GUIAS[id]
  if (!entrada) return null

  return (
    <div className={styles.guia}>
      <div className={styles.guiaCabecera}>
        <span className={styles.guiaTitulo}>Guía: {entrada.titulo}</span>
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
      {!plegada && <div className={styles.guiaContenido}>{entrada.contenido}</div>}
    </div>
  )
}

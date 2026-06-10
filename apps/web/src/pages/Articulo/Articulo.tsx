import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import mockArticulo from '../../mocks/articulo-ejemplo.json'
import styles from './Articulo.module.css'

const MOCK = !import.meta.env.VITE_API_URL

export function Articulo() {
  const { id } = useParams()
  const [art, setArt] = useState<any>(null)

  useEffect(() => {
    if (MOCK) return setArt(mockArticulo)
    fetch(`${import.meta.env.VITE_API_URL}/articulos/${id}`)
      .then(r => r.json())
      .then(setArt)
  }, [id])

  if (!art) return <p>Cargando...</p>

  return (
    <article className={styles.articulo}>
      <div>
        <p className={styles.meta}>
          {art.publication} · {new Date(art.date).toLocaleDateString('es-ES')} · {art.genre}
        </p>
        <h1>{art.headline}</h1>
        {art.subheadline && <h2>{art.subheadline}</h2>}
        {art.byline && <p className={styles.byline}>{art.byline}</p>}
      </div>

      <div className={styles.cuerpo}>
        {art.body.split('\n').filter(Boolean).map((p: string, i: number) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {art.people?.length > 0 && (
        <aside>Personas: {art.people.join(', ')}</aside>
      )}
    </article>
  )
}
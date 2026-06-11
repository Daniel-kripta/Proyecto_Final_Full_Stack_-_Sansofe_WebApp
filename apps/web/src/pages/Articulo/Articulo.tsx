import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getArticulo } from '../../api/articulos'
import styles from './Articulo.module.css'

export function Articulo() {
  const { id } = useParams()
  const [art, setArt] = useState<any>(null)

  useEffect(() => {
    if (id) getArticulo(id).then(setArt)
  }, [id])

  if (!art) return <p>Cargando...</p>

  return (
    <article className={styles.articulo}>
      <div>
        <h1>{art.headline}</h1>
        {art.subheadline && <h2>{art.subheadline}</h2>}
        {art.byline && <p className={styles.byline}>{art.byline}</p>}
      </div>

      <div className={styles.cuerpo}>
        {art.body.split('\n').filter(Boolean).map((p: string, i: number) => (
          <p key={i}>{p}</p>
        ))}
      </div>
        <p className={styles.meta}>
          {art.publication} · {new Date(art.date).toLocaleDateString('es-ES')} · {art.genre}
        </p>

      {art.people?.length > 0 && (
        <aside>Personas: {art.people.join(', ')}</aside>
      )}
    </article>
  )
}

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { getArticulo } from '../../../api/articulos'
import styles from './ModalArticulo.module.css'

interface Props {
  articuloId: string
  onClose: () => void
}

export function ModalArticulo({ articuloId, onClose }: Props) {
  const [art, setArt] = useState<any>(null)

  useEffect(() => {
    getArticulo(articuloId).then(setArt).catch(() => setArt(null))
  }, [articuloId])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.botonCerrar} onClick={onClose}>✕</button>
        {!art ? (
          <p>Cargando...</p>
        ) : (
          <article className={styles.articulo}>
            <p className={styles.meta}>
              {art.publication} · {new Date(art.date).toLocaleDateString('es-ES')} · {art.genre}
            </p>
            <h2>{art.headline}</h2>
            {art.subheadline && <h3>{art.subheadline}</h3>}
            {art.byline && <p className={styles.byline}>{art.byline}</p>}
            <div className={styles.cuerpo}>
              {art.body.split('\n').filter(Boolean).map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {art.people?.length > 0 && (
              <aside className={styles.personas}>Personas: {art.people.join(', ')}</aside>
            )}
          </article>
        )}
      </div>
    </div>,
    document.body
  )
}

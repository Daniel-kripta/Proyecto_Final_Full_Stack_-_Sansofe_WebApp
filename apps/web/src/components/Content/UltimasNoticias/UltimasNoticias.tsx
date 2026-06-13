import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getUltimasNoticias } from '../../../api/articulos'
import { ArticuloCard } from '../ArticuloCard/ArticuloCard'
import { LABELS } from '../../../api/portada'
import styles from './UltimasNoticias.module.css'

interface Props {
  seccion: string
  articuloId: string
}

export function UltimasNoticias({ seccion, articuloId }: Props) {
  const [articulos, setArticulos] = useState<any[]>([])

  useEffect(() => {
    if (!seccion) return
    getUltimasNoticias(seccion, articuloId).then(setArticulos)
  }, [seccion, articuloId])

  if (articulos.length === 0) return null

  const label = LABELS[seccion] ?? seccion

  return (
    <aside className={styles.aside}>
      <h2 className={styles.titulo}>Otras noticias de {label}</h2>
      <div className={styles.lista}>
        {articulos.map(a => <ArticuloCard key={a.id} {...a} />)}
      </div>
      <Link to={`/seccion/${seccion}`} className={styles.verMas}>
        Ver más noticias de {label}
      </Link>
    </aside>
  )
}

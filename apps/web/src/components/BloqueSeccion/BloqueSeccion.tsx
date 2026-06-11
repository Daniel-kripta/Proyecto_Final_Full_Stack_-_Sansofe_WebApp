import { useEffect, useState } from 'react'
import { ArticuloCard } from '../ArticuloCard/ArticuloCard'
import { getPortadaAgrupada, LABELS } from '../../api/portada'
import styles from '../../pages/Portada/Portada.module.css'

export default function BloqueSeccion({ seccion }: { seccion: string }) {
  const [articulos, setArticulos] = useState<any[]>([])

  useEffect(() => {
    getPortadaAgrupada().then(data => setArticulos(data[seccion] ?? []))
  }, [seccion])

  if (articulos.length === 0) return null

  return (
    <section className={styles.seccion}>
      <h2 className={styles.cabecera}>{LABELS[seccion] ?? seccion}</h2>
      <div className={styles.articulosBloques}>{articulos.map(a => <ArticuloCard key={a.id} {...a} />)}</div>
    </section>
  )
}

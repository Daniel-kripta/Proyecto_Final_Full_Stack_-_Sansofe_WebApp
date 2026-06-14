import { useState, useEffect, Fragment } from 'react'
import { getPortadaParaFecha, LABELS } from '../../../api/portada'
import styles from './NavSecciones.module.css'

const SECCIONES = [
  'sucesos', 'sociedad', 'política', 'internacional', 'economía',
  'cultura', 'deportes', 'anuncios', 'religión', 'agricultura', 'militar', 'otros',
]

interface Props {
  fecha: string
}

export default function NavSecciones({ fecha }: Props) {
  const [disponibles, setDisponibles] = useState<string[]>([])

  useEffect(() => {
    setDisponibles([])
    getPortadaParaFecha(fecha).then((data: Record<string, any[]>) => {
      setDisponibles(SECCIONES.filter(s => (data[s]?.length ?? 0) > 0))
    })
  }, [fecha])

  if (disponibles.length === 0) return null

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={styles.nav}>
      {disponibles.map(s => (
        <Fragment key={s}>
          <span className={styles.sep} aria-hidden="true"> | </span>
          <a href={`#${s}`} onClick={e => handleClick(e, s)}>{LABELS[s] ?? s}</a>
        </Fragment>
      ))}
      <span className={styles.sep} aria-hidden="true"> | </span>
    </nav>
  )
}

import { SubirIcon } from '../../Assets/Iconos/Iconos'
import styles from './BotonInicio.module.css'

export default function BotonInicio() {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <a href="#main" className={styles.botonInicio} aria-label="Volver al inicio" onClick={handleClick}>
      <SubirIcon />
    </a>
  )
}

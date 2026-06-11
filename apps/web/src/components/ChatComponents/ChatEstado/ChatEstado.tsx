import { Link } from 'react-router-dom'
import chatStyles from '../chat.module.css'
import styles from './ChatEstado.module.css'

interface Props {
  activo: boolean | null
}

export function ChatEstado({ activo }: Props) {
  return (
    <div className={chatStyles.componente}>
      <div className={styles.estadoServicio}>
        <span className={`${styles.circulo} ${activo === true ? styles.ok : activo === false ? styles.error : ''}`} />
        <span>
          {activo === null ? 'Comprobando...' : activo ? 'Servicio activo' : 'Servicio no disponible'}
        </span>
      </div>
      <Link to="/ajustes">Ajustes</Link>
    </div>
  )
}

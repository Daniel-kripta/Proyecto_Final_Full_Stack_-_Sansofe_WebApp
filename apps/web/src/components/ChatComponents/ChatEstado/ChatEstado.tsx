import { Link } from 'react-router-dom'
import chatStyles from '../chat.module.css'
import styles from './ChatEstado.module.css'

interface Props {
  activo: boolean | null
  acciones?: React.ReactNode
}

export function ChatEstado({ activo, acciones }: Props) {
  return (
    <div className={chatStyles.componente}>
      <div className={styles.estadoServicio}>
        <span className={`${styles.circulo} ${activo === true ? styles.ok : activo === false ? styles.error : ''}`} />
        <span>
          {activo === null ? 'Comprobando...' : activo ? 'Servicio activo' : 'Servicio no disponible'}
        </span>
      </div>
      <div className={styles.derecha}>
        {acciones}
        <Link to="/ajustes">Ajustes</Link>
      </div>
    </div>
  )
}

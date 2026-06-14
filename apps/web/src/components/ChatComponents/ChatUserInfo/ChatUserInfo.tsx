import { Link } from 'react-router-dom'
import chatStyles from '../chat.module.css'
import styles from './ChatUserInfo.module.css'
import { useAuth } from '../../../context/AuthContext'
import { PerfilBtnIcon } from '../../Assets/Iconos/Iconos'

export function ChatUserInfo() {
  const { user } = useAuth()

  return (
    <div className={chatStyles.componente}>
      <span className={styles.usuarioNombre}>{user?.username ?? user?.email}</span>
      <Link to="/perfil" className={styles.botonPerfil} aria-label="Perfil"><PerfilBtnIcon /></Link>
    </div>
  )
}

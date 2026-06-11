import { Link } from 'react-router-dom'
import { CloseIcon } from '../../Assets/Iconos/Iconos'
import iconoStyles from '../../Assets/Iconos/Iconos.module.css'
import styles from './NavUser.module.css'
import { useAuth } from '../../../context/AuthContext'

export default function NavUser({ onClose }: { onClose: () => void }) {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    onClose()
  }

  return (
    <div className={styles.overlay}>
      <button className={styles.closeBtn} onClick={onClose}>
        <CloseIcon className={iconoStyles.iconoNavUser} />
      </button>
      <nav className={styles.nav}>
        {user ? (
          <>
            <Link to="/perfil"            onClick={onClose}>Perfil</Link>
            <Link to="/colecciones"       onClick={onClose}>Colecciones</Link>
            <Link to="/ajustes"           onClick={onClose}>Ajustes</Link>
            <button onClick={handleLogout}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/registro" onClick={onClose}>Registrarse</Link>
            <Link to="/login"    onClick={onClose}>Iniciar sesión</Link>
          </>
        )}
      </nav>
    </div>
  )
}

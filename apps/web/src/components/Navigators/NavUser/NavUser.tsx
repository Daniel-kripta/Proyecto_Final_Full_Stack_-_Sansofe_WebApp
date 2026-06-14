import { Link } from 'react-router-dom'
import { CloseIcon, PerfilBtnIcon, AjustesBtnIcon, SalirBtnIcon, RegistroBtnIcon, LoginBtnIcon, ColeccionBtnIcon } from '../../Assets/Iconos/Iconos'
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
            <Link to="/perfil"      onClick={onClose} aria-label="Perfil">
              <span className={styles.icono}><PerfilBtnIcon /></span>
              <span className={styles.etiqueta}>Perfil</span>
            </Link>
            <Link to="/colecciones" onClick={onClose} aria-label="Colecciones">
              <span className={styles.icono}><ColeccionBtnIcon /></span>
              <span className={styles.etiqueta}>Colecciones</span>
            </Link>
            <Link to="/ajustes"     onClick={onClose} aria-label="Ajustes">
              <span className={styles.icono}><AjustesBtnIcon /></span>
              <span className={styles.etiqueta}>Ajustes</span>
            </Link>
            <button onClick={handleLogout} aria-label="Cerrar sesión">
              <span className={styles.icono}><SalirBtnIcon /></span>
              <span className={styles.etiqueta}>Salir</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/registro" onClick={onClose} aria-label="Registrarse">
              <span className={styles.icono}><RegistroBtnIcon /></span>
              <span className={styles.etiqueta}>Registro</span>
            </Link>
            <Link to="/login"    onClick={onClose} aria-label="Iniciar sesión">
              <span className={styles.icono}><LoginBtnIcon /></span>
              <span className={styles.etiqueta}>Login</span>
            </Link>
          </>
        )}
      </nav>
    </div>
  )
}

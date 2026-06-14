import { Link } from 'react-router-dom'
import { CloseIcon, PerfilBtnIcon, AjustesBtnIcon, SalirBtnIcon, RegistroBtnIcon, LoginBtnIcon } from '../../Assets/Iconos/Iconos'
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
            <Link to="/perfil"      onClick={onClose} aria-label="Perfil"><PerfilBtnIcon /></Link>
            <Link to="/colecciones" onClick={onClose}>Colecciones</Link>
            <Link to="/ajustes"     onClick={onClose} aria-label="Ajustes"><AjustesBtnIcon /></Link>
            <button onClick={handleLogout} aria-label="Cerrar sesión"><SalirBtnIcon /></button>
          </>
        ) : (
          <>
            <Link to="/registro" onClick={onClose} aria-label="Registrarse"><RegistroBtnIcon /></Link>
            <Link to="/login"    onClick={onClose} aria-label="Iniciar sesión"><LoginBtnIcon /></Link>
          </>
        )}
      </nav>
    </div>
  )
}

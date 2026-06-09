import { Link } from 'react-router-dom'
import { CloseIcon } from '../../Assets/Iconos/Iconos'
import iconoStyles from '../../Assets/Iconos/Iconos.module.css'
import styles from './NavUser.module.css'

export default function NavUser({ onClose }: { onClose: () => void }) {
    return (
        <div className={styles.overlay}>
            <button className={styles.closeBtn} onClick={onClose}>
                <CloseIcon className={iconoStyles.iconoNavUser} />
            </button>
            <nav className={styles.nav}>
                <Link to="/registrarse" onClick={onClose}>Registrarse</Link>
                <Link to="/login" onClick={onClose}>Iniciar sesión</Link>
            </nav>
        </div>
    )
}

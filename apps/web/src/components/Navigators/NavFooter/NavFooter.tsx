import { Link } from 'react-router-dom'
import styles from "./NavFooter.module.css"

const ENLACES = [
  { label: 'Sobre el proyecto',      to: '/info/sobre-el-proyecto' },
  { label: 'Cómo usar la app',       to: '/info/como-usar' },
  { label: 'Fuentes',                to: '/info/fuentes' },
  { label: 'Aviso legal',            to: '/info/aviso-legal' },
  { label: 'Privacidad',             to: '/info/privacidad' },
  { label: 'Accesibilidad',          to: '/info/accesibilidad' },
  { label: 'Metodología',             to: '/info/metodologia' },
  { label: 'Contacto',               to: '/info/contacto' },
]

export default function NavFooter() {
  return (
    <nav className={styles.navFooter} >
      {ENLACES.map(e => (
        <Link key={e.to} to={e.to}>{e.label}</Link>
      ))}
    </nav>
  )
}

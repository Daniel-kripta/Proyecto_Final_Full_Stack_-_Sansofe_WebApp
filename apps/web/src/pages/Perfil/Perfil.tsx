import { useEffect, useState } from 'react'
import styles from './Perfil.module.css'
import { getPerfil, cambiarPassword } from '../../api/perfil'
import { useAuth } from '../../context/AuthContext'

export default function Perfil() {
  const { logout } = useAuth()
  const [perfil, setPerfil] = useState<{ email: string; createdAt: string } | null>(null)
  const [passwordActual, setPasswordActual] = useState('')
  const [passwordNuevo, setPasswordNuevo] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState<string | null>(null)

  useEffect(() => {
    getPerfil().then(setPerfil).catch(() => {})
  }, [])

  const handleCambiarPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordNuevo.length < 8) {
      setMensaje('La nueva contraseña debe tener al menos 8 caracteres.')
      return
    }
    setGuardando(true)
    setMensaje(null)
    try {
      await cambiarPassword(passwordActual, passwordNuevo)
      setPasswordActual('')
      setPasswordNuevo('')
      setMensaje('Contraseña actualizada.')
    } catch {
      setMensaje('Contraseña actual incorrecta.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className={styles.pagina}>
      <h1>Perfil</h1>

      {perfil && (
        <section className={styles.seccion}>
          <p><strong>Email:</strong> {perfil.email}</p>
          <p><strong>Miembro desde:</strong> {new Date(perfil.createdAt).toLocaleDateString('es-ES')}</p>
        </section>
      )}

      <section className={styles.seccion}>
        <h2>Cambiar contraseña</h2>
        <form className={styles.form} onSubmit={handleCambiarPassword}>
          <label className={styles.campo}>
            <span>Contraseña actual</span>
            <input
              type="password"
              value={passwordActual}
              onChange={e => setPasswordActual(e.target.value)}
              autoComplete="current-password"
            />
          </label>
          <label className={styles.campo}>
            <span>Nueva contraseña</span>
            <input
              type="password"
              value={passwordNuevo}
              onChange={e => setPasswordNuevo(e.target.value)}
              autoComplete="new-password"
              minLength={8}
            />
          </label>
          <button type="submit" disabled={guardando || !passwordActual || !passwordNuevo}>
            {guardando ? 'Guardando...' : 'Actualizar contraseña'}
          </button>
        </form>
        {mensaje && <p className={styles.mensaje}>{mensaje}</p>}
      </section>

      <section className={styles.seccion}>
        <button className={styles.botonCerrar} onClick={logout}>Cerrar sesión</button>
      </section>
    </div>
  )
}

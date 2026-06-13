import { useEffect, useState } from 'react'
import styles from './Perfil.module.css'
import { getPerfil, cambiarPassword, actualizarDatos } from '../../api/perfil'
import { useAuth } from '../../context/AuthContext'

export default function Perfil() {
  const { logout } = useAuth()
  const [perfil, setPerfil] = useState<{ email: string; createdAt: string; username: string; nombre: string | null; apellidos: string | null } | null>(null)
  const [username, setUsername] = useState('')
  const [nombre, setNombre] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [guardandoDatos, setGuardandoDatos] = useState(false)
  const [mensajeDatos, setMensajeDatos] = useState<string | null>(null)
  const [passwordActual, setPasswordActual] = useState('')
  const [passwordNuevo, setPasswordNuevo] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState<string | null>(null)

  useEffect(() => {
    getPerfil().then(p => {
      setPerfil(p)
      setUsername(p.username ?? '')
      setNombre(p.nombre ?? '')
      setApellidos(p.apellidos ?? '')
    }).catch(() => {})
  }, [])

  const handleGuardarDatos = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return
    setGuardandoDatos(true)
    setMensajeDatos(null)
    try {
      await actualizarDatos({ username: username.trim(), nombre: nombre.trim() || undefined, apellidos: apellidos.trim() || undefined })
      setMensajeDatos('Datos actualizados.')
    } catch (err: any) {
      setMensajeDatos(err.message === 'Error' ? 'El nombre de usuario ya está en uso.' : 'Error al guardar.')
    } finally {
      setGuardandoDatos(false)
    }
  }

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
        <h2>Datos personales</h2>
        <form className={styles.form} onSubmit={handleGuardarDatos}>
          <label className={styles.campo}>
            <span>Nombre de usuario</span>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} minLength={3} maxLength={30} required />
          </label>
          <label className={styles.campo}>
            <span>Nombre</span>
            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} maxLength={60} />
          </label>
          <label className={styles.campo}>
            <span>Apellidos</span>
            <input type="text" value={apellidos} onChange={e => setApellidos(e.target.value)} maxLength={60} />
          </label>
          <button type="submit" disabled={guardandoDatos || !username.trim()}>
            {guardandoDatos ? 'Guardando...' : 'Guardar datos'}
          </button>
        </form>
        {mensajeDatos && <p className={styles.mensaje}>{mensajeDatos}</p>}
      </section>

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

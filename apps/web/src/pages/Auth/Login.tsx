import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Auth.module.css'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const destino = (location.state as any)?.from ?? '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate(destino, { replace: true })
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className={styles.pagina}>
      <form className={styles.formulario} onSubmit={handleSubmit}>
        <h1>Iniciar sesión</h1>
        <div>
          <label>Email o nombre de usuario</label>
          <input type="text" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Contraseña</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit">Entrar</button>
        <Link to="/registro">¿No tienes cuenta? Regístrate</Link>
      </form>
    </div>
  )
}

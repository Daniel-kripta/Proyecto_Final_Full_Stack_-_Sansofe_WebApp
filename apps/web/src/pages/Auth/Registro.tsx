import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Auth.module.css'

export default function Registro() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [honeypot, setHoneypot] = useState('')
  const navigate = useNavigate()
  const { registro } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (honeypot) return
    setError('')
    try {
      await registro(email, password)
      navigate('/login')
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className={styles.pagina}>
      <form className={styles.formulario} onSubmit={handleSubmit}>
        <h1>Registro</h1>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Contraseña (mínimo 8 caracteres)</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} minLength={8} required />
        </div>
        <div style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
          <input id="website" type="text" value={honeypot} onChange={e => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit">Registrarse</button>
        <Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
      </form>
    </div>
  )
}

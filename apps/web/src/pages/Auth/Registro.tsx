import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registro } from '../../api/auth'

export default function Registro() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await registro(email, password)
      navigate('/')
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <>
      <h1>Registro</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Contraseña (mínimo 8 caracteres)</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} minLength={8} required />
        </div>
        {error && <p>{error}</p>}
        <button type="submit">Registrarse</button>
      </form>
      <p><Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link></p>
    </>
  )
}

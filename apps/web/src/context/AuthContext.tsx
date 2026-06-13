import { createContext, useContext, useEffect, useState } from 'react'
import { login as apiLogin, registro as apiRegistro, logout as apiLogout } from '../api/auth'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3002'

interface Usuario {
  email: string
  username: string
}

interface AuthContextType {
  user: Usuario | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  registro: (email: string, password: string, username: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/auth/me`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    const data = await apiLogin(email, password)
    setUser(data.usuario)
  }

  const registro = async (email: string, password: string, username: string) => {
    const data = await apiRegistro(email, password, username)
    setUser(data.usuario)
  }

  const logout = async () => {
    await apiLogout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, registro, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}

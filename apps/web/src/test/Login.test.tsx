import { vi, describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

import { useAuth } from '../context/AuthContext'
import Login from '../pages/Auth/Login'

const mockUseAuth = vi.mocked(useAuth)

function renderLogin(state?: object) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/login', state }]}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<div>Inicio</div>} />
        <Route path="/perfil" element={<div>Perfil</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('Login', () => {
  const mockLogin = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      login: mockLogin,
      registro: vi.fn(),
      logout: vi.fn(),
    })
  })

  it('renderiza el formulario de login', () => {
    const { container } = renderLogin()
    expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument()
    expect(container.querySelector('input[type="text"]')).toBeInTheDocument()
    expect(container.querySelector('input[type="password"]')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })

  it('muestra enlace a registro', () => {
    renderLogin()
    expect(screen.getByRole('link', { name: /regístrate/i })).toBeInTheDocument()
  })

  it('login exitoso navega al destino por defecto /', async () => {
    mockLogin.mockResolvedValue(undefined)
    const user = userEvent.setup()
    const { container } = renderLogin()

    await user.type(container.querySelector('input[type="text"]')!, 'test@test.com')
    await user.type(container.querySelector('input[type="password"]')!, 'password123')
    await user.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@test.com', 'password123')
      expect(screen.getByText('Inicio')).toBeInTheDocument()
    })
  })

  it('login exitoso navega al destino del state.from', async () => {
    mockLogin.mockResolvedValue(undefined)
    const user = userEvent.setup()
    const { container } = renderLogin({ from: '/perfil' })

    await user.type(container.querySelector('input[type="text"]')!, 'test@test.com')
    await user.type(container.querySelector('input[type="password"]')!, 'password123')
    await user.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(screen.getByText('Perfil')).toBeInTheDocument()
    })
  })

  it('muestra el mensaje de error cuando login falla', async () => {
    mockLogin.mockRejectedValue(new Error('Credenciales incorrectas'))
    const user = userEvent.setup()
    const { container } = renderLogin()

    await user.type(container.querySelector('input[type="text"]')!, 'test@test.com')
    await user.type(container.querySelector('input[type="password"]')!, 'wrongpass')
    await user.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(screen.getByText('Credenciales incorrectas')).toBeInTheDocument()
    })
  })
})

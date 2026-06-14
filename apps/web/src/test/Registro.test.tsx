import { vi, describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

import { useAuth } from '../context/AuthContext'
import Registro from '../pages/Auth/Registro'

const mockUseAuth = vi.mocked(useAuth)

function renderRegistro() {
  return render(
    <MemoryRouter initialEntries={['/registro']}>
      <Routes>
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<div>Login</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('Registro', () => {
  const mockRegistro = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      login: vi.fn(),
      registro: mockRegistro,
      logout: vi.fn(),
    })
  })

  it('renderiza el formulario de registro', () => {
    const { container } = renderRegistro()
    expect(screen.getByRole('heading', { name: /registro/i })).toBeInTheDocument()
    expect(container.querySelector('input[type="text"]')).toBeInTheDocument()
    expect(container.querySelector('input[type="email"]')).toBeInTheDocument()
    expect(container.querySelector('input[type="password"]')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument()
  })

  it('muestra enlace a login', () => {
    renderRegistro()
    expect(screen.getByRole('link', { name: /inicia sesión/i })).toBeInTheDocument()
  })

  it('registro exitoso navega a /login', async () => {
    mockRegistro.mockResolvedValue(undefined)
    const user = userEvent.setup()
    const { container } = renderRegistro()

    await user.type(container.querySelector('input[type="text"]')!, 'testuser')
    await user.type(container.querySelector('input[type="email"]')!, 'test@test.com')
    await user.type(container.querySelector('input[type="password"]')!, 'password123')
    await user.click(screen.getByRole('button', { name: /registrarse/i }))

    await waitFor(() => {
      expect(mockRegistro).toHaveBeenCalledWith('test@test.com', 'password123', 'testuser')
      expect(screen.getByText('Login')).toBeInTheDocument()
    })
  })

  it('muestra mensaje de error cuando registro falla', async () => {
    mockRegistro.mockRejectedValue(new Error('El email o nombre de usuario ya existe'))
    const user = userEvent.setup()
    const { container } = renderRegistro()

    await user.type(container.querySelector('input[type="text"]')!, 'testuser')
    await user.type(container.querySelector('input[type="email"]')!, 'test@test.com')
    await user.type(container.querySelector('input[type="password"]')!, 'password123')
    await user.click(screen.getByRole('button', { name: /registrarse/i }))

    await waitFor(() => {
      expect(screen.getByText('El email o nombre de usuario ya existe')).toBeInTheDocument()
    })
  })

  it('el honeypot impide el envío si está relleno', async () => {
    const user = userEvent.setup()
    const { container } = renderRegistro()

    await user.type(container.querySelector('input[type="text"]')!, 'testuser')
    await user.type(container.querySelector('input[type="email"]')!, 'test@test.com')
    await user.type(container.querySelector('input[type="password"]')!, 'password123')

    const honeypot = document.getElementById('website') as HTMLInputElement
    await user.type(honeypot, 'bot-value')

    await user.click(screen.getByRole('button', { name: /registrarse/i }))

    expect(mockRegistro).not.toHaveBeenCalled()
  })
})

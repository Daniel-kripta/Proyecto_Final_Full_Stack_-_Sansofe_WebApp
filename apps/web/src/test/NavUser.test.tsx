import { vi, describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../components/Assets/Iconos/Iconos', () => ({
  CloseIcon: () => <svg />,
  PerfilBtnIcon: () => <svg />,
  AjustesBtnIcon: () => <svg />,
  SalirBtnIcon: () => <svg />,
  RegistroBtnIcon: () => <svg />,
  LoginBtnIcon: () => <svg />,
  ColeccionBtnIcon: () => <svg />,
}))

import { useAuth } from '../context/AuthContext'
import NavUser from '../components/Navigators/NavUser/NavUser'

const mockUseAuth = vi.mocked(useAuth)

function renderNavUser(onClose = vi.fn()) {
  return render(
    <MemoryRouter>
      <NavUser onClose={onClose} />
    </MemoryRouter>
  )
}

describe('NavUser', () => {
  beforeEach(() => { vi.clearAllMocks() })

  describe('usuario no autenticado', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
        login: vi.fn(),
        registro: vi.fn(),
        logout: vi.fn(),
      })
    })

    it('muestra los enlaces de registro y login', () => {
      renderNavUser()
      expect(screen.getByRole('link', { name: /registrarse/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /iniciar sesión/i })).toBeInTheDocument()
    })

    it('no muestra perfil, colecciones ni salir', () => {
      renderNavUser()
      expect(screen.queryByRole('link', { name: /perfil/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /cerrar sesión/i })).not.toBeInTheDocument()
    })
  })

  describe('usuario autenticado', () => {
    const mockLogout = vi.fn().mockResolvedValue(undefined)

    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: { email: 'test@test.com', username: 'testuser' },
        loading: false,
        login: vi.fn(),
        registro: vi.fn(),
        logout: mockLogout,
      })
    })

    it('muestra perfil, colecciones, ajustes y salir', () => {
      renderNavUser()
      expect(screen.getByRole('link', { name: /perfil/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /colecciones/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /ajustes/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cerrar sesión/i })).toBeInTheDocument()
    })

    it('no muestra registro ni login', () => {
      renderNavUser()
      expect(screen.queryByRole('link', { name: /registrarse/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('link', { name: /iniciar sesión/i })).not.toBeInTheDocument()
    })

    it('al hacer click en Salir llama a logout y onClose', async () => {
      const onClose = vi.fn()
      const user = userEvent.setup()
      renderNavUser(onClose)

      await user.click(screen.getByRole('button', { name: /cerrar sesión/i }))

      expect(mockLogout).toHaveBeenCalledOnce()
      expect(onClose).toHaveBeenCalledOnce()
    })

    it('al hacer click en un enlace llama a onClose', async () => {
      const onClose = vi.fn()
      const user = userEvent.setup()
      renderNavUser(onClose)

      await user.click(screen.getByRole('link', { name: /perfil/i }))

      expect(onClose).toHaveBeenCalledOnce()
    })
  })
})

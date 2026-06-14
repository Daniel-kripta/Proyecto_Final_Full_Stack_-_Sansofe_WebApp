import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('../components/Assets/Iconos/Iconos', () => ({
  SubirIcon: () => <svg data-testid="subir-icon" />,
}))

import BotonInicio from '../components/UX/BotonInicio/BotonInicio'

describe('BotonInicio', () => {
  let scrollToSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  })

  afterEach(() => {
    scrollToSpy.mockRestore()
  })

  it('renderiza el enlace con aria-label', () => {
    render(<BotonInicio />)
    expect(screen.getByRole('link', { name: /volver al inicio/i })).toBeInTheDocument()
  })

  it('renderiza el icono SVG', () => {
    render(<BotonInicio />)
    expect(screen.getByTestId('subir-icon')).toBeInTheDocument()
  })

  it('al hacer click llama a window.scrollTo con top 0', async () => {
    const user = userEvent.setup()
    render(<BotonInicio />)

    await user.click(screen.getByRole('link', { name: /volver al inicio/i }))

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })
})

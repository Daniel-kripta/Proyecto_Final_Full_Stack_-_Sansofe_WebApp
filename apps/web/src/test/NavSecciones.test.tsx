import { vi, describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('../api/portada', () => ({
  getPortadaParaFecha: vi.fn(),
  LABELS: {
    sucesos: 'Sucesos',
    sociedad: 'Sociedad',
    política: 'Política',
    cultura: 'Cultura',
  },
}))

import { getPortadaParaFecha } from '../api/portada'
import NavSecciones from '../components/Navigators/NavSecciones/NavSecciones'

describe('NavSecciones', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('no renderiza nada si no hay secciones disponibles', async () => {
    vi.mocked(getPortadaParaFecha).mockResolvedValue({})

    const { container } = render(<NavSecciones fecha="1926-01-01" />)

    await waitFor(() => {
      expect(container.firstChild).toBeNull()
    })
  })

  it('renderiza los enlaces de secciones disponibles', async () => {
    vi.mocked(getPortadaParaFecha).mockResolvedValue({
      sucesos: [{}],
      cultura: [{}],
    })

    render(<NavSecciones fecha="1926-01-01" />)

    await waitFor(() => {
      expect(screen.getByText('Sucesos')).toBeInTheDocument()
      expect(screen.getByText('Cultura')).toBeInTheDocument()
    })
  })

  it('no muestra secciones vacías', async () => {
    vi.mocked(getPortadaParaFecha).mockResolvedValue({
      sucesos: [{}],
      sociedad: [],
    })

    render(<NavSecciones fecha="1926-01-01" />)

    await waitFor(() => {
      expect(screen.getByText('Sucesos')).toBeInTheDocument()
      expect(screen.queryByText('Sociedad')).not.toBeInTheDocument()
    })
  })

  it('vuelve a cargar al cambiar la fecha', async () => {
    vi.mocked(getPortadaParaFecha).mockResolvedValue({ sucesos: [{}] })

    const { rerender } = render(<NavSecciones fecha="1926-01-01" />)
    await waitFor(() => expect(getPortadaParaFecha).toHaveBeenCalledWith('1926-01-01'))

    rerender(<NavSecciones fecha="1926-01-02" />)
    await waitFor(() => expect(getPortadaParaFecha).toHaveBeenCalledWith('1926-01-02'))
  })

  it('los enlaces tienen href de ancla correctos', async () => {
    vi.mocked(getPortadaParaFecha).mockResolvedValue({ sucesos: [{}] })

    render(<NavSecciones fecha="1926-01-01" />)

    await waitFor(() => {
      const enlace = screen.getByText('Sucesos').closest('a')
      expect(enlace).toHaveAttribute('href', '#sucesos')
    })
  })
})

import { vi, describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('../api/colecciones', () => ({
  guardarEnColeccion: vi.fn(),
}))

import { Chat } from '../components/ChatComponents/Chat/Chat'
import type { Mensaje, Coleccion } from '../types/chat'

const COLECCIONES: Coleccion[] = []

const MENSAJES_VACIO: Mensaje[] = []

const MENSAJE_USUARIO: Mensaje = {
  id: 'msg-1',
  role: 'user',
  content: 'Consulta de prueba',
}

const MENSAJE_ASISTENTE_LISTA: Mensaje = {
  id: 'msg-2',
  role: 'assistant',
  type: 'lista',
  content: 'Encontré estos artículos:',
  sources: [
    { id: 'art-1', headline: 'Titular 1', date: '1926-01-01', publication: 'El Día', url: '/articulo/art-1' },
  ],
}

const MENSAJE_ASISTENTE_SINTESIS: Mensaje = {
  id: 'msg-3',
  role: 'assistant',
  type: 'sintesis',
  content: 'Línea 1\n\nLínea 2',
  sources: [],
}

const MENSAJE_IRRELEVANTE: Mensaje = {
  id: 'msg-4',
  role: 'assistant',
  type: 'irrelevante',
  content: 'No he encontrado información relevante.',
}

function renderChat(overrides: Partial<Parameters<typeof Chat>[0]> = {}) {
  const defaults = {
    mensajes: MENSAJES_VACIO,
    colecciones: COLECCIONES,
    enviando: false,
    onEnviar: vi.fn().mockResolvedValue(undefined),
    onVerArticulo: vi.fn(),
    onGuardado: vi.fn(),
    onSintetizarSeleccion: vi.fn(),
  }
  return render(<Chat {...defaults} {...overrides} />)
}

describe('Chat', () => {
  beforeEach(() => { vi.clearAllMocks() })

  describe('interfaz de entrada', () => {
    it('renderiza el textarea y el botón Enviar', () => {
      renderChat()
      expect(screen.getByPlaceholderText(/escribe tu consulta/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument()
    })

    it('llama a onEnviar al pulsar Enviar con texto', async () => {
      const onEnviar = vi.fn().mockResolvedValue(undefined)
      const user = userEvent.setup()
      renderChat({ onEnviar })

      await user.type(screen.getByPlaceholderText(/escribe tu consulta/i), 'mi consulta')
      await user.click(screen.getByRole('button', { name: /enviar/i }))

      expect(onEnviar).toHaveBeenCalledWith('mi consulta', 10, null)
    })

    it('llama a onEnviar al pulsar Enter (sin Shift)', async () => {
      const onEnviar = vi.fn().mockResolvedValue(undefined)
      const user = userEvent.setup()
      renderChat({ onEnviar })

      const textarea = screen.getByPlaceholderText(/escribe tu consulta/i)
      await user.type(textarea, 'consulta via enter{Enter}')

      expect(onEnviar).toHaveBeenCalledOnce()
    })

    it('no llama a onEnviar con textarea vacío', async () => {
      const onEnviar = vi.fn().mockResolvedValue(undefined)
      const user = userEvent.setup()
      renderChat({ onEnviar })

      await user.click(screen.getByRole('button', { name: /enviar/i }))

      expect(onEnviar).not.toHaveBeenCalled()
    })

    it('desactiva el textarea y el botón mientras enviando=true', () => {
      renderChat({ enviando: true })
      expect(screen.getByPlaceholderText(/escribe tu consulta/i)).toBeDisabled()
      expect(screen.getByRole('button', { name: /enviando/i })).toBeDisabled()
    })
  })

  describe('animación de carga', () => {
    it('muestra "Procesando" cuando enviando=true', () => {
      renderChat({ enviando: true })
      expect(screen.getByText('Procesando')).toBeInTheDocument()
    })

    it('no muestra "Procesando" cuando enviando=false', () => {
      renderChat({ enviando: false })
      expect(screen.queryByText('Procesando')).not.toBeInTheDocument()
    })
  })

  describe('mensajes de usuario', () => {
    it('muestra el contenido del mensaje de usuario', () => {
      renderChat({ mensajes: [MENSAJE_USUARIO] })
      expect(screen.getByText('Consulta de prueba')).toBeInTheDocument()
    })
  })

  describe('mensajes del asistente', () => {
    it('muestra artículos en respuesta tipo lista', () => {
      renderChat({ mensajes: [MENSAJE_ASISTENTE_LISTA] })
      expect(screen.getByText('Encontré estos artículos:')).toBeInTheDocument()
      expect(screen.getByText('Titular 1')).toBeInTheDocument()
    })

    it('muestra el botón de sintetizar en respuesta tipo lista', () => {
      renderChat({ mensajes: [MENSAJE_ASISTENTE_LISTA] })
      expect(screen.getByRole('button', { name: /sintetizar selección/i })).toBeInTheDocument()
    })

    it('muestra el contenido de síntesis por párrafos', () => {
      renderChat({ mensajes: [MENSAJE_ASISTENTE_SINTESIS] })
      expect(screen.getByText('Línea 1')).toBeInTheDocument()
      expect(screen.getByText('Línea 2')).toBeInTheDocument()
    })

    it('muestra mensaje irrelevante', () => {
      renderChat({ mensajes: [MENSAJE_IRRELEVANTE] })
      expect(screen.getByText('No he encontrado información relevante.')).toBeInTheDocument()
    })

    it('botón Ver llama a onVerArticulo con el id correcto', async () => {
      const onVerArticulo = vi.fn()
      const user = userEvent.setup()
      renderChat({ mensajes: [MENSAJE_ASISTENTE_LISTA], onVerArticulo })

      await user.click(screen.getByRole('button', { name: /ver/i }))

      expect(onVerArticulo).toHaveBeenCalledWith('art-1')
    })

    it('botón sintetizar selección llama a onSintetizarSeleccion', async () => {
      const onSintetizarSeleccion = vi.fn()
      const user = userEvent.setup()
      renderChat({ mensajes: [MENSAJE_ASISTENTE_LISTA], onSintetizarSeleccion })

      await user.click(screen.getByRole('button', { name: /sintetizar selección/i }))

      expect(onSintetizarSeleccion).toHaveBeenCalledWith(['art-1'])
    })
  })

  describe('preview de colección', () => {
    it('muestra nombre de colección activa', () => {
      renderChat({
        previewColeccion: {
          nombre: 'Colección test',
          articulos: [],
        },
      })
      expect(screen.getByText(/Colección test seleccionada/i)).toBeInTheDocument()
    })
  })
})

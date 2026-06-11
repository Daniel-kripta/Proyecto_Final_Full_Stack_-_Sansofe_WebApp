import { useRef, useState, useEffect } from 'react'
import styles from './BusquedaAsistida.module.css'
import { Guia } from '../../components/Guia/Guia'
import { ChatUserInfo } from '../../components/ChatComponents/ChatUserInfo/ChatUserInfo'
import { ChatHistorial } from '../../components/ChatComponents/ChatHistorial/ChatHistorial'
import { ChatColecciones } from '../../components/ChatComponents/ChatColecciones/ChatColecciones'
import { ChatEstado } from '../../components/ChatComponents/ChatEstado/ChatEstado'
import { Chat } from '../../components/ChatComponents/Chat/Chat'
import { ModalArticulo } from '../../components/ModalArticulo/ModalArticulo'
import type { Mensaje, Coleccion } from '../../types/chat'
import { enviarMensaje, checkSalud } from '../../api/chat'
import { getColecciones } from '../../api/colecciones'
import { useAuth } from '../../context/AuthContext'

export default function BusquedaAsistida() {
  const layoutRef = useRef<HTMLDivElement>(null)
  const scrollToLayout = () => layoutRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [enviando, setEnviando] = useState(false)
  const [colecciones, setColecciones] = useState<Coleccion[]>([])
  const [activo, setActivo] = useState<boolean | null>(null)
  const [articuloAbierto, setArticuloAbierto] = useState<string | null>(null)
  const { logout } = useAuth()

  useEffect(() => {
    checkSalud().then(setActivo)
    getColecciones()
      .then(setColecciones)
      .catch(() => {})
  }, [])

  const handleEnviar = async (query: string, k: number, umbral: string | null) => {
    const mensajeUsuario: Mensaje = {
      id: crypto.randomUUID(),
      role: 'user',
      content: query,
    }
    setMensajes(prev => [...prev, mensajeUsuario])
    setEnviando(true)

    try {
      const respuesta = await enviarMensaje(query, k, umbral)
      const mensajeAsistente: Mensaje = {
        id: crypto.randomUUID(),
        role: 'assistant',
        type: respuesta.type as 'lista' | 'sintesis' | 'irrelevante',
        content: respuesta.content,
        sources: respuesta.sources,
      }
      setMensajes(prev => [...prev, mensajeAsistente])
    } catch (err: any) {
      if (err?.message === 'UNAUTHORIZED') {
        logout()
        return
      }
      const content = 'Ha ocurrido un error al contactar con el servicio. Por favor, inténtalo de nuevo.'
      setMensajes(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          type: 'irrelevante',
          content,
        },
      ])
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className={styles.chatLayout} ref={layoutRef}>

      <div className={styles.chatUserInfoWrapper}>
        <ChatUserInfo />
      </div>

      <aside className={styles.panel}>
        <div className={styles.bloque}>
          <ChatHistorial />
        </div>
        <div className={styles.bloque}>
          <ChatColecciones colecciones={colecciones} />
          <Guia id="Colecciones" />
        </div>
      </aside>

      <section className={styles.chatColumna}>
        <div className={`${styles.bloque} ${styles.bloqueChat}`}>
          <ChatEstado activo={activo} />
          {activo === false
            ? <Guia id="SetupServicio" cerrable={false} />
            : <Guia id="UsoChat" />
          }
          <Chat
            mensajes={mensajes}
            colecciones={colecciones}
            enviando={enviando}
            onEnviar={handleEnviar}
            onVerArticulo={setArticuloAbierto}
            onFocusInput={scrollToLayout}
          />
          <Guia id="ModoRecuperacion" />
          {articuloAbierto && (
            <ModalArticulo
              articuloId={articuloAbierto}
              onClose={() => setArticuloAbierto(null)}
            />
          )}
        </div>
      </section>

    </div>
  )
}

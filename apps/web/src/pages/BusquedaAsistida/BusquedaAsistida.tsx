import { useRef, useState, useEffect } from 'react'
import styles from './BusquedaAsistida.module.css'
import { Guia } from '../../components/Guia/Guia'
import { ChatUserInfo } from '../../components/ChatComponents/ChatUserInfo/ChatUserInfo'
import { ChatHistorial } from '../../components/ChatComponents/ChatHistorial/ChatHistorial'
import { ChatColecciones } from '../../components/ChatComponents/ChatColecciones/ChatColecciones'
import { ChatEstado } from '../../components/ChatComponents/ChatEstado/ChatEstado'
import { Chat } from '../../components/ChatComponents/Chat/Chat'
import { ModalArticulo } from '../../components/ModalArticulo/ModalArticulo'
import type { Mensaje, Coleccion, ArticuloRef } from '../../types/chat'
import { enviarMensaje } from '../../api/chat'
import { getColecciones, getColeccion, crearColeccion } from '../../api/colecciones'
import { testApiKey } from '../../api/perfil'
import { useAuth } from '../../context/AuthContext'

export default function BusquedaAsistida() {
  const layoutRef = useRef<HTMLDivElement>(null)
  const scrollToLayout = () => layoutRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const [mensajes, setMensajes] = useState<Mensaje[]>(() => {
    try {
      const saved = localStorage.getItem('chat_mensajes')
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [enviando, setEnviando] = useState(false)
  const [colecciones, setColecciones] = useState<Coleccion[]>([])
  const [coleccionReferencia, setColeccionReferencia] = useState<string | null>(null)
  const [previewColeccion, setPreviewColeccion] = useState<{ nombre: string; articulos: ArticuloRef[] } | null>(null)
  const [articulosReferencia, setArticulosReferencia] = useState<string[] | null>(null)
  const [activo, setActivo] = useState<boolean | null>(null)
  const [articuloAbierto, setArticuloAbierto] = useState<string | null>(null)
  const { logout } = useAuth()

  useEffect(() => {
    localStorage.setItem('chat_mensajes', JSON.stringify(mensajes))
  }, [mensajes])

  useEffect(() => {
    testApiKey().then(res => setActivo(res.ok)).catch(() => setActivo(false))
    getColecciones().then(setColecciones).catch(() => {})
  }, [])

  const handleGuardadoEnColeccion = (colId: string) => {
    setColecciones(prev => prev.map(c =>
      c.id === colId ? { ...c, _count: { articulos: c._count.articulos + 1 } } : c
    ))
  }

  const handleSintesis = async (colId: string | null) => {
    if (!colId) {
      setColeccionReferencia(null)
      setPreviewColeccion(null)
      return
    }
    setArticulosReferencia(null)
    setColeccionReferencia(colId)
    try {
      const col = await getColeccion(colId)
      const articulos: ArticuloRef[] = col.articulos.map((ca: any) => ({
        id: ca.articulo.id,
        headline: ca.articulo.headline,
        date: ca.articulo.date.split('T')[0],
        publication: ca.articulo.publication,
        url: `/articulo/${ca.articulo.id}`,
      }))
      setPreviewColeccion({ nombre: col.nombre, articulos })
    } catch {
      setPreviewColeccion(null)
    }
  }

  const handleSintetizarSeleccion = (ids: string[]) => {
    setColeccionReferencia(null)
    setPreviewColeccion(null)
    setArticulosReferencia(ids)
  }

  const handleCrearColeccion = async (nombre: string) => {
    const nueva = await crearColeccion(nombre)
    setColecciones(prev => [...prev, { ...nueva, _count: { articulos: 0 } }])
  }

  const handleEnviar = async (query: string, k: number, umbral: string | null) => {
    const mensajeUsuario: Mensaje = {
      id: crypto.randomUUID(),
      role: 'user',
      content: query,
    }
    setMensajes(prev => [...prev, mensajeUsuario])
    setEnviando(true)

    try {
      const respuesta = await enviarMensaje(query, k, umbral, coleccionReferencia, articulosReferencia)
      setColeccionReferencia(null)
      setPreviewColeccion(null)
      setArticulosReferencia(null)
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
      const content = err?.message === 'API_KEY_REQUIRED'
        ? 'Necesitas configurar una clave de API de Gemini en Ajustes para usar el asistente.'
        : 'Ha ocurrido un error al contactar con el servicio. Por favor, inténtalo de nuevo.'
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
          <ChatColecciones
            colecciones={colecciones}
            coleccionReferencia={coleccionReferencia}
            onCrear={handleCrearColeccion}
            onSintesis={handleSintesis}
          />
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
            previewColeccion={previewColeccion}
            enviando={enviando}
            onEnviar={handleEnviar}
            onVerArticulo={setArticuloAbierto}
            onGuardado={handleGuardadoEnColeccion}
            onFocusInput={scrollToLayout}
            onSintetizarSeleccion={handleSintetizarSeleccion}
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

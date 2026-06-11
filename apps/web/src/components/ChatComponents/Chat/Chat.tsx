import { useState, useEffect, useRef } from 'react'
import styles from './Chat.module.css'
import type { Mensaje, MensajeAsistente, ArticuloRef, Coleccion } from '../../../types/chat'
import { guardarEnColeccion } from '../../../api/colecciones'

function ArticuloCardChat({ articulo, colecciones, onVer }: { articulo: ArticuloRef; colecciones: Coleccion[]; onVer: (id: string) => void }) {
  const [seleccionado, setSeleccionado] = useState('')

  const handleGuardar = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const colId = e.target.value
    if (!colId) return
    try {
      await guardarEnColeccion(colId, articulo.id)
    } catch {
      // error silencioso
    }
    setSeleccionado('')
  }

  return (
    <div className={styles.articuloCard}>
      <div className={styles.articuloInfo}>
        <span className={styles.articuloTitular}>{articulo.headline}</span>
        <span className={styles.articuloMeta}>{articulo.date} · {articulo.publication}</span>
      </div>
      <div className={styles.articuloAcciones}>
        <button className={styles.botonVer} onClick={() => onVer(articulo.id)}>
          Ver
        </button>
        <select className={styles.selectColeccion} value={seleccionado} onChange={handleGuardar}>
          <option value="" disabled>Guardar en...</option>
          {colecciones.map(col => (
            <option key={col.id} value={col.id}>{col.nombre}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

function BloqueAsistente({ msg, colecciones, onVer }: { msg: MensajeAsistente; colecciones: Coleccion[]; onVer: (id: string) => void }) {
  return (
    <div className={styles.burbujAsistente}>
      {msg.type === 'lista' && (
        <>
          <p>{msg.content}</p>
          <div className={styles.listaArticulos}>
            {msg.sources?.map(art => (
              <ArticuloCardChat key={art.id} articulo={art} colecciones={colecciones} onVer={onVer} />
            ))}
          </div>
        </>
      )}
      {msg.type === 'sintesis' && (
        <>
          <div>
            {msg.content.split('\n\n').map((parrafo, i) => (
              <p key={i}>{parrafo}</p>
            ))}
          </div>
          {msg.sources && msg.sources.length > 0 && (
            <details>
              <summary className={styles.fuentesTitulo}>
                Fuentes consultadas ({msg.sources.length})
              </summary>
              <div className={styles.fuentesLista}>
                {msg.sources.map(art => (
                  <ArticuloCardChat key={art.id} articulo={art} colecciones={colecciones} onVer={onVer} />
                ))}
              </div>
            </details>
          )}
        </>
      )}
      {msg.type === 'irrelevante' && <p>{msg.content}</p>}
    </div>
  )
}

interface ChatProps {
  mensajes: Mensaje[]
  colecciones: Coleccion[]
  enviando?: boolean
  onEnviar: (query: string, k: number) => Promise<void>
  onVerArticulo: (id: string) => void
  onFocusInput?: () => void
}

export function Chat({ mensajes, colecciones, enviando = false, onEnviar, onVerArticulo, onFocusInput }: ChatProps) {
  const [k, setK] = useState(10)
  const [inputValor, setInputValor] = useState('')
  const mensajesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes, enviando])

  const handleEnviar = async () => {
    const query = inputValor.trim()
    if (!query || enviando) return
    setInputValor('')
    await onEnviar(query, k)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleEnviar()
    }
  }

  return (
    <div className={styles.chat}>
      <div className={styles.mensajes}>
        {mensajes.map(msg =>
          msg.role === 'user' ? (
            <div key={msg.id} className={styles.burbujUsuario}>
              <p>{msg.content}</p>
            </div>
          ) : (
            <BloqueAsistente key={msg.id} msg={msg as MensajeAsistente} colecciones={colecciones} onVer={onVerArticulo} />
          )
        )}
        {enviando && (
          <div className={styles.burbujAsistente}>
            <p className={styles.pensando}>...</p>
          </div>
        )}
        <div ref={mensajesEndRef} />
      </div>
      <div className={styles.inputArea}>
        <textarea
          className={styles.textarea}
          value={inputValor}
          onChange={e => setInputValor(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={onFocusInput}
          placeholder="Escribe tu consulta... (Enter para enviar, Shift+Enter para nueva línea)"
          rows={3}
          disabled={enviando}
        />
        <div className={styles.controles}>
          <label className={styles.kSelector}>
            <span>Artículos a consultar (solo síntesis)</span>
            <input
              type="number"
              min={1}
              max={50}
              value={k}
              onChange={e => setK(Number(e.target.value))}
              className={styles.kInput}
            />
          </label>
          <button className={styles.botonEnviar} onClick={handleEnviar} disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect, useRef } from 'react'
import styles from './Chat.module.css'
import type { Mensaje, MensajeAsistente, ArticuloRef, Coleccion } from '../../../types/chat'
import { guardarEnColeccion } from '../../../api/colecciones'

function ArticuloCardChat({ articulo, colecciones, onVer, onGuardado, checked, onCheckedChange }: {
  articulo: ArticuloRef
  colecciones: Coleccion[]
  onVer: (id: string) => void
  onGuardado: (colId: string) => void
  checked?: boolean
  onCheckedChange?: (id: string, checked: boolean) => void
}) {
  const [seleccionado, setSeleccionado] = useState('')
  const [guardado, setGuardado] = useState(false)

  const handleGuardar = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const colId = e.target.value
    if (!colId) return
    try {
      await guardarEnColeccion(colId, articulo.id)
      onGuardado(colId)
      setGuardado(true)
    } catch {
      setSeleccionado('')
    }
  }

  return (
    <div className={styles.articuloCard}>
      {onCheckedChange !== undefined && (
        <input
          type="checkbox"
          className={styles.articuloCheck}
          checked={checked ?? true}
          onChange={e => onCheckedChange(articulo.id, e.target.checked)}
        />
      )}
      <div className={styles.articuloInfo}>
        <span className={styles.articuloTitular}>{articulo.headline}</span>
        <span className={styles.articuloMeta}>{articulo.date} · {articulo.publication}</span>
      </div>
      <div className={styles.articuloAcciones}>
        {guardado && <span className={styles.guardadoConfirmacion}>✓</span>}
        <select className={styles.selectColeccion} value={seleccionado} onChange={handleGuardar}>
          <option value="" disabled>Guardar en...</option>
          {colecciones.map(col => (
            <option key={col.id} value={col.id}>{col.nombre}</option>
          ))}
        </select>
        <button className={styles.botonVer} onClick={() => onVer(articulo.id)}>
          Ver
        </button>
      </div>
    </div>
  )
}

function BloqueAsistente({ msg, colecciones, onVer, onGuardado, onSintetizarSeleccion }: {
  msg: MensajeAsistente
  colecciones: Coleccion[]
  onVer: (id: string) => void
  onGuardado: (colId: string) => void
  onSintetizarSeleccion: (ids: string[]) => void
}) {
  const [seleccionados, setSeleccionados] = useState<Set<string>>(
    () => new Set(msg.sources?.map(a => a.id) ?? [])
  )
  const [activado, setActivado] = useState(false)

  const toggleSeleccion = (id: string, checked: boolean) => {
    setActivado(false)
    setSeleccionados(prev => {
      const next = new Set(prev)
      checked ? next.add(id) : next.delete(id)
      return next
    })
  }

  return (
    <div className={styles.burbujAsistente}>
      {msg.type === 'lista' && (
        <>
          <p>{msg.content}</p>
          <div className={styles.listaArticulos}>
            {msg.sources?.map(art => (
              <ArticuloCardChat
                key={art.id}
                articulo={art}
                colecciones={colecciones}
                onVer={onVer}
                onGuardado={onGuardado}
                checked={seleccionados.has(art.id)}
                onCheckedChange={toggleSeleccion}
              />
            ))}
          </div>
          <button
            className={`${styles.botonSintetizar} ${activado ? styles.botonSintetizarActivo : ''}`}
            type="button"
            disabled={seleccionados.size === 0}
            onClick={() => { setActivado(true); onSintetizarSeleccion(Array.from(seleccionados)) }}
          >
            {activado ? `Selección activa (${seleccionados.size}) — escribe tu consulta` : `Sintetizar selección (${seleccionados.size})`}
          </button>
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
                Contexto de búsqueda ({msg.sources.length})
              </summary>
              <div className={styles.fuentesLista}>
                {msg.sources.map(art => (
                  <ArticuloCardChat key={art.id} articulo={art} colecciones={colecciones} onVer={onVer} onGuardado={onGuardado} />
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

type ModoRecuperacion = 'cantidad' | 'similitud'
type Umbral = 'exacto' | 'cercano' | 'similar'

interface ChatProps {
  mensajes: Mensaje[]
  colecciones: Coleccion[]
  previewColeccion?: { nombre: string; articulos: ArticuloRef[] } | null
  enviando?: boolean
  onEnviar: (query: string, k: number, umbral: string | null) => Promise<void>
  onVerArticulo: (id: string) => void
  onGuardado: (colId: string) => void
  onFocusInput?: () => void
  onSintetizarSeleccion: (ids: string[]) => void
}

export function Chat({ mensajes, colecciones, previewColeccion, enviando = false, onEnviar, onVerArticulo, onGuardado, onFocusInput, onSintetizarSeleccion }: ChatProps) {
  const [modo, setModo] = useState<ModoRecuperacion>('cantidad')
  const [k, setK] = useState(10)
  const [umbral, setUmbral] = useState<Umbral>('cercano')
  const [inputValor, setInputValor] = useState('')
  const mensajesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes, enviando])

  const handleEnviar = async () => {
    const query = inputValor.trim()
    if (!query || enviando) return
    setInputValor('')
    await onEnviar(query, k, modo === 'similitud' ? umbral : null)
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
            <BloqueAsistente key={msg.id} msg={msg as MensajeAsistente} colecciones={colecciones} onVer={onVerArticulo} onGuardado={onGuardado} onSintetizarSeleccion={onSintetizarSeleccion} />
          )
        )}
        {previewColeccion && (
          <div className={styles.burbujAsistente}>
            <p><strong>Colección {previewColeccion.nombre} seleccionada, haz tu consulta:</strong></p>
            <div className={styles.listaArticulos}>
              {previewColeccion.articulos.map(art => (
                <ArticuloCardChat key={art.id} articulo={art} colecciones={colecciones} onVer={onVerArticulo} onGuardado={onGuardado} />
              ))}
            </div>
          </div>
        )}
        {enviando && (
          <div className={styles.burbujAsistente}>
            <span className={styles.pensando}>
              <span className={styles.pensandoTexto}>Procesando</span>
              <span className={styles.pensandoPuntos}>
                <span /><span /><span />
              </span>
            </span>
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
          <div className={styles.modoSelector}>
            <button
              className={`${styles.modoBtn} ${modo === 'cantidad' ? styles.modoBtnActivo : ''}`}
              onClick={() => setModo('cantidad')}
              type="button"
            >
              Cantidad
            </button>
            <button
              className={`${styles.modoBtn} ${modo === 'similitud' ? styles.modoBtnActivo : ''}`}
              onClick={() => setModo('similitud')}
              type="button"
            >
              Similitud
            </button>
          </div>
          {modo === 'cantidad' ? (
            <label className={styles.kSelector}>
              <span>Artículos a consultar</span>
              <input
                type="number"
                min={1}
                max={50}
                value={k}
                onChange={e => setK(Number(e.target.value))}
                className={styles.kInput}
              />
            </label>
          ) : (
            <label className={styles.kSelector}>
              <span>Nivel de similitud</span>
              <select
                value={umbral}
                onChange={e => setUmbral(e.target.value as Umbral)}
                className={styles.kInput}
              >
                <option value="exacto">Exacto</option>
                <option value="cercano">Cercano</option>
                <option value="similar">Similar</option>
              </select>
            </label>
          )}
          <button className={styles.botonEnviar} onClick={handleEnviar} disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  )
}

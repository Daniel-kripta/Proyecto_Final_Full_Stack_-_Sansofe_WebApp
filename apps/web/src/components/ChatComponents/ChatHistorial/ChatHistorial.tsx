import { useState, useEffect } from 'react'
import styles from './ChatHistorial.module.css'
import type { Mensaje } from '../../../types/chat'
import { getInvestigaciones, getInvestigacion, crearInvestigacion } from '../../../api/investigaciones'

interface Investigacion {
  id: string
  titulo: string
  createdAt: string
}

interface ChatHistorialProps {
  mensajesActuales: Mensaje[]
  guardada: boolean
  refreshKey: number
  onCargar: (mensajes: Mensaje[]) => void
  onNueva: (opcion: 'guardar' | 'eliminar') => void
}

export function ChatHistorial({ mensajesActuales, guardada, refreshKey, onCargar, onNueva }: ChatHistorialProps) {
  const [investigaciones, setInvestigaciones] = useState<Investigacion[]>([])
  const [modalNueva, setModalNueva] = useState(false)
  const [guardandoAuto, setGuardandoAuto] = useState(false)

  useEffect(() => {
    getInvestigaciones().then(setInvestigaciones).catch(() => {})
  }, [refreshKey])

  const handleNueva = () => {
    const hayMensajesSinGuardar = mensajesActuales.length > 0 && !guardada
    if (hayMensajesSinGuardar) {
      setModalNueva(true)
    } else {
      onNueva('eliminar')
    }
  }

  const handleGuardarYNueva = async () => {
    setGuardandoAuto(true)
    const primerMensajeUsuario = mensajesActuales.find(m => m.role === 'user')
    const titulo = primerMensajeUsuario
      ? (primerMensajeUsuario as any).content.slice(0, 60)
      : 'Investigación'
    try {
      const nueva = await crearInvestigacion(titulo, mensajesActuales)
      setInvestigaciones(prev => [nueva, ...prev])
    } catch {}
    setGuardandoAuto(false)
    setModalNueva(false)
    onNueva('guardar')
  }

  const handleCargar = async (id: string) => {
    try {
      const inv = await getInvestigacion(id)
      onCargar(inv.mensajes)
    } catch {}
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.cabecera}>
        <span>Investigaciones</span>
        <button className={styles.botonNueva} onClick={handleNueva}>+ Nueva</button>
      </div>
      <div className={styles.lista}>
        {investigaciones.length === 0
          ? <span className={styles.hint}>Ninguna guardada</span>
          : investigaciones.map(inv => (
              <button key={inv.id} className={styles.itemInvestigacion} onClick={() => handleCargar(inv.id)}>
                {inv.titulo}
              </button>
            ))
        }
      </div>

      {modalNueva && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <p>Hay mensajes sin guardar. ¿Qué quieres hacer?</p>
            <div className={styles.modalAcciones}>
              <button onClick={handleGuardarYNueva} disabled={guardandoAuto}>Guardar</button>
              <button onClick={() => { setModalNueva(false); onNueva('eliminar') }}>Eliminar</button>
              <button onClick={() => setModalNueva(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

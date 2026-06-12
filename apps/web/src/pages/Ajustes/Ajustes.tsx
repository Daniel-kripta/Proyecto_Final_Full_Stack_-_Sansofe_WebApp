import { useEffect, useState } from 'react'
import styles from './Ajustes.module.css'
import { getPerfil, guardarApiKey } from '../../api/perfil'
import { Guia } from '../../components/Guia/Guia'

export default function Ajustes() {
  const [tieneApiKey, setTieneApiKey] = useState<boolean | null>(null)
  const [apiKey, setApiKey] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState<string | null>(null)

  useEffect(() => {
    getPerfil().then(p => setTieneApiKey(p.tieneApiKey)).catch(() => {})
  }, [])

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault()
    setGuardando(true)
    setMensaje(null)
    try {
      await guardarApiKey(apiKey.trim() || null)
      setTieneApiKey(!!apiKey.trim())
      setApiKey('')
      setMensaje('Clave guardada correctamente.')
    } catch {
      setMensaje('Error al guardar. Inténtalo de nuevo.')
    } finally {
      setGuardando(false)
    }
  }

  const handleEliminar = async () => {
    setGuardando(true)
    setMensaje(null)
    try {
      await guardarApiKey(null)
      setTieneApiKey(false)
      setMensaje('Clave eliminada.')
    } catch {
      setMensaje('Error al eliminar.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className={styles.pagina}>
      <h1>Ajustes</h1>

      <section className={styles.seccion}>
        <h2>API de Gemini</h2>
        <Guia id="GeminiApiKey" />
        <p className={styles.descripcion}>
          El asistente de búsqueda utiliza la API de Gemini de Google. Puedes introducir tu propia clave
          para usar tu cuota personal. Obtén una en{' '}
          <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer">Google AI Studio</a>.
        </p>
        <p className={styles.estado}>
          Estado: {tieneApiKey === null ? 'Cargando...' : tieneApiKey ? 'Clave configurada' : 'Sin clave configurada'}
        </p>
        <form className={styles.form} onSubmit={handleGuardar}>
          <input
            className={styles.input}
            type="password"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="Introduce tu clave de API..."
            autoComplete="off"
          />
          <button type="submit" disabled={guardando || !apiKey.trim()}>
            {guardando ? 'Guardando...' : 'Guardar clave'}
          </button>
          {tieneApiKey && (
            <button type="button" onClick={handleEliminar} disabled={guardando}>
              Eliminar clave
            </button>
          )}
        </form>
        {mensaje && <p className={styles.mensaje}>{mensaje}</p>}
      </section>
    </div>
  )
}

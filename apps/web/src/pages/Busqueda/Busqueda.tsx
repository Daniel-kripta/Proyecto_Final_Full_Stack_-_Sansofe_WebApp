import { useState, useEffect } from 'react'
import { buscarArticulos, getPublicaciones } from '../../api/articulos'
import { SECCIONES } from '../../constants/secciones'
import { ArticuloCard } from '../../components/ArticuloCard/ArticuloCard'
import styles from './Busqueda.module.css'

const TOPICS = SECCIONES.filter(s => s.tipo === 'topic')

export default function Busqueda() {
  const [q, setQ]                   = useState('')
  const [publication, setPublication] = useState('')
  const [topic, setTopic]           = useState('')
  const [desde, setDesde]           = useState('')
  const [hasta, setHasta]           = useState('')
  const [publicaciones, setPublicaciones] = useState<string[]>([])
  const [articulos, setArticulos]   = useState<any[]>([])
  const [pagina, setPagina]         = useState(1)
  const [buscado, setBuscado]       = useState(false)
  const [cargando, setCargando]     = useState(false)
  const [error, setError]           = useState('')

  useEffect(() => {
    getPublicaciones().then(setPublicaciones)
  }, [])

  const buscar = async (p = 1) => {
    setCargando(true)
    setError('')
    const params: Record<string, string> = { pagina: String(p) }
    if (q.trim())      params.q           = q.trim()
    if (publication)   params.publication  = publication
    if (topic)         params.topic        = topic
    if (desde)         params.desde        = desde
    if (hasta)         params.hasta        = hasta
    try {
      const results = await buscarArticulos(params)
      setArticulos(results)
      setPagina(p)
      setBuscado(true)
    } catch {
      setError('Error al conectar con el servidor.')
    } finally {
      setCargando(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    buscar(1)
  }

  const hayFiltros = q || publication || topic || desde || hasta

  return (
    <div className={styles.pagina}>
      <form className={styles.formulario} onSubmit={handleSubmit}>
        <h1>Búsqueda</h1>

        <div className={styles.campo}>
          <label>Palabras clave</label>
          <input
            type="search"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Buscar en el texto..."
          />
        </div>

        <div className={styles.fila}>
          <div className={styles.campo}>
            <label>Publicación</label>
            <select value={publication} onChange={e => setPublication(e.target.value)}>
              <option value="">Todas</option>
              {publicaciones.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className={styles.campo}>
            <label>Sección</label>
            <select value={topic} onChange={e => setTopic(e.target.value)}>
              <option value="">Todas</option>
              {TOPICS.map(s => <option key={s.valor} value={s.valor}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <div className={styles.fila}>
          <div className={styles.campo}>
            <label>Desde</label>
            <input
              type="date"
              value={desde}
              onChange={e => setDesde(e.target.value)}
              min="1926-01-01"
              max={hasta || '1926-12-31'}
            />
          </div>
          <div className={styles.campo}>
            <label>Hasta</label>
            <input
              type="date"
              value={hasta}
              onChange={e => setHasta(e.target.value)}
              min={desde || '1926-01-01'}
              max="1926-12-31"
            />
          </div>
        </div>

        <button type="submit" disabled={cargando || !hayFiltros}>
          {cargando ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      {buscado && !cargando && (
        <div className={styles.resultados}>
          {articulos.length === 0
            ? <p className={styles.sinResultados}>Sin resultados.</p>
            : <>
                <div className={styles.lista}>
                  {articulos.map(a => <ArticuloCard key={a.id} {...a} mostrarFecha />)}
                </div>
                <div className={styles.paginacion}>
                  {pagina > 1 && (
                    <button onClick={() => buscar(pagina - 1)}>Anterior</button>
                  )}
                  <span>Página {pagina}</span>
                  {articulos.length === 20 && (
                    <button onClick={() => buscar(pagina + 1)}>Siguiente</button>
                  )}
                </div>
              </>
          }
        </div>
      )}
    </div>
  )
}

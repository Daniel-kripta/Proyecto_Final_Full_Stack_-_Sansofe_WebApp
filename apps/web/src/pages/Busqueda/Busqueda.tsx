import { useState } from 'react'
import { Link } from 'react-router-dom'
import { buscarArticulos } from '../../api/articulos'

export default function Busqueda() {
  const [q, setQ]               = useState('')
  const [articulos, setArticulos] = useState<any[]>([])
  const [pagina, setPagina]     = useState(1)
  const [buscado, setBuscado]   = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError]       = useState('')

  const buscar = async (p = 1) => {
    if (!q.trim()) return
    setCargando(true)
    setError('')
    try {
      const results = await buscarArticulos({ q, pagina: String(p) })
      setArticulos(results)
      setPagina(p)
      setBuscado(true)
    } catch {
      setError('Error al conectar con el servidor')
    } finally {
      setCargando(false)
    }
  }

  return (
    <>
      <h1>Búsqueda</h1>
      <form onSubmit={e => { e.preventDefault(); buscar(1) }}>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Buscar en el archivo..."
        />
        <button type="submit">Buscar</button>
      </form>

      {cargando && <p>Buscando...</p>}
      {error && <p>{error}</p>}
      {buscado && !cargando && articulos.length === 0 && <p>Sin resultados.</p>}

      {articulos.map(a => (
        <article key={a.id}>
          <Link to={`/articulo/${a.id}`}><strong>{a.headline}</strong></Link>
          <p>{a.summary}</p>
          <small>{a.publication} · {a.date} · {a.genre}</small>
        </article>
      ))}

      {articulos.length > 0 && (
        <div>
          {pagina > 1 && <button onClick={() => buscar(pagina - 1)}>← Anterior</button>}
          <span> Página {pagina} </span>
          {articulos.length === 20 && <button onClick={() => buscar(pagina + 1)}>Siguiente →</button>}
        </div>
      )}
    </>
  )
}

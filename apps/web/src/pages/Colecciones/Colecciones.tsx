import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Colecciones.module.css'
import { getColecciones, getColeccion, crearColeccion, eliminarColeccion, eliminarDeColeccion, exportarColeccion } from '../../api/colecciones'

interface ColeccionResumen {
  id: string
  nombre: string
  _count: { articulos: number }
}

interface ArticuloEnColeccion {
  articuloId: string
  addedAt: string
  articulo: {
    id: string
    headline: string
    date: string
    publication: string
    summary: string | null
    genre: string
  }
}

interface ColeccionDetalle {
  id: string
  nombre: string
  articulos: ArticuloEnColeccion[]
}

export default function Colecciones() {
  const [colecciones, setColecciones] = useState<ColeccionResumen[]>([])
  const [seleccionada, setSeleccionada] = useState<ColeccionDetalle | null>(null)
  const [nombreNueva, setNombreNueva] = useState('')
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    getColecciones().then(setColecciones).catch(() => {})
  }, [])

  const cargarColeccion = async (id: string) => {
    setCargando(true)
    try {
      const col = await getColeccion(id)
      setSeleccionada(col)
    } finally {
      setCargando(false)
    }
  }

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombreNueva.trim()) return
    const nueva = await crearColeccion(nombreNueva.trim())
    setColecciones(prev => [...prev, { ...nueva, _count: { articulos: 0 } }])
    setNombreNueva('')
  }

  const handleEliminarColeccion = async (id: string) => {
    await eliminarColeccion(id)
    setColecciones(prev => prev.filter(c => c.id !== id))
    if (seleccionada?.id === id) setSeleccionada(null)
  }

  const handleEliminarArticulo = async (articuloId: string) => {
    if (!seleccionada) return
    await eliminarDeColeccion(seleccionada.id, articuloId)
    setSeleccionada(prev => prev ? {
      ...prev,
      articulos: prev.articulos.filter(a => a.articuloId !== articuloId)
    } : null)
    setColecciones(prev => prev.map(c =>
      c.id === seleccionada.id ? { ...c, _count: { articulos: c._count.articulos - 1 } } : c
    ))
  }

  const handleExportar = async (id: string) => {
    const res = await exportarColeccion(id)
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `coleccion-${id}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.aside}>
        <h2 className={styles.titulo}>Mis colecciones</h2>
        <ul className={styles.lista}>
          {colecciones.map(col => (
            <li
              key={col.id}
              className={`${styles.item} ${seleccionada?.id === col.id ? styles.itemActivo : ''}`}
            >
              <button className={styles.itemBtn} onClick={() => cargarColeccion(col.id)}>
                <span className={styles.itemNombre}>{col.nombre}</span>
                <span className={styles.itemConteo}>{col._count.articulos}</span>
              </button>
              <button className={styles.itemEliminar} onClick={() => handleEliminarColeccion(col.id)} title="Eliminar colección">✕</button>
            </li>
          ))}
        </ul>
        <form className={styles.formNueva} onSubmit={handleCrear}>
          <input
            className={styles.inputNueva}
            value={nombreNueva}
            onChange={e => setNombreNueva(e.target.value)}
            placeholder="Nueva colección..."
          />
          <button type="submit" disabled={!nombreNueva.trim()}>Crear</button>
        </form>
      </aside>

      <section className={styles.contenido}>
        {!seleccionada && !cargando && (
          <p className={styles.placeholder}>Selecciona una colección para ver sus artículos.</p>
        )}
        {cargando && <p className={styles.placeholder}>Cargando...</p>}
        {seleccionada && !cargando && (
          <>
            <div className={styles.coleccionCabecera}>
              <h2>{seleccionada.nombre}</h2>
              <div className={styles.coleccionAcciones}>
                <span>{seleccionada.articulos.length} artículos</span>
                <button onClick={() => handleExportar(seleccionada.id)}>Exportar CSV</button>
              </div>
            </div>
            {seleccionada.articulos.length === 0 && (
              <p className={styles.placeholder}>Esta colección está vacía.</p>
            )}
            <ul className={styles.articulos}>
              {seleccionada.articulos.map(({ articuloId, articulo }) => (
                <li key={articuloId} className={styles.articuloItem}>
                  <div className={styles.articuloInfo}>
                    <span className={styles.articuloTitular}>{articulo.headline}</span>
                    <span className={styles.articuloMeta}>
                      {new Date(articulo.date).toLocaleDateString('es-ES')} · {articulo.publication} · {articulo.genre}
                    </span>
                    {articulo.summary && <p className={styles.articuloResumen}>{articulo.summary}</p>}
                  </div>
                  <div className={styles.articuloAcciones}>
                    <Link to={`/articulo/${articulo.id}`} className={styles.botonVer}>Ver</Link>
                    <button className={styles.botonEliminar} onClick={() => handleEliminarArticulo(articuloId)}>Quitar</button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  )
}

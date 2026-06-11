import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { SECCIONES } from '../../constants/secciones'
import { getArticulosPorSeccion } from '../../api/articulos'
import { ArticuloCard } from '../../components/ArticuloCard/ArticuloCard'
import styles from './Seccion.module.css'

export default function Seccion() {
  const { seccion } = useParams<{ seccion: string }>()
  const [articulos, setArticulos] = useState<any[]>([])
  const [pagina, setPagina] = useState(1)
  const [hayMas, setHayMas] = useState(true)
  const [cargando, setCargando] = useState(false)
  const sentinel = useRef<HTMLDivElement>(null)

  const def = SECCIONES.find(s => s.valor === seccion)
  const tipo = def?.tipo ?? 'topic'
  const label = def?.label ?? seccion ?? ''

  useEffect(() => {
    setArticulos([])
    setPagina(1)
    setHayMas(true)
  }, [seccion])

  useEffect(() => {
    if (!seccion) return
    let cancelled = false
    setCargando(true)
    getArticulosPorSeccion(seccion, tipo, pagina)
      .then(data => {
        if (cancelled) return
        setArticulos(prev => pagina === 1 ? data : [...prev, ...data])
        setHayMas(data.length === 20)
      })
      .finally(() => { if (!cancelled) setCargando(false) })
    return () => { cancelled = true }
  }, [seccion, pagina])

  useEffect(() => {
    const el = sentinel.current
    if (!el) return
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hayMas && !cargando) {
        setPagina(p => p + 1)
      }
    }, { rootMargin: '300px' })
    observer.observe(el)
    return () => observer.disconnect()
  }, [hayMas, cargando])

  return (
    <div className={styles.pagina}>
      <h1 className={styles.titulo}>{label}</h1>
      <div className={styles.lista}>
        {articulos.map(a => <ArticuloCard key={a.id} {...a} />)}
      </div>
      {cargando && <p className={styles.estado}>Cargando...</p>}
      {!hayMas && articulos.length > 0 && <p className={styles.estado}>No hay más artículos</p>}
      <div ref={sentinel} />
    </div>
  )
}

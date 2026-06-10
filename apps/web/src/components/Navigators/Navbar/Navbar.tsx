import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './Navbar.module.css'

const SECCIONES = [
  { label: 'Anuncios',       valor: 'anuncios' },
  { label: 'Sucesos',        valor: 'sucesos' },
  { label: 'Sociedad',       valor: 'sociedad' },
  { label: 'Política',       valor: 'política' },
  { label: 'Internacional',  valor: 'internacional' },
  { label: 'Economía',       valor: 'economía' },
  { label: 'Cultura',        valor: 'cultura' },
  { label: 'Deportes',       valor: 'deportes' },
  { label: 'Religión',       valor: 'religión' },
  { label: 'Agricultura',    valor: 'agricultura' },
  { label: 'Militar',        valor: 'militar' },
  { label: 'Otros',          valor: 'otros' },
]

export default function Navbar() {
  const [seccionesOpen, setSeccionesOpen] = useState(false)
  const barraRef = useRef<HTMLDivElement>(null)
  const [scroll, setScroll] = useState({ izq: false, der: false })

  const checkScroll = () => {
    const el = barraRef.current
    if (!el) return
    setScroll({
      izq: el.scrollLeft > 0,
      der: el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
    })
  }

  useEffect(() => {
    if (!seccionesOpen) return
    checkScroll()
    const el = barraRef.current
    if (!el) return
    const ro = new ResizeObserver(checkScroll)
    ro.observe(el)
    return () => ro.disconnect()
  }, [seccionesOpen])

  const desplazar = (dir: 'izq' | 'der') => {
    barraRef.current?.scrollBy({ left: dir === 'der' ? 160 : -160, behavior: 'smooth' })
  }

  return (
    <div className={styles.wrapper}>
      <nav className={styles.navBar}>
        <Link to="/buscar" className={styles.enlace}>Archivo</Link>
        <button
          className={`${styles.enlace} ${styles.toggle} ${seccionesOpen ? styles.activo : ''}`}
          onClick={() => setSeccionesOpen(v => !v)}
        >
          Secciones ▾
        </button>
        <Link to="/resultados?tipo=genre&valor=literatura" className={styles.enlace}>Literatura</Link>
        <Link to="/resultados?tipo=genre&valor=opinión" className={styles.enlace}>Opinión</Link>
        <Link to="/investigar" className={styles.enlace}>[RAG]</Link>
      </nav>

      {seccionesOpen && (
        <div className={styles.subbarraWrapper}>
          {scroll.izq && (
            <button className={`${styles.scrollBtn} ${styles.scrollBtnIzq}`} onClick={() => desplazar('izq')}>‹</button>
          )}
          <div className={styles.subbarra} ref={barraRef} onScroll={checkScroll}>
            {SECCIONES.map(s => (
              <Link
                key={s.valor}
                to={`/resultados?tipo=topic&valor=${s.valor}`}
                className={styles.subenlace}
              >
                {s.label}
              </Link>
            ))}
          </div>
          {scroll.der && (
            <button className={`${styles.scrollBtn} ${styles.scrollBtnDer}`} onClick={() => desplazar('der')}>›</button>
          )}
        </div>
      )}
    </div>
  )
}

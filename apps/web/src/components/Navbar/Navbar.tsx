import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './Navbar.module.css'

const SECCIONES = [
  { label: 'Política',         valor: 'politica' },
  { label: 'Deportes',         valor: 'deportes' },
  { label: 'Cultura',          valor: 'cultura' },
  { label: 'Poemas',           valor: 'poemas' },
  { label: 'Sociedad',         valor: 'sociedad' },
  { label: 'Economía',         valor: 'economia' },
  { label: 'Sucesos',          valor: 'sucesos' },
  { label: 'Personajes',       valor: 'personajes' },
  { label: 'Religión',         valor: 'religion' },
  { label: 'Agricultura',      valor: 'agricultura' },
  { label: 'Ciencia',          valor: 'ciencia' },
  { label: 'Literatura',       valor: 'literatura' },
  { label: 'Necrológicas',     valor: 'necrologicas' },
  { label: 'Anuncios',         valor: 'anuncios' },
  { label: 'Internacional',    valor: 'internacional' },
  { label: 'Tribunales',       valor: 'tribunales' },
  { label: 'Medicina',         valor: 'medicina' },
  { label: 'Marina',           valor: 'marina' },
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
      <nav className={styles.nav}>
        <Link to="/buscar" className={styles.enlace}>Archivo</Link>
        <button
          className={`${styles.enlace} ${styles.toggle} ${seccionesOpen ? styles.activo : ''}`}
          onClick={() => setSeccionesOpen(v => !v)}
        >
          Secciones ▾
        </button>
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
                to={`/resultados?tipo=genre&valor=${s.valor}`}
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

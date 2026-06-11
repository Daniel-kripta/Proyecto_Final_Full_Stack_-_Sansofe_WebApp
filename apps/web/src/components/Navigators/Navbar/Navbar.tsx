import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './Navbar.module.css'

const SECCIONES = [
  { label: 'Anuncios',       valor: 'anuncios',       tipo: 'topic' },
  { label: 'Sucesos',        valor: 'sucesos',        tipo: 'topic' },
  { label: 'Sociedad',       valor: 'sociedad',       tipo: 'topic' },
  { label: 'Política',       valor: 'política',       tipo: 'topic' },
  { label: 'Internacional',  valor: 'internacional',  tipo: 'topic' },
  { label: 'Economía',       valor: 'economía',       tipo: 'topic' },
  { label: 'Cultura',        valor: 'cultura',        tipo: 'topic' },
  { label: 'Deportes',       valor: 'deportes',       tipo: 'topic' },
  { label: 'Religión',       valor: 'religión',       tipo: 'topic' },
  { label: 'Agricultura',    valor: 'agricultura',    tipo: 'topic' },
  { label: 'Militar',        valor: 'militar',        tipo: 'topic' },
  { label: 'Otros',          valor: 'otros',          tipo: 'topic' },
  { label: 'Literatura',     valor: 'literatura',     tipo: 'genre' },
  { label: 'Opinión',        valor: 'opinión',        tipo: 'genre' },
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
        <Link to="/busqueda-asistida" className={styles.enlace}>Búsqueda Asistida</Link>
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
                to={`/resultados?tipo=${s.tipo}&valor=${s.valor}`}
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

import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SECCIONES } from '../../../constants/secciones'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [seccionesOpen, setSeccionesOpen] = useState(false)
  const [busquedaOpen, setBusquedaOpen] = useState(false)
  const barraRef = useRef<HTMLDivElement>(null)
  const [scroll, setScroll] = useState({ izq: false, der: false })

  const toggleSecciones = () => {
    setSeccionesOpen(v => !v)
    setBusquedaOpen(false)
  }

  const toggleBusqueda = () => {
    setBusquedaOpen(v => !v)
    setSeccionesOpen(false)
  }

  const cerrarTodo = () => {
    setSeccionesOpen(false)
    setBusquedaOpen(false)
  }

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
        <Link to="/" className={styles.enlace}>Hace 100 años</Link>
        <button
          className={`${styles.enlace} ${styles.toggle} ${seccionesOpen ? styles.activo : ''}`}
          onClick={toggleSecciones}
        >
          Secciones ▾
        </button>
        <button
          className={`${styles.enlace} ${styles.toggle} ${busquedaOpen ? styles.activo : ''}`}
          onClick={toggleBusqueda}
        >
          Búsqueda ▾
        </button>
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
                to={`/seccion/${s.valor}`}
                className={styles.subenlace}
                onClick={cerrarTodo}
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

      {busquedaOpen && (
        <div className={styles.subbarraWrapper}>
          <div className={`${styles.subbarra} ${styles.subbarraCentrada}`}>
            <Link to="/buscar" className={styles.subenlace} onClick={cerrarTodo}>Búsqueda Simple</Link>
            <Link to="/busqueda-asistida" className={styles.subenlace} onClick={cerrarTodo}>Búsqueda Asistida</Link>
          </div>
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { getPortada } from '../../api/articulos'
import { ArticuloCard } from '../../components/ArticuloCard/ArticuloCard'
import styles from './Portada.module.css'

const SECCIONES = [
  'Anuncios', 'Sucesos', 'Sociedad', 'Política', 'Internacional',
  'Economía', 'Cultura', 'Deportes', 'Religión', 'Agricultura', 'Militar', 'Otros',
]

const TOPIC_LABEL: Record<string, string> = {
  anuncios: 'Anuncios',
  sucesos: 'Sucesos',
  sociedad: 'Sociedad',
  'política': 'Política',
  internacional: 'Internacional',
  'economía': 'Economía',
  cultura: 'Cultura',
  deportes: 'Deportes',
  'religión': 'Religión',
  agricultura: 'Agricultura',
  militar: 'Militar',
  otros: 'Otros',
}

function agrupar(articulos: any[]) {
  const grupos = new Map<string, any[]>()
  SECCIONES.forEach(s => grupos.set(s, []))

  for (const art of articulos) {
    const seccion = ((art.topics as string[]) ?? [])
      .map(t => TOPIC_LABEL[t])
      .find(s => s !== undefined) ?? 'Otros'
    grupos.get(seccion)!.push(art)
  }

  return SECCIONES
    .map(s => ({ seccion: s, articulos: grupos.get(s)! }))
    .filter(g => g.articulos.length > 0)
}

export default function Portada() {
  const [articulos, setArticulos] = useState<any[]>([])
  const [cargando, setCargando]   = useState(true)

  useEffect(() => {
    getPortada()
      .then(setArticulos)
      .finally(() => setCargando(false))
  }, [])

  const fecha = new Date()
  fecha.setFullYear(fecha.getFullYear() - 100)
  const grupos = agrupar(articulos)

  return (
    <>
      <h1>
        {fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
      </h1>
      {cargando && <p>Cargando...</p>}
      {!cargando && articulos.length === 0 && <p>No hay artículos para esta fecha.</p>}
      {grupos.map(g => (
        <section key={g.seccion} className={styles.seccion}>
          <h2 className={styles.cabecera}>{g.seccion}</h2>
          {g.articulos.map(a => <ArticuloCard key={a.id} {...a} />)}
        </section>
      ))}
    </>
  )
}

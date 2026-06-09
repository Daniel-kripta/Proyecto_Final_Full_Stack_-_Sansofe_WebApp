import { useEffect, useState } from 'react'
import { getPortada } from '../../api/articulos'
import { ArticuloCard } from '../../components/ArticuloCard/ArticuloCard'

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

  return (
    <>
      <h1>
        {fecha.toLocaleDateString('es-ES', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
      </h1>
      {cargando && <p>Cargando...</p>}
      {!cargando && articulos.length === 0 && <p>No hay artículos para esta fecha.</p>}
      {articulos.map(a => <ArticuloCard key={a.id} {...a} />)}
    </>
  )
}
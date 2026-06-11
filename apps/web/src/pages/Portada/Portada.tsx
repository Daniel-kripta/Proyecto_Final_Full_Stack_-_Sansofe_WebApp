import BloqueSeccion from '../../components/BloqueSeccion/BloqueSeccion'
import styles from "./Portada.module.css"

export default function Portada() {
  const fecha = new Date()
  fecha.setFullYear(fecha.getFullYear() - 100)

  return (
    <>
      <h1>
        {fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
      </h1>
      <div className={styles.contentBloques}>
        <BloqueSeccion seccion="sucesos" />
        <BloqueSeccion seccion="sociedad" />
        <BloqueSeccion seccion="política" />
        <BloqueSeccion seccion="internacional" />
        <BloqueSeccion seccion="economía" />
        <BloqueSeccion seccion="cultura" />
        <BloqueSeccion seccion="deportes" />
        <BloqueSeccion seccion="anuncios" />
        <BloqueSeccion seccion="religión" />
        <BloqueSeccion seccion="agricultura" />
        <BloqueSeccion seccion="militar" />
        <BloqueSeccion seccion="otros" />
      </div>
    </>
  )
}

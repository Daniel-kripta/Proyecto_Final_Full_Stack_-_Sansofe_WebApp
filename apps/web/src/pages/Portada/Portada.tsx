import { useState } from 'react'
import SelectorDia from '../../components/Navigators/SelectorDia/SelectorDia'
import NavSecciones from '../../components/Navigators/NavSecciones/NavSecciones'
import BloqueSeccion from '../../components/Content/BloqueSeccion/BloqueSeccion'
import BotonInicio from '../../components/UX/BotonInicio/BotonInicio'
import styles from './Portada.module.css'

export default function Portada() {
  const [fecha, setFecha] = useState<string | null>(null)

  return (
    <>
      <SelectorDia onFechaChange={setFecha} />
      {fecha && (
        <>
          <NavSecciones fecha={fecha} />
          <div className={styles.contentBloques}>
            <BloqueSeccion seccion="sucesos" fecha={fecha} />
            <BloqueSeccion seccion="sociedad" fecha={fecha} />
            <BloqueSeccion seccion="política" fecha={fecha} />
            <BloqueSeccion seccion="internacional" fecha={fecha} />
            <BloqueSeccion seccion="economía" fecha={fecha} />
            <BloqueSeccion seccion="cultura" fecha={fecha} />
            <BloqueSeccion seccion="deportes" fecha={fecha} />
            <BloqueSeccion seccion="anuncios" fecha={fecha} />
            <BloqueSeccion seccion="religión" fecha={fecha} />
            <BloqueSeccion seccion="agricultura" fecha={fecha} />
            <BloqueSeccion seccion="militar" fecha={fecha} />
            <BloqueSeccion seccion="otros" fecha={fecha} />
          </div>
        </>
      )}
      <BotonInicio />
    </>
  )
}

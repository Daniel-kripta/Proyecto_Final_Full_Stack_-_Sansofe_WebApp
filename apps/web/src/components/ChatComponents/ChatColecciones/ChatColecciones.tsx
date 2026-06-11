import styles from './ChatColecciones.module.css'
import type { Coleccion } from '../../../types/chat'

interface Props {
  colecciones: Coleccion[]
}

export function ChatColecciones({ colecciones }: Props) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.titulo}>Colecciones</span>
      <ul className={styles.lista}>
        {colecciones.map(col => (
          <li key={col.id} className={styles.item}>
            <div className={styles.info}>
              <span className={styles.nombre}>{col.nombre}</span>
              <span className={styles.count}>{col._count.articulos} artículos</span>
            </div>
            <button className={styles.botonSintesis}>Síntesis</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

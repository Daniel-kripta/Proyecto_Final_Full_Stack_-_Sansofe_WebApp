import styles from './ChatHistorial.module.css'

export function ChatHistorial() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.cabecera}>
        <span>Investigaciones</span>
        <button className={styles.botonNueva}>+ Nueva</button>
      </div>
      <span className={styles.hint}>Doble clic para cambiar nombre</span>
    </div>
  )
}

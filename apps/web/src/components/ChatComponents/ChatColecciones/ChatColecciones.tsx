import { useState } from 'react'
import styles from './ChatColecciones.module.css'
import type { Coleccion } from '../../../types/chat'

interface Props {
  colecciones: Coleccion[]
  onCrear: (nombre: string) => Promise<void>
}

export function ChatColecciones({ colecciones, onCrear }: Props) {
  const [nombre, setNombre] = useState('')
  const [creando, setCreando] = useState(false)

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim()) return
    setCreando(true)
    try {
      await onCrear(nombre.trim())
      setNombre('')
    } finally {
      setCreando(false)
    }
  }

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
      <form className={styles.formNueva} onSubmit={handleCrear}>
        <input
          className={styles.inputNueva}
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          placeholder="Nueva colección..."
          disabled={creando}
        />
        <button type="submit" disabled={!nombre.trim() || creando}>+</button>
      </form>
    </div>
  )
}

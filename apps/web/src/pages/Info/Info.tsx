import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import styles from './Info.module.css'

const BASE_URL =
  'https://raw.githubusercontent.com/Daniel-kripta/Proyecto_Final_Full_Stack_-_Sansofe_WebApp/main/docs/info'

export default function Info() {
  const { slug } = useParams<{ slug: string }>()
  const [contenido, setContenido] = useState<string | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    setContenido(null)
    setError(false)
    fetch(`${BASE_URL}/${slug}.md`)
      .then(res => {
        if (!res.ok) throw new Error()
        return res.text()
      })
      .then(setContenido)
      .catch(() => setError(true))
  }, [slug])

  if (error) return <p className={styles.error}>Página no encontrada.</p>
  if (!contenido) return <p className={styles.cargando}>Cargando...</p>

  return (
    <article className={styles.contenido}>
      <ReactMarkdown>{contenido}</ReactMarkdown>
    </article>
  )
}

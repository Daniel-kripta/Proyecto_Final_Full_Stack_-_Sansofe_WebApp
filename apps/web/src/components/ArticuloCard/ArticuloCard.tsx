import { Link } from 'react-router-dom'
import styles from "./ArticuloCard.module.css"

export function ArticuloCard({ headline, summary, publication, genre, id }: any) {
  return (
    <div className={styles.cardPortada}>
      <Link to={`/articulo/${id}`}>
        <h3>{headline}</h3>
        {summary && <><p>{summary}</p><span>Resumen generado por IA</span> <br/></> }
      </Link>
      <small>{publication}{genre ? ` · ${genre}` : ''}</small>
    </div>
  )
}
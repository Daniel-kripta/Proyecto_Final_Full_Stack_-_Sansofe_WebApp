import { Link } from 'react-router-dom'

export function ArticuloCard({ headline, summary, publication, genre, id }: any) {
  return (
    <div>
      <Link to={`/articulo/${id}`}>
        <p>{headline}</p>
        {summary && <p>{summary}</p>}
      </Link>
      <small>{publication}{genre ? ` · ${genre}` : ''}</small>
    </div>
  )
}

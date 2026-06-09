export function ArticuloCard({ headline, publication, date, id }: any) {
  return <div><a href={`/articulo/${id}`}>{headline}</a> — {publication}</div>
}
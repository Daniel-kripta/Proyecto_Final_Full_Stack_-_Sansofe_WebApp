import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'

export async function articulosRoutes(app: FastifyInstance) {
  app.get('/publicaciones', async () => {
    const rows = await prisma.$queryRaw<{ publication: string }[]>`
      SELECT DISTINCT publication FROM articulos ORDER BY publication
    `
    return rows.map(r => r.publication)
  })

  app.get('/articulos/:id', async (req, reply) => {
    const { id } = req.params as { id: string }

    const articulo = await prisma.articulo.findUnique({ where: { id } })

    if (!articulo) return reply.status(404).send({ error: 'No encontrado' })
    return articulo
  })

  app.get('/articulos', async (req, reply) => {
  const { q, publication, genre, topic, desde, hasta, pagina = '1', limite: limiteParam = '20' } = req.query as Record<string, string>
  const page = parseInt(pagina)
  if (isNaN(page) || page < 1) return reply.status(400).send({ error: 'Parámetro pagina inválido' })
  const limite = Math.min(parseInt(limiteParam) || 20, 50)
  const offset = (page - 1) * limite

  const articulos = q?.trim()
    ? await prisma.$queryRaw`
        SELECT id, headline, summary, publication, date, genre, topics, people, places,
               ts_rank(fts_vector, websearch_to_tsquery('spanish', ${q})) AS rank
        FROM articulos
        WHERE fts_vector @@ websearch_to_tsquery('spanish', ${q})
          AND (${publication ?? null}::text IS NULL OR publication = ${publication})
          AND (${genre ?? null}::text IS NULL OR genre = ${genre})
          AND (${topic ?? null}::text IS NULL OR ${topic} = ANY(topics))
          AND (${desde ?? null}::date IS NULL OR date >= ${desde}::date)
          AND (${hasta ?? null}::date IS NULL OR date <= ${hasta}::date)
        ORDER BY rank DESC, date DESC
        LIMIT ${limite} OFFSET ${offset}
      `
    : await prisma.$queryRaw`
        SELECT id, headline, summary, publication, date, genre, topics, people, places
        FROM articulos
        WHERE (${publication ?? null}::text IS NULL OR publication = ${publication})
          AND (${genre ?? null}::text IS NULL OR genre = ${genre})
          AND (${topic ?? null}::text IS NULL OR ${topic} = ANY(topics))
          AND (${desde ?? null}::date IS NULL OR date >= ${desde}::date)
          AND (${hasta ?? null}::date IS NULL OR date <= ${hasta}::date)
        ORDER BY date DESC
        LIMIT ${limite} OFFSET ${offset}
      `

  return articulos
})

}
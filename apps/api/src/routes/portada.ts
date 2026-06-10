import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'

export async function portadaRoutes(app: FastifyInstance) {
  app.get('/portada', async (req, reply) => {
    const { fecha } = req.query as { fecha?: string }
    const d = fecha ? new Date(fecha) : new Date()
    if (isNaN(d.getTime())) return reply.status(400).send({ error: 'Fecha inválida' })

    return prisma.$queryRaw`
      SELECT id, headline, summary, publication, date, genre, topics, people, places
      FROM articulos
      WHERE EXTRACT(YEAR FROM date)  = ${d.getFullYear()}
        AND EXTRACT(MONTH FROM date) = ${d.getMonth() + 1}
        AND EXTRACT(DAY FROM date)   = ${d.getDate()}
      ORDER BY publication, date
    `
  })
}
import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'

export async function portadaRoutes(app: FastifyInstance) {
  app.get('/portada', async (req) => {
    const { fecha } = req.query as { fecha?: string }
    const d = fecha ? new Date(fecha) : new Date()

    return prisma.$queryRaw`
      SELECT id, headline, summary, publication, date, genre, topics, people, places
      FROM articulos
      WHERE EXTRACT(MONTH FROM date) = ${d.getMonth() + 1}
        AND EXTRACT(DAY FROM date) = ${d.getDate()}
      ORDER BY publication, date
    `
  })
}
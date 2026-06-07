import type { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'

export async function articulosRoutes(app: FastifyInstance) {
  app.get('/articulos/:id', async (req, reply) => {
    const { id } = req.params as { id: string }

    const articulo = await prisma.articulo.findUnique({ where: { id } })

    if (!articulo) return reply.status(404).send({ error: 'No encontrado' })
    return articulo
  })
}
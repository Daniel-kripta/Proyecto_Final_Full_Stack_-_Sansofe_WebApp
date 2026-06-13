import { requireAuth } from '../middleware/auth.js'
import { prisma } from '../lib/prisma.js'

export async function investigacionesRoutes(app: any) {
  app.get('/investigaciones', { preHandler: requireAuth }, async (req: any) => {
    const { userId } = req.user
    return prisma.investigacion.findMany({
      where: { usuarioId: userId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, titulo: true, createdAt: true },
    })
  })

  app.get('/investigaciones/:id', { preHandler: requireAuth }, async (req: any, reply: any) => {
    const { userId } = req.user
    const inv = await prisma.investigacion.findUnique({ where: { id: req.params.id } })
    if (!inv || inv.usuarioId !== userId) return reply.status(404).send({ error: 'NOT_FOUND' })
    return inv
  })

  app.post('/investigaciones', { preHandler: requireAuth }, async (req: any) => {
    const { userId } = req.user
    const { titulo, mensajes } = req.body
    return prisma.investigacion.create({
      data: { usuarioId: userId, titulo, mensajes },
      select: { id: true, titulo: true, createdAt: true },
    })
  })

  app.delete('/investigaciones/:id', { preHandler: requireAuth }, async (req: any, reply: any) => {
    const { userId } = req.user
    const inv = await prisma.investigacion.findUnique({ where: { id: req.params.id } })
    if (!inv || inv.usuarioId !== userId) return reply.status(404).send({ error: 'NOT_FOUND' })
    await prisma.investigacion.delete({ where: { id: req.params.id } })
    return { ok: true }
  })
}

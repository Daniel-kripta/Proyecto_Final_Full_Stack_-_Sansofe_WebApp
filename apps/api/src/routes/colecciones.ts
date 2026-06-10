import { prisma } from '../lib/prisma.js'
import { requireAuth } from '../middleware/auth.js'

export async function coleccionesRoutes(app: any) {

  app.get('/colecciones', { preHandler: requireAuth }, async (req: any) => {
    const { userId } = req.user
    return prisma.coleccion.findMany({
      where: { usuarioId: userId },
      include: { _count: { select: { articulos: true } } }
    })
  })

  app.post('/colecciones', { preHandler: requireAuth }, async (req: any) => {
    const { userId } = req.user
    const { nombre } = req.body
    return prisma.coleccion.create({ data: { usuarioId: userId, nombre } })
  })

  app.post('/colecciones/:id/articulos', { preHandler: requireAuth }, async (req: any) => {
    const { id } = req.params
    const { articuloId } = req.body
    return prisma.coleccionArticulo.create({
      data: { coleccionId: id, articuloId }
    })
  })

  app.delete('/colecciones/:id/articulos/:aid', { preHandler: requireAuth }, async (req: any) => {
    const { id, aid } = req.params
    await prisma.coleccionArticulo.delete({
      where: { coleccionId_articuloId: { coleccionId: id, articuloId: aid } }
    })
    return { ok: true }
  })
}

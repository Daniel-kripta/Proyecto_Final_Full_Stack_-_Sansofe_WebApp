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

  app.post('/colecciones/:id/articulos', { preHandler: requireAuth }, async (req: any, reply: any) => {
    const { id } = req.params
    const { userId } = req.user
    const { articuloId } = req.body
    const coleccion = await prisma.coleccion.findUnique({ where: { id } })
    if (!coleccion || coleccion.usuarioId !== userId) {
      return reply.status(403).send({ error: 'No autorizado' })
    }
    return prisma.coleccionArticulo.create({
      data: { coleccionId: id, articuloId }
    })
  })

  app.delete('/colecciones/:id/articulos/:aid', { preHandler: requireAuth }, async (req: any, reply: any) => {
    const { id, aid } = req.params
    const { userId } = req.user
    const coleccion = await prisma.coleccion.findUnique({ where: { id } })
    if (!coleccion || coleccion.usuarioId !== userId) {
      return reply.status(403).send({ error: 'No autorizado' })
    }
    await prisma.coleccionArticulo.delete({
      where: { coleccionId_articuloId: { coleccionId: id, articuloId: aid } }
    })
    return { ok: true }
  })

  app.get('/colecciones/:id/export', { preHandler: requireAuth }, async (req: any, reply: any) => {
    const { id } = req.params
    const { userId } = req.user

    const articulos = await prisma.$queryRaw`
      SELECT a.headline, a.date, a.publication, a.genre, a.body
      FROM articulos a
      JOIN coleccion_articulos ca ON a.id = ca.articulo_id
      JOIN colecciones c ON ca.coleccion_id = c.id
      WHERE c.id = ${id}::uuid AND c.usuario_id = ${userId}::uuid
      ORDER BY a.date
    ` as any[]

    const header = 'titular,fecha,publicacion,genero,cuerpo\n'
    const rows = articulos.map(a =>
      [
        `"${a.headline.replace(/"/g, '""')}"`,
        a.date.toISOString().split('T')[0],
        a.publication,
        a.genre,
        `"${a.body.replace(/"/g, '""')}"`,
      ].join(',')
    ).join('\n')

    reply
      .header('Content-Type', 'text/csv; charset=utf-8')
      .header('Content-Disposition', `attachment; filename="coleccion-${id}.csv"`)
      .send(header + rows)
  })
}

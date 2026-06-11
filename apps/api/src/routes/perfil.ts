import bcrypt from 'bcrypt'
import { prisma } from '../lib/prisma.js'
import { requireAuth } from '../middleware/auth.js'
import { encrypt, decrypt } from '../lib/crypto.js'

export async function perfilRoutes(app: any) {

  app.get('/perfil', { preHandler: requireAuth }, async (req: any) => {
    const { userId } = req.user
    const u = await prisma.usuario.findUnique({
      where: { id: userId },
      select: { email: true, createdAt: true, geminiApiKey: true },
    })
    return { email: u!.email, createdAt: u!.createdAt, tieneApiKey: !!u!.geminiApiKey }
  })

  app.put('/perfil', { preHandler: requireAuth }, async (req: any) => {
    const { userId } = req.user
    const { geminiApiKey } = req.body
    await prisma.usuario.update({
      where: { id: userId },
      data: { geminiApiKey: geminiApiKey ? encrypt(geminiApiKey) : null },
    })
    return { ok: true }
  })

  app.put('/perfil/password', { preHandler: requireAuth }, async (req: any, reply: any) => {
    const { userId } = req.user
    const { passwordActual, passwordNuevo } = req.body
    if (!passwordActual || !passwordNuevo || passwordNuevo.length < 8) {
      return reply.status(400).send({ error: 'Datos incorrectos' })
    }
    const u = await prisma.usuario.findUnique({ where: { id: userId } })
    if (!u || !(await bcrypt.compare(passwordActual, u.passwordHash))) {
      return reply.status(401).send({ error: 'Contraseña actual incorrecta' })
    }
    const hash = await bcrypt.hash(passwordNuevo, 12)
    await prisma.usuario.update({ where: { id: userId }, data: { passwordHash: hash } })
    return { ok: true }
  })
}

export { decrypt }

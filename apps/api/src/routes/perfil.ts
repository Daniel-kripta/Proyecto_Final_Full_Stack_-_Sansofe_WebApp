import bcrypt from 'bcrypt'
import { prisma } from '../lib/prisma.js'
import { requireAuth } from '../middleware/auth.js'
import { encrypt, decrypt } from '../lib/crypto.js'

export async function perfilRoutes(app: any) {

  app.get('/perfil', { preHandler: requireAuth }, async (req: any) => {
    const { userId } = req.user
    const u = await prisma.usuario.findUnique({
      where: { id: userId },
      select: { email: true, createdAt: true, geminiApiKey: true, username: true, nombre: true, apellidos: true },
    })
    return { email: u!.email, createdAt: u!.createdAt, tieneApiKey: !!u!.geminiApiKey, username: u!.username, nombre: u!.nombre, apellidos: u!.apellidos }
  })

  app.patch('/perfil/datos', { preHandler: requireAuth }, async (req: any, reply: any) => {
    const { userId } = req.user
    const { username, nombre, apellidos } = req.body
    try {
      await prisma.usuario.update({
        where: { id: userId },
        data: { username, nombre: nombre || null, apellidos: apellidos || null },
      })
      return { ok: true }
    } catch (e: any) {
      if (e.code === 'P2002') return reply.status(409).send({ error: 'El nombre de usuario ya está en uso' })
      throw e
    }
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

  app.get('/perfil/test-key', { preHandler: requireAuth }, async (req: any) => {
    const { userId } = req.user
    const u = await prisma.usuario.findUnique({ where: { id: userId }, select: { geminiApiKey: true } })
    if (!u?.geminiApiKey) return { ok: false }
    const key = decrypt(u.geminiApiKey)
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000)
    try {
      const res = await fetch(`${process.env.AI_SERVICE_URL}/test-key`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gemini_api_key: key }),
        signal: controller.signal,
      })
      clearTimeout(timeout)
      return res.json()
    } catch (e: any) {
      clearTimeout(timeout)
      if (e.name === 'AbortError') return { ok: false }
      throw e
    }
  })
}

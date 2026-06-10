import bcrypt from 'bcrypt'
import { prisma } from '../lib/prisma.js'

export async function authRoutes(app: any) {

  app.post('/auth/registro', async (req: any, reply: any) => {
    const { email, password } = req.body
    const hash = await bcrypt.hash(password, 12)
    const usuario = await prisma.usuario.create({ data: { email, passwordHash: hash } })

    const token   = app.jwt.sign({ userId: usuario.id }, { expiresIn: '15m' })
    const refresh = app.jwt.sign({ userId: usuario.id }, { expiresIn: '30d' })

    reply
      .setCookie('token',   token,   { httpOnly: true, sameSite: 'strict', path: '/' })
      .setCookie('refresh', refresh, { httpOnly: true, sameSite: 'strict', path: '/' })
      .send({ ok: true })
  })

  app.post('/auth/login', async (req: any, reply: any) => {
    const { email, password } = req.body
    const usuario = await prisma.usuario.findUnique({ where: { email } })

    if (!usuario || !(await bcrypt.compare(password, usuario.passwordHash))) {
      return reply.status(401).send({ error: 'Credenciales incorrectas' })
    }

    const token   = app.jwt.sign({ userId: usuario.id }, { expiresIn: '15m' })
    const refresh = app.jwt.sign({ userId: usuario.id }, { expiresIn: '30d' })

    reply
      .setCookie('token',   token,   { httpOnly: true, sameSite: 'strict', path: '/' })
      .setCookie('refresh', refresh, { httpOnly: true, sameSite: 'strict', path: '/' })
      .send({ ok: true, usuario: { email: usuario.email } })
  })

  app.post('/auth/refresh', async (req: any, reply: any) => {
    const refreshToken = req.cookies?.refresh
    if (!refreshToken) return reply.status(401).send({ error: 'No autenticado' })

    try {
      const payload = app.jwt.verify(refreshToken) as { userId: string }
      const token   = app.jwt.sign({ userId: payload.userId }, { expiresIn: '15m' })
      reply
        .setCookie('token', token, { httpOnly: true, sameSite: 'strict', path: '/' })
        .send({ ok: true })
    } catch {
      reply.status(401).send({ error: 'Sesión expirada' })
    }
  })

  app.post('/auth/logout', async (_req: any, reply: any) => {
    reply.clearCookie('token').clearCookie('refresh').send({ ok: true })
  })
}

import bcrypt from 'bcrypt'
import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'

const secure = process.env.NODE_ENV === 'production'

const bodySchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email:    { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 8 }
    }
  }
}

const authRateLimit = {
  config: { rateLimit: { max: 10, timeWindow: '1 minute' } }
}

export async function authRoutes(app: any) {

  app.post('/auth/registro', { schema: bodySchema, ...authRateLimit }, async (req: any, reply: any) => {
    const { email, password } = req.body
    const hash = await bcrypt.hash(password, 12)

    let usuario
    try {
      usuario = await prisma.usuario.create({ data: { email, passwordHash: hash } })
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        return reply.status(409).send({ error: 'El usuario ya existe' })
      }
      throw e
    }

    const token   = app.jwt.sign({ userId: usuario.id }, { expiresIn: '15m' })
    const refresh = app.jwt.sign({ userId: usuario.id }, { expiresIn: '30d' })

    reply
      .setCookie('token',   token,   { httpOnly: true, sameSite: 'strict', secure, path: '/' })
      .setCookie('refresh', refresh, { httpOnly: true, sameSite: 'strict', secure, path: '/' })
      .send({ ok: true })
  })

  app.post('/auth/login', { schema: bodySchema, ...authRateLimit }, async (req: any, reply: any) => {
    const { email, password } = req.body
    const usuario = await prisma.usuario.findUnique({ where: { email } })

    if (!usuario || !(await bcrypt.compare(password, usuario.passwordHash))) {
      return reply.status(401).send({ error: 'Credenciales incorrectas' })
    }

    const token   = app.jwt.sign({ userId: usuario.id }, { expiresIn: '15m' })
    const refresh = app.jwt.sign({ userId: usuario.id }, { expiresIn: '30d' })

    reply
      .setCookie('token',   token,   { httpOnly: true, sameSite: 'strict', secure, path: '/' })
      .setCookie('refresh', refresh, { httpOnly: true, sameSite: 'strict', secure, path: '/' })
      .send({ ok: true, usuario: { email: usuario.email } })
  })

  app.post('/auth/refresh', authRateLimit, async (req: any, reply: any) => {
    const refreshToken = req.cookies?.refresh
    if (!refreshToken) return reply.status(401).send({ error: 'No autenticado' })

    try {
      const payload = app.jwt.verify(refreshToken) as { userId: string }
      const token   = app.jwt.sign({ userId: payload.userId }, { expiresIn: '15m' })
      reply
        .setCookie('token', token, { httpOnly: true, sameSite: 'strict', secure, path: '/' })
        .send({ ok: true })
    } catch {
      reply.status(401).send({ error: 'Sesión expirada' })
    }
  })

  app.post('/auth/logout', async (_req: any, reply: any) => {
    reply.clearCookie('token').clearCookie('refresh').send({ ok: true })
  })
}

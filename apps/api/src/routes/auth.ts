import bcrypt from 'bcrypt'
import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { requireAuth } from '../middleware/auth.js'

const secure = process.env.NODE_ENV === 'production'

const cookieOpts = { httpOnly: true, sameSite: 'strict' as const, secure, path: '/' }

const bodySchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email:    { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 8 },
      website:  { type: 'string' },
    }
  }
}

const authRateLimit = {
  config: { rateLimit: { max: 10, timeWindow: '1 minute' } }
}

export async function authRoutes(app: any) {

  app.post('/auth/registro', { schema: bodySchema, ...authRateLimit }, async (req: any, reply: any) => {
    const { email, password, website } = req.body
    if (website) return reply.status(400).send({ error: 'Registro no válido' })
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

    const token = app.jwt.sign({ userId: usuario.id }, { expiresIn: '30d' })
    reply.setCookie('token', token, cookieOpts).send({ ok: true, usuario: { email: usuario.email } })
  })

  app.post('/auth/login', { schema: bodySchema, ...authRateLimit }, async (req: any, reply: any) => {
    const { email, password } = req.body
    const usuario = await prisma.usuario.findUnique({ where: { email } })

    if (!usuario || !(await bcrypt.compare(password, usuario.passwordHash))) {
      return reply.status(401).send({ error: 'Credenciales incorrectas' })
    }

    const token = app.jwt.sign({ userId: usuario.id }, { expiresIn: '30d' })
    reply.setCookie('token', token, cookieOpts).send({ ok: true, usuario: { email: usuario.email } })
  })

  app.post('/auth/logout', async (_req: any, reply: any) => {
    reply.clearCookie('token').send({ ok: true })
  })

  app.get('/auth/me', { preHandler: requireAuth }, async (req: any) => {
    return prisma.usuario.findUnique({
      where: { id: req.user.userId },
      select: { email: true },
    })
  })
}

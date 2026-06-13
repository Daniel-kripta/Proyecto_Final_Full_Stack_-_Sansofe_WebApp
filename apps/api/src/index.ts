import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import {prisma} from './lib/prisma.js'

import { articulosRoutes } from './routes/articulos.js'
import { portadaRoutes } from './routes/portada.js'
import { authRoutes } from './routes/auth.js'
import { coleccionesRoutes } from './routes/colecciones.js'
import { chatRoutes } from './routes/chat.js'
import { perfilRoutes } from './routes/perfil.js'
import { investigacionesRoutes } from './routes/investigaciones.js'

const app = Fastify({ logger: true, trustProxy: true })

await app.register(import('@fastify/cookie'))
await app.register(import('@fastify/jwt'), {
  secret: process.env.JWT_SECRET!,
  cookie: { cookieName: 'token', signed: false }
})

app.register(cors, {
  origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
  credentials: true,
})
app.register(rateLimit, {
  max: 20,
  timeWindow: '1 minute',
  keyGenerator: (req) => req.ip,
})
app.register(portadaRoutes)
app.register(articulosRoutes)
app.register(authRoutes)
app.register(coleccionesRoutes)
app.register(chatRoutes)
app.register(perfilRoutes)
app.register(investigacionesRoutes)

app.get('/health', async () => {
  await prisma.$queryRaw`SELECT 1`
  return { ok: true }
})

app.listen({ port: 3002, host: '0.0.0.0' }, (err) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
})

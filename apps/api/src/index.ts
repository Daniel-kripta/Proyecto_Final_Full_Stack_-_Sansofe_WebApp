import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import cookie from '@fastify/cookie'
import {prisma} from './lib/prisma.js'

import { articulosRoutes } from './routes/articulos.js'

const app = Fastify({ logger: true })

app.register(cors, {
  origin: 'http://localhost:3000',
  credentials: true,
})
app.register(cookie)

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

app.register(articulosRoutes)
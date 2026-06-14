import Fastify from 'fastify'
import { authRoutes } from '../routes/auth.js'
import { articulosRoutes } from '../routes/articulos.js'
import { coleccionesRoutes } from '../routes/colecciones.js'
import { investigacionesRoutes } from '../routes/investigaciones.js'

export async function buildApp() {
  const app = Fastify({ logger: false })

  await app.register(import('@fastify/cookie'))
  await app.register(import('@fastify/jwt'), {
    secret: 'test-secret-for-testing-purposes-only!',
    cookie: { cookieName: 'token', signed: false },
  })

  app.register(authRoutes)
  app.register(articulosRoutes)
  app.register(coleccionesRoutes)
  app.register(investigacionesRoutes)

  await app.ready()
  return app
}

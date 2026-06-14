import { vi, describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'

vi.mock('../lib/prisma.js', () => ({
  prisma: {
    articulo: {
      findUnique: vi.fn(),
    },
    $queryRaw: vi.fn(),
  },
}))

import { prisma } from '../lib/prisma.js'
import { buildApp } from './app.js'
import type { FastifyInstance } from 'fastify'

const ARTICULO = {
  id: 'art-uuid-1',
  headline: 'Titular de prueba',
  date: new Date('1926-01-01'),
  publication: 'El Día',
  body: 'Cuerpo del artículo',
  summary: 'Resumen',
  genre: 'sucesos',
  topics: [],
  people: [],
  places: [],
}

describe('articulos routes', () => {
  let app: FastifyInstance

  beforeAll(async () => { app = await buildApp() })
  afterAll(async () => { await app.close() })
  beforeEach(() => { vi.clearAllMocks() })

  describe('GET /publicaciones', () => {
    it('devuelve lista de publicaciones únicas', async () => {
      vi.mocked(prisma.$queryRaw).mockResolvedValue([
        { publication: 'El Día' },
        { publication: 'La Prensa' },
      ])

      const res = await app.inject({ method: 'GET', url: '/publicaciones' })

      expect(res.statusCode).toBe(200)
      expect(JSON.parse(res.body)).toEqual(['El Día', 'La Prensa'])
    })
  })

  describe('GET /articulos/:id', () => {
    it('devuelve artículo existente', async () => {
      vi.mocked(prisma.articulo.findUnique).mockResolvedValue(ARTICULO as any)

      const res = await app.inject({ method: 'GET', url: `/articulos/${ARTICULO.id}` })

      expect(res.statusCode).toBe(200)
      const body = JSON.parse(res.body)
      expect(body.headline).toBe(ARTICULO.headline)
    })

    it('devuelve 404 si no existe', async () => {
      vi.mocked(prisma.articulo.findUnique).mockResolvedValue(null)

      const res = await app.inject({ method: 'GET', url: '/articulos/no-existe' })

      expect(res.statusCode).toBe(404)
    })
  })

  describe('GET /articulos', () => {
    it('devuelve lista sin búsqueda', async () => {
      vi.mocked(prisma.$queryRaw).mockResolvedValue([ARTICULO])

      const res = await app.inject({ method: 'GET', url: '/articulos' })

      expect(res.statusCode).toBe(200)
      expect(JSON.parse(res.body)).toHaveLength(1)
    })

    it('devuelve lista con búsqueda de texto', async () => {
      vi.mocked(prisma.$queryRaw).mockResolvedValue([ARTICULO])

      const res = await app.inject({ method: 'GET', url: '/articulos?q=canarias' })

      expect(res.statusCode).toBe(200)
      expect(prisma.$queryRaw).toHaveBeenCalledOnce()
    })

    it('devuelve 400 con pagina inválida', async () => {
      const res = await app.inject({ method: 'GET', url: '/articulos?pagina=-1' })

      expect(res.statusCode).toBe(400)
    })

    it('limita el número máximo de resultados a 50', async () => {
      vi.mocked(prisma.$queryRaw).mockResolvedValue([])

      const res = await app.inject({ method: 'GET', url: '/articulos?limite=200' })

      expect(res.statusCode).toBe(200)
    })
  })
})

import { vi, describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'

vi.mock('../lib/prisma.js', () => ({
  prisma: {
    coleccion: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
    coleccionArticulo: {
      create: vi.fn(),
      delete: vi.fn(),
    },
    $queryRaw: vi.fn(),
  },
}))

import { prisma } from '../lib/prisma.js'
import { buildApp } from './app.js'
import type { FastifyInstance } from 'fastify'

const USER_ID = 'user-uuid-1'
const OTHER_USER_ID = 'user-uuid-2'
const COL_ID = 'col-uuid-1'
const ART_ID = 'art-uuid-1'
const COL = { id: COL_ID, nombre: 'Mi colección', usuarioId: USER_ID, createdAt: new Date() }

describe('colecciones routes', () => {
  let app: FastifyInstance
  let token: string

  beforeAll(async () => {
    app = await buildApp()
    token = app.jwt.sign({ userId: USER_ID })
  })
  afterAll(async () => { await app.close() })
  beforeEach(() => { vi.clearAllMocks() })

  const auth = () => ({ cookie: `token=${token}` })

  describe('GET /colecciones', () => {
    it('devuelve colecciones del usuario autenticado', async () => {
      vi.mocked(prisma.coleccion.findMany).mockResolvedValue([
        { ...COL, _count: { articulos: 3 } },
      ] as any)

      const res = await app.inject({ method: 'GET', url: '/colecciones', headers: auth() })

      expect(res.statusCode).toBe(200)
      const body = JSON.parse(res.body)
      expect(body).toHaveLength(1)
      expect(body[0].nombre).toBe('Mi colección')
    })

    it('devuelve 401 sin token', async () => {
      const res = await app.inject({ method: 'GET', url: '/colecciones' })
      expect(res.statusCode).toBe(401)
    })
  })

  describe('POST /colecciones', () => {
    it('crea una colección para el usuario', async () => {
      vi.mocked(prisma.coleccion.create).mockResolvedValue(COL as any)

      const res = await app.inject({
        method: 'POST',
        url: '/colecciones',
        headers: auth(),
        payload: { nombre: 'Mi colección' },
      })

      expect(res.statusCode).toBe(200)
      expect(prisma.coleccion.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ usuarioId: USER_ID }) })
      )
    })
  })

  describe('GET /colecciones/:id', () => {
    it('devuelve colección con artículos si es del usuario', async () => {
      vi.mocked(prisma.coleccion.findUnique).mockResolvedValue(
        { ...COL, articulos: [] } as any
      )

      const res = await app.inject({
        method: 'GET',
        url: `/colecciones/${COL_ID}`,
        headers: auth(),
      })

      expect(res.statusCode).toBe(200)
    })

    it('devuelve 403 si la colección pertenece a otro usuario', async () => {
      vi.mocked(prisma.coleccion.findUnique).mockResolvedValue(
        { ...COL, usuarioId: OTHER_USER_ID, articulos: [] } as any
      )

      const res = await app.inject({
        method: 'GET',
        url: `/colecciones/${COL_ID}`,
        headers: auth(),
      })

      expect(res.statusCode).toBe(403)
    })
  })

  describe('DELETE /colecciones/:id', () => {
    it('elimina la propia colección', async () => {
      vi.mocked(prisma.coleccion.findUnique).mockResolvedValue(COL as any)
      vi.mocked(prisma.coleccion.delete).mockResolvedValue(COL as any)

      const res = await app.inject({
        method: 'DELETE',
        url: `/colecciones/${COL_ID}`,
        headers: auth(),
      })

      expect(res.statusCode).toBe(200)
      expect(JSON.parse(res.body)).toEqual({ ok: true })
    })

    it('devuelve 403 al intentar eliminar colección ajena', async () => {
      vi.mocked(prisma.coleccion.findUnique).mockResolvedValue(
        { ...COL, usuarioId: OTHER_USER_ID } as any
      )

      const res = await app.inject({
        method: 'DELETE',
        url: `/colecciones/${COL_ID}`,
        headers: auth(),
      })

      expect(res.statusCode).toBe(403)
    })
  })

  describe('POST /colecciones/:id/articulos', () => {
    it('añade artículo a colección propia', async () => {
      vi.mocked(prisma.coleccion.findUnique).mockResolvedValue(COL as any)
      vi.mocked(prisma.coleccionArticulo.create).mockResolvedValue(
        { coleccionId: COL_ID, articuloId: ART_ID, addedAt: new Date() } as any
      )

      const res = await app.inject({
        method: 'POST',
        url: `/colecciones/${COL_ID}/articulos`,
        headers: auth(),
        payload: { articuloId: ART_ID },
      })

      expect(res.statusCode).toBe(200)
    })

    it('devuelve 403 si la colección es ajena', async () => {
      vi.mocked(prisma.coleccion.findUnique).mockResolvedValue(
        { ...COL, usuarioId: OTHER_USER_ID } as any
      )

      const res = await app.inject({
        method: 'POST',
        url: `/colecciones/${COL_ID}/articulos`,
        headers: auth(),
        payload: { articuloId: ART_ID },
      })

      expect(res.statusCode).toBe(403)
    })
  })

  describe('DELETE /colecciones/:id/articulos/:aid', () => {
    it('elimina artículo de colección propia', async () => {
      vi.mocked(prisma.coleccion.findUnique).mockResolvedValue(COL as any)
      vi.mocked(prisma.coleccionArticulo.delete).mockResolvedValue({} as any)

      const res = await app.inject({
        method: 'DELETE',
        url: `/colecciones/${COL_ID}/articulos/${ART_ID}`,
        headers: auth(),
      })

      expect(res.statusCode).toBe(200)
      expect(JSON.parse(res.body)).toEqual({ ok: true })
    })
  })
})

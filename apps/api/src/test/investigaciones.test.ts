import { vi, describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'

vi.mock('../lib/prisma.js', () => ({
  prisma: {
    investigacion: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

import { prisma } from '../lib/prisma.js'
import { buildApp } from './app.js'
import type { FastifyInstance } from 'fastify'

const USER_ID = 'user-uuid-1'
const OTHER_USER_ID = 'user-uuid-2'
const INV = {
  id: 'inv-uuid-1',
  titulo: 'Mi investigación',
  usuarioId: USER_ID,
  mensajes: [],
  createdAt: new Date(),
}

describe('investigaciones routes', () => {
  let app: FastifyInstance
  let token: string

  beforeAll(async () => {
    app = await buildApp()
    token = app.jwt.sign({ userId: USER_ID })
  })
  afterAll(async () => { await app.close() })
  beforeEach(() => { vi.clearAllMocks() })

  const auth = () => ({ cookie: `token=${token}` })

  describe('GET /investigaciones', () => {
    it('devuelve investigaciones del usuario', async () => {
      vi.mocked(prisma.investigacion.findMany).mockResolvedValue([
        { id: INV.id, titulo: INV.titulo, createdAt: INV.createdAt },
      ] as any)

      const res = await app.inject({ method: 'GET', url: '/investigaciones', headers: auth() })

      expect(res.statusCode).toBe(200)
      const body = JSON.parse(res.body)
      expect(body).toHaveLength(1)
      expect(body[0].titulo).toBe(INV.titulo)
    })

    it('devuelve 401 sin token', async () => {
      const res = await app.inject({ method: 'GET', url: '/investigaciones' })
      expect(res.statusCode).toBe(401)
    })
  })

  describe('POST /investigaciones', () => {
    it('crea una investigación con mensajes', async () => {
      vi.mocked(prisma.investigacion.create).mockResolvedValue(
        { id: INV.id, titulo: INV.titulo, createdAt: INV.createdAt } as any
      )

      const res = await app.inject({
        method: 'POST',
        url: '/investigaciones',
        headers: auth(),
        payload: { titulo: 'Mi investigación', mensajes: [{ role: 'user', content: 'Hola' }] },
      })

      expect(res.statusCode).toBe(200)
      expect(prisma.investigacion.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ usuarioId: USER_ID, titulo: 'Mi investigación' }),
        })
      )
    })
  })

  describe('GET /investigaciones/:id', () => {
    it('devuelve investigación propia', async () => {
      vi.mocked(prisma.investigacion.findUnique).mockResolvedValue(INV as any)

      const res = await app.inject({
        method: 'GET',
        url: `/investigaciones/${INV.id}`,
        headers: auth(),
      })

      expect(res.statusCode).toBe(200)
    })

    it('devuelve 404 si pertenece a otro usuario', async () => {
      vi.mocked(prisma.investigacion.findUnique).mockResolvedValue(
        { ...INV, usuarioId: OTHER_USER_ID } as any
      )

      const res = await app.inject({
        method: 'GET',
        url: `/investigaciones/${INV.id}`,
        headers: auth(),
      })

      expect(res.statusCode).toBe(404)
    })

    it('devuelve 404 si no existe', async () => {
      vi.mocked(prisma.investigacion.findUnique).mockResolvedValue(null)

      const res = await app.inject({
        method: 'GET',
        url: `/investigaciones/no-existe`,
        headers: auth(),
      })

      expect(res.statusCode).toBe(404)
    })
  })

  describe('DELETE /investigaciones/:id', () => {
    it('elimina investigación propia', async () => {
      vi.mocked(prisma.investigacion.findUnique).mockResolvedValue(INV as any)
      vi.mocked(prisma.investigacion.delete).mockResolvedValue(INV as any)

      const res = await app.inject({
        method: 'DELETE',
        url: `/investigaciones/${INV.id}`,
        headers: auth(),
      })

      expect(res.statusCode).toBe(200)
      expect(JSON.parse(res.body)).toEqual({ ok: true })
    })

    it('devuelve 404 al intentar eliminar investigación ajena', async () => {
      vi.mocked(prisma.investigacion.findUnique).mockResolvedValue(
        { ...INV, usuarioId: OTHER_USER_ID } as any
      )

      const res = await app.inject({
        method: 'DELETE',
        url: `/investigaciones/${INV.id}`,
        headers: auth(),
      })

      expect(res.statusCode).toBe(404)
    })
  })
})

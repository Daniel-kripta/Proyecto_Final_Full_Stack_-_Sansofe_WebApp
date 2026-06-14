import { vi, describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'

vi.mock('../lib/prisma.js', () => ({
  prisma: {
    usuario: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}))

vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('$hash'),
    compare: vi.fn().mockResolvedValue(true),
  },
}))

import { prisma } from '../lib/prisma.js'
import { buildApp } from './app.js'
import type { FastifyInstance } from 'fastify'

const USUARIO = {
  id: 'user-uuid-1',
  email: 'test@test.com',
  username: 'testuser',
  passwordHash: '$hash',
}

describe('auth routes', () => {
  let app: FastifyInstance

  beforeAll(async () => { app = await buildApp() })
  afterAll(async () => { await app.close() })
  beforeEach(() => { vi.clearAllMocks() })

  describe('POST /auth/registro', () => {
    it('crea usuario y devuelve cookie', async () => {
      vi.mocked(prisma.usuario.create).mockResolvedValue(USUARIO as any)

      const res = await app.inject({
        method: 'POST',
        url: '/auth/registro',
        payload: { email: 'test@test.com', password: 'password123', username: 'testuser' },
      })

      expect(res.statusCode).toBe(200)
      expect(JSON.parse(res.body)).toMatchObject({ ok: true })
      expect(res.headers['set-cookie']).toBeDefined()
    })

    it('devuelve 409 si email ya existe', async () => {
      const { Prisma } = await import('@prisma/client')
      vi.mocked(prisma.usuario.create).mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Unique constraint', {
          code: 'P2002',
          clientVersion: '5.0.0',
          meta: {},
        })
      )

      const res = await app.inject({
        method: 'POST',
        url: '/auth/registro',
        payload: { email: 'test@test.com', password: 'password123', username: 'testuser' },
      })

      expect(res.statusCode).toBe(409)
    })

    it('rechaza honeypot con campo website', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/auth/registro',
        payload: { email: 'test@test.com', password: 'password123', username: 'testuser', website: 'bot' },
      })

      expect(res.statusCode).toBe(400)
    })

    it('rechaza contraseña corta', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/auth/registro',
        payload: { email: 'test@test.com', password: 'corta', username: 'testuser' },
      })

      expect(res.statusCode).toBe(400)
    })
  })

  describe('POST /auth/login', () => {
    it('login válido devuelve cookie', async () => {
      vi.mocked(prisma.usuario.findUnique).mockResolvedValue(USUARIO as any)

      const res = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: { email: 'test@test.com', password: 'password123' },
      })

      expect(res.statusCode).toBe(200)
      expect(res.headers['set-cookie']).toBeDefined()
    })

    it('devuelve 401 si usuario no existe', async () => {
      vi.mocked(prisma.usuario.findUnique).mockResolvedValue(null)

      const res = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: { email: 'noexiste@test.com', password: 'password123' },
      })

      expect(res.statusCode).toBe(401)
    })

    it('devuelve 401 si contraseña incorrecta', async () => {
      const bcrypt = await import('bcrypt')
      vi.mocked(bcrypt.default.compare).mockResolvedValue(false as any)
      vi.mocked(prisma.usuario.findUnique).mockResolvedValue(USUARIO as any)

      const res = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: { email: 'test@test.com', password: 'wrongpassword' },
      })

      expect(res.statusCode).toBe(401)
    })
  })

  describe('POST /auth/logout', () => {
    it('limpia la cookie', async () => {
      const res = await app.inject({ method: 'POST', url: '/auth/logout' })
      expect(res.statusCode).toBe(200)
      expect(JSON.parse(res.body)).toEqual({ ok: true })
    })
  })

  describe('GET /auth/me', () => {
    it('devuelve datos del usuario autenticado', async () => {
      vi.mocked(prisma.usuario.findUnique).mockResolvedValue(USUARIO as any)
      const token = app.jwt.sign({ userId: USUARIO.id })

      const res = await app.inject({
        method: 'GET',
        url: '/auth/me',
        headers: { cookie: `token=${token}` },
      })

      expect(res.statusCode).toBe(200)
    })

    it('devuelve 401 sin token', async () => {
      const res = await app.inject({ method: 'GET', url: '/auth/me' })
      expect(res.statusCode).toBe(401)
    })
  })
})

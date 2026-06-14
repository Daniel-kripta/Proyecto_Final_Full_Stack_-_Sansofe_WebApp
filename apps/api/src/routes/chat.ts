import { requireAuth } from '../middleware/auth.js'
import { prisma } from '../lib/prisma.js'
import { decrypt } from '../lib/crypto.js'

export async function chatRoutes(app: any) {
  app.post('/chat', { preHandler: requireAuth }, async (req: any, reply: any) => {
    const { userId } = req.user

    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      select: { geminiApiKey: true },
    })

    if (!usuario?.geminiApiKey) {
      return reply.status(402).send({ error: 'API_KEY_REQUIRED' })
    }

    const geminiApiKey = decrypt(usuario.geminiApiKey)

    if (req.body.coleccion_id) {
      const coleccion = await prisma.coleccion.findUnique({ where: { id: req.body.coleccion_id } })
      if (!coleccion || coleccion.usuarioId !== userId) {
        return reply.status(403).send({ error: 'FORBIDDEN' })
      }
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000)

    let response: Response
    try {
      response = await fetch(`${process.env.AI_SERVICE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...req.body,
          session_id: userId,
          ...(geminiApiKey ? { gemini_api_key: geminiApiKey } : {}),
        }),
        signal: controller.signal,
      })
    } catch (e: any) {
      clearTimeout(timeout)
      if (e.name === 'AbortError') return reply.status(504).send({ error: 'Tiempo de espera agotado' })
      throw e
    }
    clearTimeout(timeout)

    if (!response.ok) {
      return reply.status(502).send({ error: 'Error en el servicio IA' })
    }

    return response.json()
  })
}

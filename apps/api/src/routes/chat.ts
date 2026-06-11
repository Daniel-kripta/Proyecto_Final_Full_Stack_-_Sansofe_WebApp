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

    const geminiApiKey = usuario?.geminiApiKey ? decrypt(usuario.geminiApiKey) : undefined

    const response = await fetch(`${process.env.AI_SERVICE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...req.body,
        session_id: userId,
        ...(geminiApiKey ? { gemini_api_key: geminiApiKey } : {}),
      }),
    })

    if (!response.ok) {
      return reply.status(502).send({ error: 'Error en el servicio IA' })
    }

    return response.json()
  })
}

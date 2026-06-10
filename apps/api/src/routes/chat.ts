import { requireAuth } from '../middleware/auth.js'

export async function chatRoutes(app: any) {
  app.post('/chat', { preHandler: requireAuth }, async (req: any, reply: any) => {
    const { userId } = req.user

    const response = await fetch(`${process.env.AI_SERVICE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...req.body,
        session_id: userId,
      }),
    })

    if (!response.ok) {
      return reply.status(502).send({ error: 'Error en el servicio IA' })
    }

    const data = await response.json()
    return data
  })
}

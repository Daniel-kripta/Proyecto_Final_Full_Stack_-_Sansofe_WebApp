export async function requireAuth(req: any, reply: any) {
  try {
    await req.jwtVerify({ onlyCookie: true })
  } catch {
    reply.status(401).send({ error: 'No autenticado' })
  }
}

import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { env } from '@/config/env';

export async function authenticate(req: FastifyRequest, reply: FastifyReply) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send({ error: 'Missing or malformed authorization header' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as any;
    (req as any).userId = payload.sub;
  } catch (err) {
    return reply.status(401).send({ error: 'Invalid or expired access token' });
  }
}
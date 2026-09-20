import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export async function healthRoutes(app: FastifyInstance) {

  app.get('/is-healthy', async (req: FastifyRequest, reply: FastifyReply) => {
    return reply.send({ status: 'OK' });
  });
}
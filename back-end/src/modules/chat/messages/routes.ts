import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { messageService } from './service';
import { authenticate } from '@/shared/utils/authHook';

export async function messageRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authenticate);

  app.post('/conversations/:id/messages', async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const userId = (req as any).userId;
    const body = req.body as any;
    try {
      const message = await messageService.send(id, userId, body);
      return reply.status(201).send(message);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  app.get('/conversations/:id/messages', async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const userId = (req as any).userId;
    const { before, limit } = req.query as { before?: string; limit?: string };
    try {
      const messages = await messageService.getHistory(id, userId, {
        before,
        limit: limit ? parseInt(limit) : 50,
      });
      return reply.send(messages);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  app.post('/messages/:messageId/read', async (req: FastifyRequest, reply: FastifyReply) => {
    const { messageId } = req.params as { messageId: string };
    const userId = (req as any).userId;
    try {
      await messageService.markRead(messageId, userId);
      return reply.send({ success: true });
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });
}
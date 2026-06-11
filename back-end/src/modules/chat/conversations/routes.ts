import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { conversationService } from './service';
import { authenticate } from '@/shared/utils/authHook';

export async function conversationRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authenticate);

  // List user's conversations
  app.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = (req as any).userId;
    const conversations = await conversationService.getForUser(userId);
    return reply.send(conversations);
  });

  // Create conversation (direct or group)
  app.post('/', async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = (req as any).userId;
    const body = req.body as any;

    if (body.type === 'group') {
      const { name, participantIds } = body;
      if (!name || !participantIds || !Array.isArray(participantIds) || participantIds.length < 2) {
        return reply.status(400).send({ error: 'name and at least two participantIds required for group' });
      }
      const allParticipants = [...new Set([userId, ...participantIds])];
      try {
        const conversation = await conversationService.createGroup(name, allParticipants);
        return reply.status(201).send(conversation);
      } catch (err: any) {
        return reply.status(400).send({ error: err.message });
      }
    }

    // Direct chat
    const { participantId } = body;
    if (!participantId) return reply.status(400).send({ error: 'participantId required for direct chat' });
    try {
      const conversation = await conversationService.createDirect(userId, participantId);
      return reply.status(201).send(conversation);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  // Get single conversation
  app.get('/:id', async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const conversation = await conversationService.getById(id);
    if (!conversation) return reply.status(404).send({ error: 'Conversation not found' });
    return reply.send(conversation);
  });
}
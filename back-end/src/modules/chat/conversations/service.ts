import { conversationRepository, Conversation } from './repository';
import redis, { pubRedis } from '@/infrastructure/cache/redis';

export class ConversationService {
  async createDirect(userId1: string, userId2: string) {
    const conversation = await conversationRepository.createDirect(userId1, userId2);
    // Notify both users via WebSocket (publish to user channels)
    const event = JSON.stringify({ event: 'conversation.created', payload: { conversation } });
    await pubRedis.publish(`user:${userId1}`, event);
    await pubRedis.publish(`user:${userId2}`, event);
    return conversation;
  }

  async getForUser(userId: string): Promise<Conversation[]> {
    return conversationRepository.findByUser(userId);
  }

  async getById(id: string): Promise<Conversation | null> {
    return conversationRepository.findById(id);
  }

  async getParticipants(conversationId: string): Promise<string[]> {
    return conversationRepository.getParticipants(conversationId);
  }

  async createGroup(name: string, participantIds: string[]): Promise<Conversation> {
    // Ensure at least 2 participants (group must have at least 3 including creator, but creator will be added later)
    if (participantIds.length < 2) throw new Error('Group must have at least 2 participants besides the creator');
    const conversation = await conversationRepository.createGroup(name, participantIds);
    // Notify all participants
    const event = JSON.stringify({ event: 'conversation.created', payload: { conversation } });
    for (const pId of participantIds) {
        await pubRedis.publish(`user:${pId}`, event);
    }
    return conversation;
  }

  async broadcastPresence(userId: string, status: 'online' | 'offline') {
    const contactIds = await conversationRepository.getContactIds(userId);
    const event = JSON.stringify({ event: 'presence.update', payload: { userId, status } });
    for (const contactId of contactIds) {
        await pubRedis.publish(`user:${contactId}`, event);
    }
  }
}

export const conversationService = new ConversationService();
import { messageRepository, Message } from './repository';
import redis, { pubRedis } from '@/infrastructure/cache/redis';
import { conversationService } from '@/modules/chat/conversations/service';

export class MessageService {
  async send(
    conversationId: string,
    senderId: string,
    data: {
      contentType: string;
      content?: string;
      mediaHash?: string;
      mediaMetadata?: any;
      replyTo?: string;
    }
  ) {
    // Verify participant
    const participants = await conversationService.getParticipants(conversationId);
    if (!participants.includes(senderId)) {
      throw new Error('You are not a participant of this conversation');
    }

    const message = await messageRepository.create(conversationId, senderId, data);

    // Publish real-time event to the conversation channel
    const event = JSON.stringify({ event: 'message.new', payload: { conversationId, message } });
    for (const participantId of participants) {
        await pubRedis.publish(`user:${participantId}`, event);
    }
    return message;
  }

  async getHistory(
    conversationId: string,
    userId: string,
    options: { before?: string; limit?: number }
  ): Promise<Message[]> {
    // Again check participation
    const participants = await conversationService.getParticipants(conversationId);
    if (!participants.includes(userId)) throw new Error('Access denied');
    return messageRepository.findByConversation(conversationId, options);
  }

  async markRead(messageId: string, userId: string) {
    await messageRepository.markRead(messageId, userId);
    // We could publish a read receipt event here
  }
}

export const messageService = new MessageService();
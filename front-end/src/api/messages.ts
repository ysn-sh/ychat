import apiClient from './client';
import type { Message } from '@/types/message';

export const messagesApi = {
  async getHistory(conversationId: string, before?: string, limit = 50): Promise<Message[]> {
    const params: any = { limit };
    if (before) params.before = before;
    const { data } = await apiClient.get(`/conversations/${conversationId}/messages`, { params });
    return data;
  },
  async send(
    conversationId: string,
    payload: {
      contentType: string;
      content?: string;
      mediaHash?: string;
      mediaMetadata?: any;
      replyTo?: string;
    }
  ): Promise<Message> {
    const { data } = await apiClient.post(`/conversations/${conversationId}/messages`, payload);
    return data;
  },
  async markRead(messageId: string): Promise<void> {
    await apiClient.post(`/messages/${messageId}/read`);
  },
};
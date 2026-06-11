import apiClient from './client';
import type { Conversation } from '@/types/conversation';

export const conversationsApi = {
  async list(): Promise<Conversation[]> {
    const { data } = await apiClient.get('/conversations');
    return data;
  },
  async createDirect(participantId: string): Promise<Conversation> {
    const { data } = await apiClient.post('/conversations', { participantId });
    return data;
  },
  async createGroup(name: string, participantIds: string[]): Promise<Conversation> {
    const { data } = await apiClient.post('/conversations', { type: 'group', name, participantIds });
    return data;
  },
};
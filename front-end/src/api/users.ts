import apiClient from './client';
// import type { User } from '@/types/user';

interface UserSearchResult {
  id: string;
  username: string;
  displayName: string | null;
  avatarHash: string | null;
}

export const usersApi = {
  async search(query: string): Promise<UserSearchResult[]> {
    const { data } = await apiClient.get('/users/search', { params: { q: query } });
    return data;
  },
};
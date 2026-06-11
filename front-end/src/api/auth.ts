import apiClient, { setAccessToken, clearAccessToken } from './client';
import type { User } from '@/types/user';

interface AuthResponse {
  user: User;
  accessToken: string;
}

export const authApi = {
  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', { username, email, password });
    setAccessToken(data.accessToken);
    return data;
  },
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', { email, password });
    setAccessToken(data.accessToken);
    return data;
  },
  async refresh(): Promise<string> {
    const { data } = await apiClient.post<{ accessToken: string }>('/auth/refresh');
    setAccessToken(data.accessToken);
    return data.accessToken;
  },
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
    clearAccessToken();
  },
};
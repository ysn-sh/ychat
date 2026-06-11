import React, { createContext, useState, useEffect, useCallback } from 'react';
import apiClient, { setAccessToken, clearAccessToken } from '@/api/client';
import { jwtDecode } from 'jwt-decode';
import type { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;                // <-- added
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);    // start loading

  const isAuthenticated = !!user;

  // On mount, try to refresh the token silently
  useEffect(() => {
    (async () => {
      try {
        const response = await apiClient.post('/auth/refresh');
        const token = response.data.accessToken;
        setAccessToken(token);

        const decoded: any = jwtDecode(token);
        const minimalUser: User = {
          id: decoded.sub,
          username: decoded.username,
        };
        setUser(minimalUser);
      } catch (err) {
        // No valid session – stay logged out
        clearAccessToken();
      } finally {
        setLoading(false);          // initialization done
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    const token = response.data.accessToken;
    setAccessToken(token);
    setUser(response.data.user);
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    const response = await apiClient.post('/auth/register', { username, email, password });
    const token = response.data.accessToken;
    setAccessToken(token);
    setUser(response.data.user);
  }, []);

  const logout = useCallback(async () => {
    await apiClient.post('/auth/logout');
    clearAccessToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
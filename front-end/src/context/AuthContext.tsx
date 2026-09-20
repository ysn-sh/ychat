import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import apiClient from "@/api/client";

import {
  setAccessToken, 
  clearAccessToken
} from "@/api/tokenStore";

import type { User } from "@/types/user";

type AuthStatus =
  | "loading"
  | "authenticated"
  | "unauthenticated";

interface AuthContextType {
  user: User | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  loading: boolean;

  login: (email: string, password: string) => Promise<void>;

  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;

  logout: () => Promise<void>;
}

export const AuthContext =
  createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] =
    useState<AuthStatus>("loading");

  const isAuthenticated =
    status === "authenticated";

  const loading = status === "loading";
  
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const response = await apiClient.post(
          "/auth/refresh"
        );

        const token = response.data.accessToken;

        setAccessToken(token);

        /*
         * The backend already has /users/me.
         * Use the server as the source of truth for
         * the current user instead of decoding the JWT
         * into a partial User object.
         */
        const userResponse = await apiClient.get(
          "/users/me"
        );

        if (!mounted) return;

        setUser(userResponse.data);
        setStatus("authenticated");
      } catch {
        clearAccessToken();

        if (!mounted) return;

        setUser(null);
        setStatus("unauthenticated");
      }
    };

    void initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);
  
  const login = useCallback(
    async (email: string, password: string) => {
      const response = await apiClient.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      setAccessToken(response.data.accessToken);
      setUser(response.data.user);
      setStatus("authenticated");
    },
    []
  );

  const register = useCallback(
    async (
      username: string,
      email: string,
      password: string
    ) => {
      const response = await apiClient.post(
        "/auth/register",
        {
          username,
          email,
          password,
        }
      );

      setAccessToken(response.data.accessToken);
      setUser(response.data.user);
      setStatus("authenticated");
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      clearAccessToken();
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
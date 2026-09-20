import axios from "axios";

import {
  clearAccessToken,
  setAccessToken,
} from "./tokenStore";

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let refreshPromise: Promise<string> | null = null;

export function refreshAccessToken(): Promise<string> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = refreshClient
    .post("/auth/refresh")
    .then(({ data }) => {
      const token = data.accessToken;

      setAccessToken(token);

      return token;
    })
    .catch((error) => {
      clearAccessToken();

      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}
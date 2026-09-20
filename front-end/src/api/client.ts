import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

import {
  clearAccessToken,
  getAccessToken,
} from "./tokenStore";

import { refreshAccessToken } from "./refresh";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let authFailureHandler: (() => void) | null = null;

export function setAuthFailureHandler(
  handler: (() => void) | null
) {
  authFailureHandler = handler;
}

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & {
          _retry?: boolean;
        })
      | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url ?? "";

    const isAuthRequest =
      requestUrl === "/auth/login" ||
      requestUrl === "/auth/register" ||
      requestUrl === "/auth/refresh" ||
      requestUrl === "/auth/logout";

    if (
      isAuthRequest ||
      error.response?.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const token = await refreshAccessToken();

      originalRequest.headers.Authorization =
        `Bearer ${token}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      clearAccessToken();
      authFailureHandler?.();

      return Promise.reject(refreshError);
    }
  }
);

export default apiClient;
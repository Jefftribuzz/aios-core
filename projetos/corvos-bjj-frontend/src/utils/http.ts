'use client';

import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios';

type RetryableConfig = AxiosRequestConfig & { _retry?: boolean };

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const http = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

const getToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem('accessToken');
};

const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem('refreshToken');
};

const saveTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const clearSession = () => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

const resolveQueue = (token: string | null) => {
  pendingQueue.forEach((callback) => callback(token));
  pendingQueue = [];
};

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

http.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalConfig = (error.config || {}) as RetryableConfig;
    const status = error.response?.status;

    if (status !== 401 || originalConfig._retry) {
      return Promise.reject(error);
    }

    const requestUrl = originalConfig.url || '';
    const isAuthEndpoint = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/refresh');
    if (isAuthEndpoint) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push((newToken) => {
          if (!newToken) {
            reject(error);
            return;
          }

          originalConfig.headers = {
            ...(originalConfig.headers || {}),
            Authorization: `Bearer ${newToken}`,
          };

          resolve(http(originalConfig));
        });
      });
    }

    originalConfig._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const refreshResponse = await refreshClient.post('/auth/refresh', { refreshToken });
      const newAccessToken = refreshResponse.data.token as string;
      const newRefreshToken = refreshResponse.data.refreshToken as string;

      saveTokens(newAccessToken, newRefreshToken);

      if (refreshResponse.data.user && typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(refreshResponse.data.user));
      }

      resolveQueue(newAccessToken);

      originalConfig.headers = {
        ...(originalConfig.headers || {}),
        Authorization: `Bearer ${newAccessToken}`,
      };

      return http(originalConfig);
    } catch (refreshError) {
      resolveQueue(null);
      clearSession();

      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default http;

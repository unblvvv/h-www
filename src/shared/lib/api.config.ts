import axios, { AxiosError, AxiosHeaders, AxiosRequestConfig } from 'axios';

const API_BASE_URL = 'http://localhost:8080';
const TOKEN_KEY = 'token';
const REFRESH_ENDPOINT = '/v1/auth/refresh';

interface RetryConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

export const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json, application/problem+json',
  },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    return config;
  }

  if (!config.headers) {
    config.headers = new AxiosHeaders();
  }

  if (config.headers instanceof AxiosHeaders) {
    config.headers.set('Authorization', `Bearer ${token}`);
  } else {
    const headerRecord = config.headers as Record<string, string>;
    config.headers = new AxiosHeaders({
      ...headerRecord,
      Authorization: `Bearer ${token}`,
    });
  }

  return config;
});

instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = error.config as RetryConfig | undefined;

    if (!original || status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      const refreshResponse = await axios.get(`${API_BASE_URL}${REFRESH_ENDPOINT}`, {
        headers: {
          Accept: 'application/json, application/problem+json',
        },
      });

      const nextToken =
        (refreshResponse.data as { token?: string; accessToken?: string })?.token ??
        (refreshResponse.data as { token?: string; accessToken?: string })?.accessToken;

      if (!nextToken) {
        return Promise.reject(error);
      }

      localStorage.setItem(TOKEN_KEY, nextToken);

      if (!original.headers) {
        original.headers = new AxiosHeaders();
      }

      if (original.headers instanceof AxiosHeaders) {
        original.headers.set('Authorization', `Bearer ${nextToken}`);
      } else {
        const headerRecord = original.headers as Record<string, string>;
        original.headers = new AxiosHeaders({
          ...headerRecord,
          Authorization: `Bearer ${nextToken}`,
        });
      }

      return instance.request(original);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);

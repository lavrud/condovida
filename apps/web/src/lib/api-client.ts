import axios, { AxiosError, AxiosHeaders, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/auth.store';

const API_BASE = import.meta.env.VITE_API_URL || '/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ── Mock adapter ─────────────────────────────────────────────
if (USE_MOCK) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiClient.defaults.adapter = async (config: InternalAxiosRequestConfig): Promise<AxiosResponse<any>> => {
    const { handleMockRequest } = await import('../mocks/index');
    const url = (config.url || '').replace(config.baseURL || '', '');
    const body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : undefined;
    const method = config.method || 'GET';

    await new Promise((r) => setTimeout(r, 120));

    try {
      const responseData = handleMockRequest(method, url, body);
      return {
        data: responseData,
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config,
      };
    } catch (err: unknown) {
      const e = err as { status?: number; message?: string };
      const axiosError = new AxiosError(e.message || 'Mock error', String(e.status || 500), config);
      axiosError.response = {
        data: { message: e.message },
        status: e.status || 500,
        statusText: '',
        headers: new AxiosHeaders(),
        config,
      };
      throw axiosError;
    }
  };
}

// ── JWT interceptor (real requests) ─────────────────────────
if (!USE_MOCK) {
  apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    },
  );
}

export function unwrap<T>(response: { data: { data: T } }): T {
  return response.data.data;
}

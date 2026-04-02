import { apiClient } from '../../../lib/api-client';
import { AuthResponse, User } from '@condovida/shared';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<{ data: AuthResponse }>('/auth/login', { email, password });
    return response.data.data;
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get<{ data: User }>('/auth/me');
    return response.data.data;
  },
};

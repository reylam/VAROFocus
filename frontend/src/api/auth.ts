import apiClient from './apiClient';
import type { AuthCredentials, RegisterPayload, AuthResponse, User } from '@/types/models';

export const authAPI = {
  register: (data: RegisterPayload) =>
    apiClient.post<AuthResponse>('/auth/register', data),

  login: (credentials: AuthCredentials) =>
    apiClient.post<AuthResponse>('/auth/login', credentials),

  logout: () => apiClient.post('/auth/logout'),

  me: () => apiClient.get<User>('/auth/me'),

  refreshToken: () => apiClient.post<AuthResponse>('/auth/refresh-token'),
};

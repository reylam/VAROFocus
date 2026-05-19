import apiClient from './apiClient'
import type { AuthCredentials, AuthResponse, RegisterPayload, User } from '@/types/models'

export const authAPI = {
  login: (payload: AuthCredentials) => apiClient.post<AuthResponse>('/auth/login', payload),
  register: (payload: RegisterPayload) => apiClient.post<AuthResponse>('/auth/register', payload),
  logout: () => apiClient.post<{ message: string }>('/auth/logout'),
  me: () => apiClient.get<{ user: User; progress_to_next_level: { current_xp: number; required_xp: number; percentage: number } }>('/auth/me'),
  refreshToken: () => apiClient.post<{ message: string; token: string }>('/auth/refresh-token'),
}

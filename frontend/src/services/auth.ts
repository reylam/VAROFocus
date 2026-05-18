import api from './api'
import type { AuthUser } from '../types'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  username: string
  email: string
  password: string
  password_confirmation: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

export async function login(payload: LoginPayload) {
  const { data } = await api.post<AuthResponse>('/auth/login', payload)
  if (data.token) {
    localStorage.setItem('auth_token', data.token)
  }
  return data
}

export async function register(payload: RegisterPayload) {
  const { data } = await api.post<AuthResponse>('/auth/register', payload)
  if (data.token) {
    localStorage.setItem('auth_token', data.token)
  }
  return data
}

export async function fetchCurrentUser() {
  const { data } = await api.get<AuthUser>('/auth/me')
  return data
}

export async function logout() {
  await api.post('/auth/logout')
  localStorage.removeItem('auth_token')
}

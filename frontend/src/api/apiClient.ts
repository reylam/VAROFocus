import axios from 'axios'
import type { AxiosError, AxiosInstance } from 'axios'
import { useAuthStore } from '@/store/authStore'

// Derive the API host from wherever the app is being served so it works both on
// localhost and over the LAN (a friend opening http://<your-ip>:5173 hits http://<your-ip>:8000).
// Override with VITE_API_BASE_URL if your backend runs elsewhere.


export const API_BASE_URL = "https://varofocus-be-production.up.railway.app/api"

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token || localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  },
)

export default apiClient

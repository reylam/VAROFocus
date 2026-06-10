import axios from 'axios'
import { API_BASE_URL } from '@/api/apiClient'
import { mockAdapter } from '@/api/mockAdapter'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // We authenticate with Bearer tokens, not cookies. Keeping this false avoids
  // CORS failures against the wildcard-origin backend.
  withCredentials: false,
  adapter: mockAdapter,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const payload = error.response?.data || error.message || error
    return Promise.reject(payload)
  },
)

export default api

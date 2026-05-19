import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthCredentials, RegisterPayload, User } from '@/types/models'
import { authAPI } from '@/api/auth'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (credentials: AuthCredentials) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
          const { data } = await authAPI.login(credentials)
          localStorage.setItem('auth_token', data.token)
          set({ token: data.token, user: data.user, isAuthenticated: true, isLoading: false })
        } catch (error) {
          set({ error: 'Login failed', isLoading: false, isAuthenticated: false })
          throw error
        }
      },

      register: async (payload) => {
        set({ isLoading: true, error: null })
        try {
          const { data } = await authAPI.register(payload)
          localStorage.setItem('auth_token', data.token)
          set({ token: data.token, user: data.user, isAuthenticated: true, isLoading: false })
        } catch (error) {
          set({ error: 'Registration failed', isLoading: false, isAuthenticated: false })
          throw error
        }
      },

      logout: () => {
        localStorage.removeItem('auth_token')
        set({ user: null, token: null, isAuthenticated: false, isLoading: false, error: null })
      },

      setUser: (user) => set({ user, isAuthenticated: Boolean(user) }),

      setToken: (token) => {
        if (token) localStorage.setItem('auth_token', token)
        else localStorage.removeItem('auth_token')
        set({ token, isAuthenticated: Boolean(token) })
      },

      checkAuth: async () => {
        const token = get().token || localStorage.getItem('auth_token')
        if (!token) {
          set({ isLoading: false, isAuthenticated: false })
          return
        }

        set({ token, isLoading: true })
        try {
          const { data } = await authAPI.me()
          set({ user: data.user, isAuthenticated: true, isLoading: false })
        } catch {
          get().logout()
        }
      },
    }),
    {
      name: 'varo-auth',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)

export const getAuthToken = () => useAuthStore.getState().token || localStorage.getItem('auth_token')

export default useAuthStore

import { create } from 'zustand'
import type { AuthUser, UserStats } from '../types'

interface AuthState {
  user: AuthUser | null
  userStats: UserStats | null
  isAuthenticated: boolean
  setUser: (user: AuthUser | null) => void
  setUserStats: (stats: UserStats | null) => void
  logout: () => void
  updateUser: (updates: Partial<AuthUser>) => void
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userStats: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setUserStats: (stats) => set({ userStats: stats }),
  logout: () => {
    localStorage.removeItem('auth_token')
    set({ user: null, userStats: null, isAuthenticated: false })
  },
  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
}))

export default useAuthStore


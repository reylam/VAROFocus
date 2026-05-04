import { create } from 'zustand'

export interface ToastMessage {
  id: string
  title: string
  description?: string
  variant?: 'success' | 'warning' | 'danger' | 'info'
}

interface UiState {
  theme: 'light' | 'dark'
  toasts: ToastMessage[]
  toggleTheme: () => void
  addToast: (toast: Omit<ToastMessage, 'id'>) => void
  removeToast: (id: string) => void
}

const useUiStore = create<UiState>((set, get) => ({
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'dark',
  toasts: [],
  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', next)
    set({ theme: next })
  },
  addToast: (toast) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    set({ toasts: [...get().toasts, { id, ...toast }] })
    window.setTimeout(() => get().removeToast(id), 4200)
  },
  removeToast: (id) => {
    set({ toasts: get().toasts.filter((toast) => toast.id !== id) })
  },
}))

export default useUiStore

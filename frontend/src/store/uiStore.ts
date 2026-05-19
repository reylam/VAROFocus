import { create } from 'zustand'

export type ToastVariant = 'success' | 'warning' | 'error' | 'info'

export interface Toast {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

interface UiState {
  theme: 'light'
  sidebarOpen: boolean
  toasts: Toast[]
  toggleTheme: () => void
  setSidebarOpen: (open: boolean) => void
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

export const useUiStore = create<UiState>((set) => ({
  theme: 'light',
  sidebarOpen: true,
  toasts: [],
  toggleTheme: () => set({ theme: 'light' }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  addToast: (toast) => {
    const id = crypto.randomUUID()
    set((state) => ({ toasts: [...state.toasts, { id, ...toast }] }))
    if (toast.duration !== -1) {
      window.setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) }))
      }, toast.duration ?? 3200)
    }
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) })),
}))

export default useUiStore

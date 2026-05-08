import { create } from 'zustand';
import type { Toast } from '../types';

interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  modals: Record<string, boolean>;
  toasts: Toast[];

  toggleTheme: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'dark',
  sidebarOpen: true,
  modals: {},
  toasts: [],

  toggleTheme: () =>
    set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),

  openModal: (id: string) =>
    set((state) => ({ modals: { ...state.modals, [id]: true } })),

  closeModal: (id: string) =>
    set((state) => ({ modals: { ...state.modals, [id]: false } })),

  addToast: (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id },
      ],
    }));

    if (toast.duration !== -1) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((n) => n.id !== id),
        }));
      }, toast.duration || 3000);
    }
  },

  removeToast: (id: string) =>
    set((state) => ({
      toasts: state.toasts.filter((n) => n.id !== id),
    })),
}));

export default useUIStore;

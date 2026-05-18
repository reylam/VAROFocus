import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthCredentials, RegisterPayload } from '@/types/models';
import { authAPI } from '@/api/auth';
import { toast } from 'sonner';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (credentials: AuthCredentials) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      login: async (credentials: AuthCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login(credentials);
          const { token, user } = response.data;

          localStorage.setItem('auth_token', token);
          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          toast.success('Welcome back!');
        } catch (error: any) {
          const message = error.response?.data?.message || 'Login failed';
          set({
            error: message,
            isLoading: false,
          });
          toast.error(message);
          throw error;
        }
      },

      register: async (payload: RegisterPayload) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.register(payload);
          const { token, user } = response.data;

          localStorage.setItem('auth_token', token);
          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          toast.success('Account created successfully!');
        } catch (error: any) {
          const message = error.response?.data?.message || 'Registration failed';
          set({
            error: message,
            isLoading: false,
          });
          toast.error(message);
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('auth_token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
        toast.success('Logged out successfully');
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      setToken: (token: string) => {
        localStorage.setItem('auth_token', token);
        set({ token, isAuthenticated: true });
      },

      checkAuth: async () => {
        const token = get().token || localStorage.getItem('auth_token');
        if (!token) {
          set({ isLoading: false });
          return;
        }

        if (!get().token) {
          set({ token, isAuthenticated: true });
        }

        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.me();
          set({ user: response.data.user, isAuthenticated: true, isLoading: false });
        } catch {
          get().logout();
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;


import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '@/api/auth';
import type { User, AuthCredentials, RegisterPayload } from '@/types/models';
import useAuthStore from '@/store/authStore';

export const useAuth = () => {
  const { user, token, isAuthenticated, login, register, logout, checkAuth } = useAuthStore();
  return { user, token, isAuthenticated, login, register, logout, checkAuth };
};

export const useCurrentUser = () => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const response = await authAPI.me();
      return response.data.user;
    },
    onSuccess: (userData: User) => {
      queryClient.setQueryData(['me'], userData);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authAPI.register(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['me']);
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (credentials: AuthCredentials) => authAPI.login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries(['me']);
    },
  });
};

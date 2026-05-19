import { useMutation } from '@tanstack/react-query'
import useAuthStore from '@/store/authStore'
import type { AuthCredentials, RegisterPayload } from '@/types/models'

export const useLogin = () => {
  const login = useAuthStore((state) => state.login)
  return useMutation({ mutationFn: (payload: AuthCredentials) => login(payload) })
}

export const useRegister = () => {
  const register = useAuthStore((state) => state.register)
  return useMutation({ mutationFn: (payload: RegisterPayload) => register(payload) })
}

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout)
  return useMutation({ mutationFn: async () => logout() })
}

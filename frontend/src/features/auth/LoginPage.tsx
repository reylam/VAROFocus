import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAuthStore from '../../store/authStore'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import useUiStore from '../../store/uiStore'

export function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const addToast = useUiStore((state) => state.addToast)
  const queryClient = useQueryClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const mutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => login({ email, password }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
      addToast({ title: 'Welcome back', description: 'Your focus session is ready.', variant: 'success' })
      navigate('/dashboard')
    },
    onError: () => {
      addToast({ title: 'Login failed', description: 'Check your credentials and try again.', variant: 'warning' })
    },
  })

  return (
    <div className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.14),transparent_32%),#05060b] px-4 py-10">
      <Card className="max-w-lg space-y-8 bg-slate-950/95 p-10">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Login</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">Enter the battle zone</h1>
          <p className="mt-3 text-slate-400">Sign in to manage your monsters, claim XP, and join sessions.</p>
        </div>

        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault()
            mutation.mutate({ email, password })
          }}
        >
          <label className="block text-sm text-slate-300">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <label className="block text-sm text-slate-300">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <Button type="submit" className="w-full" size="lg">
            {mutation.isPending ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500">
          New here?{' '}
          <Link to="/register" className="font-semibold text-primary hover:text-white">
            Create an account
          </Link>
        </p>
      </Card>
    </div>
  )
}

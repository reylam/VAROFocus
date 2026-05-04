import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { register } from '../../services/auth'
import useAuthStore from '../../store/authStore'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import useUiStore from '../../store/uiStore'

export function RegisterPage() {
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)
  const addToast = useUiStore((state) => state.addToast)
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const mutation = useMutation(register, {
    onSuccess: (data) => {
      setUser(data.user)
      queryClient.invalidateQueries(['user'])
      addToast({ title: 'Account created', description: 'Welcome to VAROFocus.', variant: 'success' })
      navigate('/dashboard')
    },
    onError: () => {
      addToast({ title: 'Registration failed', description: 'Please verify your fields.', variant: 'danger' })
    },
  })

  return (
    <div className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.14),transparent_32%),#05060b] px-4 py-10">
      <Card className="max-w-lg space-y-8 bg-slate-950/95 p-10">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Register</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">Build your focus legend</h1>
          <p className="mt-3 text-slate-400">Sign up to start defeating monsters and earning rewards.</p>
        </div>

        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault()
            mutation.mutate({ name, email, password, password_confirmation: confirmPassword })
          }}
        >
          <label className="block text-sm text-slate-300">
            Name
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
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
          <label className="block text-sm text-slate-300">
            Confirm password
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <Button type="submit" className="w-full" size="lg">
            {mutation.isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:text-white">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  )
}

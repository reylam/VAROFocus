import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail } from 'lucide-react'
import { useLogin } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import useUiStore from '@/store/uiStore'

export function LoginPage() {
  const navigate = useNavigate()
  const login = useLogin()
  const addToast = useUiStore((state) => state.addToast)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <main className="grid min-h-screen place-items-center bg-[#f6fbfa] px-4 py-10 text-slate-900">
      <Card className="w-full max-w-md border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#17937f]">VAROFocus</p>
          <h1 className="mt-3 text-3xl font-semibold">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-600">Masuk untuk lanjut menyerang task monster dan tracking XP.</p>
        </div>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            login.mutate(
              { email, password },
              {
                onSuccess: () => {
                  addToast({ title: 'Login berhasil', variant: 'success' })
                  navigate('/dashboard')
                },
                onError: () => addToast({ title: 'Login gagal', description: 'Cek email dan password kamu.', variant: 'error' }),
              },
            )
          }}
        >
          <Input icon={<Mail size={18} />} label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <Input icon={<Lock size={18} />} label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          <Button type="submit" className="w-full" size="lg" disabled={login.isPending}>
            {login.isPending ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Belum punya akun? <Link className="font-semibold text-[#17937f]" to="/register">Register</Link>
        </p>
      </Card>
    </main>
  )
}

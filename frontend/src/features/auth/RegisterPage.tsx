import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, UserRound, Lock } from 'lucide-react'
import { useRegister } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import useUiStore from '@/store/uiStore'

export function RegisterPage() {
  const navigate = useNavigate()
  const register = useRegister()
  const addToast = useUiStore((state) => state.addToast)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')

  return (
    <main className="grid min-h-screen place-items-center bg-[#f6fbfa] px-4 py-10 text-slate-900">
      <Card className="w-full max-w-md border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#f99f1e]">New account</p>
          <h1 className="mt-3 text-3xl font-semibold">Create your profile</h1>
          <p className="mt-2 text-sm text-slate-600">Akun baru langsung dapat token Bearer dari Laravel Sanctum.</p>
        </div>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            register.mutate(
              { username, email, password, password_confirmation: passwordConfirmation },
              {
                onSuccess: () => {
                  addToast({ title: 'Akun berhasil dibuat', variant: 'success' })
                  navigate('/dashboard')
                },
                onError: () => addToast({ title: 'Register gagal', description: 'Pastikan password minimal 8 karakter dan konfirmasi cocok.', variant: 'error' }),
              },
            )
          }}
        >
          <Input icon={<UserRound size={18} />} label="Username" value={username} onChange={(event) => setUsername(event.target.value)} required minLength={3} />
          <Input icon={<Mail size={18} />} label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <Input icon={<Lock size={18} />} label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} />
          <Input icon={<Lock size={18} />} label="Confirm password" type="password" value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} required />
          <Button type="submit" className="w-full" size="lg" disabled={register.isPending}>
            {register.isPending ? 'Creating...' : 'Create account'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Sudah punya akun? <Link className="font-semibold text-[#17937f]" to="/login">Sign in</Link>
        </p>
      </Card>
    </main>
  )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail, AlertCircle, CheckCircle } from 'lucide-react'
import { useLogin } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import useUiStore from '@/store/uiStore'

// Component Toast/Notification
const ToastContainer = () => {
  const toasts = useUiStore((state) => state.toasts)
  const removeToast = useUiStore((state) => state.removeToast)

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 rounded-lg p-4 shadow-lg animate-in slide-in-from-right ${
            toast.variant === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : toast.variant === 'error'
              ? 'bg-red-50 text-red-800 border border-red-200'
              : toast.variant === 'warning'
              ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
              : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}
        >
          {toast.variant === 'success' && <CheckCircle className="h-5 w-5 flex-shrink-0" />}
          {toast.variant === 'error' && <AlertCircle className="h-5 w-5 flex-shrink-0" />}
          <div className="flex-1">
            <p className="font-medium">{toast.title}</p>
            {toast.description && <p className="text-sm mt-1 opacity-90">{toast.description}</p>}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}

export function LoginPage() {
  const navigate = useNavigate()
  const login = useLogin()
  const addToast = useUiStore((state) => state.addToast)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    // Reset errors
    setErrors({})
    
    // Validasi frontend
    if (!email.trim()) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }))
      addToast({ 
        title: 'Validation Error', 
        description: 'Please enter your email', 
        variant: 'error' 
      })
      return
    }
    
    if (!password.trim()) {
      setErrors(prev => ({ ...prev, password: 'Password is required' }))
      addToast({ 
        title: 'Validation Error', 
        description: 'Please enter your password', 
        variant: 'error' 
      })
      return
    }

    try {
      await login.mutateAsync({ email, password })
      addToast({ 
        title: 'Login Successful!', 
        description: `Welcome back! 🎉`, 
        variant: 'success' 
      })
      navigate('/dashboard')
    } catch (error: any) {
      console.error('Login error:', error)
      
      // Handle error dari server
      const status = error.response?.status
      const responseData = error.response?.data
      
      if (status === 422) {
        // Validation error dari Laravel
        const validationErrors = responseData?.errors
        if (validationErrors) {
          // Set field errors
          if (validationErrors.email) {
            setErrors(prev => ({ ...prev, email: validationErrors.email[0] }))
          }
          if (validationErrors.password) {
            setErrors(prev => ({ ...prev, password: validationErrors.password[0] }))
          }
          addToast({ 
            title: 'Validation Error', 
            description: validationErrors.email?.[0] || validationErrors.password?.[0] || 'Please check your input', 
            variant: 'error' 
          })
        } else {
          addToast({ 
            title: 'Login Failed', 
            description: responseData?.message || 'Please check your email and password', 
            variant: 'error' 
          })
        }
      } else if (status === 401) {
        // Unauthorized - wrong credentials
        addToast({ 
          title: 'Login Failed', 
          description: 'Incorrect email or password. Please try again.', 
          variant: 'error' 
        })
        setErrors({ 
          email: 'Invalid credentials', 
          password: 'Invalid credentials' 
        })
      } else if (status === 500) {
        // Server error
        addToast({ 
          title: 'Server Error', 
          description: 'Something went wrong. Please try again later.', 
          variant: 'error' 
        })
      } else {
        // Other errors
        addToast({ 
          title: 'Login Failed', 
          description: responseData?.message || 'An unexpected error occurred', 
          variant: 'error' 
        })
      }
    }
  }

  return (
    <>
      <ToastContainer />
      <main className="grid min-h-screen place-items-center bg-[#f6fbfa] px-4 py-10 text-slate-900">
        <Card className="w-full max-w-md border-slate-200 bg-white p-8 shadow-xl">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#17937f]">VAROFocus</p>
            <h1 className="mt-3 text-3xl font-semibold">Welcome back</h1>
            <p className="mt-2 text-sm text-slate-600">Masuk untuk lanjut menyerang task monster dan tracking XP.</p>
          </div>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Input 
                icon={<Mail size={18} />} 
                label="Email" 
                type="email" 
                value={email} 
                onChange={(event) => {
                  setEmail(event.target.value)
                  if (errors.email) setErrors(prev => ({ ...prev, email: undefined }))
                }} 
                required 
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            
            <div>
              <Input 
                icon={<Lock size={18} />} 
                label="Password" 
                type="password" 
                value={password} 
                onChange={(event) => {
                  setPassword(event.target.value)
                  if (errors.password) setErrors(prev => ({ ...prev, password: undefined }))
                }} 
                required 
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              size="lg" 
              disabled={login.isPending}
            >
              {login.isPending ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          
          <p className="mt-6 text-center text-sm text-slate-600">
            Belum punya akun? <Link className="font-semibold text-[#17937f]" to="/register">Register</Link>
          </p>
        </Card>
      </main>
    </>
  )
}
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, UserRound, Lock, AlertCircle, CheckCircle } from 'lucide-react'
import { useRegister } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import useUiStore from '@/store/uiStore'
import logo from "../../assets/varo_logo_text.png"

// Toast Container Component
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

export function RegisterPage() {
  const navigate = useNavigate()
  const register = useRegister()
  const addToast = useUiStore((state) => state.addToast)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [errors, setErrors] = useState<{
    username?: string
    email?: string
    password?: string
    password_confirmation?: string
  }>({})

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    // Reset errors
    setErrors({})
    
    // Frontend validations
    if (username.length < 3) {
      setErrors(prev => ({ ...prev, username: 'Username must be at least 3 characters' }))
      addToast({ 
        title: 'Validation Error', 
        description: 'Username must be at least 3 characters', 
        variant: 'error' 
      })
      return
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }))
      addToast({ 
        title: 'Validation Error', 
        description: 'Please enter a valid email address', 
        variant: 'error' 
      })
      return
    }
    
    if (password.length < 8) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters' }))
      addToast({ 
        title: 'Validation Error', 
        description: 'Password must be at least 8 characters', 
        variant: 'error' 
      })
      return
    }
    
    if (password !== passwordConfirmation) {
      setErrors(prev => ({ ...prev, password_confirmation: 'Passwords do not match' }))
      addToast({ 
        title: 'Validation Error', 
        description: 'Password and confirmation do not match', 
        variant: 'error' 
      })
      return
    }

    try {
      await register.mutateAsync({ 
        username, 
        email, 
        password, 
        password_confirmation: passwordConfirmation 
      })
      addToast({ 
        title: 'Account Created! 🎉', 
        description: `Welcome ${username}! You are now registered.`, 
        variant: 'success' 
      })
      navigate('/dashboard')
    } catch (error: any) {
      console.error('Register error:', error)
      
      const status = error.response?.status
      const responseData = error.response?.data
      
      if (status === 422) {
        const validationErrors = responseData?.errors
        
        if (validationErrors) {
          if (validationErrors.username) {
            setErrors(prev => ({ ...prev, username: validationErrors.username[0] }))
          }
          if (validationErrors.email) {
            setErrors(prev => ({ ...prev, email: validationErrors.email[0] }))
          }
          if (validationErrors.password) {
            setErrors(prev => ({ ...prev, password: validationErrors.password[0] }))
          }
          if (validationErrors.password_confirmation) {
            setErrors(prev => ({ ...prev, password_confirmation: validationErrors.password_confirmation[0] }))
          }
          
          const firstError = (Object.values(validationErrors)[0] as string[] | undefined)?.[0]
          addToast({ 
            title: 'Registration Failed', 
            description: firstError || 'Please check your input', 
            variant: 'error' 
          })
        } else {
          addToast({ 
            title: 'Registration Failed', 
            description: responseData?.message || 'Please check your input', 
            variant: 'error' 
          })
        }
      } else if (status === 409) {
        addToast({ 
          title: 'Registration Failed', 
          description: responseData?.message || 'Email or username already exists', 
          variant: 'error' 
        })
      } else if (status === 500) {
        addToast({ 
          title: 'Server Error', 
          description: 'Something went wrong. Please try again later.', 
          variant: 'error' 
        })
      } else {
        addToast({ 
          title: 'Registration Failed', 
          description: responseData?.message || 'An unexpected error occurred', 
          variant: 'error' 
        })
      }
    }
  }

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-[#f6fbfa] flex flex-col items-center justify-center px-4 py-10">
        <div className="flex flex-col items-center w-full max-w-md">
          <img src={logo} alt="VAROFocus" className="w-32 mb-6" />
          
          <Card className="w-full border-slate-200 bg-white p-8 shadow-xl">
            <div className="mb-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#f99f1e]">New account</p>
              <h1 className="mt-3 text-3xl font-semibold">Create your profile</h1>
              <p className="mt-2 text-sm text-slate-600">Akun baru langsung dapat token Bearer dari Laravel Sanctum.</p>
            </div>
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Username Field */}
              <div>
                <Input 
                  icon={<UserRound size={18} />} 
                  label="Username" 
                  value={username} 
                  onChange={(event) => {
                    setUsername(event.target.value)
                    if (errors.username) setErrors(prev => ({ ...prev, username: undefined }))
                  }} 
                  required 
                  minLength={3}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                )}
                <p className="mt-1 text-xs text-slate-500">Min. 3 characters</p>
              </div>

              {/* Email Field */}
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

              {/* Password Field */}
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
                  minLength={8}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
                <p className="mt-1 text-xs text-slate-500">Min. 8 characters</p>
              </div>

              {/* Confirm Password Field */}
              <div>
                <Input 
                  icon={<Lock size={18} />} 
                  label="Confirm password" 
                  type="password" 
                  value={passwordConfirmation} 
                  onChange={(event) => {
                    setPasswordConfirmation(event.target.value)
                    if (errors.password_confirmation) setErrors(prev => ({ ...prev, password_confirmation: undefined }))
                  }} 
                  required 
                />
                {errors.password_confirmation && (
                  <p className="mt-1 text-sm text-red-500">{errors.password_confirmation}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg" 
                disabled={register.isPending}
              >
                {register.isPending ? 'Creating...' : 'Create account'}
              </Button>
            </form>
            
            <p className="mt-6 text-center text-sm text-slate-600">
              Sudah punya akun? <Link className="font-semibold text-[#17937f]" to="/login">Sign in</Link>
            </p>
          </Card>
        </div>
      </div>
    </>
  )
}
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import clsx from '../../utils/clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  icon,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400',
        variant === 'primary' && 'bg-primary text-white shadow-glow hover:bg-indigo-500',
        variant === 'secondary' && 'border border-slate-700 bg-slate-900 text-slate-100 hover:border-slate-500 hover:bg-slate-800',
        variant === 'ghost' && 'bg-transparent text-slate-200 hover:bg-slate-800',
        variant === 'danger' && 'bg-danger text-white hover:bg-red-500',
        size === 'sm' && 'px-3 py-2 text-sm',
        size === 'md' && 'px-4 py-3 text-sm md:text-base',
        size === 'lg' && 'px-5 py-4 text-base',
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}

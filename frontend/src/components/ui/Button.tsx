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
        'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#17937f]/40',
        variant === 'primary' && 'bg-[#17937f] text-white shadow-[0_12px_30px_rgba(23,147,127,0.18)] hover:bg-[#12816c]',
        variant === 'secondary' && 'border border-[#f99f1e] bg-[#f99f1e]/10 text-[#f99f1e] hover:bg-[#f99f1e]/15',
        variant === 'ghost' && 'bg-slate-100 text-slate-800 hover:bg-slate-200',
        variant === 'danger' && 'bg-[#ef4444] text-white hover:bg-[#dc2626]',
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

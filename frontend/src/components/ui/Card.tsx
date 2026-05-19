import type { ReactNode } from 'react'
import clsx from '../../utils/clsx'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={clsx('rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-soft', className)}>
      {children}
    </div>
  )
}

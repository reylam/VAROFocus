import { ReactNode } from 'react'
import clsx from '../../utils/clsx'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={clsx('rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-5 shadow-soft backdrop-blur-xl', className)}>
      {children}
    </div>
  )
}

import type { ReactNode } from 'react'
import { ToastContainer } from '../ui/ToastContainer'
import useUiStore from '../../store/uiStore'

interface ToastProviderProps {
  children?: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const { toasts, removeToast } = useUiStore()

  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  )
}

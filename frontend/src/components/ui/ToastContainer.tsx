import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import type { Toast } from '../../types'
import clsx from '../../utils/clsx'

interface ToastItemProps {
  toast: Toast
  onClose: (id: string) => void
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const colors = {
  success: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200',
  error: 'border-red-500/50 bg-red-500/10 text-red-200',
  warning: 'border-amber-500/50 bg-amber-500/10 text-amber-200',
  info: 'border-blue-500/50 bg-blue-500/10 text-blue-200',
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const Icon = icons[toast.variant || 'info']

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        'flex items-start gap-3 rounded-2xl border p-4 shadow-lg backdrop-blur-xl',
        colors[toast.variant || 'info'],
      )}
    >
      <Icon size={20} className="mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <h4 className="font-semibold">{toast.title}</h4>
        {toast.description && (
          <p className="mt-1 text-sm opacity-90">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 rounded-lg p-1 transition hover:bg-white/10"
      >
        <X size={16} />
      </button>
    </motion.div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  )
}

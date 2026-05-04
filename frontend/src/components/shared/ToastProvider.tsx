import { AnimatePresence, motion } from 'framer-motion'
import useUiStore from '../../store/uiStore'

export function ToastProvider() {
  const { toasts, removeToast } = useUiStore()

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            className="pointer-events-auto rounded-2xl border border-white/10 bg-slate-950/95 p-4 shadow-soft backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-white">{toast.title}</p>
                {toast.description && <p className="mt-1 text-sm text-slate-400">{toast.description}</p>}
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="rounded-full border border-slate-700 p-2 text-slate-400 transition hover:border-slate-500 hover:text-white"
              >
                ×
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

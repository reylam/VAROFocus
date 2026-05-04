import { motion } from 'framer-motion'

interface HPBarProps {
  current: number
  max: number
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
}

export function HPBar({ current, max, label, size = 'md' }: HPBarProps) {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100))
  const isLowHealth = percentage < 25

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          <span>{label}</span>
          <span>{current} / {max}</span>
        </div>
      )}
      <div className={clsx('w-full overflow-hidden rounded-full bg-slate-800', sizeClasses[size])}>
        <motion.div
          className={clsx(
            'h-full rounded-full transition-colors',
            percentage > 50
              ? 'bg-gradient-to-r from-emerald-500 to-green-400'
              : percentage > 25
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                : 'bg-gradient-to-r from-red-500 to-orange-400',
          )}
          initial={false}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      {isLowHealth && (
        <motion.p
          className="text-xs font-semibold text-red-400"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          Critical HP!
        </motion.p>
      )}
    </div>
  )
}

import clsx from '../../utils/clsx'

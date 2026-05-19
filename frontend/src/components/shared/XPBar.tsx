import { motion } from 'framer-motion'

interface XPBarProps {
  current: number
  nextLevel: number
}

export function XPBar({ current, nextLevel }: XPBarProps) {
  const progress = Math.min(100, Math.round((current / nextLevel) * 100))
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-600">
        <span>XP progress</span>
        <span>{current.toLocaleString()} / {nextLevel.toLocaleString()}</span>
      </div>
      <div className="rounded-full bg-slate-100 p-1">
        <motion.div
          className="h-3 rounded-full bg-gradient-to-r from-[#f99f1e] via-[#17937f] to-[#17937f]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import type { Achievement } from '../../types'
import clsx from '../../utils/clsx'

interface AchievementCardProps {
  achievement: Achievement
  isUnlocked: boolean
  progress?: number
  maxProgress?: number
}

export function AchievementCard({
  achievement,
  isUnlocked,
  progress = 0,
  maxProgress = 100,
}: AchievementCardProps) {
  const progressPercent = Math.min(100, (progress / (maxProgress || 1)) * 100)

  return (
    <motion.div
      whileHover={isUnlocked ? { y: -4 } : {}}
      className={clsx(
        'relative rounded-2xl border p-4 transition-all',
        isUnlocked
          ? 'border-primary/50 bg-slate-950/80 shadow-soft'
          : 'border-slate-700 bg-slate-950/50',
      )}
    >
      {!isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 backdrop-blur-sm">
          <Lock className="text-slate-400" size={24} />
        </div>
      )}

      <div className="flex gap-3">
        <div
          className={clsx(
            'h-12 w-12 flex-shrink-0 rounded-lg border',
            isUnlocked
              ? 'border-primary/30 bg-primary/10'
              : 'border-slate-700 bg-slate-800',
          )}
        >
          {achievement.icon_url ? (
            <img
              src={achievement.icon_url}
              alt={achievement.title}
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-lg">⭐</span>
          )}
        </div>

        <div className="flex-1">
          <h3 className={clsx(
            'font-semibold',
            isUnlocked ? 'text-white' : 'text-slate-400',
          )}>
            {achievement.title}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {achievement.description}
          </p>
          {!isUnlocked && maxProgress && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Progress</span>
                <span className="text-slate-400">
                  {Math.min(progress, maxProgress)} / {maxProgress}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-accent"
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="text-right text-xs font-semibold text-yellow-400">
          +{achievement.xp_reward} XP
        </div>
      </div>
    </motion.div>
  )
}

import { motion } from 'framer-motion'
import { Sparkles, Swords, Trash2 } from 'lucide-react'
import type { Task } from '@/types/models'
import { Button } from '../ui/Button'
import clsx from '../../utils/clsx'
import useTaskStore from '../../store/taskStore'

interface TaskCardProps {
  task: Task
  onAttack: (id: string) => void
  onDelete?: (id: string) => void
}

const difficultyStyles = {
  easy: 'bg-emerald-50 text-emerald-700',
  medium: 'bg-amber-50 text-amber-700',
  hard: 'bg-orange-50 text-orange-700',
  boss: 'bg-rose-50 text-rose-700',
}

export function TaskCard({ task, onAttack, onDelete }: TaskCardProps) {
  const monster = Array.isArray(task.monster) ? task.monster[0] : task.monster
  const currentHp = monster?.current_hp ?? task.current_hp
  const maxHp = monster?.max_hp ?? task.hp
  const cheersCount = task.cheers?.length ?? task.cheers_count ?? 0
  const hpProgress = maxHp > 0 ? Math.max(0, Math.round((currentHp / maxHp) * 100)) : 0
  const isDefeated = currentHp <= 0 || task.status === 'completed'
  const attackingId = useTaskStore((s) => s.attackingTaskId)
  const isAttacking = attackingId === task.id

  return (
    <motion.article
      layout
      whileHover={{ y: -4 }}
      animate={isAttacking ? { x: [0, -8, 8, -6, 6, 0] } : undefined}
      transition={isAttacking ? { duration: 0.6, ease: 'easeOut' } : undefined}
      className="group rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.32em] text-slate-600">
            {task.difficulty}
          </div>
          <h3 className="mt-4 text-xl font-semibold text-slate-900">{task.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{task.description}</p>
        </div>
        <div className="flex flex-col items-end gap-2 text-right text-xs uppercase tracking-[0.24em] text-slate-500">
          <div className="flex items-center gap-2">
            {onDelete && (
              <button
                onClick={() => onDelete(task.id)}
                aria-label="Delete task"
                className="rounded-full p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            )}
            <span>{cheersCount} cheers</span>
          </div>
          <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-slate-700">Priority {task.priority}</span>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between text-sm text-slate-700">
          <span>Monster HP</span>
          <span>{currentHp}/{maxHp}</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            initial={false}
            animate={{ width: `${hpProgress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-[#17937f] via-[#f99f1e] to-[#f99f1e]"
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className={clsx(
            'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold',
            difficultyStyles[task.difficulty],
          )}>
            <Sparkles size={14} />
            +{task.xp_reward} XP
          </div>
          <div className="relative">
            <Button
              variant="secondary"
              size="sm"
              icon={<Swords size={14} />}
              onClick={() => onAttack(task.id)}
              disabled={isDefeated || isAttacking}
            >
              {isDefeated ? 'Defeated' : 'Attack'}
            </Button>
            {isAttacking && (
              <motion.span
                initial={{ x: 24, opacity: 1, scale: 0.9 }}
                animate={{ x: 0, opacity: 0, scale: 1.2 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="pointer-events-none absolute -right-3 top-0 flex h-3 w-3 items-center justify-center rounded-full bg-[#f99f1e]"
              />
            )}
          </div>
        </div>
      </div>
    </motion.article>
  )
}

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Swords, Trophy, X } from 'lucide-react'
import { useTasks, useCreateTask, useDeleteTask, useAttackMonster } from '../../hooks/useTaskHooks'
import { TaskCard } from '../../components/shared/TaskCard'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import useUiStore from '../../store/uiStore'
import useTaskStore from '../../store/taskStore'
import type { CreateTaskPayload, Task } from '@/types/models'

const difficultyOptions: { value: NonNullable<CreateTaskPayload['difficulty']>; label: string; hp: number; xp: number }[] = [
  { value: 'easy', label: 'Easy', hp: 50, xp: 25 },
  { value: 'medium', label: 'Medium', hp: 100, xp: 50 },
  { value: 'hard', label: 'Hard', hp: 200, xp: 100 },
  { value: 'boss', label: 'Boss', hp: 500, xp: 250 },
]

const ATTACK_DAMAGE = 25

export function TasksPage() {
  const { data: tasksResponse, isLoading } = useTasks({ limit: 50 })
  const addToast = useUiStore((state) => state.addToast)
  const attackMutation = useAttackMonster()
  const createMutation = useCreateTask()
  const deleteMutation = useDeleteTask()
  const setAttacking = useTaskStore((s) => s.setAttacking)

  const [isCreateOpen, setCreateOpen] = useState(false)
  const [form, setForm] = useState<{ title: string; description: string; difficulty: NonNullable<CreateTaskPayload['difficulty']>; priority: number }>(
    { title: '', description: '', difficulty: 'medium', priority: 1 },
  )

  const allTasks = useMemo<Task[]>(() => tasksResponse?.data ?? [], [tasksResponse])
  const activeTasks = useMemo(() => allTasks.filter((task) => task.status !== 'completed' && task.status !== 'failed'), [allTasks])
  const completedTasks = useMemo(() => allTasks.filter((task) => task.status === 'completed'), [allTasks])

  const resetForm = () => setForm({ title: '', description: '', difficulty: 'medium', priority: 1 })

  const handleCreate = () => {
    if (!form.title.trim()) {
      addToast({ title: 'Name required', description: 'Give your monster a name first.', variant: 'warning' })
      return
    }
    createMutation.mutate(
      { title: form.title.trim(), description: form.description.trim() || undefined, difficulty: form.difficulty, priority: form.priority },
      {
        onSuccess: () => {
          addToast({ title: 'Monster summoned', description: `"${form.title.trim()}" is ready to battle.`, variant: 'success' })
          resetForm()
          setCreateOpen(false)
        },
        onError: () => addToast({ title: 'Could not create task', description: 'Please try again.', variant: 'warning' }),
      },
    )
  }

  const handleAttack = (taskId: string) => {
    setAttacking(taskId)
    attackMutation.mutate(
      { id: taskId, damage: ATTACK_DAMAGE, source: 'manual' },
      {
        onSuccess: (res) => {
          const payload = (res as { data?: { is_dead?: boolean; task_completed?: boolean; xp_earned?: number } })?.data
          if (payload?.is_dead || payload?.task_completed) {
            addToast({ title: 'Monster defeated!', description: `You earned ${payload?.xp_earned ?? 0} XP.`, variant: 'success' })
          } else {
            addToast({ title: 'Hit landed', description: `-${ATTACK_DAMAGE} HP.`, variant: 'info' })
          }
        },
        onError: () => addToast({ title: 'Attack failed', description: 'Try again in a moment.', variant: 'warning' }),
        onSettled: () => setAttacking(null),
      },
    )
  }

  const handleDelete = (taskId: string) => {
    if (!window.confirm('Delete this task and its monster?')) return
    deleteMutation.mutate(taskId, {
      onSuccess: () => addToast({ title: 'Task removed', description: 'The monster fled.', variant: 'info' }),
      onError: () => addToast({ title: 'Delete failed', description: 'Please try again.', variant: 'warning' }),
    })
  }

  return (
    <main className="space-y-8 pb-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-[#17937f]">Monster ledger</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Your active task monsters</h1>
          <p className="mt-2 text-sm text-slate-500">Create a quest, then attack to chip away its HP. Reach 0 HP to defeat it and claim XP.</p>
        </div>
        <Button variant="primary" size="lg" icon={<Plus size={18} />} onClick={() => setCreateOpen(true)}>
          New monster
        </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e6f7f3] text-[#17937f]"><Swords size={20} /></div>
          <div>
            <p className="text-2xl font-semibold text-slate-900">{activeTasks.length}</p>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Active</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-[#f99f1e]"><Trophy size={20} /></div>
          <div>
            <p className="text-2xl font-semibold text-slate-900">{completedTasks.length}</p>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Defeated</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">XP</div>
          <div>
            <p className="text-2xl font-semibold text-slate-900">{completedTasks.reduce((sum, t) => sum + (t.xp_reward ?? 0), 0)}</p>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">XP earned</p>
          </div>
        </Card>
      </div>

      {isLoading ? (
        <Card className="text-center text-slate-500">Loading your monsters...</Card>
      ) : activeTasks.length === 0 ? (
        <Card className="flex flex-col items-center gap-4 py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e6f7f3] text-[#17937f]"><Swords size={28} /></div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">No active monsters</h2>
            <p className="mt-1 text-sm text-slate-500">Summon your first quest to start your adventure.</p>
          </div>
          <Button variant="primary" icon={<Plus size={16} />} onClick={() => setCreateOpen(true)}>Create a monster</Button>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {activeTasks.map((task) => (
            <TaskCard key={task.id} task={task} onAttack={handleAttack} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {completedTasks.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Defeated</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {completedTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-700 line-through">{task.title}</p>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#17937f]">+{task.xp_reward} XP</p>
                </div>
                <button onClick={() => handleDelete(task.id)} aria-label="Delete" className="rounded-full p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCreateOpen(false)}
              className="absolute inset-0"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl z-10"
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Summon a new monster</h2>
                <button onClick={() => setCreateOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <Input
                  label="Quest name"
                  placeholder="e.g. Finish math homework"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  autoFocus
                />
                <Input
                  label="Description (optional)"
                  placeholder="Add a short note"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Difficulty</label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {difficultyOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, difficulty: opt.value }))}
                        className={`rounded-2xl border px-3 py-2 text-center transition ${form.difficulty === opt.value
                          ? 'border-[#17937f] bg-[#e6f7f3] text-[#17937f]'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                          }`}
                      >
                        <span className="block text-sm font-semibold">{opt.label}</span>
                        <span className="block text-[11px] text-slate-400">{opt.hp} HP / {opt.xp} XP</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Priority: {form.priority}</label>
                  <input
                    type="range"
                    min={0}
                    max={5}
                    value={form.priority}
                    onChange={(e) => setForm((f) => ({ ...f, priority: Number(e.target.value) }))}
                    className="w-full accent-[#17937f]"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button variant="primary" icon={<Plus size={16} />} onClick={handleCreate} disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Summoning...' : 'Summon monster'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}

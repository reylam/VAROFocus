import clsx from '../../utils/clsx'

interface ToggleProps {
  label: string
  checked: boolean
  onChange: () => void
}

export function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={clsx(
        'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-200',
        checked ? 'border-primary bg-primary/15 text-primary' : 'border-slate-700 bg-slate-900 text-slate-300',
      )}
    >
      <span>{label}</span>
      <span className={clsx('h-5 w-10 rounded-full transition-all', checked ? 'bg-primary' : 'bg-slate-600')}>
        <span
          className={clsx(
            'block h-4 w-4 rounded-full bg-white shadow-sm transition-transform',
            checked ? 'translate-x-5' : 'translate-x-1',
          )}
        />
      </span>
    </button>
  )
}

import clsx from 'clsx';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className, ...props }: InputProps) => {
  return (
    <label className="block text-sm text-slate-200">
      {label && <span className="mb-2 block font-medium">{label}</span>}
      <input
        className={clsx(
          'w-full rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-sm text-white transition focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20',
          className
        )}
        {...props}
      />
      {error && <span className="mt-2 block text-xs text-red-400">{error}</span>}
    </label>
  );
};

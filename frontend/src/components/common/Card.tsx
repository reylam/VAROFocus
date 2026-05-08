import clsx from 'clsx';
import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export const Card = ({ title, subtitle, children, className }: CardProps) => {
  return (
    <section className={clsx('rounded-3xl border border-slate-700 bg-slate-950/70 p-6 shadow-2xl shadow-slate-950/20', className)}>
      {(title || subtitle) && (
        <div className="mb-5 space-y-1">
          {title && <h2 className="text-xl font-semibold text-white">{title}</h2>}
          {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  );
};

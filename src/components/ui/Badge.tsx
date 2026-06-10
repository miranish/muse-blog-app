import { ReactNode } from 'react';

interface BadgeProps {
  key?: any;
  children: ReactNode;
  variant?: 'amber' | 'slate' | 'outline' | 'lavender';
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Badge({ children, variant = 'slate', interactive = false, onClick, className = '' }: BadgeProps) {
  const baseStyle = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium font-sans tracking-wide transition-all';
  const interactionStyle = interactive ? 'cursor-pointer hover:opacity-85 active:scale-[0.96]' : '';

  const colors = {
    amber: 'bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200 border border-amber-200/50 dark:border-amber-800/20',
    slate: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800/80 dark:text-neutral-200',
    lavender: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300',
    outline: 'border border-neutral-200 text-neutral-600 dark:border-neutral-800 dark:text-neutral-400',
  };

  return (
    <span
      onClick={interactive ? onClick : undefined}
      className={`${baseStyle} ${colors[variant]} ${interactionStyle} ${className}`}
    >
      {children}
    </span>
  );
}

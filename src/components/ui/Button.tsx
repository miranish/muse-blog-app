import { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyle = 'inline-flex items-center justify-center font-sans font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';
    
    // Custom Amber/Editorial theme colors
    const variants = {
      primary: 'bg-amber-400 text-neutral-900 hover:bg-amber-500 focus:ring-amber-500 shadow-sm dark:bg-amber-400 dark:text-neutral-950 dark:hover:bg-amber-300',
      secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700',
      outline: 'bg-transparent text-neutral-800 border border-neutral-300 hover:bg-neutral-50 dark:text-neutral-200 dark:border-neutral-700 dark:hover:bg-neutral-800/50',
      ghost: 'bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800/40 dark:hover:text-neutral-100',
      danger: 'bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-950/65',
    };

    const sizes = {
      sm: 'px-3.5 py-1.5 text-xs tracking-wide',
      md: 'px-5 py-2.5 text-sm tracking-wide',
      lg: 'px-7 py-3 text-base tracking-wide',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

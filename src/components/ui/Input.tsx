import { InputHTMLAttributes, forwardRef, TextareaHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', type = 'text', label, error, helperText, id, ...props }, ref) => {
    return (
      <div className="w-full mb-4">
        {label && (
          <label htmlFor={id} className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1.5 dark:text-neutral-400">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          id={id}
          className={`w-full px-4 py-3 bg-neutral-50 text-neutral-900 border ${
            error ? 'border-rose-400 focus:ring-rose-200' : 'border-neutral-200 focus:ring-amber-200/50 dark:border-neutral-800'
          } rounded-xl font-sans text-sm tracking-wide transition-all outline-none focus:bg-white focus:border-amber-400 focus:ring-4 dark:bg-neutral-900/60 dark:text-neutral-100 dark:focus:bg-neutral-900 dark:focus:border-amber-400/80 ${className}`}
          {...props}
        />
        {error ? (
          <p className="mt-1 text-xs text-rose-500 font-sans">{error}</p>
        ) : (
          helperText && <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500 font-sans">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, helperText, id, rows = 4, ...props }, ref) => {
    return (
      <div className="w-full mb-4">
        {label && (
          <label htmlFor={id} className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1.5 dark:text-neutral-400">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          className={`w-full px-4 py-3 bg-neutral-50 text-neutral-900 border ${
            error ? 'border-rose-400 focus:ring-rose-200' : 'border-neutral-200 focus:ring-amber-200/50 dark:border-neutral-800'
          } rounded-xl font-sans text-sm tracking-wide transition-all outline-none focus:bg-white focus:border-amber-400 focus:ring-4 dark:bg-neutral-900/60 dark:text-neutral-100 dark:focus:bg-neutral-900 dark:focus:border-amber-400/80 ${className}`}
          {...props}
        />
        {error ? (
          <p className="mt-1 text-xs text-rose-500 font-sans">{error}</p>
        ) : (
          helperText && <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500 font-sans">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

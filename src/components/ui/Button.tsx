import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', fullWidth, className, ...rest },
  ref,
) {
  const base =
    'inline-flex items-center justify-center font-extrabold rounded-2xl transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';
  const variants: Record<Variant, string> = {
    primary: 'bg-brand-600 text-white shadow-lg shadow-brand-600/25 hover:bg-brand-700',
    secondary: 'bg-white text-brand-700 border-2 border-brand-200 hover:border-brand-400',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
    danger: 'bg-rose-500 text-white hover:bg-rose-600',
  };
  const sizes: Record<Size, string> = {
    sm: 'h-10 px-4 text-sm',
    md: 'h-12 px-5 text-base',
    lg: 'h-14 px-6 text-lg',
  };
  return (
    <button
      ref={ref}
      className={twMerge(
        clsx(base, variants[variant], sizes[size], fullWidth && 'w-full'),
        className,
      )}
      {...rest}
    />
  );
});

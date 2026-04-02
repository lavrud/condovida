import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cx } from '../../lib/utils';

type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  full?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-stone-900 text-white hover:bg-stone-800 active:bg-stone-950',
  accent:
    'bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-700 hover:to-orange-600 shadow-sm shadow-orange-200',
  secondary: 'bg-stone-100 text-stone-700 hover:bg-stone-200 active:bg-stone-300',
  ghost: 'text-stone-500 hover:text-stone-800 hover:bg-stone-50 active:bg-stone-100',
  danger: 'bg-red-50 text-red-700 hover:bg-red-100 active:bg-red-200',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1',
  md: 'px-4 py-2.5 text-sm gap-1.5',
  lg: 'px-6 py-3 text-sm gap-2',
};

const iconSizes: Record<ButtonSize, number> = { sm: 13, md: 15, lg: 16 };

export function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  full = false,
  loading = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cx(
        'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 select-none',
        variantClasses[variant],
        sizeClasses[size],
        full && 'w-full',
        (disabled || loading) && 'opacity-40 cursor-not-allowed',
        className,
      )}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        Icon && <Icon size={iconSizes[size]} />
      )}
      {children}
    </button>
  );
}

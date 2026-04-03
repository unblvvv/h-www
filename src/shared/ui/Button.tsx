import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl transition-colors duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-[#22C55E] text-white hover:bg-[#16A34A] active:bg-[#15803D]':
              variant === 'primary',
            'bg-white text-[#111827] border-2 border-[#E5E7EB] hover:border-[#D1D5DB] active:border-[#9CA3AF]':
              variant === 'secondary',
            'px-6 py-3': size === 'default',
            'px-8 py-4': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

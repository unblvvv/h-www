import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-xl border-2 transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent',
            error
              ? 'border-[#EF4444] focus:ring-[#EF4444]'
              : 'border-[#E5E7EB] hover:border-[#D1D5DB]',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-[#EF4444]">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

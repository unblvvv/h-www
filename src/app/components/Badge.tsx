import { HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

type BadgeVariant = 'available' | 'in-process' | 'adopted';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant: BadgeVariant;
}

export function Badge({ variant, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-lg',
        {
          'bg-[#D1FAE5] text-[#065F46]': variant === 'available',
          'bg-[#FEF3C7] text-[#92400E]': variant === 'in-process',
          'bg-[#F3F4F6] text-[#6B7280]': variant === 'adopted',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

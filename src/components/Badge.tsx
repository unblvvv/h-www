import { HTMLAttributes } from 'react';
import { cn } from '../shared/utils/cn';
import './Badge.scss';

type BadgeVariant = 'available' | 'in-process' | 'adopted';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant: BadgeVariant;
}

const variantText: Record<BadgeVariant, string> = {
  available: 'Looking for home',
  'in-process': 'In process',
  adopted: 'Adopted',
};

export function Badge({ variant, className, children, ...props }: BadgeProps) {
  return (
    <span className={cn('app-badge', `app-badge--${variant}`, className)} {...props}>
      {children ?? variantText[variant]}
    </span>
  );
}

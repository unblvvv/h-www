import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../shared/utils/cn';
import './Button.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'app-button',
          `app-button--${variant}`,
          size === 'lg' && 'app-button--lg',
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';

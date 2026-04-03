import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../shared/utils/cn';
import './Input.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="app-input-wrap">
        <input
          ref={ref}
          className={cn('app-input', error && 'app-input--error', className)}
          {...props}
        />
        {error ? <p className="app-input-error">{error}</p> : null}
      </div>
    );
  },
);

Input.displayName = 'Input';

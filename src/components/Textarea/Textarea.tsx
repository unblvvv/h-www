import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../shared/utils/cn';
import './Textarea.scss';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="app-textarea-wrap">
        <textarea
          ref={ref}
          className={cn('app-textarea', error && 'app-textarea--error', className)}
          {...props}
        />
        {error ? <p className="app-textarea-error">{error}</p> : null}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

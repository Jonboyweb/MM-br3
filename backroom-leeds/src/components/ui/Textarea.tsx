'use client';

import { forwardRef, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  variant?: 'default' | 'filled' | 'ghost';
  textareaSize?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  resize?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    className,
    label,
    error,
    hint,
    variant = 'default',
    textareaSize = 'md',
    fullWidth = true,
    resize = true,
    disabled,
    placeholder,
    rows = 4,
    ...props
  }, ref) => {
    const baseStyles = 'transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-deco-gold/50 focus:border-deco-gold disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      default: 'bg-speakeasy-charcoal border-speakeasy-ash text-content-primary placeholder:text-content-tertiary hover:border-deco-gold/30 light:bg-daylight-pearl light:border-daylight-sand light:text-content-primary-light',
      filled: 'bg-speakeasy-smoke border-speakeasy-smoke text-content-primary placeholder:text-content-tertiary hover:bg-speakeasy-ash hover:border-speakeasy-ash light:bg-daylight-silk light:border-daylight-silk light:text-content-primary-light',
      ghost: 'bg-transparent border-transparent text-content-primary placeholder:text-content-tertiary hover:bg-speakeasy-smoke hover:border-speakeasy-ash light:hover:bg-daylight-silk'
    };

    const sizes = {
      sm: 'px-3 py-2 text-sm rounded-md',
      md: 'px-4 py-3 text-base rounded-lg',
      lg: 'px-5 py-4 text-lg rounded-lg'
    };

    const containerClasses = cn(
      'relative',
      fullWidth && 'w-full'
    );

    const textareaClasses = cn(
      baseStyles,
      variants[variant],
      sizes[textareaSize],
      !resize && 'resize-none',
      resize && 'resize-y',
      error && 'border-danger focus:border-danger focus:ring-danger/50',
      className
    );

    return (
      <div className={containerClasses}>
        {label && (
          <label className="block text-sm font-medium text-content-primary mb-2">
            {label}
            {props.required && (
              <span className="text-danger ml-1">*</span>
            )}
          </label>
        )}
        
        <div className="relative">
          <textarea
            className={textareaClasses}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            ref={ref}
            {...props}
          />
          
          {error && (
            <div className="absolute top-3 right-3">
              <AlertCircle className="w-5 h-5 text-danger" />
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-danger flex items-center gap-1">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </p>
        )}
        
        {hint && !error && (
          <p className="mt-1 text-sm text-content-tertiary">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
export default Textarea;
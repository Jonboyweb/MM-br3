'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'ghost';
  inputSize?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type,
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    variant = 'default',
    inputSize = 'md',
    fullWidth = true,
    disabled,
    placeholder,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputType = type === 'password' && showPassword ? 'text' : type;

    const baseStyles = 'transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-deco-gold/50 focus:border-deco-gold disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      default: 'bg-speakeasy-charcoal border-speakeasy-ash text-content-primary placeholder:text-content-tertiary hover:border-deco-gold/30 light:bg-daylight-pearl light:border-daylight-sand light:text-content-primary-light',
      filled: 'bg-speakeasy-smoke border-speakeasy-smoke text-content-primary placeholder:text-content-tertiary hover:bg-speakeasy-ash hover:border-speakeasy-ash light:bg-daylight-silk light:border-daylight-silk light:text-content-primary-light',
      ghost: 'bg-transparent border-transparent text-content-primary placeholder:text-content-tertiary hover:bg-speakeasy-smoke hover:border-speakeasy-ash light:hover:bg-daylight-silk'
    };

    const sizes = {
      sm: 'px-3 py-2 text-sm rounded-md min-h-touch',
      md: 'px-4 py-3 text-base rounded-lg min-h-input',
      lg: 'px-5 py-4 text-lg rounded-lg min-h-input'
    };

    const iconSizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    const containerClasses = cn(
      'relative',
      fullWidth && 'w-full'
    );

    const inputClasses = cn(
      baseStyles,
      variants[variant],
      sizes[inputSize],
      leftIcon && 'pl-12',
      (rightIcon || type === 'password') && 'pr-12',
      error && 'border-danger focus:border-danger focus:ring-danger/50',
      className
    );

    const iconBaseClasses = 'absolute top-1/2 transform -translate-y-1/2 text-content-tertiary';
    const leftIconClasses = cn(iconBaseClasses, 'left-3');
    const rightIconClasses = cn(iconBaseClasses, 'right-3');

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
          {leftIcon && (
            <div className={leftIconClasses}>
              <div className={iconSizes[inputSize]}>
                {leftIcon}
              </div>
            </div>
          )}
          
          <input
            type={inputType}
            className={inputClasses}
            placeholder={placeholder}
            disabled={disabled}
            ref={ref}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          
          {type === 'password' && (
            <button
              type="button"
              className={cn(rightIconClasses, 'cursor-pointer hover:text-deco-gold focus-accessible')}
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className={iconSizes[inputSize]} />
              ) : (
                <Eye className={iconSizes[inputSize]} />
              )}
            </button>
          )}
          
          {rightIcon && type !== 'password' && (
            <div className={rightIconClasses}>
              <div className={iconSizes[inputSize]}>
                {rightIcon}
              </div>
            </div>
          )}
          
          {error && (
            <div className={cn(rightIconClasses, type === 'password' ? 'right-12' : 'right-3')}>
              <AlertCircle className={cn(iconSizes[inputSize], 'text-danger')} />
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

Input.displayName = 'Input';

export { Input };
export default Input;
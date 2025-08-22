'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'burgundy' | 'outline' | 'ghost' | 'link' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon';
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    fullWidth = false,
    disabled,
    children,
    ...props 
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus-accessible disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';
    
    const variants = {
      primary: 'cta-primary text-white hover:shadow-elevated',
      secondary: 'bg-speakeasy-charcoal text-content-primary border border-speakeasy-ash hover:bg-speakeasy-smoke hover:border-deco-gold light:bg-daylight-pearl light:text-content-primary-light light:border-daylight-sand light:hover:bg-daylight-silk',
      gold: 'cta-gold text-speakeasy-black hover:shadow-glow-gold',
      burgundy: 'bg-prohibition-burgundy text-white hover:bg-prohibition-wine hover:shadow-glow-burgundy light:bg-prohibition-burgundy-light light:hover:bg-prohibition-wine-light',
      outline: 'border-2 border-deco-gold text-deco-gold bg-transparent hover:bg-deco-gold hover:text-speakeasy-black light:border-deco-gold-dark light:text-deco-gold-dark light:hover:bg-deco-gold-dark light:hover:text-daylight-cream',
      ghost: 'text-content-secondary hover:text-deco-gold hover:bg-speakeasy-smoke light:text-content-secondary-light light:hover:text-deco-gold-dark light:hover:bg-daylight-silk',
      link: 'text-deco-gold underline-offset-4 hover:underline hover:text-deco-champagne light:text-deco-gold-dark light:hover:text-deco-brass-dark',
      danger: 'bg-danger text-white hover:bg-danger/90 hover:shadow-elevated light:bg-danger-light'
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-md min-h-touch',
      md: 'px-4 py-2 text-base rounded-lg min-h-button',
      lg: 'px-6 py-3 text-lg rounded-lg min-h-button',
      xl: 'px-8 py-4 text-xl rounded-xl min-h-button font-headline',
      icon: 'p-2 rounded-lg min-h-touch w-touch h-touch'
    };

    const widthStyles = fullWidth ? 'w-full' : '';

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          widthStyles,
          loading && 'cursor-wait',
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export default Button;
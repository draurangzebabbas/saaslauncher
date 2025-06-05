import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    
    const variants = {
      primary: 'bg-[#007a33] text-white hover:bg-[#006128] focus-visible:ring-[#007a33]',
      secondary: 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300 focus-visible:ring-neutral-400',
      outline: 'border border-neutral-300 bg-transparent hover:bg-neutral-100 focus-visible:ring-neutral-400',
      ghost: 'bg-transparent hover:bg-neutral-100 text-neutral-800 focus-visible:ring-neutral-400',
      link: 'bg-transparent underline-offset-4 hover:underline text-[#007a33] hover:bg-transparent focus:bg-transparent'
    };

    const sizes = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4 py-2',
      lg: 'h-11 px-6 py-3 text-lg'
    };

    return (
      <button
        ref={ref}
        className={twMerge(
          baseStyles,
          variants[variant],
          sizes[size],
          isLoading && 'opacity-70 pointer-events-none',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-800" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
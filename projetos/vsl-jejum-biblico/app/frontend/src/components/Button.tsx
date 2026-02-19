import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading = false, className = '', ...props }, ref) => {
    const baseStyles = 'font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-primary text-white hover:bg-opacity-90',
      secondary: 'bg-secondary text-white hover:bg-opacity-90',
      outline: 'border-2 border-primary text-primary hover:bg-primary hover:bg-opacity-10',
    };

    const sizes = {
      sm: 'px-3 py-2 text-sm min-h-10',
      md: 'px-4 py-2 text-base min-h-11',
      lg: 'px-6 py-3 text-lg min-h-12',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? '...' : props.children}
      </button>
    );
  }
);

Button.displayName = 'Button';

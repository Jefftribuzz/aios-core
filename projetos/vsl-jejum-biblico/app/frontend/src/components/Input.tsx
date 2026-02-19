import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-base min-h-11 ${
            error ? 'border-accent' : ''
          } ${className}`}
          {...props}
        />
        {error && <p className="text-SM text-accent mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

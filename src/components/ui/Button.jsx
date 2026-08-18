import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = React.forwardRef(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium font-sans rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8963C] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-cursor-not-allowed select-none cursor-pointer';

    const variants = {
      primary: 'bg-[#14213D] text-white hover:bg-[#1f3057] active:bg-[#0f192e]',
      accent: 'bg-[#E8963C] text-white hover:bg-[#d6852b] active:bg-[#c47622]',
      secondary: 'bg-[#F4F5F7] text-[#14213D] border border-[#DDE1E7] hover:bg-[#e8ebf0] active:bg-[#dde1e7]',
      outline: 'bg-transparent text-[#14213D] border border-[#DDE1E7] hover:bg-[#F4F5F7] active:bg-[#e8ebf0]',
      danger: 'bg-[#D64545] text-white hover:bg-[#be3a3a] active:bg-[#a63030]',
      ghost: 'bg-transparent text-[#14213D] hover:bg-[#F4F5F7] active:bg-[#e8ebf0]'
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm min-h-[36px]',
      md: 'px-4 py-2 text-base min-h-[44px]',
      lg: 'px-6 py-3 text-base font-semibold min-h-[48px]'
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Processing...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

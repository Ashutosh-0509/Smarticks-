import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Input = React.forwardRef(
  ({ label, error, helperText, mono = false, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[#14213D] font-sans">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={twMerge(
            clsx(
              'w-full px-3.5 py-2.5 bg-white border border-[#DDE1E7] rounded-lg text-base text-[#14213D]',
              'placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8963C] focus-visible:border-[#E8963C]',
              'disabled:bg-[#F4F5F7] disabled:text-gray-500 disabled:cursor-not-allowed',
              mono ? 'font-mono' : 'font-sans',
              error && 'border-[#D64545] focus-visible:ring-[#D64545]',
              className
            )
          )}
          {...props}
        />
        {error ? (
          <span className="text-xs font-medium text-[#D64545]">{error}</span>
        ) : helperText ? (
          <span className="text-xs text-gray-500">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

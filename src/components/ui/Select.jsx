import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Select = React.forwardRef(
  ({ label, options = [], error, helperText, className, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-[#14213D] font-sans">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={twMerge(
              clsx(
                'w-full px-3.5 py-2.5 bg-white border border-[#DDE1E7] rounded-lg text-base text-[#14213D] font-sans appearance-none pr-10',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8963C] focus-visible:border-[#E8963C]',
                'disabled:bg-[#F4F5F7] disabled:text-gray-500 disabled:cursor-not-allowed',
                error && 'border-[#D64545] focus-visible:ring-[#D64545]',
                className
              )
            )}
            {...props}
          >
            {options.map((opt) => (
              <option
                key={typeof opt === 'string' ? opt : opt.value}
                value={typeof opt === 'string' ? opt : opt.value}
              >
                {typeof opt === 'string' ? opt : opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
        {error ? (
          <span className="text-xs font-medium text-[#D64545]">{error}</span>
        ) : helperText ? (
          <span className="text-xs text-gray-500">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';

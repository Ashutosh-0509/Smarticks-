import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Textarea = React.forwardRef(
  ({ label, error, helperText, maxLength, value = '', className, id, onChange, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const charCount = typeof value === 'string' ? value.length : 0;

    return (
      <div className="w-full flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          {label && (
            <label htmlFor={textareaId} className="text-sm font-medium text-[#14213D] font-sans">
              {label}
            </label>
          )}
          {maxLength && (
            <span className="text-xs text-gray-500 font-mono">
              {charCount}/{maxLength}
            </span>
          )}
        </div>
        <textarea
          ref={ref}
          id={textareaId}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          rows={4}
          className={twMerge(
            clsx(
              'w-full px-3.5 py-2.5 bg-white border border-[#DDE1E7] rounded-lg text-base text-[#14213D] font-sans resize-y min-h-[120px]',
              'placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8963C] focus-visible:border-[#E8963C]',
              'disabled:bg-[#F4F5F7] disabled:text-gray-500 disabled:cursor-not-allowed',
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

Textarea.displayName = 'Textarea';

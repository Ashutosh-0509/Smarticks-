import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Badge = ({ children, variant = 'neutral', className, ...props }) => {
  const variants = {
    neutral: 'bg-[#F4F5F7] text-[#14213D] border-[#DDE1E7]',
    high: 'bg-[#D64545]/10 text-[#D64545] border-[#D64545]/20',
    medium: 'bg-[#E8963C]/10 text-[#c27521] border-[#E8963C]/20',
    low: 'bg-[#4A9B6E]/10 text-[#4A9B6E] border-[#4A9B6E]/20',
    dark: 'bg-[#14213D] text-white border-transparent'
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center px-2.5 py-0.5 rounded border text-xs font-mono font-medium tracking-wide',
          variants[variant],
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
};

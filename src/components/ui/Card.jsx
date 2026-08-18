import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'rounded-lg border border-[#DDE1E7] bg-white shadow-sm transition-all',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className, ...props }) => (
  <div className={twMerge(clsx('p-6 pb-4 border-b border-[#DDE1E7]', className))} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className, ...props }) => (
  <h3 className={twMerge(clsx('text-xl font-semibold font-heading text-[#14213D]', className))} {...props}>
    {children}
  </h3>
);

export const CardContent = ({ children, className, ...props }) => (
  <div className={twMerge(clsx('p-6', className))} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className, ...props }) => (
  <div className={twMerge(clsx('p-6 pt-4 border-t border-[#DDE1E7] bg-[#F4F5F7]/50 rounded-b-lg', className))} {...props}>
    {children}
  </div>
);

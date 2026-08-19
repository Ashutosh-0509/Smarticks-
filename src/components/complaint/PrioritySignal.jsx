import React from 'react';

export const PrioritySignal = ({ priority = 'Medium', className = '' }) => {
  const normPriority = (priority || 'Medium').toLowerCase();

  const configs = {
    high: {
      color: '#D64545',
      text: 'HIGH',
      bgClass: 'bg-[#D64545]',
      textClass: 'text-[#D64545]'
    },
    medium: {
      color: '#E8963C',
      text: 'MEDIUM',
      bgClass: 'bg-[#E8963C]',
      textClass: 'text-[#E8963C]'
    },
    low: {
      color: '#4A9B6E',
      text: 'LOW',
      bgClass: 'bg-[#4A9B6E]',
      textClass: 'text-[#4A9B6E]'
    }
  };

  const config = configs[normPriority] || configs.medium;

  return (
    <span className={`inline-flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.05em] px-2.5 py-0.5 rounded border border-gray-200 bg-white ${config.textClass} ${className}`}>
      <span className={`w-2 h-2 rounded-full ${config.bgClass}`} aria-hidden="true" />
      <span>{config.text}</span>
    </span>
  );
};

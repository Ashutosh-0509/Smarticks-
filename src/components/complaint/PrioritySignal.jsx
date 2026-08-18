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
    <span className={`inline-flex items-center gap-1.5 font-mono text-xs font-bold ${className}`}>
      <span className={`w-2.5 h-2.5 rounded-full ${config.bgClass}`} aria-hidden="true" />
      <span className={config.textClass}>{config.text}</span>
    </span>
  );
};

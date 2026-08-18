import React from 'react';

export const StatsCards = ({ stats = {} }) => {
  const items = [
    { label: 'Total complaints', value: stats.total || 0, tag: 'Total' },
    { label: 'High priority', value: stats.high || 0, tag: 'High priority', colorClass: 'text-[#D64545]' },
    { label: 'Needs review', value: stats.needsReview || 0, tag: 'Needs review', colorClass: 'text-[#E8963C]' },
    { label: 'In progress', value: stats.inProgress || 0, tag: 'In progress', colorClass: 'text-[#14213D]' },
    { label: 'Resolved', value: stats.resolved || 0, tag: 'Resolved', colorClass: 'text-[#4A9B6E]' }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-lg border border-[#DDE1E7] bg-white p-4 space-y-1 shadow-sm"
        >
          <span className="text-2xl font-bold font-heading text-[#14213D] block">
            {item.value.toLocaleString()}
          </span>
          <span className={`text-xs font-mono font-medium block ${item.colorClass || 'text-gray-500'}`}>
            {item.tag}
          </span>
        </div>
      ))}
    </div>
  );
};

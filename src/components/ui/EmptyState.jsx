import React from 'react';
import { Inbox } from 'lucide-react';

export const EmptyState = ({
  title = 'No complaints reported yet.',
  description = 'When new civic complaints are logged, they will appear here.',
  action = null
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-lg border border-dashed border-[#DDE1E7] bg-white">
      <div className="p-3 bg-[#F4F5F7] rounded-full text-[#14213D] mb-4">
        <Inbox className="w-8 h-8 stroke-[1.5]" />
      </div>
      <h4 className="text-xl font-semibold font-heading text-[#14213D] mb-2">{title}</h4>
      <p className="text-base text-gray-600 font-sans max-w-md mb-6">{description}</p>
      {action}
    </div>
  );
};

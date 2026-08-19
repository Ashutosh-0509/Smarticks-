import React from 'react';

export const MapLegend = ({ mode = 'pins' }) => {
  return (
    <div className="bg-white border border-[#DDE1E7] rounded-lg p-3 shadow-sm inline-flex items-center gap-4 text-xs font-sans">
      <span className="font-mono text-gray-500 uppercase font-semibold">
        {mode === 'heatmap' ? 'HEATMAP DENSITY:' : 'PRIORITY LEGEND:'}
      </span>

      <div className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-full bg-[#D64545]" />
        <span className="font-mono font-medium text-[#14213D]">HIGH PRIORITY</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-full bg-[#E8963C]" />
        <span className="font-mono font-medium text-[#14213D]">MEDIUM</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-full bg-[#4A9B6E]" />
        <span className="font-mono font-medium text-[#14213D]">LOW</span>
      </div>
    </div>
  );
};

import React from 'react';

export const EvidenceBadge = ({ score, className = '' }) => {
  if (typeof score !== 'number' || score >= 70) {
    return null; // Do not render anything when evidence confidence is normal
  }

  if (score >= 30) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-[#E8963C]/30 bg-[#E8963C]/10 text-[#E8963C] font-mono text-xs font-semibold ${className}`}>
        <span className="w-2 h-2 rounded-full bg-[#E8963C]" />
        NEEDS REVIEW
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-[#D64545]/30 bg-[#D64545]/10 text-[#D64545] font-mono text-xs font-semibold ${className}`}>
      <span className="w-2 h-2 rounded-full bg-[#D64545]" />
      SUSPICIOUS
    </span>
  );
};

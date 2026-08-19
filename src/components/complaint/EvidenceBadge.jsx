import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const EvidenceBadge = ({ score, className = '' }) => {
  if (typeof score !== 'number' || score >= 70) {
    return null; // Do not render anything when evidence confidence is normal
  }

  if (score >= 30) {
    return (
      <span className={`inline-flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.05em] px-2.5 py-0.5 rounded border border-[#E8963C]/30 bg-[#E8963C]/10 text-[#E8963C] ${className}`}>
        <span className="w-2 h-2 rounded-full bg-[#E8963C]" />
        NEEDS REVIEW
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.05em] px-2.5 py-0.5 rounded border border-[#D64545]/30 bg-[#D64545]/10 text-[#D64545] ${className}`}>
      <AlertTriangle className="w-3 h-3" />
      SUSPICIOUS
    </span>
  );
};

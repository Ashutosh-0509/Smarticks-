import React from 'react';
import { Cpu, AlertTriangle, ShieldCheck, Tag } from 'lucide-react';

export const NLPAnalysisBadge = ({ title = '', description = '' }) => {
  const text = `${title} ${description}`.toLowerCase();
  if (text.trim().length < 5) return null;

  let detectedIntent = 'General Civic Issue';
  let severity = 'MEDIUM';
  let color = '#E8963C';
  let urgency = '6.5 / 10';

  if (text.includes('pothole') || text.includes('road') || text.includes('accident') || text.includes('crater')) {
    detectedIntent = 'Road Hazard / Pothole Damage';
    severity = 'HIGH SEVERITY';
    color = '#D64545';
    urgency = '9.2 / 10 (High Risk)';
  } else if (text.includes('water') || text.includes('leak') || text.includes('pipe') || text.includes('burst')) {
    detectedIntent = 'Water Board Pipeline Rupture';
    severity = 'HIGH SEVERITY';
    color = '#D64545';
    urgency = '8.8 / 10 (Urgent)';
  } else if (text.includes('wire') || text.includes('spark') || text.includes('shock') || text.includes('cable')) {
    detectedIntent = 'Electrical Shock Hazard';
    severity = 'CRITICAL SEVERITY';
    color = '#D64545';
    urgency = '9.6 / 10 (Immediate)';
  } else if (text.includes('garbage') || text.includes('trash') || text.includes('dump')) {
    detectedIntent = 'Solid Waste Accumulation';
    severity = 'MEDIUM SEVERITY';
    color = '#E8963C';
    urgency = '6.0 / 10';
  } else if (text.includes('light') || text.includes('dark') || text.includes('lamp')) {
    detectedIntent = 'Street Lighting Outage';
    severity = 'MEDIUM SEVERITY';
    color = '#E8963C';
    urgency = '5.8 / 10';
  }

  return (
    <div className="rounded-lg border border-[#DDE1E7] bg-white p-3.5 space-y-2 shadow-xs font-sans text-xs">
      <div className="flex items-center justify-between border-b border-[#DDE1E7] pb-1.5">
        <span className="font-mono text-xs font-bold text-[#14213D] flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-[#C49A45]" />
          NLP AI TEXT ENTITY SCANNER
        </span>
        <span className="font-mono text-[10px] font-bold text-white px-2 py-0.5 rounded" style={{ backgroundColor: color }}>
          {severity}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
        <div>
          <span className="text-gray-400 block">EXTRACTED ENTITY:</span>
          <span className="font-bold text-[#14213D]">{detectedIntent}</span>
        </div>
        <div>
          <span className="text-gray-400 block">URGENCY RATING:</span>
          <span className="font-bold text-[#14213D]">{urgency}</span>
        </div>
      </div>
    </div>
  );
};

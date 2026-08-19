import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, CircleDot, Circle } from 'lucide-react';

const STAGES = ['Submitted', 'Acknowledged', 'Assigned', 'In Progress', 'Resolved'];

export const StatusTimeline = ({ timeline = [], currentStatus = 'Submitted' }) => {
  const currentIndex = STAGES.indexOf(currentStatus);
  const activeIdx = currentIndex >= 0 ? currentIndex : 0;

  return (
    <div className="w-full space-y-4 py-2">
      <h4 className="text-[11px] font-sans font-semibold uppercase text-gray-500 tracking-[0.05em]">
        STATUS TIMELINE
      </h4>
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-[#DDE1E7]">
        {STAGES.map((stage, idx) => {
          const isCompleted = idx < activeIdx || currentStatus === 'Resolved';
          const isCurrent = idx === activeIdx && currentStatus !== 'Resolved';
          const isUpcoming = idx > activeIdx && currentStatus !== 'Resolved';

          const entry = timeline.find((t) => t.status === stage);

          return (
            <motion.div
              key={stage}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              className="relative flex items-start justify-between gap-4"
            >
              {/* Dot Icon */}
              <div className="absolute -left-6 top-0.5 flex items-center justify-center bg-white rounded-full">
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-[#4A9B6E]" />
                ) : isCurrent ? (
                  <CircleDot className="w-5 h-5 text-[#E8963C] animate-pulse" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300" />
                )}
              </div>

              {/* Title & Info */}
              <div className="flex-1">
                <p className={`text-base font-semibold font-sans ${isUpcoming ? 'text-gray-400' : 'text-[#14213D]'}`}>
                  {stage}
                </p>
                {entry?.note && (
                  <p className="text-sm text-gray-600 mt-0.5 font-sans">{entry.note}</p>
                )}
              </div>

              {/* Timestamp */}
              <div className="text-right whitespace-nowrap pt-0.5">
                {entry?.timestamp ? (
                  <span className="text-[11px] font-sans font-medium text-gray-500 uppercase tracking-wide">
                    {entry.timestamp}
                  </span>
                ) : isUpcoming ? (
                  <span className="text-[11px] font-sans font-medium text-gray-400 uppercase tracking-wide">Pending</span>
                ) : isCurrent ? (
                  <span className="text-[11px] font-sans font-semibold text-[#E8963C] uppercase tracking-wide">Active</span>
                ) : null}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

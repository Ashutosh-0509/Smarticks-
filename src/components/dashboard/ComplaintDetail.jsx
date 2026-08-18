import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Building2, Tag, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PrioritySignal } from '../complaint/PrioritySignal';
import { StatusTimeline } from '../complaint/StatusTimeline';
import { EvidenceBadge } from '../complaint/EvidenceBadge';
import { Button } from '../ui/Button';

export const ComplaintDetail = ({
  complaint,
  isOpen,
  onClose,
  onUpdateStatus
}) => {
  const [selectedStatus, setSelectedStatus] = useState(complaint?.status || 'Submitted');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen || !complaint) return null;

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await onUpdateStatus(complaint.id, selectedStatus);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 bg-[#14213D]/40 backdrop-blur-none"
          onClick={onClose}
        />

        {/* Drawer Container */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-2xl bg-white h-full shadow-xl z-10 flex flex-col border-l border-[#DDE1E7] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#DDE1E7] bg-white flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold text-[#14213D] bg-[#F4F5F7] px-2.5 py-1 rounded border border-[#DDE1E7]">
                  {complaint.id}
                </span>
                <PrioritySignal priority={complaint.priority} />
                <EvidenceBadge score={complaint.evidence_score} />
              </div>
              <h3 className="text-xl font-semibold font-heading text-[#14213D] mt-2">
                {complaint.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-[#F4F5F7] text-gray-500 hover:text-[#14213D]"
              aria-label="Close detail drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Image Preview if available */}
            {complaint.image_url && (
              <div className="w-full h-56 rounded-lg overflow-hidden border border-[#DDE1E7] bg-[#F4F5F7]">
                <img
                  src={complaint.image_url}
                  alt={complaint.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Description */}
            <div className="space-y-1">
              <span className="text-xs font-mono text-gray-500 uppercase">DESCRIPTION</span>
              <p className="text-sm text-gray-700 font-sans leading-relaxed whitespace-pre-wrap">
                {complaint.description}
              </p>
            </div>

            {/* Key Metadata */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-[#F4F5F7] border border-[#DDE1E7]">
              <div>
                <span className="text-xs font-mono text-gray-500 uppercase block mb-0.5">CATEGORY</span>
                <span className="text-sm font-semibold font-sans text-[#14213D]">{complaint.category}</span>
              </div>
              <div>
                <span className="text-xs font-mono text-gray-500 uppercase block mb-0.5">DEPARTMENT</span>
                <span className="text-sm font-semibold font-sans text-[#14213D]">{complaint.department_name}</span>
              </div>
              <div className="col-span-2">
                <span className="text-xs font-mono text-gray-500 uppercase block mb-0.5">LOCATION</span>
                <span className="text-sm font-semibold font-sans text-[#14213D] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#E8963C]" />
                  {complaint.location}
                </span>
              </div>
            </div>

            {/* Staff Only AI Analysis Breakdown */}
            <div className="rounded-lg border border-[#DDE1E7] p-4 bg-white space-y-3">
              <div className="flex items-center justify-between border-b border-[#DDE1E7] pb-2">
                <span className="text-xs font-mono font-semibold text-[#14213D] uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#4A9B6E]" />
                  AI CLASSIFICATION DETAILS (STAFF ONLY)
                </span>
                <span className="text-xs font-mono text-gray-500">
                  Confidence: {Math.round((complaint.ai_confidence || 0.9) * 100)}%
                </span>
              </div>
              <div>
                <span className="text-xs font-mono text-gray-500 uppercase block">SUMMARY</span>
                <p className="text-xs text-gray-700 font-sans mt-0.5">{complaint.ai_summary}</p>
              </div>
              <div>
                <span className="text-xs font-mono text-gray-500 uppercase block">REASONING</span>
                <p className="text-xs text-gray-600 font-sans mt-0.5">{complaint.ai_reasoning}</p>
              </div>
              <div className="pt-2 border-t border-[#DDE1E7] flex items-center justify-between text-xs font-mono">
                <span>EVIDENCE INTEGRITY SCORE:</span>
                <span className="font-bold text-[#14213D]">{complaint.evidence_score}/100</span>
              </div>
              {complaint.evidence_flags?.length > 0 && (
                <div className="p-2 bg-[#E8963C]/10 rounded border border-[#E8963C]/20 text-xs font-sans text-[#E8963C]">
                  ⚠️ Flags: {complaint.evidence_flags.join(', ')}
                </div>
              )}
            </div>

            {/* Staff Status Control */}
            <div className="p-4 rounded-lg border border-[#DDE1E7] bg-white space-y-3">
              <h4 className="text-sm font-semibold font-heading text-[#14213D] uppercase tracking-wider">
                MUNICIPAL STATUS CONTROL
              </h4>
              <form onSubmit={handleStatusSubmit} className="flex items-center gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm bg-white border border-[#DDE1E7] rounded-lg font-sans text-[#14213D] focus-visible:ring-2 focus-visible:ring-[#E8963C]"
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Acknowledged">Acknowledged</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isUpdating}
                  className="whitespace-nowrap"
                >
                  Update Status
                </Button>
              </form>
            </div>

            {/* Timeline */}
            <div className="border-t border-[#DDE1E7] pt-4">
              <StatusTimeline timeline={complaint.timeline} currentStatus={complaint.status} />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

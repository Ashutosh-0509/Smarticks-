import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, Edit3, ArrowRight } from 'lucide-react';
import { PrioritySignal } from './PrioritySignal';
import { MOCK_CATEGORIES, MOCK_DEPARTMENTS } from '../../data/mockComplaints';

const LOADING_STEPS = [
  'Understanding the issue...',
  'Checking the category...',
  'Finding the right department...'
];

export const AIAnalysisCard = ({
  isAnalyzing,
  aiResult,
  onConfirm,
  onEditToggle,
  onPhotoRetry,
  onContinueWithoutPhoto
}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCategory, setEditedCategory] = useState(aiResult?.category || 'Pothole');
  const [editedPriority, setEditedPriority] = useState(aiResult?.priority || 'High');
  const [editedDeptId, setEditedDeptId] = useState(aiResult?.department_id || 'dept-roads');

  useEffect(() => {
    if (isAnalyzing) {
      setStepIndex(0);
      const timer1 = setTimeout(() => setStepIndex(1), 400);
      const timer2 = setTimeout(() => setStepIndex(2), 800);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isAnalyzing]);

  useEffect(() => {
    if (aiResult) {
      setEditedCategory(aiResult.category);
      setEditedPriority(aiResult.priority);
      setEditedDeptId(aiResult.department_id);
    }
  }, [aiResult]);

  // Handle progressive loading
  if (isAnalyzing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="rounded-lg border border-[#DDE1E7] bg-white p-6 shadow-sm space-y-4 text-center"
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#DDE1E7] border-t-[#14213D] rounded-full animate-spin" />
          <h4 className="text-lg font-semibold font-heading text-[#14213D]">
            Analyzing your complaint...
          </h4>
          <AnimatePresence mode="wait">
            <motion.p
              key={stepIndex}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-sans text-gray-600 bg-[#F4F5F7] px-3 py-1.5 rounded-md border border-[#DDE1E7]"
            >
              {LOADING_STEPS[stepIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  if (!aiResult) return null;

  // Handle potential evidence photo mismatch fallback UI
  const isPhotoMismatch = aiResult.evidence_score < 30 && aiResult.evidence_flags?.length > 0;

  if (isPhotoMismatch) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-[#E8963C] bg-white p-6 shadow-sm space-y-4"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-[#E8963C] flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-base font-semibold font-heading text-[#14213D]">
              We couldn't confidently match the photo to the reported issue.
            </h4>
            <p className="text-sm text-gray-600 font-sans">
              The photo provided may not clearly show the details of the problem. You can try uploading another photo or continue without one.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onPhotoRetry}
            className="w-full sm:w-auto px-4 py-2 bg-[#14213D] text-white text-sm font-medium rounded-lg hover:bg-[#1f3057]"
          >
            Try another photo
          </button>
          <button
            type="button"
            onClick={onContinueWithoutPhoto}
            className="w-full sm:w-auto px-4 py-2 bg-[#F4F5F7] border border-[#DDE1E7] text-[#14213D] text-sm font-medium rounded-lg hover:bg-[#e8ebf0]"
          >
            Continue without photo
          </button>
        </div>
      </motion.div>
    );
  }

  const currentDeptName =
    MOCK_DEPARTMENTS.find((d) => d.id === editedDeptId)?.name || aiResult.department_name;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-lg border border-[#DDE1E7] bg-white p-6 shadow-sm space-y-6"
    >
      {/* Top Banner Notice */}
      <div className="p-4 bg-[#F4F5F7] rounded-md border border-[#DDE1E7]">
        <p className="text-sm font-sans text-[#14213D] font-medium leading-relaxed">
          We think this is a <span className="font-semibold text-[#14213D]">{editedCategory}</span>,{' '}
          <span className="font-semibold text-[#14213D]">{editedPriority.toLowerCase()} priority</span>, going to{' '}
          <span className="font-semibold text-[#14213D]">{currentDeptName}</span>.
        </p>
      </div>

      {/* Main AI Classification Attributes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Category */}
        <div className="p-3 rounded-lg border border-[#DDE1E7] bg-white">
          <span className="text-xs font-mono text-gray-500 uppercase block mb-1">CATEGORY</span>
          {isEditing ? (
            <select
              value={editedCategory}
              onChange={(e) => setEditedCategory(e.target.value)}
              className="w-full px-2 py-1 text-sm bg-white border border-[#DDE1E7] rounded focus-visible:ring-1 focus-visible:ring-[#E8963C]"
            >
              {MOCK_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-base font-semibold font-sans text-[#14213D]">
              {editedCategory}
            </span>
          )}
        </div>

        {/* Priority */}
        <div className="p-3 rounded-lg border border-[#DDE1E7] bg-white">
          <span className="text-xs font-mono text-gray-500 uppercase block mb-1">PRIORITY</span>
          {isEditing ? (
            <select
              value={editedPriority}
              onChange={(e) => setEditedPriority(e.target.value)}
              className="w-full px-2 py-1 text-sm bg-white border border-[#DDE1E7] rounded focus-visible:ring-1 focus-visible:ring-[#E8963C]"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          ) : (
            <PrioritySignal priority={editedPriority} />
          )}
        </div>

        {/* Department */}
        <div className="p-3 rounded-lg border border-[#DDE1E7] bg-white">
          <span className="text-xs font-mono text-gray-500 uppercase block mb-1">DEPARTMENT</span>
          {isEditing ? (
            <select
              value={editedDeptId}
              onChange={(e) => setEditedDeptId(e.target.value)}
              className="w-full px-2 py-1 text-sm bg-white border border-[#DDE1E7] rounded focus-visible:ring-1 focus-visible:ring-[#E8963C]"
            >
              {MOCK_DEPARTMENTS.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-sm font-semibold font-sans text-[#14213D]">
              {currentDeptName}
            </span>
          )}
        </div>
      </div>

      {/* AI Explanation Section */}
      <div className="space-y-3 pt-2 border-t border-[#DDE1E7]">
        <div>
          <span className="text-xs font-mono text-gray-500 uppercase block mb-1">AI SUMMARY</span>
          <p className="text-sm text-gray-700 font-sans leading-relaxed">{aiResult.ai_summary}</p>
        </div>

        <div>
          <span className="text-xs font-mono text-gray-500 uppercase block mb-1">AI REASONING</span>
          <p className="text-xs text-gray-600 font-sans leading-relaxed">{aiResult.ai_reasoning}</p>
        </div>
      </div>

      {/* Confirmation & Actions */}
      <div className="pt-4 border-t border-[#DDE1E7] flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm font-medium font-sans text-[#14213D]">Does that look right?</p>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="flex-1 sm:flex-initial px-3.5 py-2 bg-white border border-[#DDE1E7] text-[#14213D] text-sm font-medium rounded-lg hover:bg-[#F4F5F7] flex items-center justify-center gap-1.5"
          >
            <Edit3 className="w-4 h-4" />
            {isEditing ? 'Done Editing' : 'Edit'}
          </button>

          <button
            type="button"
            onClick={() =>
              onConfirm({
                category: editedCategory,
                priority: editedPriority,
                department_id: editedDeptId,
                department_name: currentDeptName
              })
            }
            className="flex-1 sm:flex-initial px-4 py-2 bg-[#14213D] text-white text-sm font-medium rounded-lg hover:bg-[#1f3057] flex items-center justify-center gap-2"
          >
            <span>Proceed to Review</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

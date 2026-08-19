import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, Edit3, ArrowRight } from 'lucide-react';
import { PrioritySignal } from './PrioritySignal';
import { MOCK_CATEGORIES, MOCK_DEPARTMENTS } from '../../data/mockComplaints';

export const AIAnalysisCard = ({
  isAnalyzing,
  aiResult,
  onConfirm,
  onEditToggle,
  onPhotoRetry,
  onContinueWithoutPhoto
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCategory, setEditedCategory] = useState(aiResult?.category || 'Pothole');
  const [editedPriority, setEditedPriority] = useState(aiResult?.priority || 'High');
  const [editedDeptId, setEditedDeptId] = useState(aiResult?.department_id || 'dept-roads');

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
      <div className="space-y-4 text-center py-10">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-8 h-8 border-4 border-[var(--border-color)] border-t-[var(--ink)] rounded-full animate-spin" />
          <div>
            <h4 className="text-lg font-semibold font-heading text-[var(--ink)]">
              Analyzing complaint...
            </h4>
            <p className="text-sm font-sans text-gray-500 mt-1">
              Classifying issue and determining department routing
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!aiResult) return null;

  // Handle potential evidence photo mismatch fallback UI
  const isPhotoMismatch = aiResult.evidence_score < 30 && aiResult.evidence_flags?.length > 0;

  if (isPhotoMismatch) {
    return (
      <div className="rounded border border-[#E8963C] bg-orange-50/50 p-6 space-y-4">
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
            className="w-full sm:w-auto px-4 py-2 bg-[var(--ink)] text-white text-sm font-medium rounded hover:bg-black cursor-pointer"
          >
            Try another photo
          </button>
          <button
            type="button"
            onClick={onContinueWithoutPhoto}
            className="w-full sm:w-auto px-4 py-2 bg-[var(--surface)] border border-[var(--border-color)] text-[var(--ink)] text-sm font-medium rounded hover:bg-gray-200 cursor-pointer"
          >
            Continue without photo
          </button>
        </div>
      </div>
    );
  }

  const currentDeptName =
    MOCK_DEPARTMENTS.find((d) => d.id === editedDeptId)?.name || aiResult.department_name;

  return (
    <div className="space-y-6 pt-2">
      {/* Top Banner Notice */}
      <div className="p-4 bg-[var(--surface)] rounded border border-[var(--border-color)]">
        <p className="text-sm font-sans text-[var(--ink)] font-medium leading-relaxed">
          We think this is a <span className="font-semibold">{editedCategory}</span>,{' '}
          <span className="font-semibold">{editedPriority.toLowerCase()} priority</span>, going to{' '}
          <span className="font-semibold">{currentDeptName}</span>.
        </p>
      </div>

      {/* Main AI Classification Attributes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Category */}
        <div className="p-3 rounded border border-[var(--border-color)] bg-[var(--surface-card)]">
          <span className="text-xs font-mono text-gray-500 uppercase block mb-1">CATEGORY</span>
          {isEditing ? (
            <select
              value={editedCategory}
              onChange={(e) => setEditedCategory(e.target.value)}
              className="w-full px-2 py-1 text-sm bg-white border border-[var(--border-color)] rounded focus-visible:ring-1 focus-visible:ring-[var(--accent)]"
            >
              {MOCK_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-base font-semibold font-sans text-[var(--ink)]">
              {editedCategory}
            </span>
          )}
        </div>

        {/* Priority */}
        <div className="p-3 rounded border border-[var(--border-color)] bg-[var(--surface-card)]">
          <span className="text-xs font-mono text-gray-500 uppercase block mb-1">PRIORITY</span>
          {isEditing ? (
            <select
              value={editedPriority}
              onChange={(e) => setEditedPriority(e.target.value)}
              className="w-full px-2 py-1 text-sm bg-white border border-[var(--border-color)] rounded focus-visible:ring-1 focus-visible:ring-[var(--accent)]"
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
        <div className="p-3 rounded border border-[var(--border-color)] bg-[var(--surface-card)]">
          <span className="text-xs font-mono text-gray-500 uppercase block mb-1">DEPARTMENT</span>
          {isEditing ? (
            <select
              value={editedDeptId}
              onChange={(e) => setEditedDeptId(e.target.value)}
              className="w-full px-2 py-1 text-sm bg-white border border-[var(--border-color)] rounded focus-visible:ring-1 focus-visible:ring-[var(--accent)]"
            >
              {MOCK_DEPARTMENTS.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-sm font-semibold font-sans text-[var(--ink)]">
              {currentDeptName}
            </span>
          )}
        </div>
      </div>

      {/* AI Explanation Section */}
      <div className="space-y-3 pt-2 border-t border-[var(--border-color)] mt-4">
        <div className="mt-4">
          <span className="text-xs font-mono text-gray-500 uppercase block mb-1">AI SUMMARY</span>
          <p className="text-sm text-gray-700 font-sans leading-relaxed">{aiResult.ai_summary}</p>
        </div>

        <div>
          <span className="text-xs font-mono text-gray-500 uppercase block mb-1">AI REASONING</span>
          <p className="text-xs text-gray-600 font-sans leading-relaxed">{aiResult.ai_reasoning}</p>
        </div>
      </div>

      {/* Confirmation & Actions */}
      <div className="pt-4 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm font-medium font-sans text-[var(--ink)]">Does that look right?</p>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="flex-1 sm:flex-initial px-3.5 py-2 bg-white border border-[var(--border-color)] text-[var(--ink)] text-sm font-medium rounded hover:bg-[var(--surface)] flex items-center justify-center gap-1.5 cursor-pointer"
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
            className="flex-1 sm:flex-initial px-4 py-2 bg-[var(--ink)] text-white text-sm font-medium rounded hover:bg-black flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to Review</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

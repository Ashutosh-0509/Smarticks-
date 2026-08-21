import React, { useState, useEffect } from 'react';
import { Edit3, ArrowRight } from 'lucide-react';
import { PrioritySignal } from './PrioritySignal';
import { MOCK_CATEGORIES, MOCK_DEPARTMENTS } from '../../data/mockComplaints';
import { useLanguage } from '../../context/LanguageContext';

export const AIAnalysisCard = ({
  isAnalyzing,
  aiResult,
  onConfirm
}) => {
  const { t } = useLanguage();
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
      <div className="space-y-4 text-center py-10 font-sans">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-8 h-8 border-4 border-[var(--border-color)] border-t-[var(--ink)] rounded-full animate-spin" />
          <div>
            <h4 className="text-lg font-semibold font-heading text-[var(--ink)]">
              {t('ai.analyzing')}
            </h4>
            <p className="text-sm font-sans text-gray-500 mt-1">
              {t('ai.classifying')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!aiResult) return null;

  const currentDeptName =
    MOCK_DEPARTMENTS.find((d) => d.id === editedDeptId)?.name || aiResult.department_name;

  return (
    <div className="space-y-6 pt-2 font-sans">
      {/* Top Banner Notice */}
      <div className="p-4 bg-[var(--surface)] rounded border border-[var(--border-color)]">
        <p className="text-sm font-sans text-[var(--ink)] font-medium leading-relaxed">
          {t('ai.thinksPre')} <span className="font-semibold">{editedCategory}</span>,{' '}
          <span className="font-semibold">{editedPriority.toLowerCase()}</span> {t('ai.thinksPost')}{' '}
          <span className="font-semibold">{currentDeptName}</span>.
        </p>
      </div>

      {/* Main AI Classification Attributes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Category */}
        <div className="p-3 rounded border border-[var(--border-color)] bg-[var(--surface-card)]">
          <span className="text-xs font-mono text-gray-500 uppercase block mb-1">{t('ai.categoryLabel')}</span>
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
          <span className="text-xs font-mono text-gray-500 uppercase block mb-1">{t('ai.priorityLabel')}</span>
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
          <span className="text-xs font-mono text-gray-500 uppercase block mb-1">{t('ai.departmentLabel')}</span>
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
          <span className="text-xs font-mono text-gray-500 uppercase block mb-1">{t('ai.aiSummaryLabel')}</span>
          <p className="text-sm text-gray-700 font-sans leading-relaxed">{aiResult.ai_summary}</p>
        </div>

        <div>
          <span className="text-xs font-mono text-gray-500 uppercase block mb-1">{t('ai.aiReasoningLabel')}</span>
          <p className="text-xs text-gray-600 font-sans leading-relaxed">{aiResult.ai_reasoning}</p>
        </div>
      </div>

      {/* Confirmation & Actions */}
      <div className="pt-4 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm font-medium font-sans text-[var(--ink)]">{t('ai.looksRight')}</p>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="flex-1 sm:flex-initial px-3.5 py-2 bg-white border border-[var(--border-color)] text-[var(--ink)] text-sm font-medium rounded hover:bg-[var(--surface)] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            {isEditing ? t('ai.doneEditing') : t('ai.edit')}
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
            <span>{t('ai.proceedReview')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

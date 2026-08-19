import React from 'react';
import { PrioritySignal } from './PrioritySignal';
import { Button } from '../ui/Button';
import { ShieldCheck, MapPin, Building2, Tag, FileText } from 'lucide-react';

export const ComplaintReview = ({
  formData,
  aiData,
  onFinalSubmit,
  onEdit,
  isSubmitting
}) => {
  return (
    <div className="space-y-6 pt-2">
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
        <div>
          <span className="text-xs font-mono font-medium text-[#4A9B6E] uppercase tracking-wider block">
            PRE-SUBMISSION VERIFICATION
          </span>
          <h3 className="text-xl font-semibold font-heading text-[var(--ink)]">
            Review your report
          </h3>
        </div>
        <div className="p-2 bg-[var(--surface)] rounded-md text-[var(--ink)]">
          <ShieldCheck className="w-5 h-5 text-[#4A9B6E]" />
        </div>
      </div>

      {/* Explicit submission reminder */}
      <div className="p-3 bg-[var(--surface)] rounded-md border border-[var(--border-color)] text-xs font-sans text-gray-600">
        ℹ️ <span className="font-semibold text-[var(--ink)]">Nothing has been submitted yet.</span> Review the details below before sending to municipal dispatch.
      </div>

      {/* Summary Grid */}
      <div className="space-y-4">
        {/* Title */}
        <div className="space-y-1">
          <span className="text-xs font-mono text-gray-500 uppercase">ISSUE TITLE</span>
          <p className="text-base font-semibold font-sans text-[var(--ink)]">{formData.title}</p>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <span className="text-xs font-mono text-gray-500 uppercase">DESCRIPTION</span>
          <p className="text-sm text-gray-700 font-sans leading-relaxed whitespace-pre-wrap">
            {formData.description}
          </p>
        </div>

        {/* Photo Preview if uploaded */}
        {formData.image_url && (
          <div className="space-y-1">
            <span className="text-xs font-mono text-gray-500 uppercase">ATTACHED PHOTO</span>
            <div className="w-full h-40 rounded-lg overflow-hidden border border-[var(--border-color)] bg-[var(--surface)]">
              <img src={formData.image_url} alt="Attached photo" className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        {/* Categorization & Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-gray-400" />
            <div>
              <span className="text-xs font-mono text-gray-500 uppercase block">CATEGORY</span>
              <span className="text-sm font-semibold font-sans text-[var(--ink)]">{aiData.category}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-500 uppercase block">PRIORITY</span>
            <PrioritySignal priority={aiData.priority} />
          </div>

          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gray-400" />
            <div>
              <span className="text-xs font-mono text-gray-500 uppercase block">DEPARTMENT</span>
              <span className="text-sm font-semibold font-sans text-[var(--ink)]">{aiData.department_name}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <div>
              <span className="text-xs font-mono text-gray-500 uppercase block">LOCATION</span>
              <span className="text-sm font-semibold font-sans text-[var(--ink)]">{formData.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onEdit}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          Edit report
        </Button>

        <Button
          type="button"
          variant="primary"
          onClick={onFinalSubmit}
          isLoading={isSubmitting}
          className="w-full sm:w-auto font-bold bg-[var(--ink)] hover:bg-black"
        >
          Report this issue
        </Button>
      </div>
    </div>
  );
};

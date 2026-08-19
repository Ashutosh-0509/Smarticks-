import React from 'react';
import { MessageSquareWarning } from 'lucide-react';

export const SiteFeedbackPage = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pt-4 px-4 sm:px-0">
      <div className="space-y-1">
        <span className="text-[11px] font-sans font-semibold text-[var(--accent)] uppercase tracking-[0.05em] block mb-1">
          TECHNICAL SUPPORT
        </span>
        <h1 className="text-3xl font-bold font-heading text-[var(--ink)]">Report a Website Issue</h1>
      </div>

      <div className="rounded-lg border border-[var(--border-color)] bg-white p-6 sm:p-8 shadow-sm space-y-6 text-[var(--ink)] font-sans">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <MessageSquareWarning className="w-8 h-8 text-[#D64545] flex-shrink-0" />
          <div className="space-y-4 w-full">
            <h2 className="text-xl font-bold font-heading">Experiencing technical difficulties?</h2>
            <p className="text-sm leading-relaxed text-gray-700">
              Use this form strictly to report technical bugs, broken links, or accessibility issues related to the CivicReport website itself. 
              <strong> Do not use this form to report civic hazards like potholes or broken streetlights.</strong>
            </p>

            <form className="mt-6 space-y-4 border-t border-[var(--border-color)] pt-6">
              <div>
                <label className="block text-[11px] font-sans font-semibold text-gray-500 uppercase tracking-[0.05em] mb-1">
                  Issue Type
                </label>
                <select className="w-full px-3 py-2 text-sm bg-white border border-[var(--border-color)] rounded focus-visible:ring-1 focus-visible:ring-[var(--accent)]">
                  <option>Broken Link or Page Not Found</option>
                  <option>Accessibility Barrier</option>
                  <option>Form Submission Error</option>
                  <option>Display/Layout Issue</option>
                  <option>Other Technical Bug</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-sans font-semibold text-gray-500 uppercase tracking-[0.05em] mb-1">
                  Description of the Issue
                </label>
                <textarea 
                  rows={4} 
                  className="w-full px-3 py-2 text-sm bg-white border border-[var(--border-color)] rounded focus-visible:ring-1 focus-visible:ring-[var(--accent)]"
                  placeholder="Please describe what you were trying to do and what went wrong..."
                />
              </div>

              <button 
                type="button" 
                className="px-5 py-2.5 bg-[#14213D] hover:bg-[#0B1221] text-white text-sm font-semibold rounded font-sans transition-colors"
                onClick={() => alert("Thank you for your feedback! Our IT team has been notified.")}
              >
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

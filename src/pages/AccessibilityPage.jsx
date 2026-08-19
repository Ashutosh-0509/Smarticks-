import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const AccessibilityPage = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pt-4 px-4 sm:px-0">
      <div className="space-y-1">
        <span className="text-[11px] font-sans font-semibold text-[var(--accent)] uppercase tracking-[0.05em] block mb-1">
          COMPLIANCE
        </span>
        <h1 className="text-3xl font-bold font-heading text-[var(--ink)]">Accessibility Statement</h1>
      </div>

      <div className="rounded-lg border border-[var(--border-color)] bg-white p-6 sm:p-8 shadow-sm space-y-6 text-[var(--ink)] font-sans">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <ShieldCheck className="w-8 h-8 text-[#4A9B6E] flex-shrink-0" />
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-heading">Our Commitment to Accessibility</h2>
            <p className="text-sm leading-relaxed text-gray-700">
              The Government of [Municipality Name] is committed to making its electronic and information technologies accessible to individuals with disabilities. We are actively working to increase the accessibility and usability of the CivicReport portal and, in doing so, adhere to many of the available standards and guidelines.
            </p>
            <p className="text-sm leading-relaxed text-gray-700">
              This application endeavors to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA as well as the Guidelines for Indian Government Websites (GIGW 3.0). These guidelines explain how to make web content more accessible for people with disabilities. Conformance with these guidelines will help make the web more user-friendly for all people.
            </p>
            
            <div className="mt-6 pt-6 border-t border-[var(--border-color)]">
              <h3 className="text-md font-bold font-heading mb-2">Reporting an Issue</h3>
              <p className="text-sm leading-relaxed text-gray-700 mb-2">
                If you encounter any difficulty using this portal, please contact our IT department or use the primary feedback form to report an accessibility barrier.
              </p>
              <ul className="text-[11px] font-sans font-semibold uppercase tracking-wide text-gray-600 space-y-1">
                <li>Email: <a href="mailto:support@civicreport.gov" className="text-[var(--accent)] hover:underline">support@civicreport.gov</a></li>
                <li>Phone: 1916 / 1070</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

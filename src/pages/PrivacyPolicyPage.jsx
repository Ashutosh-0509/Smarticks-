import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pt-4 px-4 sm:px-0">
      <div className="space-y-1">
        <span className="text-[11px] font-sans font-semibold text-[var(--accent)] uppercase tracking-[0.05em] block mb-1">
          COMPLIANCE & LEGAL
        </span>
        <h1 className="text-3xl font-bold font-heading text-[var(--ink)]">Privacy Policy</h1>
      </div>

      <div className="rounded-lg border border-[var(--border-color)] bg-white p-6 sm:p-8 shadow-sm space-y-6 text-[var(--ink)] font-sans">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <Lock className="w-8 h-8 text-[#E8963C] flex-shrink-0" />
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-heading">Data Collection and Usage</h2>
            <p className="text-sm leading-relaxed text-gray-700">
              The Government of [Municipality Name] values your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and protect the information you provide when using the CivicReport portal.
            </p>
            <p className="text-sm leading-relaxed text-gray-700">
              When you submit a civic issue, we may collect basic contact information (such as your phone number or email) to provide updates on your report's status. Location data is collected strictly to identify the location of the reported hazard or issue.
            </p>
            
            <h2 className="text-xl font-bold font-heading mt-6">Data Sharing</h2>
            <p className="text-sm leading-relaxed text-gray-700">
              Your personal information is never sold to third parties. It is strictly shared with relevant municipal departments and authorized contractors solely for the purpose of resolving the reported civic issues.
            </p>

            <div className="mt-6 pt-6 border-t border-[var(--border-color)]">
              <h3 className="text-md font-bold font-heading mb-2">Contact the Data Protection Officer</h3>
              <p className="text-sm leading-relaxed text-gray-700 mb-2">
                If you have questions regarding our privacy practices or wish to request data deletion, please contact our data protection office.
              </p>
              <ul className="text-[11px] font-sans font-semibold uppercase tracking-wide text-gray-600 space-y-1">
                <li>Email: privacy@civicreport.gov</li>
                <li>Phone: 1916 / 1070</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

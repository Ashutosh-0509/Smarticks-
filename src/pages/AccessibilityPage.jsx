import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AccessibilityPage = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto space-y-6 pt-4 px-4 sm:px-0">
      <div className="space-y-1">
        <span className="text-[11px] font-sans font-semibold text-[var(--accent)] uppercase tracking-[0.05em] block mb-1">
          {t('accessibility.badge')}
        </span>
        <h1 className="text-3xl font-bold font-heading text-[var(--ink)]">{t('accessibility.title')}</h1>
      </div>

      <div className="rounded-lg border border-[var(--border-color)] bg-white p-6 sm:p-8 shadow-sm space-y-6 text-[var(--ink)] font-sans">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <ShieldCheck className="w-8 h-8 text-[#4A9B6E] flex-shrink-0" />
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-heading">{t('accessibility.commitment')}</h2>
            <p className="text-sm leading-relaxed text-gray-700">
              {t('accessibility.desc1')}
            </p>
            <p className="text-sm leading-relaxed text-gray-700">
              {t('accessibility.desc2')}
            </p>
            
            <div className="mt-6 pt-6 border-t border-[var(--border-color)]">
              <h3 className="text-md font-bold font-heading mb-2">{t('accessibility.reportingTitle')}</h3>
              <p className="text-sm leading-relaxed text-gray-700 mb-2">
                {t('accessibility.reportingDesc')}
              </p>
              <ul className="text-[11px] font-sans font-semibold uppercase tracking-wide text-gray-600 space-y-1">
                <li><a href="mailto:support@civicreport.gov.in" className="text-[var(--accent)] hover:underline">{t('accessibility.email')}</a></li>
                <li>{t('accessibility.phone')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


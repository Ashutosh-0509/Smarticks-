import React from 'react';
import { Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const PrivacyPolicyPage = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto space-y-6 pt-4 px-4 sm:px-0">
      <div className="space-y-1">
        <span className="text-[11px] font-sans font-semibold text-[var(--accent)] uppercase tracking-[0.05em] block mb-1">
          {t('privacy.badge')}
        </span>
        <h1 className="text-3xl font-bold font-heading text-[var(--ink)]">{t('privacy.title')}</h1>
      </div>

      <div className="rounded-lg border border-[var(--border-color)] bg-white p-6 sm:p-8 shadow-sm space-y-6 text-[var(--ink)] font-sans">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <Lock className="w-8 h-8 text-[#E8963C] flex-shrink-0" />
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-heading">{t('privacy.dataTitle')}</h2>
            <p className="text-sm leading-relaxed text-gray-700">
              {t('privacy.dataDesc1')}
            </p>
            <p className="text-sm leading-relaxed text-gray-700">
              {t('privacy.dataDesc2')}
            </p>
            
            <h2 className="text-xl font-bold font-heading mt-6">{t('privacy.sharingTitle')}</h2>
            <p className="text-sm leading-relaxed text-gray-700">
              {t('privacy.sharingDesc')}
            </p>

            <div className="mt-6 pt-6 border-t border-[var(--border-color)]">
              <h3 className="text-md font-bold font-heading mb-2">{t('privacy.officerTitle')}</h3>
              <p className="text-sm leading-relaxed text-gray-700 mb-2">
                {t('privacy.officerDesc')}
              </p>
              <ul className="text-[11px] font-sans font-semibold uppercase tracking-wide text-gray-600 space-y-1">
                <li>{t('privacy.email')}</li>
                <li>{t('privacy.phone')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


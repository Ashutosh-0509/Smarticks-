import React, { useState } from 'react';
import { MessageSquare, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const SiteFeedbackPage = () => {
  const { t } = useLanguage();
  const [feedbackType, setFeedbackType] = useState('general');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setError(t('feedback.descLabel') + ' is required.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  const handleReset = () => {
    setDescription('');
    setEmail('');
    setFeedbackType('general');
    setSubmitted(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pt-4 px-4 sm:px-0 font-sans">
      <div className="space-y-1">
        <span className="text-[11px] font-sans font-semibold text-[#E8963C] uppercase tracking-[0.05em] block mb-1">
          {t('feedbackPage.badge')}
        </span>
        <h1 className="text-3xl font-bold font-heading text-[#14213D]">{t('feedbackPage.title')}</h1>
        <p className="text-sm text-gray-600 font-sans">{t('feedbackPage.subtitle')}</p>
      </div>

      <div className="rounded-lg border border-[var(--border-color)] bg-white p-6 sm:p-8 shadow-sm text-[#14213D] font-sans">
        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-[#4A9B6E]/10 rounded-full text-[#4A9B6E]">
                <CheckCircle2 className="w-12 h-12" />
              </div>
            </div>
            <h2 className="text-2xl font-bold font-heading text-[#14213D]">{t('feedbackPage.successTitle')}</h2>
            <p className="text-sm text-gray-600 max-w-md mx-auto">{t('feedbackPage.successDesc')}</p>
            <div className="pt-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2.5 bg-[#14213D] hover:bg-[#1f3057] text-white text-sm font-semibold rounded cursor-pointer transition-colors"
              >
                {t('feedbackPage.submitAnother')}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <MessageSquare className="w-8 h-8 text-[#E8963C] flex-shrink-0" />
            <div className="space-y-4 w-full">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-sans font-semibold text-gray-500 uppercase tracking-[0.05em] mb-1">
                    {t('feedbackPage.typeLabel')}
                  </label>
                  <select
                    value={feedbackType}
                    onChange={(e) => setFeedbackType(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[var(--border-color)] rounded focus-visible:ring-1 focus-visible:ring-[#E8963C] outline-none cursor-pointer"
                  >
                    <option value="general">{t('feedbackPage.types.general')}</option>
                    <option value="complaint">{t('feedbackPage.types.complaint')}</option>
                    <option value="suggestion">{t('feedbackPage.types.suggestion')}</option>
                    <option value="bug">{t('feedbackPage.types.bug')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-sans font-semibold text-gray-500 uppercase tracking-[0.05em] mb-1">
                    {t('feedbackPage.descLabel')}
                  </label>
                  <textarea 
                    rows={4} 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[var(--border-color)] rounded focus-visible:ring-1 focus-visible:ring-[#E8963C] outline-none"
                    placeholder={t('feedbackPage.descPlaceholder')}
                  />
                  {error && <p className="text-xs text-[#D64545] mt-1">{error}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-sans font-semibold text-gray-500 uppercase tracking-[0.05em] mb-1">
                    {t('feedbackPage.emailLabel')}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[var(--border-color)] rounded focus-visible:ring-1 focus-visible:ring-[#E8963C] outline-none"
                    placeholder={t('feedbackPage.emailPlaceholder')}
                  />
                </div>

                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-[#14213D] hover:bg-[#0B1221] text-white text-sm font-semibold rounded font-sans transition-colors cursor-pointer"
                >
                  {t('feedbackPage.submitBtn')}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

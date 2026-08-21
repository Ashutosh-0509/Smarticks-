import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, ArrowLeft, RefreshCcw, ClipboardCheck } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { LocationPicker } from '../components/complaint/LocationPicker';
import { VoiceInput } from '../components/complaint/VoiceInput';
import { AIAnalysisCard } from '../components/complaint/AIAnalysisCard';
import { ComplaintReview } from '../components/complaint/ComplaintReview';
import { PotholePhotoUpload } from '../components/complaint/PotholePhotoUpload';
import { PotholeOfficerCard } from '../components/complaint/PotholeOfficerCard';
import { Button } from '../components/ui/Button';
import { analyzeComplaint, submitComplaint } from '../services/complaintService';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { UserCheck } from 'lucide-react';

const PrioritySignal = ({ priority }) => {
  const isHigh = priority === 'High' || priority === 'Urgent';
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
      isHigh ? 'bg-[#D64545]/10 text-[#D64545]' : 'bg-[#E8963C]/10 text-[#E8963C]'
    }`}>
      {isHigh ? '🔴 HIGH PRIORITY' : '🟡 MEDIUM PRIORITY'}
    </span>
  );
};

export const ReportPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();

  // Guided steps: 'form' | 'ai_analysis' | 'review' | 'success' | 'error'
  const [step, setStep] = useState('form');

  // Form state (Photo evidence removed as per requirements #9 & #10)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    coordinates: null,
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [confirmedAiData, setConfirmedAiData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [photoDataUrl, setPhotoDataUrl] = useState(null);

  const validateForm = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = t('report.issueTitleLabel');
    if (!formData.description.trim()) {
      errs.description = t('report.descriptionLabel');
    } else if (formData.description.trim().length < 10) {
      errs.description = 'Description should be at least 10 characters long.';
    }
    if (!formData.location || !formData.coordinates) {
      errs.location = t('location.required');
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleStartAnalysis = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setStep('ai_analysis');
    setIsAnalyzing(true);

    try {
      const result = await analyzeComplaint({ ...formData, photoDataUrl });
      setAiResult(result);
    } catch (err) {
      console.error(err);
      setErrorMessage(t('report.errorDesc'));
      setStep('error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAiConfirm = (confirmedData) => {
    setConfirmedAiData(confirmedData);
    setStep('review');
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        ...confirmedAiData,
        image_url: photoDataUrl || formData.image_url,
        citizen_email: user?.email,
        citizen_name: user?.name,
        ai_summary: aiResult?.ai_summary,
        ai_reasoning: aiResult?.ai_reasoning,
        ai_confidence: aiResult?.ai_confidence,
        evidence_score: aiResult?.evidence_score || 90,
        evidence_flags: aiResult?.evidence_flags || [],
        pothole_severity: aiResult?.pothole_severity,
        pothole_dimensions: aiResult?.pothole_dimensions,
        is_safety_hazard: aiResult?.is_safety_hazard,
        damage_type: aiResult?.damage_type
      };

      const result = await submitComplaint(payload);
      setSubmittedComplaint(result);
      setStep('success');
    } catch (err) {
      console.error(err);
      setErrorMessage(t('report.errorDesc'));
      setStep('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      coordinates: null,
    });
    setAiResult(null);
    setConfirmedAiData(null);
    setSubmittedComplaint(null);
    setErrors({});
    setPhotoDataUrl(null);
    setStep('form');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header always visible */}
      <div className="space-y-1">
        <span className="text-xs font-mono font-bold text-[#C49A45] uppercase tracking-wider block">
          {t('report.badge')}
        </span>
        <h1 className="text-3xl font-bold font-heading text-[#14213D]">{t('report.title')}</h1>
        <p className="text-sm text-gray-700 font-sans leading-relaxed">
          {t('report.subtitle')}
        </p>
        {user && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#4A9B6E]/10 border border-[#4A9B6E]/30 rounded text-xs font-medium text-[#4A9B6E] mt-2">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Filing as verified citizen: <strong>{user.name || user.email}</strong></span>
          </div>
        )}
      </div>

      {/* UNIFIED CARD CONTAINER */}
      <div className="rounded-lg border border-[var(--border-color)] bg-white p-6 sm:p-8 shadow-sm">
        {/* STEP 1: FORM INPUT */}
        {step === 'form' && (
          <form onSubmit={handleStartAnalysis} className="space-y-6 font-sans">
            <div className="space-y-6">
              <Input
                label={t('report.issueTitleLabel')}
                placeholder={t('report.titlePlaceholder')}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                error={errors.title}
              />

              <div className="flex flex-col gap-2">
                <Textarea
                  label={t('report.descriptionLabel')}
                  placeholder={t('report.descPlaceholder')}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  maxLength={500}
                  error={errors.description}
                />
                <VoiceInput 
                  currentValue={formData.description} 
                  onTranscript={(text) => setFormData({ ...formData, description: text })} 
                />
              </div>

              <LocationPicker
                location={formData.location}
                coordinates={formData.coordinates}
                onChange={({ location, coordinates }) =>
                  setFormData({ ...formData, location, coordinates })
                }
                error={errors.location}
              />

              {/* Pothole Photo Upload — always visible in form */}
              <PotholePhotoUpload
                onPhotoData={setPhotoDataUrl}
                aiResult={null}
              />

              {/* Officer Card — shows when location is selected */}
              {formData.location && formData.coordinates && (
                <PotholeOfficerCard
                  location={formData.location}
                  coordinates={formData.coordinates}
                  complaintTitle={formData.title}
                  complaintDescription={formData.description}
                />
              )}
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full font-bold bg-[#14213D] cursor-pointer">
              {t('report.analyzeBtn')}
            </Button>
          </form>
        )}

        {/* STEP 2: AI ANALYSIS & CONFIRMATION */}
        {step === 'ai_analysis' && (
          <div className="space-y-4 font-sans">
            <button
              type="button"
              onClick={() => setStep('form')}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-gray-500 hover:text-[#14213D] cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {t('report.backToForm')}
            </button>

            <AIAnalysisCard
              isAnalyzing={isAnalyzing}
              aiResult={aiResult}
              onConfirm={handleAiConfirm}
            />

            {/* Pothole severity details shown after analysis */}
            {aiResult && aiResult.pothole_severity && aiResult.pothole_severity !== 'None' && (
              <PotholePhotoUpload
                onPhotoData={setPhotoDataUrl}
                aiResult={aiResult}
              />
            )}
          </div>
        )}

        {/* STEP 3: FINAL REVIEW */}
        {step === 'review' && (
          <div className="space-y-4 font-sans">
            <button
              type="button"
              onClick={() => setStep('ai_analysis')}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-gray-500 hover:text-[#14213D] cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {t('report.backToAI')}
            </button>

            <ComplaintReview
              formData={formData}
              aiData={confirmedAiData}
              onFinalSubmit={handleFinalSubmit}
              onEdit={() => setStep('form')}
              isSubmitting={isSubmitting}
            />
          </div>
        )}

        {/* STEP 4: SUCCESS SCREEN */}
        {step === 'success' && submittedComplaint && (
          <div className="text-center space-y-6 py-4 font-sans">
            <div className="flex justify-center">
              <div className="p-3 bg-[#4A9B6E]/10 rounded-full text-[#4A9B6E]">
                <CheckCircle2 className="w-12 h-12 stroke-[1.75]" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-heading text-[#14213D]">
                {t('report.successTitle')}
              </h2>
              <div className="inline-block px-3 py-1 bg-[#F4F5F7] border border-[var(--border-color)] rounded">
                <span className="text-xs font-mono text-gray-500 uppercase mr-1">{t('report.complaintId')}</span>
                <span className="text-base font-mono font-bold text-[#14213D]">
                  {submittedComplaint.id}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#F4F5F7] border border-[var(--border-color)] space-y-3 text-left">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold font-heading text-[#14213D]">
                  {submittedComplaint.category}
                </span>
                <PrioritySignal priority={submittedComplaint.priority} />
              </div>

              <div className="text-xs text-gray-600 font-sans space-y-1">
                <p>
                  <span className="font-mono text-gray-400">{t('report.department')}</span>{' '}
                  <span className="font-semibold text-[#14213D]">{submittedComplaint.department_name}</span>
                </p>
                <p>
                  <span className="font-mono text-gray-400">{t('report.location')}</span>{' '}
                  <span className="font-semibold text-[#14213D]">{submittedComplaint.location}</span>
                </p>
              </div>

              <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-mono">
                <span className="text-gray-500">{t('report.statusLabel')}</span>
                <span className="font-bold text-[#14213D] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#14213D]" />
                  {t('report.submittedStatus')}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                variant="primary"
                onClick={() => navigate(`/track/${submittedComplaint.id}`)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer"
              >
                <ClipboardCheck className="w-4 h-4" />
                <span>{t('report.trackBtn')}</span>
              </Button>

              <Button
                variant="secondary"
                onClick={handleReset}
                className="w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCcw className="w-4 h-4" />
                <span>{t('report.reportAnother')}</span>
              </Button>
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {step === 'error' && (
          <div className="text-center space-y-6 py-4 font-sans">
            <div className="flex justify-center">
              <div className="p-3 bg-[#D64545]/10 rounded-full text-[#D64545]">
                <AlertCircle className="w-10 h-10" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold font-heading text-[#14213D]">
                {t('report.errorTitle')}
              </h3>
              <p className="text-sm font-sans text-gray-700">
                {errorMessage || t('report.errorDesc')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button variant="primary" onClick={() => setStep('review')}>
                {t('report.tryAgain')}
              </Button>
              <Button variant="secondary" onClick={() => setStep('form')}>
                {t('report.goBack')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

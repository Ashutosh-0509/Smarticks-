import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, ArrowLeft, RefreshCcw, ClipboardCheck } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { ImageUploader } from '../components/complaint/ImageUploader';
import { LocationPicker } from '../components/complaint/LocationPicker';
import { VoiceInput } from '../components/complaint/VoiceInput';
import { AIAnalysisCard } from '../components/complaint/AIAnalysisCard';
import { ComplaintReview } from '../components/complaint/ComplaintReview';
import { Button } from '../components/ui/Button';
import { analyzeComplaint, submitComplaint } from '../services/complaintService';

export const ReportPage = () => {
  const navigate = useNavigate();

  // Guided steps: 'form' | 'ai_analysis' | 'review' | 'success' | 'error'
  const [step, setStep] = useState('form');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    location: '',
    coordinates: null,
    hasPhotoMismatch: false
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [confirmedAiData, setConfirmedAiData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Please provide a brief title.';
    if (!formData.description.trim()) {
      errs.description = 'Please describe the problem in detail.';
    } else if (formData.description.trim().length < 10) {
      errs.description = 'Description should be at least 10 characters long.';
    }
    if (!formData.image_url) {
      errs.image_url = 'Please upload a photo of the issue.';
    }
    if (!formData.location || !formData.coordinates) {
      errs.location = 'Please select the location of the issue.';
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
      const result = await analyzeComplaint(formData);
      setAiResult(result);
    } catch (err) {
      console.error(err);
      setErrorMessage('Could not analyze complaint — please try again.');
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
        ai_summary: aiResult?.ai_summary,
        ai_reasoning: aiResult?.ai_reasoning,
        ai_confidence: aiResult?.ai_confidence,
        evidence_score: aiResult?.evidence_score,
        evidence_flags: aiResult?.evidence_flags
      };

      const result = await submitComplaint(payload);
      setSubmittedComplaint(result);
      setStep('success');
    } catch (err) {
      console.error(err);
      setErrorMessage("Couldn't submit — check your connection and try again.");
      setStep('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      location: '',
      coordinates: null,
      hasPhotoMismatch: false
    });
    setAiResult(null);
    setConfirmedAiData(null);
    setSubmittedComplaint(null);
    setErrors({});
    setStep('form');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <span className="text-xs font-mono font-bold text-[#C49A45] uppercase tracking-wider block">
          OFFICIAL CITIZEN REPORT FORM
        </span>
        <h1 className="text-3xl font-bold font-heading text-[#14213D]">What's happening?</h1>
        <p className="text-sm text-gray-700 font-sans leading-relaxed">
          Tell us what you noticed. Our AI Vision & NLP models will classify the issue and dispatch it to the municipal engineer.
        </p>
      </div>

      {/* STEP 1: FORM INPUT */}
      {step === 'form' && (
        <form onSubmit={handleStartAnalysis} className="space-y-6 font-sans">
          <div className="rounded-lg border border-[#DDE1E7] bg-white p-6 shadow-sm space-y-6">
            {/* Title Input */}
            <Input
              label="ISSUE TITLE"
              placeholder="e.g. Severe pothole near Main Market Gate"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              error={errors.title}
            />

            {/* Description Textarea & Voice Input */}
            <div className="flex flex-col gap-2">
              <Textarea
                label="DESCRIPTION"
                placeholder="Example: There's a large pothole near the main gate causing vehicle swerving and commuter safety hazards."
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


            {/* Photo Uploader */}
            <ImageUploader
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
              error={errors.image_url}
            />

            {/* Location Picker */}
            <LocationPicker
              location={formData.location}
              coordinates={formData.coordinates}
              onChange={({ location, coordinates }) =>
                setFormData({ ...formData, location, coordinates })
              }
              error={errors.location}
            />
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full font-bold bg-[#14213D]">
            Analyze Complaint with AI
          </Button>
        </form>
      )}

      {/* STEP 2: AI ANALYSIS & CONFIRMATION */}
      {step === 'ai_analysis' && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setStep('form')}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-gray-500 hover:text-[#14213D]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to edit form
          </button>

          <AIAnalysisCard
            isAnalyzing={isAnalyzing}
            aiResult={aiResult}
            onConfirm={handleAiConfirm}
            onPhotoRetry={() => setStep('form')}
            onContinueWithoutPhoto={() => {
              setFormData({ ...formData, image_url: '' });
              handleAiConfirm({
                category: aiResult?.category || 'Other',
                priority: aiResult?.priority || 'Medium',
                department_id: aiResult?.department_id || 'dept-general',
                department_name: aiResult?.department_name || 'General Services'
              });
            }}
          />
        </div>
      )}

      {/* STEP 3: FINAL REVIEW */}
      {step === 'review' && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setStep('ai_analysis')}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-gray-500 hover:text-[#14213D]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to AI classification
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
        <div className="rounded-lg border border-[#DDE1E7] bg-white p-8 text-center shadow-sm space-y-6">
          <div className="flex justify-center">
            <div className="p-3 bg-[#4A9B6E]/10 rounded-full text-[#4A9B6E]">
              <CheckCircle2 className="w-12 h-12 stroke-[1.75]" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-heading text-[#14213D]">
              Your complaint has been reported.
            </h2>
            <div className="inline-block px-3 py-1 bg-[#F4F5F7] border border-[#DDE1E7] rounded">
              <span className="text-xs font-mono text-gray-500 uppercase mr-1">COMPLAINT ID:</span>
              <span className="text-base font-mono font-bold text-[#14213D]">
                {submittedComplaint.id}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#F4F5F7] border border-[#DDE1E7] space-y-3 text-left">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold font-heading text-[#14213D]">
                {submittedComplaint.category}
              </span>
              <PrioritySignal priority={submittedComplaint.priority} />
            </div>

            <div className="text-xs text-gray-600 font-sans space-y-1">
              <p>
                <span className="font-mono text-gray-400">DEPARTMENT:</span>{' '}
                <span className="font-semibold text-[#14213D]">{submittedComplaint.department_name}</span>
              </p>
              <p>
                <span className="font-mono text-gray-400">LOCATION:</span>{' '}
                <span className="font-semibold text-[#14213D]">{submittedComplaint.location}</span>
              </p>
            </div>

            <div className="pt-2 border-t border-[#DDE1E7] flex items-center justify-between text-xs font-mono">
              <span className="text-gray-500">STATUS:</span>
              <span className="font-bold text-[#14213D] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#14213D]" />
                ● SUBMITTED
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              onClick={() => navigate(`/track/${submittedComplaint.id}`)}
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Track my complaint</span>
            </Button>

            <Button
              variant="secondary"
              onClick={handleReset}
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" />
              <span>Report another issue</span>
            </Button>
          </div>
        </div>
      )}

      {/* ERROR STATE */}
      {step === 'error' && (
        <div className="rounded-lg border border-[#D64545] bg-white p-8 text-center shadow-sm space-y-6">
          <div className="flex justify-center">
            <div className="p-3 bg-[#D64545]/10 rounded-full text-[#D64545]">
              <AlertCircle className="w-10 h-10" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold font-heading text-[#14213D]">
              Submission Error
            </h3>
            <p className="text-sm font-sans text-gray-700">
              {errorMessage || "Couldn't submit — check your connection and try again."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="primary" onClick={() => setStep('review')}>
              Try again
            </Button>
            <Button variant="secondary" onClick={() => setStep('form')}>
              Go back
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useRef } from 'react';
import { Camera, Upload, X, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { uploadComplaintImage } from '../../services/complaintService';
import { useLanguage } from '../../context/LanguageContext';

const SEVERITY_CONFIG = {
  'Minor': { color: '#4A9B6E', bg: '#4A9B6E1A', label: 'MINOR', icon: '🟢', desc: '< 5cm deep · Cosmetic surface wear' },
  'Moderate': { color: '#E8963C', bg: '#E8963C1A', label: 'MODERATE', icon: '🟡', desc: '5–10cm deep · Vehicle hazard' },
  'Severe': { color: '#D64545', bg: '#D645451A', label: 'SEVERE', icon: '🔴', desc: '> 10cm deep or > 30cm wide · Immediate danger' },
  'None': { color: '#6B7280', bg: '#6B72801A', label: 'N/A', icon: '⚪', desc: 'Not a road damage issue' }
};

const DAMAGE_LABELS = {
  'Pothole Cavity': '🕳️ Pothole Cavity',
  'Failed Patch': '🩹 Failed Patch',
  'Surface Breakup': '💥 Surface Breakup',
  'Rut/Depression': '📐 Rut / Depression',
  'Edge Break': '🔪 Edge Break',
  'Crocodile Cracking': '🐊 Crocodile Cracking',
  'None': '—'
};

export const PotholePhotoUpload = ({ onPhotoData, aiResult }) => {
  const { t } = useLanguage();
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB.');
      return;
    }

    setIsUploading(true);
    try {
      const dataUrl = await uploadComplaintImage(file);
      setPreview(dataUrl);
      onPhotoData(dataUrl);
    } catch (err) {
      console.error('Photo upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const clearPhoto = () => {
    setPreview(null);
    onPhotoData(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const severity = aiResult?.pothole_severity || 'None';
  const severityConfig = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG['None'];
  const damageType = aiResult?.damage_type || 'None';
  const dimensions = aiResult?.pothole_dimensions || 'N/A';
  const isHazard = aiResult?.is_safety_hazard || false;
  const hasPotholeData = severity !== 'None' && damageType !== 'None';

  return (
    <div className="space-y-3 font-sans">
      {/* Section Label */}
      <div className="flex items-center gap-2">
        <Camera className="w-4 h-4 text-[#E8963C]" />
        <span className="text-xs font-mono font-bold text-[#E8963C] uppercase tracking-wider">
          {t('pothole.photoTitle') || 'Road Damage Photo Evidence'}
        </span>
      </div>

      {/* Upload Area */}
      {!preview ? (
        <label className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-[var(--border-color)] rounded-lg bg-[var(--surface)] hover:border-[#E8963C] hover:bg-[#E8963C08] transition-colors cursor-pointer group">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileSelect}
          />
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-[#E8963C] animate-spin" />
          ) : (
            <div className="p-3 rounded-full bg-[#E8963C]/10 group-hover:bg-[#E8963C]/20 transition-colors">
              <Upload className="w-6 h-6 text-[#E8963C]" />
            </div>
          )}
          <div className="text-center">
            <p className="text-sm font-semibold text-[var(--ink)]">
              {t('pothole.uploadPrompt') || 'Upload pothole photo'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {t('pothole.uploadHint') || 'Tap to use camera or select from gallery · Max 5MB'}
            </p>
          </div>
        </label>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-[var(--border-color)]">
          <img src={preview} alt="Pothole evidence" className="w-full h-48 object-cover" />
          <button
            type="button"
            onClick={clearPhoto}
            className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-black/80 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Photo uploaded badge */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-1 bg-[#4A9B6E]/90 rounded text-white text-xs font-mono font-bold">
            <CheckCircle2 className="w-3 h-3" />
            {t('pothole.photoAttached') || 'Photo attached'}
          </div>
        </div>
      )}

      {/* AI Pothole Analysis Results — shown after AI analysis completes */}
      {hasPotholeData && (
        <div className="rounded-lg border border-[var(--border-color)] bg-[var(--surface-card)] overflow-hidden">
          {/* Severity Banner */}
          <div className="flex items-center justify-between px-4 py-2.5" style={{ backgroundColor: severityConfig.bg }}>
            <div className="flex items-center gap-2">
              <span className="text-base">{severityConfig.icon}</span>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: severityConfig.color }}>
                  {severityConfig.label} SEVERITY
                </span>
                <p className="text-[10px] text-gray-600 mt-0.5">{severityConfig.desc}</p>
              </div>
            </div>
            {isHazard && (
              <div className="flex items-center gap-1 px-2 py-1 bg-[#D64545]/10 rounded text-[#D64545]">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono font-bold uppercase">Safety Hazard</span>
              </div>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-px bg-[var(--border-color)]">
            <div className="p-3 bg-[var(--surface-card)]">
              <span className="text-[10px] font-mono text-gray-400 uppercase block mb-0.5">Damage Type</span>
              <span className="text-xs font-semibold text-[var(--ink)]">{DAMAGE_LABELS[damageType] || damageType}</span>
            </div>
            <div className="p-3 bg-[var(--surface-card)]">
              <span className="text-[10px] font-mono text-gray-400 uppercase block mb-0.5">Dimensions</span>
              <span className="text-xs font-semibold text-[var(--ink)]">{dimensions}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useRef, useState } from 'react';
import { Camera, Upload, Image as ImageIcon, Trash2, RefreshCw, Eye, Sparkles, CheckCircle2 } from 'lucide-react';
import { uploadComplaintImage } from '../../services/complaintService';

export const ImageUploader = ({ value, onChange }) => {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      setIsUploading(true);
      try {
        const mockUrl = await uploadComplaintImage(files[0]);
        onChange(mockUrl);
      } catch (err) {
        console.error('Upload failed', err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setIsUploading(true);
      try {
        const mockUrl = await uploadComplaintImage(e.dataTransfer.files[0]);
        onChange(mockUrl);
      } catch (err) {
        console.error('Upload failed', err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="w-full flex flex-col gap-2 font-sans">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-[#14213D] font-sans flex items-center gap-1.5">
          <span>PHOTO EVIDENCE</span>
          <span className="text-[10px] font-mono bg-[#14213D] text-white px-1.5 py-0.5 rounded font-bold">
            AI VISION SCAN ACTIVE
          </span>
        </label>
      </div>

      {value ? (
        <div className="relative rounded-lg border-2 border-[#C49A45] overflow-hidden bg-white p-3 space-y-3 shadow-md">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* AI Vision Bounding Box Overlay Preview */}
            <div className="relative w-full sm:w-56 h-40 rounded-md overflow-hidden bg-gray-900 border border-[#DDE1E7] flex-shrink-0 group">
              <img src={value} alt="Complaint Evidence Preview" className="w-full h-full object-cover opacity-90" />

              {/* Simulated AI Computer Vision Bounding Box */}
              <div className="absolute inset-4 border-2 border-[#C49A45] rounded border-dashed flex items-start justify-start p-1.5 animate-pulse bg-[#C49A45]/10">
                <span className="text-[9px] font-mono font-bold bg-[#C49A45] text-white px-1 py-0.5 rounded shadow">
                  DETECTED: HAZARD REGION (94.2%)
                </span>
              </div>
            </div>

            {/* AI Detection Breakdown */}
            <div className="flex-1 w-full space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-[#DDE1E7] pb-1.5">
                <span className="font-mono font-bold text-[#4A9B6E] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4A9B6E]" />
                  AI Vision Scan Verified
                </span>
                <span className="font-mono text-gray-500">Confidence: 94.2%</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2 bg-[#F4F5F7] rounded border border-[#DDE1E7]">
                  <span className="text-gray-400 block">IMAGE CLARITY</span>
                  <span className="font-bold text-[#14213D]">High (HD)</span>
                </div>
                <div className="p-2 bg-[#F4F5F7] rounded border border-[#DDE1E7]">
                  <span className="text-gray-400 block">GPS EMBEDDED</span>
                  <span className="font-bold text-[#4A9B6E]">Verified 📍</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#DDE1E7] rounded-md text-xs font-medium text-[#14213D] hover:bg-[#F4F5F7]"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Replace photo
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#D64545]/30 rounded-md text-xs font-medium text-[#D64545] hover:bg-[#D64545]/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`rounded-lg border-2 border-dashed p-6 text-center transition-all ${
            isDragging ? 'border-[#C49A45] bg-[#C49A45]/5' : 'border-[#DDE1E7] bg-white'
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="p-3 bg-[#F4F5F7] rounded-full text-[#14213D]">
              <Upload className="w-6 h-6 stroke-[1.5] text-[#C49A45]" />
            </div>

            <div>
              <p className="text-base font-semibold font-sans text-[#14213D]">Upload photo evidence</p>
              <p className="text-xs text-gray-500 font-sans mt-0.5">
                AI Vision model automatically detects potholes, garbage, water pipe leaks & damaged poles.
              </p>
            </div>

            <p className="hidden sm:block text-xs text-gray-400 font-sans">
              Drag & drop image here, or browse files
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#F4F5F7] border border-[#DDE1E7] rounded-lg text-sm font-medium text-[#14213D] hover:bg-[#e8ebf0]"
              >
                <ImageIcon className="w-4 h-4 text-[#C49A45]" />
                Choose from gallery
              </button>

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex sm:hidden items-center gap-1.5 px-3.5 py-2 bg-[#14213D] text-white rounded-lg text-sm font-medium hover:bg-[#1f3057]"
              >
                <Camera className="w-4 h-4 text-[#C49A45]" />
                Take photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

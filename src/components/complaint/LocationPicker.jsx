import React, { useState } from 'react';
import { MapPin, Navigation, Edit2, Check } from 'lucide-react';

export const LocationPicker = ({ location, coordinates, onChange }) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [isManual, setIsManual] = useState(false);
  const [tempLocation, setTempLocation] = useState(location || 'Sector 17, Navi Mumbai');

  const handleUseMyLocation = () => {
    setIsDetecting(true);
    setTimeout(() => {
      setIsDetecting(false);
      const detected = 'Sector 17, Navi Mumbai';
      const detectedCoords = { lat: 19.0760, lng: 73.0033 };
      setTempLocation(detected);
      onChange({ location: detected, coordinates: detectedCoords });
      setIsManual(false);
    }, 800);
  };

  const handleManualSave = () => {
    onChange({ location: tempLocation, coordinates: coordinates || { lat: 19.0760, lng: 73.0033 } });
    setIsManual(false);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <label className="text-sm font-medium text-[#14213D] font-sans">LOCATION</label>

      <div className="rounded-lg border border-[#DDE1E7] bg-white p-4 space-y-4">
        {/* Detection Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="p-2 bg-[#F4F5F7] rounded-md text-[#14213D] mt-0.5">
              <MapPin className="w-5 h-5 text-[#E8963C]" />
            </div>
            <div>
              <p className="text-xs font-mono font-medium text-[#4A9B6E] flex items-center gap-1">
                <span>📍</span> Location Detected
              </p>
              <p className="text-base font-semibold font-sans text-[#14213D]">
                {location || 'Sector 17, Navi Mumbai'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleUseMyLocation}
              disabled={isDetecting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F4F5F7] border border-[#DDE1E7] rounded-md text-xs font-medium text-[#14213D] hover:bg-[#e8ebf0]"
            >
              <Navigation className={`w-3.5 h-3.5 ${isDetecting ? 'animate-spin' : ''}`} />
              {isDetecting ? 'Detecting...' : 'Use my location'}
            </button>

            <button
              type="button"
              onClick={() => setIsManual(!isManual)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#DDE1E7] rounded-md text-xs font-medium text-[#14213D] hover:bg-[#F4F5F7]"
            >
              <Edit2 className="w-3.5 h-3.5" />
              {isManual ? 'Cancel' : 'Change location'}
            </button>
          </div>
        </div>

        {/* Manual Input Toggle */}
        {isManual && (
          <div className="p-3 bg-[#F4F5F7] rounded-md border border-[#DDE1E7] space-y-2">
            <label className="text-xs font-medium text-[#14213D]">Enter address manually</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tempLocation}
                onChange={(e) => setTempLocation(e.target.value)}
                placeholder="e.g. Sector 17, Near Main Market Gate"
                className="flex-1 px-3 py-1.5 text-sm bg-white border border-[#DDE1E7] rounded-md focus-visible:ring-2 focus-visible:ring-[#E8963C]"
              />
              <button
                type="button"
                onClick={handleManualSave}
                className="px-3 py-1.5 bg-[#14213D] text-white text-xs font-medium rounded-md hover:bg-[#1f3057] flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                Save address
              </button>
            </div>
          </div>
        )}

        {/* Coordinate Display & Controls Guarantee Notice */}
        <div className="flex items-center justify-between pt-2 border-t border-[#DDE1E7] text-xs text-gray-500 font-mono">
          <span>COORDS: 19.0760° N, 73.0033° E</span>
          <span className="font-sans text-gray-400">You control the final location before submitting</span>
        </div>
      </div>
    </div>
  );
};

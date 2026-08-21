import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Check } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useLanguage } from '../../context/LanguageContext';

// Create a simple custom icon for the picker
const pickerIcon = L.divIcon({
  html: `
    <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.372 0 0 5.372 0 12C0 21 12 32 12 32C12 32 24 21 24 12C24 5.372 18.628 0 12 0Z" fill="#14213D"/>
      <circle cx="12" cy="12" r="5" fill="#FFFFFF"/>
    </svg>
  `,
  className: 'custom-leaflet-marker',
  iconSize: [24, 32],
  iconAnchor: [12, 32],
  popupAnchor: [0, -28]
});

// Component to handle map clicks
const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return position === null ? null : (
    <Marker position={position} icon={pickerIcon}></Marker>
  );
};

export const LocationPicker = ({ location, coordinates, onChange, error }) => {
  const { t } = useLanguage();
  const [isDetecting, setIsDetecting] = useState(false);
  const [tempCoords, setTempCoords] = useState(coordinates || { lat: 20.5937, lng: 78.9629 });
  
  // Sync map center when coordinates change from outside
  useEffect(() => {
    if (coordinates) {
      setTempCoords(coordinates);
    }
  }, [coordinates]);

  const handleUseMyLocation = () => {
    setIsDetecting(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setIsDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const detectedCoords = { lat: latitude, lng: longitude };
        setTempCoords(detectedCoords);
        
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          const detected = data.display_name || `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;
          onChange({ location: detected, coordinates: detectedCoords });
        } catch (err) {
          console.error("Error fetching location name:", err);
          const fallbackName = `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;
          onChange({ location: fallbackName, coordinates: detectedCoords });
        } finally {
          setIsDetecting(false);
        }
      },
      (err) => {
        console.error("Error detecting location:", err);
        alert("Unable to retrieve your location. Falling back to default region (India).");
        const fallbackName = 'New Delhi, India';
        const fallbackCoords = { lat: 28.6139, lng: 77.2090 };
        setTempCoords(fallbackCoords);
        onChange({ location: fallbackName, coordinates: fallbackCoords });
        setIsDetecting(false);
      }
    );
  };

  const handleMapPinSelect = async (newCoords) => {
    setTempCoords(newCoords);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${newCoords.lat}&lon=${newCoords.lng}`);
      const data = await response.json();
      const detected = data.display_name || `Lat: ${newCoords.lat.toFixed(4)}, Lng: ${newCoords.lng.toFixed(4)}`;
      onChange({ location: detected, coordinates: newCoords });
    } catch (err) {
      console.error("Error fetching location name:", err);
      const fallbackName = `Lat: ${newCoords.lat.toFixed(4)}, Lng: ${newCoords.lng.toFixed(4)}`;
      onChange({ location: fallbackName, coordinates: newCoords });
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 font-sans">
      <div className="flex flex-col">
        <label className={`text-sm font-medium ${error ? 'text-[#D64545]' : 'text-[#14213D]'}`}>
          {t('location.label')}
        </label>
        {error && <p className="text-xs text-[#D64545] font-medium mt-0.5">{error}</p>}
      </div>

      <div className={`rounded-lg border ${error ? 'border-[#D64545]' : 'border-[#DDE1E7]'} bg-white p-4 space-y-4`}>
        {/* Detection Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="p-2 bg-[#F4F5F7] rounded-md text-[#14213D] mt-0.5">
              <MapPin className="w-5 h-5 text-[#E8963C]" />
            </div>
            <div>
              <p className="text-xs font-mono font-medium text-[#4A9B6E] flex items-center gap-1">
                <span>📍</span> {location ? t('location.selected') : t('location.required')}
              </p>
              <p className="text-sm font-semibold font-sans text-[#14213D] line-clamp-2">
                {location || t('location.none')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={isDetecting}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#F4F5F7] border border-[#DDE1E7] rounded-md text-xs font-medium text-[#14213D] hover:bg-[#e8ebf0] whitespace-nowrap self-start sm:self-auto cursor-pointer"
          >
            <Navigation className={`w-3.5 h-3.5 ${isDetecting ? 'animate-spin' : ''}`} />
            {isDetecting ? t('location.detecting') : t('location.useMyLocation')}
          </button>
        </div>

        {/* ALWAYS-OPEN Interactive Map Picker (Default India view) */}
        <div className="p-3 bg-[#F4F5F7] rounded-md border border-[#DDE1E7] space-y-2">
          <p className="text-xs font-medium text-[#14213D]">{t('location.tapMap')}</p>
          <div className="h-60 w-full rounded border border-[#DDE1E7] overflow-hidden relative z-0">
            <MapContainer 
              center={coordinates || { lat: 20.5937, lng: 78.9629 }} 
              zoom={coordinates ? 13 : 5} 
              scrollWheelZoom={true} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker position={tempCoords} setPosition={handleMapPinSelect} />
            </MapContainer>
          </div>
        </div>

        {/* Coordinate Display & Controls Guarantee Notice */}
        <div className="flex items-center justify-between pt-2 border-t border-[#DDE1E7] text-xs text-gray-500 font-mono">
          <span>{t('location.coordsLabel')} {coordinates ? `${coordinates.lat.toFixed(4)}° N, ${coordinates.lng.toFixed(4)}° E` : t('location.notSet')}</span>
          <span className="font-sans text-gray-400 text-[11px] hidden sm:inline">{t('location.youControl')}</span>
        </div>
      </div>
    </div>
  );
};

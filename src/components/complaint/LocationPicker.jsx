import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Edit2, Check } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

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
  const [isDetecting, setIsDetecting] = useState(false);
  const [isManual, setIsManual] = useState(false);
  const [tempCoords, setTempCoords] = useState(coordinates || { lat: 19.0760, lng: 73.0033 });
  
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
        
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          const detected = data.display_name || `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;
          onChange({ location: detected, coordinates: detectedCoords });
        } catch (error) {
          console.error("Error fetching location name:", error);
          const fallbackName = `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;
          onChange({ location: fallbackName, coordinates: detectedCoords });
        } finally {
          setIsDetecting(false);
          setIsManual(false);
        }
      },
      (error) => {
        console.error("Error detecting location:", error);
        alert("Unable to retrieve your location. Falling back to default location.");
        const fallbackName = 'Sector 17, Navi Mumbai';
        const fallbackCoords = { lat: 19.0760, lng: 73.0033 };
        onChange({ location: fallbackName, coordinates: fallbackCoords });
        setIsDetecting(false);
        setIsManual(false);
      }
    );
  };

  const handleManualSave = async () => {
    if (!tempCoords) return;
    
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${tempCoords.lat}&lon=${tempCoords.lng}`);
      const data = await response.json();
      const detected = data.display_name || `Lat: ${tempCoords.lat.toFixed(4)}, Lng: ${tempCoords.lng.toFixed(4)}`;
      onChange({ location: detected, coordinates: tempCoords });
    } catch (error) {
      console.error("Error fetching location name:", error);
      const fallbackName = `Lat: ${tempCoords.lat.toFixed(4)}, Lng: ${tempCoords.lng.toFixed(4)}`;
      onChange({ location: fallbackName, coordinates: tempCoords });
    } finally {
      setIsManual(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex flex-col">
        <label className={`text-sm font-medium ${error ? 'text-[#D64545]' : 'text-[#14213D]'} font-sans`}>
          LOCATION
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
                <span>📍</span> {location ? 'Location Selected' : 'Location Required'}
              </p>
              <p className="text-base font-semibold font-sans text-[#14213D]">
                {location || 'No location selected'}
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

        {/* Manual Map Picker Toggle */}
        {isManual && (
          <div className="p-3 bg-[#F4F5F7] rounded-md border border-[#DDE1E7] space-y-3">
            <label className="text-xs font-medium text-[#14213D]">Tap on the map to place the pin</label>
            <div className="h-56 w-full rounded border border-[#DDE1E7] overflow-hidden relative z-0">
              <MapContainer 
                center={coordinates || { lat: 19.0760, lng: 73.0033 }} 
                zoom={14} 
                scrollWheelZoom={true} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={tempCoords} setPosition={setTempCoords} />
              </MapContainer>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs text-gray-500 font-mono">
                {tempCoords ? `Lat: ${tempCoords.lat.toFixed(4)}, Lng: ${tempCoords.lng.toFixed(4)}` : 'No point selected'}
              </p>
              <button
                type="button"
                onClick={handleManualSave}
                disabled={!tempCoords}
                className="px-3 py-1.5 bg-[#14213D] text-white text-xs font-medium rounded-md hover:bg-[#1f3057] flex items-center justify-center gap-1 disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                Save pin location
              </button>
            </div>
          </div>
        )}

        {/* Coordinate Display & Controls Guarantee Notice */}
        <div className="flex items-center justify-between pt-2 border-t border-[#DDE1E7] text-xs text-gray-500 font-mono">
          <span>COORDS: {coordinates ? `${coordinates.lat.toFixed(4)}° N, ${coordinates.lng.toFixed(4)}° E` : 'NOT SET'}</span>
          <span className="font-sans text-gray-400">You control the final location before submitting</span>
        </div>
      </div>
    </div>
  );
};

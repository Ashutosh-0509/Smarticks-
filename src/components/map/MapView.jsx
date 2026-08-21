import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { PrioritySignal } from '../complaint/PrioritySignal';
import { MapLegend } from './MapLegend';
import { Flame, MapPin } from 'lucide-react';

const createCustomIcon = (priority) => {
  const normPriority = (priority || 'Medium').toLowerCase();
  const color =
    normPriority === 'high' ? '#D64545' : normPriority === 'medium' ? '#E8963C' : '#4A9B6E';

  const svgMarker = `
    <svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.268 21.732 0 14 0Z" fill="${color}"/>
      <circle cx="14" cy="14" r="6" fill="#FFFFFF"/>
    </svg>
  `;

  return L.divIcon({
    html: svgMarker,
    className: 'custom-leaflet-marker',
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -32]
  });
};

import { useLanguage } from '../../context/LanguageContext';

export const MapView = ({ complaints = [], center = [20.5937, 78.9629], zoom = 5, height = '480px' }) => {
  const { t } = useLanguage();
  const [mapMode, setMapMode] = useState('pins'); // 'pins' | 'heatmap'

  return (
    <div className="relative w-full rounded-lg border border-[#DDE1E7] overflow-hidden bg-[#F4F5F7] shadow-sm font-sans">
      {/* Mode Switcher Control Bar Overlay */}
      <div className="absolute top-3 right-3 z-[1000] bg-white border border-[#DDE1E7] rounded-lg p-1 shadow-md flex items-center gap-1 font-mono text-xs">
        <button
          type="button"
          onClick={() => setMapMode('pins')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors font-medium cursor-pointer ${
            mapMode === 'pins'
              ? 'bg-[#14213D] text-white font-bold'
              : 'text-gray-700 hover:bg-[#F4F5F7]'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-[#C49A45]" />
          <span>{t('pinMarkers') || 'Pin Markers'}</span>
        </button>

        <button
          type="button"
          onClick={() => setMapMode('heatmap')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors font-medium cursor-pointer ${
            mapMode === 'heatmap'
              ? 'bg-[#D64545] text-white font-bold'
              : 'text-gray-700 hover:bg-[#F4F5F7]'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-white" />
          <span>{t('priorityHeatmapBtn') || 'Priority Heatmap'}</span>
        </button>
      </div>

      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height, width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* MAP PINS MODE */}
        {mapMode === 'pins' &&
          complaints.map((item) => {
            if (!item.coordinates?.lat || !item.coordinates?.lng) return null;

            return (
              <Marker
                key={item.id}
                position={[item.coordinates.lat, item.coordinates.lng]}
                icon={createCustomIcon(item.priority)}
              >
                <Popup>
                  <div className="p-1 space-y-2 max-w-xs font-sans">
                    <div className="flex items-center justify-between gap-2 border-b border-[#DDE1E7] pb-1.5">
                      <span className="font-mono text-xs font-bold text-[#14213D]">{item.id}</span>
                      <PrioritySignal priority={item.priority} />
                    </div>

                    <h5 className="font-semibold text-sm font-heading text-[#14213D] leading-tight">
                      {item.title}
                    </h5>

                    <div className="text-xs text-gray-600 space-y-1">
                      <p className="flex justify-between">
                        <span className="text-gray-400 font-mono">CATEGORY:</span>
                        <span className="font-medium text-[#14213D]">{item.category}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-400 font-mono">STATUS:</span>
                        <span className="font-medium text-[#14213D]">{item.status}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-400 font-mono">LOCATION:</span>
                        <span className="font-medium text-[#14213D]">{item.location}</span>
                      </p>
                    </div>

                    <div className="pt-1 text-right">
                      <Link
                        to={`/track/${item.id}`}
                        className="inline-block text-xs font-semibold text-[#14213D] underline hover:text-[#C49A45]"
                      >
                        {t('trackComplaintLink') || 'Track complaint →'}
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {/* HEATMAP DENSITY MODE */}
        {mapMode === 'heatmap' && (
          <>
            {complaints.map((item) => {
              if (!item.coordinates?.lat || !item.coordinates?.lng) return null;
              const normPriority = (item.priority || 'Medium').toLowerCase();

              const color =
                normPriority === 'high' ? '#D64545' : normPriority === 'medium' ? '#E8963C' : '#4A9B6E';

              const radius = normPriority === 'high' ? 600 : normPriority === 'medium' ? 450 : 300;

              return (
                <Circle
                  key={`heat-${item.id}`}
                  center={[item.coordinates.lat, item.coordinates.lng]}
                  radius={radius}
                  pathOptions={{
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.45,
                    weight: 2
                  }}
                >
                  <Popup>
                    <div className="p-2 space-y-1 font-sans text-xs">
                      <span className="font-mono font-bold text-[#D64545]">HEATMAP DENSITY ZONE</span>
                      <h5 className="font-bold text-[#14213D]">{item.title}</h5>
                      <p className="text-gray-600">Priority: <strong>{item.priority}</strong></p>
                      <p className="text-gray-500 font-mono">Location: {item.location}</p>
                    </div>
                  </Popup>
                </Circle>
              );
            })}
          </>
        )}
      </MapContainer>

      {/* Floating Legend */}
      <div className="absolute bottom-3 left-3 z-[1000]">
        <MapLegend mode={mapMode} />
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { AlertCircle, Flame, ExternalLink, Newspaper, ShieldAlert, Radio } from 'lucide-react';

const CIVIC_NEWS_ITEMS = [
  {
    id: 'NEWS-881',
    category: 'ROAD ACCIDENT & POTHOLE HAZARD',
    title: 'Tragic Road Accident Reported Near Sector 17 Market Entrance',
    summary: 'A two-wheeler commuter lost control due to an unpatched deep pothole near Sector 17 market gate. Municipal Emergency Asphalt Dispatch #4 allocated for immediate resurfacing.',
    location: 'Sector 17, Main Market Gate',
    severity: 'CRITICAL',
    time: '12 mins ago',
    source: 'City Traffic Police & Municipal Control',
    relatedId: 'CR-1048'
  },
  {
    id: 'NEWS-880',
    category: 'WATER INFRASTRUCTURE',
    title: '14-Inch Main Potable Supply Pipeline Rupture Floods Palm Beach Road',
    summary: 'Pressurized water pipe seam burst reported. Water Supply Board engineers have initiated emergency isolation valves to stop fresh water wastage.',
    location: 'Road 12, Bus Depot Area',
    severity: 'HIGH',
    time: '45 mins ago',
    source: 'Water Supply & Sewage Board',
    relatedId: 'CR-1045'
  },
  {
    id: 'NEWS-879',
    category: 'ELECTRICAL HAZARD',
    title: 'Exposed High-Voltage Armored Cable Isolated at Station Road',
    summary: 'Following citizen hazard report CR-1043, Electrical Duty Squad #2 neutralized exposed wire casing near Bus Stop #3 to prevent public shock risk.',
    location: 'Station Road, Bus Stop #3',
    severity: 'HIGH',
    time: '2 hours ago',
    source: 'Electrical & Lighting Cell',
    relatedId: 'CR-1043'
  },
  {
    id: 'NEWS-878',
    category: 'DRAINAGE CLEARANCE',
    title: 'Monsoon Storm Drain Obstruction Cleared Ahead of Rainfall Alert',
    summary: 'Debris blockage cleared at Sector 15 storm drain grill, Restoring full channel capacity for rain runoff.',
    location: 'Sector 15, Service Lane',
    severity: 'RESOLVED',
    time: '4 hours ago',
    source: 'Storm Water Drainage Gang',
    relatedId: 'CR-1044'
  }
];

export const CivicNewsFeed = () => {
  const [activeCategory, setActiveCategory] = useState('ALL');

  const filteredNews =
    activeCategory === 'ALL'
      ? CIVIC_NEWS_ITEMS
      : CIVIC_NEWS_ITEMS.filter((n) => n.severity === activeCategory);

  return (
    <div className="rounded-lg border border-[#DDE1E7] bg-white p-5 shadow-sm space-y-4 font-sans">
      {/* Header & Live Ticker Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DDE1E7] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#D64545]/10 rounded-md text-[#D64545]">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#D64545] uppercase tracking-wider">
                LIVE INCIDENT & SAFETY NEWS FEED
              </span>
              <span className="w-2 h-2 rounded-full bg-[#D64545] animate-ping" />
            </div>
            <h4 className="text-lg font-bold font-heading text-[#14213D]">
              Local Civic Hazard News Alerts
            </h4>
          </div>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          {['ALL', 'CRITICAL', 'HIGH', 'RESOLVED'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveCategory(tab)}
              className={`px-2.5 py-1 rounded border transition-colors ${
                activeCategory === tab
                  ? 'bg-[#14213D] text-white border-[#14213D] font-bold'
                  : 'bg-[#F4F5F7] text-gray-700 border-[#DDE1E7] hover:bg-[#e8ebf0]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Breaking News Ticker Strip */}
      <div className="bg-[#D64545]/10 border border-[#D64545]/30 rounded-md p-3 flex items-center gap-3 text-xs text-[#D64545] font-sans">
        <Flame className="w-4 h-4 flex-shrink-0 animate-bounce text-[#D64545]" />
        <p className="font-semibold flex-1 truncate">
          BREAKING: Fatal pothole accident reported at Sector 17 main market. Emergency asphalt repair squad dispatched.
        </p>
        <span className="font-mono text-[10px] bg-[#D64545] text-white px-2 py-0.5 rounded font-bold">
          LIVE ALERT
        </span>
      </div>

      {/* News Cards Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNews.map((news) => (
          <div
            key={news.id}
            className="rounded-lg border border-[#DDE1E7] bg-white p-4 space-y-2.5 hover:border-[#C49A45] transition-all shadow-xs flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono font-bold uppercase text-[#14213D] bg-[#F4F5F7] px-2 py-0.5 rounded border border-[#DDE1E7]">
                  {news.category}
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    news.severity === 'CRITICAL'
                      ? 'bg-[#D64545] text-white'
                      : news.severity === 'HIGH'
                      ? 'bg-[#E8963C] text-white'
                      : 'bg-[#4A9B6E] text-white'
                  }`}
                >
                  {news.severity}
                </span>
              </div>

              <h5 className="text-base font-bold font-heading text-[#14213D] leading-snug">
                {news.title}
              </h5>

              <p className="text-xs text-gray-700 leading-relaxed font-sans">
                {news.summary}
              </p>
            </div>

            <div className="pt-2 border-t border-[#DDE1E7] flex items-center justify-between text-[11px] font-mono text-gray-500">
              <span>📍 {news.location}</span>
              <span className="text-gray-400">{news.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

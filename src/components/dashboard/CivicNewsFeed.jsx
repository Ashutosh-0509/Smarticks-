import React, { useState, useEffect } from 'react';
import { Radio, Loader2 } from 'lucide-react';

const FALLBACK_NEWS_ITEMS = [
  {
    id: 'NEWS-881',
    category: 'ROAD ACCIDENT & POTHOLE HAZARD',
    title: 'Road Accident Reported Near Sector 17 Market Entrance',
    summary: 'Two-wheeler accident reported due to pothole near Sector 17 market gate. Municipal Emergency Asphalt Dispatch #4 allocated for immediate resurfacing.',
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

const stripHtml = (html) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

const getRelativeTime = (dateString) => {
  const date = new Date(dateString.replace(' ', 'T') + 'Z'); 
  const now = new Date();
  let diffInSeconds = Math.floor((now - date) / 1000);
  
  if (isNaN(diffInSeconds) || diffInSeconds < 0) {
     return dateString.split(' ')[1] || "Recently"; 
  }
  
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} days ago`;
};

const categorizeNews = (title, content) => {
  const text = (title + ' ' + content).toLowerCase();
  
  // Strict exclusion filter: if it mentions politics, administration, or irrelevant topics, DROP IT immediately.
  const excludeKeywords = /\b(bjp|ncp|tmc|congress|shiv sena|aap|tax|court|bail|slams|minister|president|oppn|opposition|election|vote|campaign|rally|protest|policy|scheme|budget)\b/;
  
  if (excludeKeywords.test(text)) {
    return null;
  }
  
  // Use regex for word boundaries to prevent partial matches, and focus strictly on physical civic issues
  if (text.match(/\b(accident|crash|fire|collapse|hazard|emergency|casualty|injury|death|killed|murder|crime)\b/)) {
    return { category: 'EMERGENCY & CRIME', severity: 'CRITICAL' };
  }
  if (text.match(/\b(water cut|pipe burst|water logging|pothole|drain|sewage|garbage|infrastructure|power cut|electricity|blackout)\b/)) {
    return { category: 'CIVIC INFRASTRUCTURE', severity: 'HIGH' };
  }
  if (text.match(/\b(traffic|road block|highway|train|local|station|metro|bridge|delay|derail)\b/)) {
    return { category: 'TRANSIT & ROADS', severity: 'UPDATE' };
  }
  if (text.match(/\b(rain|weather|monsoon|alert|flood|cyclone|storm)\b/)) {
    return { category: 'WEATHER ALERT', severity: 'HIGH' };
  }
  
  // If it doesn't match any strict physical civic keywords, return null
  return null;
};

export const CivicNewsFeed = () => {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.hindustantimes.com/feeds/rss/cities/mumbai-news/rssfeed.xml');
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        
        if (data && data.items && data.items.length > 0) {
          const processedNews = [];
          
          for (let i = 0; i < data.items.length; i++) {
            const item = data.items[i];
            const classification = categorizeNews(item.title, item.description);
            
            // Only add news that successfully matched a civic category
            if (classification) {
              const cleanSummary = stripHtml(item.description).slice(0, 150) + '...';
              processedNews.push({
                id: `LIVE-NEWS-${processedNews.length}`,
                category: classification.category,
                title: item.title,
                summary: cleanSummary,
                location: 'Mumbai Region',
                severity: classification.severity,
                time: getRelativeTime(item.pubDate),
                source: 'Hindustan Times (Mumbai)',
                originalLink: item.link
              });
            }
          }

          // If the live feed has very few civic-related news items right now, pad it with our fallback mock data
          if (processedNews.length < 4) {
             const needed = 4 - processedNews.length;
             processedNews.push(...FALLBACK_NEWS_ITEMS.slice(0, needed));
          }
          
          setNewsItems(processedNews.slice(0, 8));
        } else {
          setNewsItems(FALLBACK_NEWS_ITEMS);
        }
      } catch (error) {
        console.error("Error fetching live civic news:", error);
        setNewsItems(FALLBACK_NEWS_ITEMS);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filteredNews =
    activeCategory === 'ALL'
      ? newsItems
      : newsItems.filter((n) => n.severity === activeCategory);

  return (
    <div className="rounded-lg border border-[#DDE1E7] bg-white p-5 shadow-sm space-y-4 font-sans h-full flex flex-col">
      {/* Header & Live Ticker Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DDE1E7] pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#F4F5F7] rounded-md border border-[#DDE1E7] text-[#14213D]">
            <Radio className="w-5 h-5 text-[#E8963C]" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.05em] text-[#14213D]">
                ACTIVE DISPATCH LOG
              </span>
              {loading && <Loader2 className="w-3 h-3 text-gray-500 animate-spin" />}
            </div>
            <h4 className="text-lg font-bold font-heading text-[#14213D]">
              Recent Incident Updates
            </h4>
          </div>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.05em]">
          {['ALL', 'CRITICAL', 'HIGH', 'UPDATE', 'RESOLVED'].map((tab) => (
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
      <div className="bg-white border border-[#DDE1E7] shadow-sm rounded-md p-3 flex items-center gap-3 text-xs text-[#14213D] font-sans">
        <Radio className="w-4 h-4 flex-shrink-0 text-[#D64545] animate-pulse" />
        <p className="font-semibold flex-1 truncate">
          {newsItems.length > 0 ? newsItems[0].title : "Connecting to civic news feed..."}
        </p>
        <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.05em] border border-[#D64545] text-[#D64545] px-2 py-0.5 rounded">
          LIVE ALERT
        </span>
      </div>

      {/* News Cards Feed */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-sm text-gray-500 font-medium">
            No updates found for this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNews.map((news) => (
              <a
                key={news.id}
                href={news.originalLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-[#DDE1E7] bg-white p-4 space-y-2.5 hover:border-[#C49A45] transition-all shadow-xs flex flex-col justify-between block cursor-pointer group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.05em] text-[#14213D] bg-[#F4F5F7] px-2 py-0.5 rounded border border-[#DDE1E7] truncate max-w-[150px]">
                      {news.category}
                    </span>
                    <span
                      className={`text-[10px] font-sans font-semibold uppercase tracking-[0.05em] px-2 py-0.5 rounded flex-shrink-0 ${
                        news.severity === 'CRITICAL'
                          ? 'bg-[#D64545] text-white'
                          : news.severity === 'HIGH'
                          ? 'bg-[#E8963C] text-white'
                          : news.severity === 'UPDATE'
                          ? 'bg-[#1E5A99] text-white'
                          : 'bg-[#4A9B6E] text-white'
                      }`}
                    >
                      {news.severity}
                    </span>
                  </div>

                  <h5 className="text-base font-bold font-heading text-[#14213D] leading-snug group-hover:text-[#C49A45] transition-colors">
                    {news.title}
                  </h5>

                  <p className="text-xs text-gray-700 leading-relaxed font-sans line-clamp-3">
                    {news.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#DDE1E7] flex items-center justify-between text-[11px] font-sans font-medium text-gray-500 uppercase tracking-wide">
                  <span>📍 {news.location}</span>
                  <span className="text-gray-400">{news.time}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


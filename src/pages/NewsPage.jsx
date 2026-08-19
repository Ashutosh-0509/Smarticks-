import React from 'react';
import { Newspaper } from 'lucide-react';
import { CivicNewsFeed } from '../components/dashboard/CivicNewsFeed';

export const NewsPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full animate-in fade-in duration-500 font-sans">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-[#C49A45]/10 rounded-lg border border-[#C49A45]/20">
            <Newspaper className="w-6 h-6 text-[#C49A45]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-heading text-[#14213D] tracking-tight">
              Live Civic Updates
            </h1>
          </div>
        </div>
        <p className="text-gray-600 max-w-3xl ml-14">
          Real-time incident reports, emergency alerts, and infrastructure updates for the Mumbai Region. Powered by live news feeds.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 h-[800px]">
        {/* We stretch the CivicNewsFeed to fill this container */}
        <CivicNewsFeed />
      </div>
    </div>
  );
};

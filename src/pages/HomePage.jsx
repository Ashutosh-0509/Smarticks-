import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Globe, Activity, MapPin, Building2 } from 'lucide-react';
import { MapView } from '../components/map/MapView';
import { PrioritySignal } from '../components/complaint/PrioritySignal';
import { getComplaints } from '../services/complaintService';
import { useLanguage } from '../context/LanguageContext';

export const HomePage = () => {
  const { t } = useLanguage();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getComplaints();
        setComplaints(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="w-full space-y-12 font-sans">
      {/* ══ HERO ══ */}
      <section
        className="relative w-full min-h-screen sm:min-h-[600px] flex items-end sm:items-center bg-[#0B1E3D] overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/hero-bg.jpg')`
        }}
      >
        {/* Full dark gradient – stronger at bottom for mobile readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1E3D]/40 via-[#0B1E3D]/60 to-[#0B1E3D]/95 sm:bg-gradient-to-r sm:from-[#0B1E3D]/90 sm:via-[#0B1E3D]/70 sm:to-[#0B1E3D]/20 pointer-events-none" />

        <div className="relative z-10 w-full px-5 sm:px-10 pb-10 sm:py-20">
          <div className="max-w-xl space-y-5">
            {/* Numbered badge – matches CityWall "02 • AI COMPLAINT ACTION SYSTEM" */}
            <div className="inline-flex items-center gap-2 bg-[#C49A45] text-[#14213D] text-[11px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded">
              <span>02</span>
              <span className="w-px h-3 bg-[#14213D]/40" />
              <span>AI Complaint Action System</span>
            </div>

            {/* Big headline */}
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-[1.15] drop-shadow-xl">
              {t('hero.title')}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-white/80 font-sans leading-relaxed">
              AI-powered civic action platform allowing citizens to report potholes, garbage, water leaks, and streetlights using{' '}
              <strong className="text-white">Text, Images, or Voice</strong>. Automatically parsed, prioritized, and routed to municipal departments.
            </p>

            {/* Two stacked CTA buttons – matching screenshot */}
            <div className="flex flex-col gap-3 pt-2 max-w-sm">
              <Link to="/report" className="block">
                <button
                  type="button"
                  className="w-full flex items-center justify-between bg-[#C49A45] hover:bg-[#a88235] text-white font-bold text-sm sm:text-base px-5 py-3.5 rounded-lg cursor-pointer transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                >
                  <span>Report Issue (Text, Photo, Voice)</span>
                  <ArrowRight className="w-5 h-5 flex-shrink-0" />
                </button>
              </Link>

              <Link to="/track/CR-1048" className="block">
                <button
                  type="button"
                  className="w-full flex items-center justify-between border-2 border-white/70 text-white hover:bg-white/10 font-bold text-sm sm:text-base px-5 py-3.5 rounded-lg cursor-pointer transition-all active:scale-[0.98]"
                >
                  <span>Track Complaint Status</span>
                  <ArrowRight className="w-5 h-5 flex-shrink-0" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4 OVERLAPPING FEATURE CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 -mt-24 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* CARD 1: AI Reasoning */}
          <div className="bg-white p-7 rounded-lg border border-[#DDE1E7] shadow-sm space-y-4">
            <div className="text-[#14213D] flex items-center justify-start">
              <Sparkles className="w-6 h-6 text-[#C49A45]" />
            </div>
            <h4 className="text-lg font-bold font-heading text-[#14213D] leading-snug">
              {t('features.ai.title')}
            </h4>
            <p className="text-xs text-gray-600 font-sans leading-relaxed">
              {t('features.ai.desc')}
            </p>
          </div>

          {/* CARD 2: Public Transparency Map */}
          <div className="bg-white p-7 rounded-lg border border-[#DDE1E7] shadow-sm space-y-4">
            <div className="text-[#14213D] flex items-center justify-start">
              <Globe className="w-6 h-6 text-[#C49A45]" />
            </div>
            <h4 className="text-lg font-bold font-heading text-[#14213D] leading-snug">
              {t('features.map.title')}
            </h4>
            <p className="text-xs text-gray-600 font-sans leading-relaxed">
              {t('features.map.desc')}
            </p>
          </div>

          {/* CARD 3: Status Tracking */}
          <div className="bg-white p-7 rounded-lg border border-[#DDE1E7] shadow-sm space-y-4">
            <div className="text-[#14213D] flex items-center justify-start">
              <Activity className="w-6 h-6 text-[#C49A45]" />
            </div>
            <h4 className="text-lg font-bold font-heading text-[#14213D] leading-snug">
              {t('features.tracking.title')}
            </h4>
            <p className="text-xs text-gray-600 font-sans leading-relaxed">
              {t('features.tracking.desc')}
            </p>
          </div>

          {/* CARD 4: Department Dashboard */}
          <div className="bg-white p-7 rounded-lg border border-[#DDE1E7] shadow-sm space-y-4">
            <div className="text-[#14213D] flex items-center justify-start">
              <Building2 className="w-6 h-6 text-[#C49A45]" />
            </div>
            <h4 className="text-lg font-bold font-heading text-[#14213D] leading-snug">
              {t('features.routing.title')}
            </h4>
            <p className="text-xs text-gray-600 font-sans leading-relaxed">
              {t('features.routing.desc')}
            </p>
          </div>
        </div>
      </section>

      {/* BANNER STRIP BELOW CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="rounded-lg border border-[#DDE1E7] bg-white p-4 sm:p-6 shadow-sm">
          <p className="text-sm font-sans text-[#14213D] font-medium text-center">
            {t('officialPortal')}
          </p>
        </div>
      </section>

      {/* LIVE CIVIC ISSUE MAP SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-4">
        <div className="flex items-center justify-between border-b border-[#DDE1E7] pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-gray-500 uppercase tracking-wider block">
              {t('realTimeLabel')}
            </span>
            <h2 className="text-2xl font-bold font-heading text-[#14213D] flex items-center gap-2">
              <MapPin className="w-6 h-6 text-[#E8963C]" />
              {t('priorityHeatmap')}
            </h2>
          </div>
          <span className="text-xs font-mono text-gray-500">
            {complaints.length} {t('activeReportsOnMap')}
          </span>
        </div>

        <MapView complaints={complaints} height="480px" />
        <div className="pt-2">
          <p className="text-xs text-gray-500 font-sans italic flex items-center justify-center sm:justify-end gap-1.5">
            {t('mapDisclaimer')}
          </p>
        </div>
      </section>

      {/* RECENT CIVIC REPORTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-[#DDE1E7] pb-4">
          <h3 className="text-2xl font-bold font-heading text-[#14213D]">
            {t('recentActivity')}
          </h3>
          <Link to="/dashboard" className="text-xs font-mono font-semibold text-[#E8963C] hover:underline">
            {t('staffDashboard')}
          </Link>
        </div>

        {complaints.length === 0 ? (
          <div className="p-8 text-center rounded-lg border border-dashed border-[#DDE1E7] bg-white space-y-3">
            <Building2 className="w-8 h-8 text-[#C49A45] mx-auto" />
            <h4 className="text-lg font-bold font-heading text-[#14213D]">{t('noComplaintsTitle')}</h4>
            <p className="text-xs text-gray-600 font-sans max-w-md mx-auto">
              {t('noComplaintsDesc')}
            </p>
            <Link to="/report">
              <button className="mt-2 px-5 py-2 bg-[#C49A45] text-white text-xs font-bold rounded cursor-pointer">
                {t('reportNow')}
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complaints.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-[#DDE1E7] bg-white p-6 shadow-sm hover:border-[#C49A45] transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#14213D] bg-[#F4F5F7] px-2 py-0.5 rounded border border-[#DDE1E7]">
                      {item.id}
                    </span>
                    <PrioritySignal priority={item.priority} />
                  </div>

                  <h4 className="text-lg font-semibold font-heading text-[#14213D] line-clamp-1">
                    {item.title}
                  </h4>

                  <p className="text-xs text-gray-600 font-sans line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#DDE1E7] flex items-center justify-between text-xs font-sans">
                  <span className="text-gray-500 font-medium line-clamp-1">{item.location}</span>
                  <Link
                    to={`/track/${item.id}`}
                    className="font-semibold text-[#14213D] hover:text-[#C49A45] flex items-center gap-1 shrink-0 ml-2"
                  >
                    Track <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

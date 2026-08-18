import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Globe, Activity, MapPin, Building2 } from 'lucide-react';
import { MapView } from '../components/map/MapView';
import { PrioritySignal } from '../components/complaint/PrioritySignal';
import { getComplaints } from '../services/complaintService';

export const HomePage = () => {
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
    <div className="w-full space-y-12">
      {/* GRAND HERO BANNER with Crisp Municipal Building Image & Clear Overlay */}
      <section
        className="relative w-full min-h-[580px] bg-cover bg-center bg-no-repeat flex items-center justify-start overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.25)), url('/hero-bg.jpg')`
        }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full py-20 pb-36 space-y-6">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm font-semibold font-sans uppercase text-white tracking-widest drop-shadow-md">
              Civic AI Complaint Action System
            </p>

            <h1 className="text-4xl sm:text-6xl font-extrabold font-heading text-white leading-tight drop-shadow-lg">
              Smart Issue Resolution Through Transparent AI
            </h1>

            <p className="text-base text-gray-100 font-sans leading-relaxed max-w-xl drop-shadow-md">
              Report local civic problems like potholes or broken streetlights. Our AI automatically classifies issues, assigns priority, and routes them to the right municipal department for faster action.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Link to="/report">
                <button
                  type="button"
                  className="px-7 py-3.5 bg-[#C49A45] hover:bg-[#a88235] text-white text-base font-bold rounded font-sans transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Discover More</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>

              <Link to="/track/CR-1048">
                <button
                  type="button"
                  className="px-7 py-3.5 bg-[#C49A45]/35 hover:bg-[#C49A45]/60 text-white border border-[#C49A45]/60 text-base font-semibold rounded font-sans transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-xs"
                >
                  <span>Track Status</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4 OVERLAPPING FEATURE CARDS (Exact match to screenshot 2) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 -mt-24 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* CARD 1: AI Reasoning */}
          <div className="bg-white p-7 rounded-none sm:rounded-lg border border-[#DDE1E7] shadow-xl space-y-4 hover:border-[#C49A45] transition-all group">
            <div className="w-12 h-12 rounded bg-[#C49A45]/20 border border-[#C49A45]/40 text-[#C49A45] flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold font-heading text-[#14213D] leading-snug group-hover:text-[#C49A45] transition-colors">
              Transparent AI Reasoning
            </h4>
            <p className="text-xs text-gray-600 font-sans leading-relaxed">
              No black boxes. See exactly why your issue was assigned its priority and routed to a specific department.
            </p>
          </div>

          {/* CARD 2: Public Transparency Map */}
          <div className="bg-white p-7 rounded-none sm:rounded-lg border border-[#DDE1E7] shadow-xl space-y-4 hover:border-[#C49A45] transition-all group">
            <div className="w-12 h-12 rounded bg-[#C49A45]/20 border border-[#C49A45]/40 text-[#C49A45] flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold font-heading text-[#14213D] leading-snug group-hover:text-[#C49A45] transition-colors">
              Public Transparency Map
            </h4>
            <p className="text-xs text-gray-600 font-sans leading-relaxed">
              Anyone can see all reported issues and their live status across the city. Accountability is built right in.
            </p>
          </div>

          {/* CARD 3: Status Tracking */}
          <div className="bg-white p-7 rounded-none sm:rounded-lg border border-[#DDE1E7] shadow-xl space-y-4 hover:border-[#C49A45] transition-all group">
            <div className="w-12 h-12 rounded bg-[#C49A45]/20 border border-[#C49A45]/40 text-[#C49A45] flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold font-heading text-[#14213D] leading-snug group-hover:text-[#C49A45] transition-colors">
              Real-Time Status Tracking
            </h4>
            <p className="text-xs text-gray-600 font-sans leading-relaxed">
              Follow your complaint's progress from submission to resolution with our easy-to-use timeline view.
            </p>
          </div>

          {/* CARD 4: Department Dashboard */}
          <div className="bg-white p-7 rounded-none sm:rounded-lg border border-[#DDE1E7] shadow-xl space-y-4 hover:border-[#C49A45] transition-all group">
            <div className="w-12 h-12 rounded bg-[#14213D] text-[#C49A45] flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold font-heading text-[#14213D] leading-snug group-hover:text-[#C49A45] transition-colors">
              Direct Authority Routing
            </h4>
            <p className="text-xs text-gray-600 font-sans leading-relaxed">
              Issues are instantly routed to the correct department's command center to drastically reduce response times.
            </p>
          </div>
        </div>
      </section>

      {/* BANNER STRIP BELOW CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="rounded-lg border border-[#DDE1E7] bg-white p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm font-sans text-[#14213D] font-medium text-center sm:text-left">
            The official portal for reporting, tracking, and resolving civic issues in our city.
          </p>

          <Link to="/report">
            <button
              type="button"
              className="px-6 py-2.5 bg-[#C49A45] hover:bg-[#a88235] text-white text-xs font-bold font-sans uppercase tracking-wider rounded transition-colors whitespace-nowrap"
            >
              Find Your Solution
            </button>
          </Link>
        </div>
      </section>

      {/* LIVE CIVIC ISSUE MAP SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-4">
        <div className="flex items-center justify-between border-b border-[#DDE1E7] pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-[#C49A45] uppercase tracking-wider block">
              REAL-TIME INFRASTRUCTURE ACTION
            </span>
            <h2 className="text-2xl font-bold font-heading text-[#14213D] flex items-center gap-2">
              <MapPin className="w-6 h-6 text-[#C49A45]" />
              Live Civic Monitoring Map
            </h2>
          </div>
          <span className="text-xs font-mono text-gray-500">
            {complaints.length} active reports on map
          </span>
        </div>

        <MapView complaints={complaints} height="480px" />
      </section>

      {/* RECENT CIVIC REPORTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-[#DDE1E7] pb-4">
          <h3 className="text-2xl font-bold font-heading text-[#14213D]">
            Recent Municipal Activity
          </h3>
          <Link to="/dashboard" className="text-xs font-mono font-semibold text-[#C49A45] hover:underline">
            Open Authority Command Center →
          </Link>
        </div>

        {complaints.length === 0 ? (
          <div className="p-8 text-center rounded-lg border border-dashed border-[#DDE1E7] bg-white space-y-3">
            <Building2 className="w-8 h-8 text-[#C49A45] mx-auto" />
            <h4 className="text-lg font-bold font-heading text-[#14213D]">No Complaints Reported Yet</h4>
            <p className="text-xs text-gray-600 font-sans max-w-md mx-auto">
              Be the first citizen to report a pothole, garbage overflow, or streetlight issue to municipal dispatch.
            </p>
            <Link to="/report">
              <button className="mt-2 px-5 py-2 bg-[#C49A45] text-white text-xs font-bold rounded">
                Report Issue Now
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
                  <span className="text-gray-500 font-medium">{item.location}</span>
                  <Link
                    to={`/track/${item.id}`}
                    className="font-semibold text-[#14213D] hover:text-[#C49A45] flex items-center gap-1"
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

import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, UserCheck, ArrowRight, Lock, Home, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const ProtectedRoute = ({ children, roleRequired = 'any' }) => {
  const { user, openAuthModal, quickLogin } = useAuth();
  const { t } = useLanguage();

  // If not logged in
  if (!user) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 font-sans">
        <div className="rounded-xl border border-[#DDE1E7] bg-white p-8 shadow-md text-center space-y-6">
          {/* Lock / Shield Icon */}
          <div className="flex justify-center">
            <div className="p-4 bg-[#14213D]/5 border border-[#14213D]/10 rounded-2xl text-[#14213D]">
              <ShieldCheck className="w-12 h-12 text-[#C49A45]" />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold text-[#C49A45] uppercase tracking-widest block">
              Citizen Authentication Required
            </span>
            <h2 className="text-2xl font-bold font-heading text-[#14213D]">
              Sign In to Report an Issue
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
              To prevent duplicate spam and provide real-time SMS/Email status updates, citizens must verify their identity before filing complaints.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 gap-3 text-left p-4 bg-[#F4F5F7] rounded-lg border border-[#DDE1E7] text-xs">
            <div className="flex items-center gap-2 text-gray-700">
              <UserCheck className="w-4 h-4 text-[#4A9B6E] flex-shrink-0" />
              <span>Verified Citizen Profile</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Lock className="w-4 h-4 text-[#4A9B6E] flex-shrink-0" />
              <span>Secure OTP Sign In</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Sparkles className="w-4 h-4 text-[#C49A45] flex-shrink-0" />
              <span>AI Pothole & Issue Routing</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <ShieldCheck className="w-4 h-4 text-[#4A9B6E] flex-shrink-0" />
              <span>Real-Time Grievance Tracking</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => openAuthModal()}
              className="w-full flex items-center justify-center gap-2 bg-[#14213D] hover:bg-[#0B1E3D] text-white font-bold text-sm py-3 px-6 rounded-lg transition-colors cursor-pointer shadow-md"
            >
              <span>Sign In with Email / OTP</span>
              <ArrowRight className="w-4 h-4 text-[#C49A45]" />
            </button>

            <button
              type="button"
              onClick={() => quickLogin('citizen')}
              className="w-full flex items-center justify-center gap-2 bg-[#C49A45] hover:bg-[#a88235] text-white font-bold text-sm py-2.5 px-6 rounded-lg transition-colors cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>1-Click Citizen Demo Login</span>
            </button>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-gray-500 hover:text-[#14213D] pt-2"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If staff role is required (e.g. for staff dashboard)
  if (roleRequired === 'staff' && user.role !== 'staff') {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 font-sans text-center">
        <div className="rounded-xl border border-[#DDE1E7] bg-white p-8 shadow-md space-y-4">
          <Lock className="w-12 h-12 text-[#D64545] mx-auto" />
          <h2 className="text-xl font-bold font-heading text-[#14213D]">Municipal Staff Access Only</h2>
          <p className="text-sm text-gray-600">
            This dashboard is restricted to authorized municipal officers. You are currently signed in as a Citizen.
          </p>
          <button
            type="button"
            onClick={() => quickLogin('staff')}
            className="px-5 py-2.5 bg-[#14213D] text-white text-xs font-bold rounded cursor-pointer"
          >
            Switch to Officer Demo Login
          </button>
        </div>
      </div>
    );
  }

  return children;
};

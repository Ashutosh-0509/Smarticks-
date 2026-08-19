import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import { ChevronDown, ArrowRight, LayoutGrid, Shield, Building2, UserCheck, MapPin, FilePlus, ClipboardCheck, LayoutDashboard } from 'lucide-react';
import { GovHeader } from './GovHeader';
import { AuthModal } from '../auth/AuthModal';
import { useAuth } from '../../context/AuthContext';

export const Layout = () => {
  const location = useLocation();
  const { user, openAuthModal } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState(null);

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#14213D] flex flex-col font-sans selection:bg-[#C49A45] selection:text-white">
      {/* Top Utility Bar */}
      <GovHeader />

      {/* Auth & Role Selection Modal */}
      <AuthModal />

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#DDE1E7] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group focus-visible:outline-none">
            <div className="w-11 h-11 rounded-lg bg-[#F4F5F7] text-[#C49A45] flex items-center justify-center font-heading font-bold text-xl shadow-inner border border-[#DDE1E7] group-hover:border-[#C49A45] transition-colors">
              <Building2 className="w-7 h-7 text-[#C49A45]" />
            </div>
            <div>
              <span className="text-[26px] font-bold font-sans text-[#14213D] tracking-tight leading-none">
                CivicReport
              </span>
              <span className="text-[10px] text-gray-500 font-sans block mt-0.5 tracking-wide">
                City Government Online Services
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-sans font-medium text-[#14213D]">
            {/* Home Dropdown */}
            <div className="relative group">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-1 py-2 hover:text-[#C49A45] transition-colors ${
                    isActive ? 'text-[#C49A45] font-semibold' : ''
                  }`
                }
              >
                <span>Home</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </NavLink>
            </div>

            {/* Citizen Portal Link */}
            <NavLink
              to="/citizen-portal"
              className={({ isActive }) =>
                `flex items-center gap-1 py-2 hover:text-[#C49A45] transition-colors ${
                  isActive ? 'text-[#C49A45] font-semibold' : ''
                }`
              }
            >
              <span>Citizen Portal</span>
            </NavLink>

            {/* Live News Link */}
            <NavLink
              to="/news"
              className={({ isActive }) =>
                `flex items-center gap-1 py-2 hover:text-[#C49A45] transition-colors ${
                  isActive ? 'text-[#C49A45] font-semibold' : ''
                }`
              }
            >
              <span>Civic News</span>
            </NavLink>

            {/* Authority Dashboard Link */}
            {user?.role === 'staff' && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-1 py-2 hover:text-[#C49A45] transition-colors ${
                    isActive ? 'text-[#C49A45] font-semibold' : ''
                  }`
                }
              >
                <span>Authority Dashboard</span>
              </NavLink>
            )}

            {/* Contact */}
            <Link to="/track/CR-1048" className="hover:text-[#C49A45] transition-colors">
              Contact / Track
            </Link>
          </nav>

          {/* Right Action Gold Button & Grid Menu Icon */}
          <div className="flex items-center gap-4">
            <Link to="/report">
              <button
                type="button"
                className="px-5 py-2.5 bg-[#C49A45] hover:bg-[#a88235] text-white text-sm font-semibold rounded font-sans transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Report Issue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Page Outlet */}
      <main className="flex-1 w-full mx-auto pb-24 md:pb-12">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#DDE1E7] shadow-lg px-2 py-2 flex items-center justify-around">
        <NavLink to="/" className="flex flex-col items-center justify-center py-1 px-3 rounded-lg text-xs font-medium text-gray-700 hover:text-[#C49A45]">
          <MapPin className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </NavLink>
        <NavLink to="/report" className="flex flex-col items-center justify-center py-1 px-3 rounded-lg text-xs font-medium text-gray-700 hover:text-[#C49A45]">
          <FilePlus className="w-5 h-5 mb-0.5" />
          <span>Report</span>
        </NavLink>
        <NavLink to="/citizen-portal" className="flex flex-col items-center justify-center py-1 px-3 rounded-lg text-xs font-medium text-gray-700 hover:text-[#C49A45]">
          <UserCheck className="w-5 h-5 mb-0.5" />
          <span>Citizen</span>
        </NavLink>
        {user?.role === 'staff' && (
          <NavLink to="/dashboard" className="flex flex-col items-center justify-center py-1 px-3 rounded-lg text-xs font-medium text-gray-700 hover:text-[#C49A45]">
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
            <span>Authority</span>
          </NavLink>
        )}
      </nav>

      {/* Official Footer */}
      <footer className="border-t border-[var(--border-color)] bg-[var(--surface-card)] text-[var(--ink)] py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-sans">
          <div className="text-gray-600">
            Maintained by <span className="font-semibold text-gray-800">Civic IT Department</span> • Last updated: Aug 2026
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <Link to="/privacy-policy" className="text-[#E8963C] hover:underline">Privacy Policy</Link>
            <Link to="/accessibility" className="text-[#E8963C] hover:underline">Accessibility Statement</Link>
            <Link to="/site-feedback" className="text-[#E8963C] hover:underline">Report an issue with this website</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

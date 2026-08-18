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
              <span className="text-2xl font-extrabold font-heading text-[#14213D] tracking-tight leading-none">
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

            {/* Grid menu icon */}
            <button
              type="button"
              onClick={() => openAuthModal('role_select')}
              className="p-2 rounded hover:bg-[#F4F5F7] text-[#14213D] transition-colors cursor-pointer"
              title="Access Portal Modes"
            >
              <LayoutGrid className="w-6 h-6 text-[#C49A45]" />
            </button>
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
      <footer className="border-t border-[#DDE1E7] bg-[#0B132B] text-white py-10 mt-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs font-sans">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-[#C49A45]" />
              <span className="text-xl font-bold font-heading">CivicReport</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Official City Government Online Services portal for public civic issue reporting, real-time AI dispatching, and municipal monitoring.
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="font-mono text-[#C49A45] font-bold text-sm uppercase">Quick Links</h5>
            <ul className="space-y-1.5 text-gray-300">
              <li><Link to="/" className="hover:text-[#C49A45]">Home Overview</Link></li>
              <li><Link to="/report" className="hover:text-[#C49A45]">Report an Issue</Link></li>
              <li><Link to="/track/CR-1048" className="hover:text-[#C49A45]">Track Complaint Status</Link></li>
              <li><Link to="/citizen-portal" className="hover:text-[#C49A45]">Citizen Verification</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="font-mono text-[#C49A45] font-bold text-sm uppercase">Municipal Divisions</h5>
            <ul className="space-y-1.5 text-gray-300">
              <li>Roads & Infrastructure</li>
              <li>Sanitation & Solid Waste</li>
              <li>Water Supply & Sewage</li>
              <li>Electrical & Street Lighting</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="font-mono text-[#C49A45] font-bold text-sm uppercase">Contact Helpline</h5>
            <p className="text-gray-300">City Hall, Central Municipal Square</p>
            <p className="text-gray-300">Emergency Hotline: <strong>1916 / 1070</strong></p>
            <p className="text-gray-300">Email: <strong>support@civicreport.gov</strong></p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 mt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 font-sans gap-2">
          <p>© 2026 CivicReport Government Online Services — All Rights Reserved.</p>
          <p className="font-mono text-gray-400">The official portal for reporting, tracking, and resolving civic issues in our city.</p>
        </div>
      </footer>
    </div>
  );
};

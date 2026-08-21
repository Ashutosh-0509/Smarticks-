import React, { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  ArrowRight, LayoutGrid, Phone, Mail, Globe, LogOut,
  MapPin, FilePlus, UserCheck, LayoutDashboard, Building2
} from 'lucide-react';
import { AuthModal } from '../auth/AuthModal';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const Layout = () => {
  const { user, openAuthModal, logout, quickLogin } = useAuth();
  const { language, changeLanguage, t } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);

  const langLabel = language === 'hi' ? 'हिंदी' : language === 'mr' ? 'मराठी' : 'English';

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-[#14213D] flex flex-col font-sans">
      {/* ── TIER 1 : TOP CONTACT BAR ── */}
      <div className="w-full bg-[#0B1E3D] text-white text-xs font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-9 flex items-center justify-between gap-4">
          {/* Left: Phone + Email */}
          <div className="flex items-center gap-4 opacity-90">
            <a href="tel:1916" className="flex items-center gap-1.5 hover:text-[#C49A45] transition-colors">
              <Phone className="w-3 h-3" />
              <span className="font-mono tracking-wide">+199(980) 6915</span>
            </a>
            <a href="mailto:support@civicai.gov.in" className="hidden sm:flex items-center gap-1.5 hover:text-[#C49A45] transition-colors">
              <Mail className="w-3 h-3" />
              <span>support@civicai.gov.in</span>
            </a>
          </div>

          {/* Right: Language + Officer Badge + Logout */}
          <div className="flex items-center gap-3">
            {/* Language dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangOpen(v => !v)}
                className="flex items-center gap-1 cursor-pointer hover:text-[#C49A45] transition-colors"
              >
                <Globe className="w-3 h-3" />
                <span>Language: <span className="font-semibold">{langLabel}</span></span>
                <span className="text-[10px] opacity-60">▼</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 w-32 bg-[#0F2849] border border-white/15 rounded shadow-xl z-50 py-1">
                  {[['en', 'English'], ['hi', 'हिंदी'], ['mr', 'मराठी']].map(([code, label]) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => { changeLanguage(code); setLangOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-white/10 cursor-pointer transition-colors ${language === code ? 'text-[#C49A45] font-semibold' : 'text-white/80'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Officer / Citizen badge */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 px-2 py-0.5 rounded text-[10px]">
                  {user.role === 'staff' ? (
                    <Building2 className="w-3 h-3 text-[#C49A45]" />
                  ) : (
                    <UserCheck className="w-3 h-3 text-green-400" />
                  )}
                  <span className="font-semibold text-[#C49A45] uppercase">
                    {user.role === 'staff' ? 'Officer' : 'Citizen'}
                  </span>
                  <span className="truncate max-w-[80px]">{user.name || user.email}</span>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  title="Sign Out"
                  className="p-1 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal()}
                className="text-[#C49A45] font-semibold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── TIER 2 : MAIN HEADER ── */}
      <header className="sticky top-0 z-40 bg-[#14213D] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand: Logo + Name + Badge */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-white/20 flex-shrink-0 shadow-md">
              <img
                src="/logo.png"
                alt="Civic AI"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-white leading-none tracking-tight">
                  Civic AI
                </span>
                <span className="text-[10px] font-bold bg-[#C49A45] text-[#14213D] px-1.5 py-0.5 rounded uppercase tracking-wider">
                  AI Complaint System
                </span>
              </div>
              <span className="text-[10px] text-white/50 block mt-0.5">
                Report an issue. Help your city act.
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-5 text-sm text-white/75 font-medium flex-1 justify-center">
            <NavLink to="/" className={({ isActive }) => `hover:text-white transition-colors ${isActive ? 'text-white font-semibold' : ''}`}>
              {t('home')}
            </NavLink>
            <NavLink to="/citizen-portal" className={({ isActive }) => `hover:text-white transition-colors ${isActive ? 'text-white font-semibold' : ''}`}>
              {t('citizenPortal')}
            </NavLink>
            <NavLink to="/news" className={({ isActive }) => `hover:text-white transition-colors ${isActive ? 'text-white font-semibold' : ''}`}>
              {t('civicNews')}
            </NavLink>
            <NavLink to="/track/CR-1048" className={({ isActive }) => `hover:text-white transition-colors ${isActive ? 'text-white font-semibold' : ''}`}>
              {t('contactTrack')}
            </NavLink>
            <NavLink to="/site-feedback" className={({ isActive }) => `hover:text-white transition-colors ${isActive ? 'text-white font-semibold' : ''}`}>
              {t('feedback')}
            </NavLink>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Report Issue CTA */}
            <Link to="/report">
              <button
                type="button"
                className="flex items-center gap-2 bg-[#C49A45] hover:bg-[#a88235] text-white text-sm font-bold px-4 py-2 rounded-lg transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-95"
              >
                <span>Report Issue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>

            {/* Grid / Dashboard icon */}
            <NavLink
              to="/dashboard"
              title="Authority Dashboard"
              className={({ isActive }) =>
                `p-2 rounded-lg border transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#C49A45] border-[#C49A45] text-white'
                    : 'border-white/20 text-white/70 hover:border-white/50 hover:text-white'
                }`
              }
            >
              <LayoutGrid className="w-5 h-5" />
            </NavLink>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal />

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 w-full pb-20 lg:pb-0">
        <Outlet />
      </main>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#14213D] border-t border-white/10 shadow-2xl">
        <div className="grid grid-cols-4 h-16">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors ${
                isActive ? 'text-[#C49A45]' : 'text-white/60 hover:text-white'
              }`
            }
          >
            <MapPin className="w-5 h-5" />
            <span>{t('home')}</span>
          </NavLink>

          <NavLink
            to="/report"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors ${
                isActive ? 'text-[#C49A45]' : 'text-white/60 hover:text-white'
              }`
            }
          >
            <FilePlus className="w-5 h-5" />
            <span>Report</span>
          </NavLink>

          <NavLink
            to="/citizen-portal"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors ${
                isActive ? 'text-[#C49A45]' : 'text-white/60 hover:text-white'
              }`
            }
          >
            <UserCheck className="w-5 h-5" />
            <span>Citizen</span>
          </NavLink>

          {/* Admin tab – circle highlight */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors ${
                isActive ? 'text-[#C49A45]' : 'text-white/60 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center -mt-5 shadow-lg border-2 ${isActive ? 'bg-[#C49A45] border-[#a88235]' : 'bg-[#C49A45] border-[#a88235]'}`}>
                  <LayoutDashboard className="w-5 h-5 text-white" />
                </div>
                <span className="mt-0.5 text-[#C49A45] font-bold">Admin</span>
              </>
            )}
          </NavLink>
        </div>
      </nav>

      {/* Footer */}
      <footer className="hidden lg:block border-t border-[#DDE1E7] bg-white text-[#14213D] py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-sans text-gray-500">
          <div>
            {t('footerMaintained')} <span className="font-semibold text-gray-700">{t('footerDept')}</span> • {t('footerUpdated')}
          </div>
          <div className="flex items-center gap-5">
            <Link to="/privacy-policy" className="text-[#E8963C] hover:underline">{t('privacyPolicy')}</Link>
            <Link to="/accessibility" className="text-[#E8963C] hover:underline">{t('accessibilityStatement')}</Link>
            <Link to="/site-feedback" className="text-[#E8963C] hover:underline">{t('siteFeedback')}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

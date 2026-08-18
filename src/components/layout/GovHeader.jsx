import React from 'react';
import { Phone, Mail, Globe, Facebook, Twitter, Instagram, Video, UserCheck, Building2, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const GovHeader = () => {
  const { user, openAuthModal, logout } = useAuth();
  return (
    <div className="w-full bg-[#0B132B] text-gray-300 border-b border-gray-800 text-xs font-sans select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-6 font-mono text-[11px] text-gray-300">
          <a href="tel:1916" className="flex items-center gap-1.5 hover:text-[#C49A45] transition-colors">
            <Phone className="w-3.5 h-3.5 text-[#C49A45]" />
            <span>1916 / 1070</span>
          </a>
          <span className="text-gray-700">|</span>
          <a href="mailto:support@civicreport.gov" className="flex items-center gap-1.5 hover:text-[#C49A45] transition-colors">
            <Mail className="w-3.5 h-3.5 text-[#C49A45]" />
            <span>support@civicreport.gov</span>
          </a>
        </div>

        {/* Right Language & Social Icons & Role Badge */}
        <div className="flex items-center gap-6 text-[11px]">
          {/* Social Links */}
          <div className="hidden md:flex items-center gap-3 text-gray-400">
            <span className="text-gray-400 font-sans">Follow on:</span>
            <a href="#" className="hover:text-white transition-colors" title="Facebook"><Facebook className="w-3.5 h-3.5" /></a>
            <a href="#" className="hover:text-white transition-colors" title="Twitter"><Twitter className="w-3.5 h-3.5" /></a>
            <a href="#" className="hover:text-white transition-colors" title="Vimeo"><Video className="w-3.5 h-3.5" /></a>
            <a href="#" className="hover:text-white transition-colors" title="Instagram"><Instagram className="w-3.5 h-3.5" /></a>
          </div>

          <span className="text-gray-700">|</span>

          {/* Auth / Role Badge */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-white/10 border border-white/20 font-mono text-[11px]">
                {user.role === 'staff' ? (
                  <>
                    <Building2 className="w-3 h-3 text-[#C49A45]" />
                    <span className="text-[#C49A45] font-bold">AUTHORITY:</span>
                    <span className="text-white">{user.email}</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3 h-3 text-[#4A9B6E]" />
                    <span className="text-[#4A9B6E] font-bold">CITIZEN:</span>
                    <span className="text-white">{user.email}</span>
                  </>
                )}
              </span>

              <button
                type="button"
                onClick={logout}
                className="p-1 rounded bg-white/10 hover:bg-[#D64545] text-gray-300 hover:text-white transition-colors"
                title="Logout / Switch Role"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal('role_select')}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#C49A45] text-[#0B132B] font-mono font-bold rounded hover:bg-[#b58c3a] transition-colors"
            >
              <span>Login / Verify</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

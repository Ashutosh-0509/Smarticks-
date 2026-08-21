import React, { useEffect, useState } from 'react';
import { Shield, UserCheck, Building2, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const GovHeader = () => {
  const { user, openAuthModal, logout } = useAuth();
  const { language, changeLanguage, t } = useLanguage();
  const [currentScale, setCurrentScale] = useState(1);

  useEffect(() => {
    const savedScale = localStorage.getItem('civic_text_scale');
    if (savedScale) {
      const scale = parseFloat(savedScale);
      setCurrentScale(scale);
      applyScale(scale);
    }
  }, []);

  const applyScale = (scale) => {
    document.documentElement.style.setProperty('--text-scale', scale);
    if (scale === 1) document.documentElement.style.fontSize = '16px';
    if (scale === 0.9) document.documentElement.style.fontSize = '14.4px';
    if (scale === 1.1) document.documentElement.style.fontSize = '17.6px';
  };

  const handleScale = (scale) => {
    setCurrentScale(scale);
    localStorage.setItem('civic_text_scale', scale.toString());
    applyScale(scale);
  };

  return (
    <div className="w-full bg-[#0B1E3D] text-white border-b border-gray-800 text-sm font-sans select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-1.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Institutional Identity */}
        <div className="flex items-center gap-2 font-medium">
          <Shield className="w-4 h-4 text-white opacity-90" />
          <span>{t('govName')}</span>
        </div>

        {/* Right: Tools & Auth */}
        <div className="flex items-center gap-4 text-xs">
          {/* Text Size Toggle */}
          <div className="hidden sm:flex items-center gap-1.5 border-r border-white/20 pr-4">
            <span className="opacity-70 mr-1">{t('textSize')}</span>
            <button onClick={() => handleScale(0.9)} className={`hover:text-[#E8963C] font-medium px-1 cursor-pointer ${currentScale === 0.9 ? 'text-[#E8963C]' : ''}`}>A-</button>
            <button onClick={() => handleScale(1)} className={`hover:text-[#E8963C] font-medium px-1 cursor-pointer ${currentScale === 1 ? 'text-[#E8963C]' : ''}`}>A</button>
            <button onClick={() => handleScale(1.1)} className={`hover:text-[#E8963C] font-medium px-1 cursor-pointer ${currentScale === 1.1 ? 'text-[#E8963C]' : ''}`}>A+</button>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center gap-2 border-r border-white/20 pr-4">
            <button 
              onClick={() => changeLanguage('en')} 
              className={`hover:text-[#E8963C] cursor-pointer ${language === 'en' ? 'text-[#E8963C] font-semibold' : 'opacity-80'}`}
            >
              English
            </button>
            <span className="opacity-40">|</span>
            <button 
              onClick={() => changeLanguage('hi')} 
              className={`hover:text-[#E8963C] cursor-pointer ${language === 'hi' ? 'text-[#E8963C] font-semibold' : 'opacity-80'}`}
            >
              हिंदी
            </button>
            <span className="opacity-40">|</span>
            <button 
              onClick={() => changeLanguage('mr')} 
              className={`hover:text-[#E8963C] cursor-pointer ${language === 'mr' ? 'text-[#E8963C] font-semibold' : 'opacity-80'}`}
            >
              मराठी
            </button>
          </div>

          {/* Auth / Role Badge */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/10 font-mono text-[10px] uppercase">
                {user.role === 'staff' ? (
                  <>
                    <Building2 className="w-3 h-3 text-[#E8963C]" />
                    <span className="text-[#E8963C] font-bold">Staff:</span>
                    <span>{user.email}</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3 h-3 text-[#4A9B6E]" />
                    <span className="text-[#4A9B6E] font-bold">Citizen:</span>
                    <span>{user.email}</span>
                  </>
                )}
              </span>
              <button
                type="button"
                onClick={logout}
                className="p-1 hover:text-[#D64545] transition-colors cursor-pointer"
                title={t('logout')}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
              <button
                type="button"
                onClick={() => openAuthModal('role_select')}
                className="hover:text-[#E8963C] transition-colors font-semibold uppercase tracking-wider text-[11px] cursor-pointer border border-white/20 px-3 py-1.5 rounded hover:border-[#E8963C] bg-white/5"
              >
                {t('login')}
              </button>
          )}
        </div>
      </div>
    </div>
  );
};

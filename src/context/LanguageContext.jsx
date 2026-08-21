import React, { createContext, useContext, useState, useCallback } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('civic_language') || 'en';
  });

  const changeLanguage = useCallback((lang) => {
    setLanguage(lang);
    localStorage.setItem('civic_language', lang);
  }, []);

  // t(key) — dot-notation key lookup with English fallback
  const t = useCallback(
    (key) => {
      const keys = key.split('.');
      const resolve = (obj) => {
        let val = obj;
        for (const k of keys) {
          if (val == null) return undefined;
          val = val[k];
        }
        return val;
      };
      const result = resolve(translations[language]);
      if (result !== undefined && result !== null) return result;
      // Fallback to English
      const fallback = resolve(translations['en']);
      return fallback !== undefined ? fallback : key;
    },
    [language]
  );

  // Map language code to BCP-47 locale for Web Speech API
  const speechLocale =
    language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, speechLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a <LanguageProvider>');
  return ctx;
};

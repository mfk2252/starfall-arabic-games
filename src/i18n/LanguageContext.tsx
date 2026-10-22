import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Translations } from './types';
import { arTranslations } from './ar';
import { enTranslations } from './en';

interface LanguageContextType {
  language: Language;
  dir: 'rtl' | 'ltr';
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof Translations | string) => string;
  translations: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_LANG_KEY = 'starfall_lang';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_LANG_KEY) as Language;
      if (saved === 'ar' || saved === 'en') return saved;
    }
    return 'ar'; // Default Arabic
  });

  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const translations = language === 'ar' ? arTranslations : enTranslations;

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_LANG_KEY, lang);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = dir;
    }
  }, [language, dir]);

  const t = (key: string): string => {
    // Nested category lookup or top-level key
    if (key.startsWith('categoryNames.')) {
      const catKey = key.replace('categoryNames.', '');
      return translations.categoryNames[catKey] || catKey;
    }
    if (key.startsWith('categoryDescriptions.')) {
      const catKey = key.replace('categoryDescriptions.', '');
      return translations.categoryDescriptions[catKey] || catKey;
    }
    const val = (translations as unknown as Record<string, unknown>)[key];
    if (typeof val === 'string') return val;
    return key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        dir,
        setLanguage,
        toggleLanguage,
        t,
        translations,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
};

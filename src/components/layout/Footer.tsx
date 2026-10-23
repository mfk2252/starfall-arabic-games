import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import { sound } from '../../utils/audio';
import { Info } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language } = useLanguage();

  const titleText = language === 'ar' ? 'معلومات المطور والمنصة' : 'Developer & Platform Info';

  return (
    <footer
      className="w-full py-4 px-4 mt-auto flex items-center justify-center select-none"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      role="contentinfo"
    >
      <Link
        to="/about"
        onClick={() => sound.playClick()}
        className="group relative inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 hover:border-sky-300 dark:hover:border-sky-600 shadow-xs hover:shadow-md transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-500"
        aria-label={titleText}
        title={titleText}
      >
        <Info className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 group-hover:rotate-12" />

        {/* Hover / Focus Tooltip */}
        <span
          role="tooltip"
          className="pointer-events-none absolute -top-9 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-900/90 dark:bg-white/95 text-white dark:text-slate-900 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-150 whitespace-nowrap shadow-md z-30"
        >
          {titleText}
        </span>
      </Link>
    </footer>
  );
};

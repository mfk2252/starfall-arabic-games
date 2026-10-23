import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import { sound } from '../../utils/audio';
import {
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { ButterflyIcon } from '../common/ButterflyIcon';

export const Footer: React.FC = () => {
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();
  const personalWebsiteUrl = 'https://mfekry.vercel.app/';

  // Strictly single brand name per language (no bilingual mixing)
  const brandName = language === 'ar' ? 'تالين' : 'TALEEN';

  return (
    <footer
      className="w-full max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 py-6 mt-auto"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="bg-white dark:bg-[#0b1329] rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-6 sm:p-8 transition-colors duration-200">
        {/* Main Content Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-8 border-b border-slate-200/80 dark:border-slate-800/80">
          
          {/* Section 1: Brand & Founder Identity (Cols 1-7) */}
          <div className="lg:col-span-7 flex flex-col gap-4 text-center sm:text-start">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
              <Link
                to="/"
                onClick={() => sound.playClick()}
                className="flex items-center gap-2.5 group select-none shrink-0"
                aria-label={brandName}
              >
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-400 via-sky-500 to-indigo-500 p-1 flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-200">
                  <ButterflyIcon className="w-8 h-8 rounded-xl object-contain" />
                </div>
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  {brandName}
                </span>
              </Link>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
              {language === 'ar'
                ? 'منصة تفاعلية آمنة ومبتكرة لتعلم وتطوير مهارات الأطفال الحركية والمعرفية واللغوية عبر الألعاب الهادفة والقصص التفاعلية.'
                : 'An innovative interactive platform for early childhood cognitive, motor, and linguistic skill development through purposeful games and stories.'}
            </p>

            {/* Founder Portfolio Link */}
            <div className="pt-1">
              <a
                href={personalWebsiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-sky-50 dark:hover:bg-sky-950/60 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors border border-slate-200/60 dark:border-slate-700/60"
              >
                <span>{language === 'ar' ? 'الموقع الشخصي للمطور:' : 'Developer Portfolio:'}</span>
                <span className="text-sky-600 dark:text-sky-400 underline">mfekry.vercel.app</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Section 2: Consultation Action & Policy Links (Cols 8-12) */}
          <div className="lg:col-span-5 flex flex-col items-center sm:items-start justify-between gap-4">
            <div className="w-full space-y-2 text-center sm:text-start">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {language === 'ar' ? 'حجز الاستشارات' : 'Consultation Booking'}
              </h3>
              
              {/* SINGLE Consultation Button */}
              <Link
                to="/consultation"
                onClick={() => sound.playClick()}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-sky-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-5 py-3 rounded-2xl text-xs sm:text-sm font-black shadow-sm hover:shadow-md transition-all transform hover:scale-[1.02] active:scale-95"
              >
                <MessageSquare className="w-4 h-4 text-white" />
                <span>{language === 'ar' ? 'احجز استشارة' : 'Book Consultation'}</span>
              </Link>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Link
                to="/privacy"
                onClick={() => sound.playClick()}
                className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
              >
                {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </Link>
              <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">
                |
              </span>
              <Link
                to="/terms"
                onClick={() => sound.playClick()}
                className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
              >
                {language === 'ar' ? 'شروط الاستخدام' : 'Terms of Use'}
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Section: Secondary area with "عن تالين" and Copyright */}
        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 text-center sm:text-start font-medium">
          <div className="flex items-center gap-3">
            <Link
              to="/about"
              onClick={() => sound.playClick()}
              className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors font-bold text-slate-700 dark:text-slate-300 hover:underline"
            >
              {language === 'ar' ? 'عن تالين' : 'About Taleen'}
            </Link>
          </div>

          <p className="tabular-nums">
            {language === 'ar'
              ? `جميع الحقوق محفوظة. ${brandName} © ${currentYear}`
              : `All rights reserved. ${brandName} © ${currentYear}`}
          </p>
        </div>
      </div>
    </footer>
  );
};

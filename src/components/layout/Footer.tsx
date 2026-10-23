import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import { sound } from '../../utils/audio';
import {
  ExternalLink,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { ButterflyIcon } from '../common/ButterflyIcon';

// Clean vector social icons
const FacebookIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const TwitterXIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const YoutubeIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export const Footer: React.FC = () => {
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();
  const personalWebsiteUrl = 'https://mfekry.vercel.app/';

  // Strictly single brand name per language (no bilingual mixing)
  const brandName = language === 'ar' ? 'تالين' : 'TALEEN';

  return (
    <footer
      className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 mt-auto"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="bg-white dark:bg-[#0b1329] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 sm:p-8 transition-colors duration-200">
        {/* Top Section: Brand + Founder Website + Booking Pills + Secondary Links + Social Icons */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6">
          {/* Brand Logo & Founder Website Info */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-start">
            <Link
              to="/"
              onClick={() => sound.playClick()}
              className="flex items-center gap-2.5 group select-none shrink-0"
              aria-label={brandName}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 via-sky-500 to-indigo-500 p-1 flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-200">
                <ButterflyIcon className="w-7 h-7 rounded-xl object-contain" />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                {brandName}
              </span>
            </Link>

            {/* Founder Portfolio Link */}
            <a
              href={personalWebsiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="group flex flex-col items-center sm:items-start text-xs text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
            >
              <span className="inline-flex items-center gap-1 font-bold text-slate-700 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400">
                {language === 'ar' ? 'الموقع الشخصي' : 'Personal Website'}
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-sky-500" />
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 group-hover:underline">
                mfekry.vercel.app
              </span>
            </a>
          </div>

          {/* Center Action Buttons: «احجز جلستك» & «احجز استشارة» (as shown in reference design) */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/consultation"
              onClick={() => sound.playClick()}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-black shadow-xs hover:shadow-md transition-all transform hover:scale-105 active:scale-95"
            >
              <Calendar className="w-4 h-4 text-white" />
              <span>{language === 'ar' ? 'احجز جلستك' : 'Book Session'}</span>
            </Link>

            <Link
              to="/consultation"
              onClick={() => sound.playClick()}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-black shadow-xs hover:shadow-md transition-all transform hover:scale-105 active:scale-95"
            >
              <MessageSquare className="w-4 h-4 text-white" />
              <span>{language === 'ar' ? 'احجز استشارة' : 'Book Consultation'}</span>
            </Link>
          </div>

          {/* Left Side: Legal/Contact Links & Social Media Icons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            {/* Secondary text links */}
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
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
              <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">
                |
              </span>
              <Link
                to="/consultation"
                onClick={() => sound.playClick()}
                className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
              >
                {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
              </Link>
            </div>

            {/* Social Media Circular Buttons */}
            <div className="flex items-center gap-2">
              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-sky-950/60 hover:text-sky-600 dark:hover:text-sky-400 flex items-center justify-center transition-colors border border-slate-200/60 dark:border-slate-700"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>

              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-pink-50 dark:hover:bg-pink-950/60 hover:text-pink-600 dark:hover:text-pink-400 flex items-center justify-center transition-colors border border-slate-200/60 dark:border-slate-700"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>

              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                aria-label="X (formerly Twitter)"
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors border border-slate-200/60 dark:border-slate-700"
              >
                <TwitterXIcon className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/60 hover:text-rose-600 dark:hover:text-rose-400 flex items-center justify-center transition-colors border border-slate-200/60 dark:border-slate-700"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section: Divider & Centered Copyright + "عن تالين" */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-center text-xs text-slate-500 dark:text-slate-400 text-center">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/about"
              onClick={() => sound.playClick()}
              className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors font-medium hover:underline"
            >
              {language === 'ar' ? 'عن تالين' : 'About Taleen'}
            </Link>
            <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">
              |
            </span>
            <p>
              {language === 'ar'
                ? `جميع الحقوق محفوظة. ${brandName} © ${currentYear}`
                : `All rights reserved. ${brandName} © ${currentYear}`}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

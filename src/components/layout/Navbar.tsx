import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Gamepad2,
  LayoutGrid,
  BookOpen,
  Trophy,
  Globe,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../theme/ThemeContext';
import { sound } from '../../utils/audio';
import { ButterflyIcon } from '../common/ButterflyIcon';

export const Navbar: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(!sound.isEnabled());

  // Strictly single brand name per language (no bilingual mixing)
  const brandName = language === 'ar' ? 'تالين' : 'TALEEN';

  const handleToggleSound = () => {
    const enabled = sound.toggleSound();
    setIsMuted(!enabled);
    if (enabled) {
      sound.playClick();
    }
  };

  // Essential primary navigation links requested by the user
  const navLinks = [
    {
      to: '/',
      label: language === 'ar' ? 'الرئيسية' : 'Home',
      icon: Home,
    },
    {
      to: '/games',
      label: language === 'ar' ? 'جميع الألعاب' : 'All Games',
      icon: Gamepad2,
    },
    {
      to: '/categories',
      label: language === 'ar' ? 'الأقسام التعليمية' : 'Categories',
      icon: LayoutGrid,
    },
    {
      to: '/stories',
      label: language === 'ar' ? 'القصص والأنشطة' : 'Stories & Activities',
      icon: BookOpen,
    },
    {
      to: '/progress',
      label: language === 'ar' ? 'لوحة الإنجازات' : 'Achievements',
      icon: Trophy,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0b1329]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo: Butterfly Icon + Single Name Only */}
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

          {/* Desktop Navigation Links */}
          <nav
            aria-label={language === 'ar' ? 'التنقل الرئيسي' : 'Main Navigation'}
            className="hidden lg:flex items-center gap-1 xl:gap-2"
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => sound.playClick()}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-sm transition-all ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300 shadow-xs border border-sky-200/80 dark:border-sky-800'
                      : 'text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400 dark:text-slate-400'}`} />
                  <span className="whitespace-nowrap">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Controls: Dark/Light Mode, Language Switcher, Sound & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Dark / Light Mode Toggle Pill */}
            <button
              onClick={() => {
                sound.playClick();
                toggleTheme();
              }}
              className="relative p-1.5 sm:px-3 sm:py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              title={theme === 'dark' ? (language === 'ar' ? 'تفعيل الوضع النهاري' : 'Switch to Light Mode') : (language === 'ar' ? 'تفعيل الوضع الليلي' : 'Switch to Dark Mode')}
              aria-label="Toggle theme"
            >
              <div className="w-5 h-5 rounded-full flex items-center justify-center bg-amber-400 text-amber-950 dark:bg-indigo-500 dark:text-white transition-transform">
                {theme === 'dark' ? (
                  <Moon className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Sun className="w-3.5 h-3.5 fill-current" />
                )}
              </div>
              <span className="hidden sm:inline text-xs font-bold">
                {theme === 'dark'
                  ? (language === 'ar' ? 'ليلي' : 'Dark')
                  : (language === 'ar' ? 'نهاري' : 'Light')}
              </span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => {
                sound.playClick();
                toggleLanguage();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer shadow-xs"
              title={language === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>{language === 'ar' ? 'العربية' : 'English'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              className={`p-2 rounded-full border shadow-xs transition-all cursor-pointer ${
                isMuted
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400 border-rose-200 dark:border-rose-900/60'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100'
              }`}
              title={isMuted ? (language === 'ar' ? 'تشغيل الصوت' : 'Unmute') : (language === 'ar' ? 'كتم الصوت' : 'Mute')}
              aria-label="Toggle sound"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-[#0b1329]/98 px-4 pt-3 pb-5 space-y-1.5 shadow-xl animate-pop-in">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => {
                  sound.playClick();
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base transition-colors ${
                  isActive
                    ? 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};

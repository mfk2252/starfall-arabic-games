import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Volume2, VolumeX, Star, Globe, Menu, X, Sparkles, BookOpen, Layers, Trophy, Info } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { sound } from '../../utils/audio';
import { getAllProgress } from '../../utils/storage';

export const Navbar: React.FC = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(!sound.isEnabled());

  const progress = getAllProgress();
  const totalStars = Object.values(progress).reduce(
    (acc, curr) => acc + (curr.stars || 0),
    0
  );

  const handleToggleSound = () => {
    const enabled = sound.toggleSound();
    setIsMuted(!enabled);
    if (enabled) {
      sound.playClick();
    }
  };

  const navLinks = [
    { to: '/', label: t('goHome'), icon: Sparkles },
    { to: '/games', label: t('allGames'), icon: Layers },
    { to: '/categories', label: t('categories'), icon: BookOpen },
    { to: '/progress', label: t('myProgress'), icon: Trophy },
    { to: '/about', label: t('about'), icon: Info },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-sky-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => sound.playClick()}
            className="flex items-center gap-2.5 group select-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#4fc3f7] to-[#0288d1] flex items-center justify-center text-white text-2xl shadow-md group-hover:rotate-12 transition-transform">
              ⭐
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight leading-none group-hover:text-sky-600 transition-colors">
                {t('appName')}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-400 mt-0.5">
                {language === 'ar' ? 'منصة الألعاب التعليمية للأطفال' : 'Educational Games for Kids'}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => sound.playClick()}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full font-bold text-sm transition-all ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 font-black shadow-xs border border-sky-200'
                      : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Action Tools (Language, Audio, Stars) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Stars Count Pill */}
            <Link
              to="/progress"
              onClick={() => sound.playClick()}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 px-3 py-1.5 rounded-full text-xs sm:text-sm font-black shadow-xs hover:shadow-md transition-all transform hover:scale-105 border border-amber-300"
              title={t('starsEarned')}
            >
              <Star className="w-4 h-4 fill-amber-100 text-amber-200 animate-pulse" />
              <span className="tabular-nums">{totalStars}</span>
            </Link>

            {/* Language Switcher */}
            <button
              onClick={() => {
                sound.playClick();
                toggleLanguage();
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer shadow-xs"
              title={language === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
            >
              <Globe className="w-3.5 h-3.5 text-sky-600" />
              <span>{language === 'ar' ? 'English' : 'عربي'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              className={`p-2 rounded-full border shadow-xs transition-all cursor-pointer ${
                isMuted
                  ? 'bg-rose-50 text-rose-500 border-rose-200'
                  : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
              }`}
              title={isMuted ? t('soundOn') : t('soundOff')}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 px-4 pt-2 pb-4 space-y-1 shadow-lg animate-pop-in">
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
                    ? 'bg-sky-50 text-sky-700 font-black'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};

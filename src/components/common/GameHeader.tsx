import React from 'react';
import { ArrowRight, ArrowLeft, RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { sound } from '../../utils/audio';
import { useLanguage } from '../../i18n/LanguageContext';

interface GameHeaderProps {
  title: string;
  icon: string;
  score: number;
  onRestart: () => void;
  onGoHome: () => void;
  accentGradient?: string;
  badgeText?: string;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  title,
  icon,
  score,
  onRestart,
  onGoHome,
  accentGradient = 'from-emerald-500 to-teal-600',
  badgeText,
}) => {
  const { t, language } = useLanguage();
  const [isMuted, setIsMuted] = React.useState(!sound.isEnabled());
  const BackIcon = language === 'ar' ? ArrowRight : ArrowLeft;

  const handleToggleSound = () => {
    const enabled = sound.toggleSound();
    setIsMuted(!enabled);
    if (enabled) {
      sound.playClick();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-6 px-2 sm:px-0">
      {/* Top action row */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <button
          onClick={() => {
            sound.playClick();
            onGoHome();
          }}
          className="flex items-center gap-2 bg-white/95 dark:bg-[#0b1329] hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-100 px-4 py-2.5 rounded-full font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 border border-slate-200 dark:border-slate-800/90 cursor-pointer"
          title={t('backToGames')}
        >
          <BackIcon className="w-5 h-5 text-amber-500 dark:text-amber-400" />
          <span>{t('backToGames')}</span>
        </button>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className={`p-2.5 rounded-full border shadow-sm transition-all cursor-pointer ${
              isMuted
                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-500 dark:text-rose-400 border-rose-200 dark:border-rose-900'
                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900 hover:bg-emerald-100 dark:hover:bg-emerald-900/80'
            }`}
            title={isMuted ? t('soundOn') : t('soundOff')}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Restart button */}
          <button
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/80 text-amber-800 dark:text-amber-200 px-3.5 py-2.5 rounded-full font-bold border border-amber-200 dark:border-amber-800 shadow-sm transition-all transform hover:rotate-12 cursor-pointer"
            title={t('newGame')}
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">{t('newGame')}</span>
          </button>

          {/* Score Counter */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 dark:from-amber-500 dark:to-amber-600 text-amber-950 px-4 py-2 rounded-full font-black text-base sm:text-lg shadow-md border-2 border-amber-300 dark:border-amber-400">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-200 text-amber-100 animate-pulse" />
            <span>{t('score')}:</span>
            <span className="text-lg sm:text-xl tabular-nums">{score}</span>
          </div>
        </div>
      </div>

      {/* Title Card */}
      <div className={`p-4 sm:p-5 rounded-3xl bg-gradient-to-r ${accentGradient} text-white shadow-lg text-center relative overflow-hidden`}>
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="flex items-center justify-center gap-3 mb-1">
            <span className="text-3xl sm:text-4xl filter drop-shadow">{icon}</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-xs">
              {title}
            </h1>
          </div>
          {badgeText && (
            <span className="text-xs sm:text-sm bg-white/20 backdrop-blur-xs px-3 py-0.5 rounded-full font-semibold text-white/95 mt-1">
              {badgeText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, RotateCcw, Home, Trophy, Award } from 'lucide-react';
import { sound } from '../../utils/audio';
import { useLanguage } from '../../i18n/LanguageContext';

interface WinCelebrationProps {
  score: number;
  message?: string;
  onRestart: () => void;
  onGoHome: () => void;
  stars?: number;
}

export const WinCelebration: React.FC<WinCelebrationProps> = ({
  score,
  message,
  onRestart,
  onGoHome,
  stars = 3,
}) => {
  const { t, language } = useLanguage();

  const defaultMsg = message || t('winMessage');

  useEffect(() => {
    sound.playWin();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4fc3f7', '#81c784', '#ffd54f', '#ff8a65', '#f48fb1', '#ce93d8'],
      });
      const timer = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 350);
      return () => clearTimeout(timer);
    } catch {
      // Ignore if confetti fails in headless/test environments
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl border-4 border-amber-300 animate-pop-in relative overflow-hidden">
        {/* Decorative corner stars */}
        <div className="absolute top-2 left-2 text-2xl">⭐</div>
        <div className="absolute top-2 right-2 text-2xl">⭐</div>

        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
          <Trophy className="w-10 h-10 text-amber-900" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-2">
          {t('congratulations')}
        </h2>
        <p className="text-emerald-700 font-bold text-base sm:text-lg mb-6 leading-relaxed">
          {defaultMsg}
        </p>

        {/* Stars awarded */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((starIndex) => (
            <div
              key={starIndex}
              className={`transform transition-all duration-500 ${
                starIndex <= stars
                  ? 'scale-110 text-amber-400 drop-shadow-md'
                  : 'text-slate-200'
              }`}
            >
              <Star
                className="w-10 h-10"
                fill={starIndex <= stars ? 'currentColor' : 'none'}
              />
            </div>
          ))}
        </div>

        {/* Score badge */}
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-5 py-2.5 rounded-full font-black text-lg mb-6">
          <Award className="w-5 h-5 text-amber-500" />
          <span>{t('score')}:</span>
          <span className="text-2xl text-amber-600 font-black tabular-nums">{score}</span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-3 px-4 rounded-2xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{language === 'ar' ? 'العب مجدداً' : 'Play Again'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onGoHome();
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-2xl border border-slate-300 transition-all transform hover:scale-105 active:scale-95 cursor-pointer text-sm"
          >
            <Home className="w-4 h-4" />
            <span>{t('backToGames')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

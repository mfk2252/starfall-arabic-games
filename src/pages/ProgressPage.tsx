import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GAMES_LIST } from '../data/games';
import { getAllProgress } from '../utils/storage';
import { useLanguage } from '../i18n/LanguageContext';
import { sound } from '../utils/audio';
import { Trophy, Star, Award, RotateCcw, Play, CheckCircle2, AlertTriangle } from 'lucide-react';

export const ProgressPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [progress, setProgress] = useState(getAllProgress());
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const totalPossibleStars = GAMES_LIST.length * 3;
  const totalStarsEarned = Object.values(progress).reduce(
    (acc, curr) => acc + (curr.stars || 0),
    0
  );
  const totalCompletedGames = Object.values(progress).filter((p) => p.completed).length;

  const handleResetProgress = () => {
    sound.playClick();
    localStorage.removeItem('starfall_progress');
    setProgress({});
    setShowConfirmModal(false);
    setToastMessage(t('clearProgressSuccess'));
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Badges calculations
  const badges = [
    {
      id: 'first_step',
      name: language === 'ar' ? 'الخطوة الأولى' : 'First Step',
      icon: '🌱',
      achieved: totalCompletedGames >= 1,
      desc: language === 'ar' ? 'إكمال أول لعبة بنجاح' : 'Completed first game',
    },
    {
      id: 'star_collector',
      name: language === 'ar' ? 'جامع النجوم' : 'Star Collector',
      icon: '⭐',
      achieved: totalStarsEarned >= 15,
      desc: language === 'ar' ? 'الحصول على 15 نجمة' : 'Collected 15 stars',
    },
    {
      id: 'math_wizard',
      name: language === 'ar' ? 'عبقري الأرقام' : 'Math Wizard',
      icon: '🔢',
      achieved: !!progress['numbers']?.completed || !!progress['counting-compare']?.completed,
      desc: language === 'ar' ? 'إتقان ألعاب الأرقام والعد' : 'Mastered numbers games',
    },
    {
      id: 'language_hero',
      name: language === 'ar' ? 'بطل الحروف' : 'Letters Hero',
      icon: '🔤',
      achieved: !!progress['arabic-letters']?.completed && !!progress['arabic-words']?.completed,
      desc: language === 'ar' ? 'إتقان الحروف والكلمات العربية' : 'Mastered Arabic letters & words',
    },
    {
      id: 'puzzle_master',
      name: language === 'ar' ? 'خبير الألغاز' : 'Puzzle Master',
      icon: '🧩',
      achieved: !!progress['puzzle-2']?.completed || !!progress['puzzle-4']?.completed,
      desc: language === 'ar' ? 'تركيب البازل بدقة' : 'Assembled picture puzzles',
    },
    {
      id: 'logic_thinker',
      name: language === 'ar' ? 'المفكر المنطقي' : 'Logic Thinker',
      icon: '🧠',
      achieved: !!progress['pattern-complete']?.completed || !!progress['odd-one-out']?.completed,
      desc: language === 'ar' ? 'حل مسائل الأنماط والاختلاف' : 'Solved patterns & odd-one-out',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 start-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3 rounded-full font-bold shadow-xl animate-pop-in">
          {toastMessage}
        </div>
      )}

      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-3.5 py-1 rounded-full mb-3 border border-amber-200 dark:border-amber-800">
          <Trophy className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>{language === 'ar' ? 'سجل الإنجاز والتحفيز' : 'Achievements & Progress Tracker'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white mb-2">
          {t('myProgress')}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
          {language === 'ar'
            ? 'تابع تقدم طفلك وعدد النجوم المكتسبة والألعاب المكتملة'
            : 'Track your child’s stars, completed activities, and earned milestone badges'}
        </p>
      </div>

      {/* Main Stats Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10">
        {/* Total Stars */}
        <div className="bg-white dark:bg-[#20091b] rounded-3xl p-6 border border-pink-100 dark:border-[#3d122f] shadow-sm flex items-center gap-4 transition-colors">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center shrink-0">
            <Star className="w-9 h-9 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-pink-300/70 block mb-0.5">{t('starsEarned')}</span>
            <div className="text-3xl font-black text-slate-800 dark:text-pink-100 tabular-nums">
              {totalStarsEarned} <span className="text-sm font-semibold text-slate-400 dark:text-pink-400/60">/ {totalPossibleStars}</span>
            </div>
          </div>
        </div>

        {/* Completed Games */}
        <div className="bg-white dark:bg-[#20091b] rounded-3xl p-6 border border-pink-100 dark:border-[#3d122f] shadow-sm flex items-center gap-4 transition-colors">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-pink-300/70 block mb-0.5">
              {language === 'ar' ? 'الألعاب المكتملة' : 'Completed Games'}
            </span>
            <div className="text-3xl font-black text-slate-800 dark:text-pink-100 tabular-nums">
              {totalCompletedGames} <span className="text-sm font-semibold text-slate-400 dark:text-pink-400/60">/ {GAMES_LIST.length}</span>
            </div>
          </div>
        </div>

        {/* Badges Earned */}
        <div className="bg-white dark:bg-[#20091b] rounded-3xl p-6 border border-pink-100 dark:border-[#3d122f] shadow-sm flex items-center gap-4 transition-colors">
          <div className="w-16 h-16 rounded-2xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0">
            <Award className="w-9 h-9" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-pink-300/70 block mb-0.5">
              {language === 'ar' ? 'الأوسمة المحققة' : 'Badges Earned'}
            </span>
            <div className="text-3xl font-black text-slate-800 dark:text-pink-100 tabular-nums">
              {badges.filter((b) => b.achieved).length} <span className="text-sm font-semibold text-slate-400 dark:text-pink-400/60">/ {badges.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Milestone Badges Showcase */}
      <div className="bg-white dark:bg-[#20091b] rounded-3xl p-6 sm:p-8 shadow-sm border border-pink-100 dark:border-[#3d122f] mb-10 transition-colors">
        <h2 className="text-xl font-black text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <span>{language === 'ar' ? 'أوسمة الإنجاز والتميز' : 'Milestone Badges'}</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${
                b.achieved
                  ? 'bg-amber-50/70 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-200 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 opacity-60'
              }`}
            >
              <span className={`text-4xl mb-2 ${b.achieved ? 'filter drop-shadow scale-110' : 'grayscale'}`}>
                {b.icon}
              </span>
              <span className="text-sm font-black mb-1">{b.name}</span>
              <span className="text-[10px] font-semibold opacity-80">{b.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Game Scores Breakdown Table */}
      <div className="bg-white dark:bg-[#20091b] rounded-3xl p-6 sm:p-8 shadow-sm border border-pink-100 dark:border-[#3d122f] mb-10 transition-colors">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <h2 className="text-xl font-black text-slate-800 dark:text-pink-100">
            {language === 'ar' ? 'تفاصيل أداء الألعاب' : 'Game Breakdown & High Scores'}
          </h2>
          <button
            onClick={() => setShowConfirmModal(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 px-3 py-1.5 rounded-full border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('resetProgress')}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {GAMES_LIST.map((game) => {
            const data = progress[game.id];
            const stars = data?.stars || 0;
            const highScore = data?.highScore || 0;
            const timesPlayed = data?.timesPlayed || 0;

            return (
              <div
                key={game.id}
                className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between gap-3 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{game.icon}</span>
                  <div>
                    <h4 className="font-black text-sm text-slate-800 dark:text-slate-100">
                      {language === 'ar' ? game.title : game.titleEn}
                    </h4>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {language === 'ar' ? `لُعبت ${timesPlayed} مرات` : `Played ${timesPlayed} times`}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= stars ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 dark:fill-slate-700 text-slate-200 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-extrabold text-amber-700 dark:text-amber-500">
                    {highScore} {language === 'ar' ? 'نقطة' : 'pts'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/50 dark:bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#20091b] rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl border border-pink-200 dark:border-[#3d122f] animate-pop-in">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">
              {t('resetProgress')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mb-6 leading-relaxed">
              {t('resetProgressConfirm')}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleResetProgress}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-colors text-sm cursor-pointer"
              >
                {language === 'ar' ? 'نعم، تصفير الآن' : 'Yes, Reset Now'}
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 transition-colors text-sm cursor-pointer"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

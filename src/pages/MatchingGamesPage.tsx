import React from 'react';
import { Link } from 'react-router-dom';
import { GAMES_LIST } from '../data/games';
import { useLanguage } from '../i18n/LanguageContext';
import { sound } from '../utils/audio';
import { getAllProgress } from '../utils/storage';
import { ArrowRight, ArrowLeft, Star, Sparkles, Trophy } from 'lucide-react';
import { ButterflyIcon } from '../components/common/ButterflyIcon';

export const MatchingGamesPage: React.FC = () => {
  const { language } = useLanguage();
  const ArrowIcon = language === 'ar' ? ArrowRight : ArrowLeft;
  const progress = getAllProgress();

  // List of matching games IDs
  const matchingGameIds = ['numbers', 'arabic-letters', 'english-letters', 'images'];
  const matchingGames = GAMES_LIST.filter((g) => matchingGameIds.includes(g.id));

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6 animate-in fade-in duration-300" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className="w-full rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-sky-500 via-purple-600 to-indigo-700 text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-3 text-center sm:text-start max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-pink-100 border border-white/30">
            <ButterflyIcon className="w-4 h-4 text-pink-200" />
            <span>{language === 'ar' ? 'قسم الألعاب التفاعلية' : 'Interactive Games Section'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black">
            {language === 'ar' ? 'ألعاب التطابق والذاكرة 🧩' : 'Matching & Memory Games 🧩'}
          </h1>

          <p className="text-sm sm:text-base text-pink-100/90 font-medium leading-relaxed">
            {language === 'ar'
              ? 'مجموعة ألعاب تطابق الذاكرة الشيقة المصممة خصيصاً لتنمية التركيز، قوة الملاحظة، والذاكرة البصرية لدى الأطفال عبر الأرقام، الحروف، والصور.'
              : 'Delightful memory matching games designed to boost concentration, observation skills, and visual memory through numbers, letters, and pictures.'}
          </p>
        </div>

        <div className="text-8xl sm:text-9xl filter drop-shadow-lg animate-bounce shrink-0 select-none">
          🧩
        </div>
      </div>

      {/* Grid of Matching Games */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5 w-full">
        {matchingGames.map((game) => {
          const gameStars = progress[game.id]?.stars || 0;
          const isPlayed = !!progress[game.id];

          return (
            <Link
              key={game.id}
              to={`/games/${game.id}`}
              onClick={() => sound.playClick()}
              className="group p-6 rounded-3xl bg-white dark:bg-[#20091b] border-2 border-pink-100 dark:border-[#3d122f] hover:border-pink-400 dark:hover:border-pink-500 transition-all transform hover:-translate-y-1 shadow-md hover:shadow-xl flex flex-col justify-between gap-4 relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-100 to-purple-100 dark:from-[#2d0e26] dark:to-[#1a0716] border border-pink-200 dark:border-pink-900/40 flex items-center justify-center text-4xl shrink-0 shadow-inner group-hover:scale-110 transition-transform select-none">
                  {game.icon}
                </div>

                {/* Stars Badge */}
                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                  {[1, 2, 3].map((starIndex) => (
                    <Star
                      key={starIndex}
                      className={`w-4 h-4 ${
                        starIndex <= gameStars
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-800 dark:text-pink-100 mb-1 group-hover:text-pink-600 dark:group-hover:text-pink-300 transition-colors">
                  {language === 'ar' ? game.title : game.titleEn}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-pink-200/80 font-medium leading-relaxed">
                  {language === 'ar' ? game.description : game.descriptionEn}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-pink-50 dark:border-pink-950/40 text-xs font-bold">
                <span className="text-pink-600 dark:text-pink-400">
                  {language === 'ar' ? `الفئة العمرية: ${game.ageRange}` : `Age: ${game.ageRangeEn}`}
                </span>

                <div className="inline-flex items-center gap-1.5 text-pink-600 dark:text-pink-300 group-hover:translate-x-[-4px] transition-transform">
                  <span>{language === 'ar' ? 'العبي الآن' : 'Play Now'}</span>
                  <ArrowIcon className="w-4 h-4" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

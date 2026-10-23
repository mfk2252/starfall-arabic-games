import React from 'react';
import { Link } from 'react-router-dom';
import { GameInfo } from '../../types';
import { Star, Play, Sparkles } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { sound } from '../../utils/audio';
import { getGameProgress } from '../../utils/storage';

interface GameCardProps {
  game: GameInfo;
}

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const { language, t } = useLanguage();
  const gameData = getGameProgress(game.id);
  const starsEarned = gameData?.stars || 0;

  const title = language === 'ar' ? game.title : game.titleEn;
  const description = language === 'ar' ? game.description : game.descriptionEn;
  const ageRange = language === 'ar' ? game.ageRange : game.ageRangeEn;
  const skills = language === 'ar' ? game.skills : game.skillsEn;

  return (
    <Link
      to={`/games/${game.id}`}
      onClick={() => sound.playClick()}
      className="game-card bg-white dark:bg-[#0b1329] rounded-3xl p-6 text-center shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer relative overflow-hidden group border border-slate-100 dark:border-slate-800/90 hover:border-sky-300 dark:hover:border-sky-700 flex flex-col justify-between select-none transform hover:-translate-y-1.5"
    >
      {/* Rainbow stripe on top */}
      <div className="absolute top-0 left-0 right-0 h-1.5 card-rainbow-strip" />

      {/* Top Header metadata */}
      <div>
        <div className="flex items-center justify-between w-full mb-3 gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
              {ageRange}
            </span>
            {game.isNew && (
              <span className="text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>{language === 'ar' ? 'جديد' : 'NEW'}</span>
              </span>
            )}
          </div>

          {/* Stars indicator */}
          <div className="flex items-center gap-0.5" title={`${starsEarned} / 3`}>
            {[1, 2, 3].map((starIdx) => (
              <Star
                key={starIdx}
                className={`w-4 h-4 ${
                  starIdx <= starsEarned
                    ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                    : 'fill-slate-100 dark:fill-slate-800 text-slate-200 dark:text-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Game Big Icon */}
        <div className="my-2 flex items-center justify-center">
          <div
            className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${game.gradient} text-white flex items-center justify-center text-4xl shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
          >
            {game.icon}
          </div>
        </div>

        {/* Title & Description */}
        <div className="my-3 text-center">
          <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium line-clamp-2">
            {description}
          </p>
        </div>

        {/* Skills Tag Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 my-3">
          {skills.slice(0, 2).map((skill, i) => (
            <span
              key={i}
              className="text-[10px] bg-sky-50 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 px-2 py-0.5 rounded-md font-bold border border-sky-100 dark:border-sky-800/60"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Play Action Button */}
      <div className="mt-4 pt-2">
        <button
          type="button"
          className={`w-full py-2.5 px-5 rounded-full font-bold text-sm text-white shadow-md group-hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r ${game.gradient} group-hover:opacity-95 cursor-pointer`}
        >
          <Play className="w-4 h-4 fill-white" />
          <span>{t('playNow')}</span>
        </button>
      </div>
    </Link>
  );
};

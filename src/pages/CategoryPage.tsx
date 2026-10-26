import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { GAMES_LIST } from '../data/games';
import { GameCard } from '../components/ui/GameCard';
import { useLanguage } from '../i18n/LanguageContext';
import { sound } from '../utils/audio';
import { ArrowRight, ArrowLeft, BookOpen } from 'lucide-react';
import { GameCategory } from '../types';

export const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { t, language } = useLanguage();
  const ArrowIcon = language === 'ar' ? ArrowRight : ArrowLeft;

  const validCategories: GameCategory[] = ['numbers', 'letters', 'words', 'visual', 'logic', 'science'];

  if (!categoryId || !validCategories.includes(categoryId as GameCategory)) {
    return <Navigate to="/categories" replace />;
  }

  const categoryGames = GAMES_LIST.filter((g) => g.category === categoryId);
  const title = t(`categoryNames.${categoryId}`);
  const description = t(`categoryDescriptions.${categoryId}`);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      {/* Back button and breadcrumb */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/categories"
          onClick={() => sound.playClick()}
          className="inline-flex items-center gap-2 bg-white dark:bg-[#20091b] px-4 py-2 rounded-full font-bold text-sm text-slate-700 dark:text-pink-100 shadow-xs border border-pink-200/80 dark:border-[#3d122f] hover:bg-pink-50 dark:hover:bg-[#2d0e26] transition-colors"
        >
          <ArrowIcon className="w-4 h-4 text-pink-600 dark:text-pink-400" />
          <span>{language === 'ar' ? 'الرجوع إلى جميع الأقسام' : 'Back to Categories'}</span>
        </Link>

        <span className="text-xs font-bold bg-pink-50 dark:bg-pink-950/80 text-pink-800 dark:text-pink-200 px-3 py-1 rounded-full border border-pink-200 dark:border-pink-800">
          {categoryGames.length} {language === 'ar' ? 'ألعاب متوفرة' : 'Games available'}
        </span>
      </div>

      {/* Category Header Card */}
      <div className="bg-white dark:bg-[#20091b] rounded-3xl p-6 sm:p-8 shadow-md border border-pink-100 dark:border-[#3d122f] mb-8 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-pink-50 dark:bg-[#2a0c24] text-3xl mb-3 shadow-inner">
          <BookOpen className="w-8 h-8 text-pink-600 dark:text-pink-400" />
        </div>
        <h1 className="text-3xl font-black text-slate-800 dark:text-pink-100 mb-2">{title}</h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-pink-200/80 font-medium leading-relaxed">
          {description}
        </p>
      </div>

      {/* Category Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {categoryGames.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
};

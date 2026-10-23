import React, { useState, useMemo } from 'react';
import { GAMES_LIST } from '../data/games';
import { GameCard } from '../components/ui/GameCard';
import { useLanguage } from '../i18n/LanguageContext';
import { Search, Filter, Sparkles, Layers, RotateCcw } from 'lucide-react';
import { sound } from '../utils/audio';

export const AllGamesPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAge, setSelectedAge] = useState<string>('all');

  const categories = [
    { id: 'all', label: language === 'ar' ? 'جميع الأقسام' : 'All Categories' },
    { id: 'numbers', label: t('categoryNames.numbers') },
    { id: 'letters', label: t('categoryNames.letters') },
    { id: 'words', label: t('categoryNames.words') },
    { id: 'visual', label: t('categoryNames.visual') },
    { id: 'logic', label: t('categoryNames.logic') },
    { id: 'science', label: t('categoryNames.science') },
  ];

  const ageBrackets = [
    { id: 'all', label: t('allAges') },
    { id: '2-4', label: language === 'ar' ? '٢ - ٤ سنوات (براعم)' : '2-4 years' },
    { id: '4-6', label: language === 'ar' ? '٤ - ٦ سنوات (روضة)' : '4-6 years' },
    { id: '5-7', label: language === 'ar' ? '٥ - ٧ سنوات (ابتدائي)' : '5-7 years' },
  ];

  const filteredGames = useMemo(() => {
    return GAMES_LIST.filter((game) => {
      // Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        game.title.toLowerCase().includes(q) ||
        game.titleEn.toLowerCase().includes(q) ||
        game.description.toLowerCase().includes(q) ||
        game.descriptionEn.toLowerCase().includes(q) ||
        game.skills.some((s) => s.toLowerCase().includes(q)) ||
        game.skillsEn.some((s) => s.toLowerCase().includes(q));

      // Category filter
      const matchCategory =
        selectedCategory === 'all' || game.category === selectedCategory;

      // Age filter
      let matchAge = true;
      if (selectedAge === '2-4') {
        matchAge = game.minAge <= 4 && game.maxAge >= 2;
      } else if (selectedAge === '4-6') {
        matchAge = game.minAge <= 6 && game.maxAge >= 4;
      } else if (selectedAge === '5-7') {
        matchAge = game.minAge <= 7 && game.maxAge >= 5;
      }

      return matchSearch && matchCategory && matchAge;
    });
  }, [searchQuery, selectedCategory, selectedAge]);

  const handleResetFilters = () => {
    sound.playClick();
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedAge('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-100 dark:bg-sky-950/80 px-3.5 py-1 rounded-full mb-3 border border-sky-200/80 dark:border-sky-800/80">
          <Layers className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span>{language === 'ar' ? 'مكتبة الألعاب التعليمية الكاملة' : 'Complete Learning Games Library'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100 mb-2">
          {t('allGames')}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
          {language === 'ar'
            ? 'استكشف ١٨ لعبة تعليمية ممتعة تغطي الحساب، اللغة، الذاكرة، المنطق، والعلوم'
            : 'Explore 18 educational games covering math, language, memory, logic, and natural science'}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-5 sm:p-6 shadow-md border border-slate-100 dark:border-slate-800/90 mb-8 space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute top-1/2 -translate-y-1/2 start-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full bg-slate-50 dark:bg-[#070e20] border-2 border-slate-200 dark:border-slate-700 focus:border-sky-400 dark:focus:border-sky-400 focus:bg-white dark:focus:bg-[#070e20] rounded-2xl py-3 px-12 text-sm font-semibold outline-hidden transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute top-1/2 -translate-y-1/2 end-4 text-xs bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-full px-2 py-0.5 font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Categories row */}
        <div>
          <span className="text-xs font-bold text-slate-400 dark:text-slate-400 block mb-2">
            {t('filterByCategory')}:
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedCategory(cat.id);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-sky-600 dark:bg-sky-500 text-white shadow-xs scale-105'
                    : 'bg-slate-50 dark:bg-[#070e20] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Age brackets row */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-400">
              {t('filterByAge')}:
            </span>
            {ageBrackets.map((age) => (
              <button
                key={age.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedAge(age.id);
                }}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedAge === age.id
                    ? 'bg-amber-400 text-amber-950 shadow-xs'
                    : 'bg-slate-50 dark:bg-[#070e20] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80'
                }`}
              >
                {age.label}
              </button>
            ))}
          </div>

          {/* Reset Filters */}
          {(searchQuery || selectedCategory !== 'all' || selectedAge !== 'all') && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'إعادة تعيين الفلاتر' : 'Reset Filters'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6 px-1">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
          {language === 'ar' ? `عدد الألعاب المتاحة: ${filteredGames.length}` : `Available Games: ${filteredGames.length}`}
        </span>
      </div>

      {/* Games Grid or Empty State */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-800/90 shadow-sm max-w-md mx-auto my-8">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2">
            {t('noGamesFound')}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
            {language === 'ar'
              ? 'جرّب تغيير عبارة البحث أو اختيار فئة عمرية مختلفة لرؤية الألعاب'
              : 'Try modifying your search query or selecting a different age bracket'}
          </p>
          <button
            onClick={handleResetFilters}
            className="bg-sky-600 dark:bg-sky-500 hover:bg-sky-700 dark:hover:bg-sky-600 text-white font-bold px-6 py-2.5 rounded-full text-sm shadow-md transition-all cursor-pointer"
          >
            {language === 'ar' ? 'عرض جميع الألعاب' : 'View All Games'}
          </button>
        </div>
      )}
    </div>
  );
};

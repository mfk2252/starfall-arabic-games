import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GAMES_LIST } from '../data/games';
import { STORIES_LIST } from '../data/stories';
import { useLanguage } from '../i18n/LanguageContext';
import { sound } from '../utils/audio';
import { getAllProgress } from '../utils/storage';
import {
  Search,
  Sparkles,
  Shuffle,
  Star,
  BookOpen,
  X,
  Trophy,
  Gamepad2,
  ShieldCheck,
  Info
} from 'lucide-react';
import { ButterflyIcon } from '../components/common/ButterflyIcon';

type CategoryFilter = 'all' | 'letters' | 'numbers' | 'visual' | 'logic' | 'science' | 'stories';
type AgeFilter = 'all' | 'toddler' | 'preschool';

export const HomePage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [ageFilter, setAgeFilter] = useState<AgeFilter>('all');

  const brandName = language === 'ar' ? 'تالين' : 'TALEEN';
  const progress = getAllProgress();

  // Category filter definitions
  const categories = [
    { id: 'all', label: language === 'ar' ? 'الكل' : 'All', icon: '✨' },
    { id: 'letters', label: language === 'ar' ? 'الحروف والكلمات' : 'Letters & Words', icon: '🔤' },
    { id: 'numbers', label: language === 'ar' ? 'الأرقام والعد' : 'Numbers & Counting', icon: '🔢' },
    { id: 'visual', label: language === 'ar' ? 'الذاكرة والأشكال' : 'Visual & Shapes', icon: '🧩' },
    { id: 'logic', label: language === 'ar' ? 'التفكير والأنماط' : 'Logic & Patterns', icon: '🔄' },
    { id: 'science', label: language === 'ar' ? 'الطبيعة والعلوم' : 'Nature & Science', icon: '🌸' },
    { id: 'stories', label: language === 'ar' ? 'القصص التفاعلية' : 'Stories', icon: '📖' },
  ];

  // Combined activities list (games + stories)
  const allActivities = useMemo(() => {
    const gameItems = GAMES_LIST.map((game) => ({
      id: game.id,
      type: 'game' as const,
      title: language === 'ar' ? game.title : game.titleEn,
      description: language === 'ar' ? game.description : game.descriptionEn,
      icon: game.icon,
      gradient: game.gradient,
      category: game.category,
      minAge: game.minAge,
      maxAge: game.maxAge,
      ageRange: language === 'ar' ? game.ageRange : game.ageRangeEn,
      link: `/games/${game.id}`,
      stars: progress[game.id]?.stars || 0,
      played: !!progress[game.id],
      featured: game.featured,
      isNew: game.isNew,
    }));

    const storyItems = STORIES_LIST.map((story) => ({
      id: story.id,
      type: 'story' as const,
      title: language === 'ar' ? story.title : story.titleEn,
      description: language === 'ar' ? story.summary : story.summaryEn,
      icon: story.coverIcon,
      gradient: story.gradient,
      category: 'stories',
      minAge: 3,
      maxAge: 7,
      ageRange: language === 'ar' ? story.ageRange : story.ageRangeEn,
      link: `/stories/${story.id}`,
      stars: 3,
      played: false,
      featured: true,
      isNew: false,
    }));

    return [...gameItems, ...storyItems];
  }, [language, progress]);

  // Filtered items based on search and selected categories
  const filteredActivities = useMemo(() => {
    return allActivities.filter((item) => {
      // Category filter
      if (categoryFilter !== 'all') {
        if (categoryFilter === 'stories' && item.type !== 'story') return false;
        if (categoryFilter === 'letters' && !['letters', 'words'].includes(item.category)) return false;
        if (categoryFilter === 'numbers' && item.category !== 'numbers') return false;
        if (categoryFilter === 'visual' && item.category !== 'visual') return false;
        if (categoryFilter === 'logic' && item.category !== 'logic') return false;
        if (categoryFilter === 'science' && item.category !== 'science') return false;
      }

      // Age filter
      if (ageFilter === 'toddler' && item.minAge > 3) return false;
      if (ageFilter === 'preschool' && item.maxAge < 5) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }

      return true;
    });
  }, [allActivities, categoryFilter, ageFilter, searchQuery]);

  // Random activity launcher
  const handleRandomPlay = () => {
    sound.playClick();
    const randomIndex = Math.floor(Math.random() * allActivities.length);
    const chosen = allActivities[randomIndex];
    if (chosen) {
      navigate(chosen.link);
    }
  };

  // Total stars accumulated across all games
  const totalStars = Object.values(progress).reduce(
    (sum, curr) => sum + (curr.stars || 0),
    0
  );

  return (
    <div className="flex-1 w-full max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 py-4 sm:py-6 flex flex-col gap-5">
      {/* Control Bar: Search Input + Age Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'ar'
                ? 'ابحث عن لعبة أو مهارة (مثال: أرقام، حروف، ذاكرة)...'
                : 'Search any game or story...'
            }
            className="w-full ps-10 pe-9 py-2.5 bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-xs transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Age Filter Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800/80 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => {
              sound.playClick();
              setAgeFilter('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              ageFilter === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            {language === 'ar' ? 'جميع الأعمار' : 'All Ages'}
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setAgeFilter('toddler');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              ageFilter === 'toddler'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            {language === 'ar' ? '٢-٤ سنوات' : '2-4 yrs'}
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setAgeFilter('preschool');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              ageFilter === 'preschool'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            {language === 'ar' ? '٥-٧ سنوات' : '5-7 yrs'}
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none select-none">
        {categories.map((cat) => {
          const isActive = categoryFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                sound.playClick();
                setCategoryFilter(cat.id as CategoryFilter);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-sky-500 text-white shadow-xs shadow-sky-500/20 scale-[1.02]'
                  : 'bg-white dark:bg-[#0b1329] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Count Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium px-1">
        <span>
          {language === 'ar'
            ? `عرض ${filteredActivities.length} نشاط ولعبة`
            : `Showing ${filteredActivities.length} activities`}
        </span>
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all');
              setAgeFilter('all');
            }}
            className="text-sky-600 dark:text-sky-400 hover:underline font-bold"
          >
            {language === 'ar' ? 'إعادة ضبط التصفية' : 'Reset filters'}
          </button>
        )}
      </div>

      {/* App Launcher Fluid Grid */}
      {filteredActivities.length === 0 ? (
        <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-10 text-center border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-5xl mb-3">🔍</div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            {language === 'ar' ? 'لم نجد ألعابًا تطابق بحثك' : 'No activities matched your search'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {language === 'ar'
              ? 'جرّب كتابة كلمة أخرى مثل "حروف" أو "أرقام" أو اختر قسماً آخر'
              : 'Try searching for something else or reset the filter'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all');
              setAgeFilter('all');
            }}
            className="mt-4 px-4 py-2 bg-sky-500 text-white rounded-full text-xs font-bold hover:bg-sky-600 transition-colors cursor-pointer"
          >
            {language === 'ar' ? 'إظهار جميع الألعاب' : 'Show all games'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3 sm:gap-4.5">
          {filteredActivities.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              onClick={() => sound.playClick()}
              className="group bg-white dark:bg-[#0b1329] rounded-3xl p-3.5 sm:p-4 border border-slate-200/90 dark:border-slate-800/90 shadow-xs hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 active:scale-95 flex flex-col items-center text-center relative select-none"
            >
              {/* Completed / Star Badge */}
              {item.played && item.stars > 0 && (
                <div
                  className="absolute top-2 end-2 bg-amber-400 text-amber-950 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shadow-xs"
                  title={`${item.stars} ${language === 'ar' ? 'نجوم' : 'stars'}`}
                >
                  ★
                </div>
              )}

              {/* App Card Tactile Icon */}
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${item.gradient} text-white flex items-center justify-center text-2xl sm:text-3xl shadow-md group-hover:scale-105 transition-transform duration-200 mb-2.5`}
              >
                {item.icon}
              </div>

              {/* Title Underneath (Short, Clear & Non-overflowing) */}
              <h3 className="font-black text-xs sm:text-sm text-slate-800 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1 w-full leading-snug">
                {item.title}
              </h3>

              {/* Metadata */}
              <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 dark:text-slate-400 mt-0.5">
                <span>{item.ageRange}</span>
                {item.type === 'story' && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold">
                      {language === 'ar' ? 'قصة' : 'Story'}
                    </span>
                  </>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Bottom Taleen Interactive Banner Container (relocated above bottom footer) */}
      <div className="mt-4 bg-gradient-to-r from-sky-400 via-sky-500 to-indigo-500 dark:from-slate-900 dark:via-sky-950 dark:to-slate-900 rounded-3xl p-4 sm:p-6 text-white shadow-xs relative overflow-hidden transition-all duration-300">
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand Logo + Welcome Text */}
          <div className="flex items-center gap-3.5 text-center sm:text-start">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md p-2 flex items-center justify-center shadow-inner shrink-0">
              <ButterflyIcon className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl sm:text-3xl font-black tracking-tight drop-shadow-xs">
                  {brandName}
                </h2>
                <span className="text-[11px] bg-white/20 text-white font-bold px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                  {language === 'ar' ? 'منصة الألعاب والأنشطة' : 'Interactive Games App'}
                </span>
              </div>
              <p className="text-xs text-sky-100 dark:text-sky-200 font-medium mt-0.5">
                {language === 'ar'
                  ? 'اضغط على أي لعبة وابدأ التعلم والاستكشاف فوراً'
                  : 'Tap any activity card to jump directly into learning and fun'}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons (Random Game, Stars Counter, and Info Button) */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleRandomPlay}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-amber-950 px-4 py-2 sm:py-2.5 rounded-full font-black text-xs sm:text-sm shadow-xs transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
              title={language === 'ar' ? 'اختر لي لعبة عشوائية' : 'Pick a random game for me'}
            >
              <Shuffle className="w-4 h-4" />
              <span>{language === 'ar' ? 'لعبة عشوائية' : 'Surprise Me'}</span>
            </button>

            <Link
              to="/progress"
              onClick={() => sound.playClick()}
              className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm backdrop-blur-md shadow-xs transition-all border border-white/20"
              title={language === 'ar' ? 'لوحة النجوم والإنجازات' : 'Achievements board'}
            >
              <Star className="w-4 h-4 fill-amber-300 text-amber-300 animate-pulse" />
              <span className="tabular-nums font-black">{totalStars}</span>
              <span className="hidden sm:inline text-xs opacity-90">
                {language === 'ar' ? 'نجمة' : 'Stars'}
              </span>
            </Link>

            <Link
              to="/about"
              onClick={() => sound.playClick()}
              className="inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md shadow-xs transition-all border border-white/20 hover:scale-110 active:scale-95"
              title={language === 'ar' ? 'معلومات المطور والمنصة' : 'Developer & Platform Info'}
              aria-label={language === 'ar' ? 'معلومات المطور والمنصة' : 'Developer & Platform Info'}
            >
              <Info className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { GAMES_LIST } from '../data/games';
import { useLanguage } from '../i18n/LanguageContext';
import { sound } from '../utils/audio';
import { BookOpen, ArrowRight, ArrowLeft } from 'lucide-react';

export const CategoriesOverviewPage: React.FC = () => {
  const { t, language } = useLanguage();
  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  const categories = [
    {
      id: 'numbers',
      title: t('categoryNames.numbers'),
      description: t('categoryDescriptions.numbers'),
      icon: '🔢',
      color: 'from-[#4fc3f7] to-[#0288d1]',
      count: GAMES_LIST.filter((g) => g.category === 'numbers').length,
    },
    {
      id: 'letters',
      title: t('categoryNames.letters'),
      description: t('categoryDescriptions.letters'),
      icon: '🔤',
      color: 'from-[#81c784] to-[#2e7d32]',
      count: GAMES_LIST.filter((g) => g.category === 'letters').length,
    },
    {
      id: 'words',
      title: t('categoryNames.words'),
      description: t('categoryDescriptions.words'),
      icon: '📝',
      color: 'from-[#ff8a65] to-[#d84315]',
      count: GAMES_LIST.filter((g) => g.category === 'words').length,
    },
    {
      id: 'visual',
      title: t('categoryNames.visual'),
      description: t('categoryDescriptions.visual'),
      icon: '🧩',
      color: 'from-[#ce93d8] to-[#8e24aa]',
      count: GAMES_LIST.filter((g) => g.category === 'visual').length,
    },
    {
      id: 'logic',
      title: t('categoryNames.logic'),
      description: t('categoryDescriptions.logic'),
      icon: '🔄',
      color: 'from-[#00b4d8] to-[#0077b6]',
      count: GAMES_LIST.filter((g) => g.category === 'logic').length,
    },
    {
      id: 'science',
      title: t('categoryNames.science'),
      description: t('categoryDescriptions.science'),
      icon: '🌸',
      color: 'from-[#f48fb1] to-[#ab47bc]',
      count: GAMES_LIST.filter((g) => g.category === 'science').length,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-100 dark:bg-sky-950/80 px-3.5 py-1 rounded-full mb-3 border border-sky-200 dark:border-sky-800">
          <BookOpen className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span>{language === 'ar' ? 'المسارات والمجالات التعليمية' : 'Learning Curricular Domains'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100 mb-2">
          {t('categories')}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
          {language === 'ar'
            ? 'تم تقسيم الألعاب إلى ٦ مسارات تربوية متخصصة لتنمية مهارات الطفل المختلفة بشكل متوازن'
            : 'Games are structured into 6 pedagogical tracks to foster comprehensive child development'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/categories/${cat.id}`}
            onClick={() => sound.playClick()}
            className="bg-white dark:bg-[#0b1329] rounded-3xl p-6 sm:p-7 shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-100 dark:border-slate-800/90 group flex flex-col justify-between transform hover:-translate-y-1.5 select-none"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.color} text-white flex items-center justify-center text-3xl shadow-md group-hover:scale-110 transition-transform`}
                >
                  {cat.icon}
                </div>
                <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                  {cat.count} {language === 'ar' ? 'ألعاب' : 'games'}
                </span>
              </div>

              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                {cat.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-6">
                {cat.description}
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm font-bold text-sky-600 dark:text-sky-400 group-hover:text-sky-700 dark:group-hover:text-sky-300 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span>{language === 'ar' ? 'تصفح ألعاب هذا القسم' : 'Browse games in track'}</span>
              <ArrowIcon className="w-4 h-4 transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

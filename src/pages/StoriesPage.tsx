import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { STORIES_LIST, StoryInfo } from '../data/stories';
import { useLanguage } from '../i18n/LanguageContext';
import { sound } from '../utils/audio';
import { BookOpen, Sparkles, Clock, Heart, Play, ArrowRight, ArrowLeft } from 'lucide-react';

export const StoriesPage: React.FC = () => {
  const { language, t } = useLanguage();
  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-3.5 py-1 rounded-full mb-3 border border-amber-200 dark:border-amber-800">
          <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>{language === 'ar' ? 'القصص المصورة والأنشطة التفاعلية' : 'Interactive Illustrated Stories'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100 mb-2">
          {language === 'ar' ? 'قصص تالين الهادفة' : 'Taleen Educational Stories'}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
          {language === 'ar'
            ? 'قصص تفاعلية مصورة تنمي الخيال واللغة والقيم الإيجابية، مع أسئلة استيعاب خفيفة تشارك الطفل في أحداث القصة'
            : 'Illustrated stories nurturing imagination, language, and positive values with engaging questions'}
        </p>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {STORIES_LIST.map((story: StoryInfo) => {
          const title = language === 'ar' ? story.title : story.titleEn;
          const summary = language === 'ar' ? story.summary : story.summaryEn;
          const ageRange = language === 'ar' ? story.ageRange : story.ageRangeEn;
          const duration = language === 'ar' ? story.duration : story.durationEn;
          const moral = language === 'ar' ? story.moral : story.moralEn;

          return (
            <div
              key={story.id}
              className="bg-white dark:bg-[#20091b] rounded-3xl p-6 sm:p-7 shadow-md hover:shadow-2xl transition-all duration-300 border border-pink-100 dark:border-[#3d122f] hover:border-pink-300 dark:hover:border-pink-600/80 flex flex-col justify-between group transform hover:-translate-y-1.5"
            >
              <div>
                {/* Meta pills */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[11px] font-bold bg-pink-50 dark:bg-[#2a0c24] text-slate-700 dark:text-pink-200 px-2.5 py-1 rounded-full border border-pink-200/80 dark:border-[#421334]">
                    {ageRange}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-pink-300/70">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{duration}</span>
                  </div>
                </div>

                {/* Big Illustration Cover */}
                <div className="my-3 flex items-center justify-center">
                  <div
                    className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${story.gradient} text-white flex items-center justify-center text-5xl shadow-md group-hover:scale-110 transition-transform duration-300`}
                  >
                    {story.coverIcon}
                  </div>
                </div>

                {/* Title & Summary */}
                <div className="text-center my-3">
                  <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-1.5 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-4">
                    {summary}
                  </p>
                </div>

                {/* Moral lesson badge */}
                <div className="bg-amber-50/80 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800 rounded-2xl p-3 mb-6 text-xs text-amber-900 dark:text-amber-200 font-bold flex items-start gap-2">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] text-amber-700 dark:text-amber-400 font-extrabold uppercase">
                      {language === 'ar' ? 'العبرة والهدف التربوي:' : 'Educational Value:'}
                    </span>
                    <span>{moral}</span>
                  </div>
                </div>
              </div>

              {/* Start reading button */}
              <Link
                to={`/stories/${story.id}`}
                onClick={() => sound.playClick()}
                className={`w-full py-3 px-5 rounded-full font-black text-sm text-white shadow-md group-hover:shadow-lg transition-all flex items-center justify-center gap-2 bg-gradient-to-r ${story.gradient} hover:opacity-95`}
              >
                <BookOpen className="w-4 h-4" />
                <span>{language === 'ar' ? 'اقرأ القصة التفاعلية' : 'Read Interactive Story'}</span>
                <ArrowIcon className="w-4 h-4" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

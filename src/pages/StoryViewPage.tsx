import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { STORIES_LIST } from '../data/stories';
import { useLanguage } from '../i18n/LanguageContext';
import { sound } from '../utils/audio';
import { ArrowRight, ArrowLeft, BookOpen, RotateCcw, Check, Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export const StoryViewPage: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const { language } = useLanguage();
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answeredState, setAnsweredState] = useState<'correct' | 'wrong' | null>(null);
  const [storyCompleted, setStoryCompleted] = useState(false);

  const story = STORIES_LIST.find((s) => s.id === storyId);

  if (!story) {
    return <Navigate to="/stories" replace />;
  }

  const currentPage = story.pages[currentPageIdx];
  const totalPages = story.pages.length;
  const isLastPage = currentPageIdx === totalPages - 1;

  const handleNextPage = () => {
    sound.playClick();
    if (!isLastPage) {
      setCurrentPageIdx((prev) => prev + 1);
      setSelectedAnswer(null);
      setAnsweredState(null);
    } else {
      sound.playWin();
      setStoryCompleted(true);
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // Ignore
      }
    }
  };

  const handlePrevPage = () => {
    sound.playClick();
    if (currentPageIdx > 0) {
      setCurrentPageIdx((prev) => prev - 1);
      setSelectedAnswer(null);
      setAnsweredState(null);
      setStoryCompleted(false);
    }
  };

  const handleSelectOption = (idx: number, isCorrect: boolean) => {
    if (answeredState !== null) return;
    setSelectedAnswer(idx);

    if (isCorrect) {
      sound.playMatch();
      setAnsweredState('correct');
    } else {
      sound.playWrong();
      setAnsweredState('wrong');
    }
  };

  const handleRestartStory = () => {
    sound.playClick();
    setCurrentPageIdx(0);
    setSelectedAnswer(null);
    setAnsweredState(null);
    setStoryCompleted(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 w-full flex flex-col items-center flex-1">
      {/* Top Navigation Bar */}
      <div className="w-full flex items-center justify-between gap-3 mb-6 flex-wrap">
        <Link
          to="/stories"
          onClick={() => sound.playClick()}
          className="inline-flex items-center gap-2 bg-white dark:bg-[#0b1329] px-4 py-2 rounded-full font-bold text-sm text-slate-700 dark:text-slate-200 shadow-xs border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
        >
          {language === 'ar' ? <ArrowRight className="w-4 h-4 text-amber-500" /> : <ArrowLeft className="w-4 h-4 text-amber-500" />}
          <span>{language === 'ar' ? 'الرجوع إلى القصص' : 'Back to Stories'}</span>
        </Link>

        {/* Page progress badge */}
        <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800 px-4 py-1.5 rounded-full text-xs font-black">
          <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>{language === 'ar' ? `الصفحة ${currentPageIdx + 1} من ${totalPages}` : `Page ${currentPageIdx + 1} of ${totalPages}`}</span>
        </div>
      </div>

      {/* Story Reader Card */}
      <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-6 sm:p-10 shadow-xl border border-amber-100 dark:border-slate-800 w-full flex flex-col items-center relative overflow-hidden">
        {/* Story Title & Cover Banner */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 mb-1">
            {language === 'ar' ? story.title : story.titleEn}
          </h1>
          <span className="text-xs font-bold text-slate-400 dark:text-slate-400">
            {language === 'ar' ? story.summary : story.summaryEn}
          </span>
        </div>

        {/* Visual Scene Illustration */}
        <div className="w-full max-w-lg bg-gradient-to-b from-sky-50 via-amber-50 to-emerald-50 dark:from-slate-900 dark:via-sky-950/40 dark:to-slate-900 rounded-3xl p-8 sm:p-12 border-2 border-amber-200 dark:border-slate-700 text-center mb-8 shadow-inner flex flex-col items-center justify-center min-h-[180px]">
          <span className="text-6xl sm:text-7xl filter drop-shadow animate-pulse tracking-widest">
            {currentPage.illustration}
          </span>
        </div>

        {/* Narrative Text */}
        <div className="w-full max-w-2xl bg-amber-50/50 dark:bg-slate-900/80 border border-amber-100 dark:border-slate-800 rounded-2xl p-6 mb-8 text-center">
          <p className="text-lg sm:text-2xl font-extrabold text-slate-800 dark:text-slate-100 leading-loose">
            {language === 'ar' ? currentPage.text : currentPage.textEn}
          </p>
        </div>

        {/* Interactive Question on the page (if present) */}
        {currentPage.interactiveQuestion && !storyCompleted && (
          <div className="w-full max-w-xl bg-slate-50 dark:bg-slate-900/90 border-2 border-dashed border-amber-300 dark:border-amber-700 rounded-3xl p-5 mb-8">
            <div className="flex items-center justify-center gap-1.5 text-xs font-black text-amber-700 dark:text-amber-400 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>{language === 'ar' ? 'سؤال استيعابي ممتع:' : 'Fun Comprehension Question:'}</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 text-center mb-4">
              {language === 'ar' ? currentPage.interactiveQuestion.question : currentPage.interactiveQuestion.questionEn}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentPage.interactiveQuestion.options.map((opt, idx) => {
                const isSelected = selectedAnswer === idx;
                let btnStyle = 'bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-amber-300 dark:hover:border-amber-600';

                if (answeredState !== null) {
                  if (opt.isCorrect) {
                    btnStyle = 'bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-200 shadow-sm';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-500 text-white border-rose-600 ring-2 ring-rose-200';
                  } else {
                    btnStyle = 'bg-slate-100 dark:bg-slate-800/60 text-slate-400 border-slate-200 dark:border-slate-800 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx, opt.isCorrect)}
                    disabled={answeredState !== null}
                    className={`p-3 rounded-2xl border-2 font-bold text-sm text-center transition-all cursor-pointer ${btnStyle}`}
                  >
                    {language === 'ar' ? opt.text : opt.textEn}
                  </button>
                );
              })}
            </div>

            {answeredState === 'correct' && (
              <div className="mt-3 text-center text-xs font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 p-2 rounded-xl border border-emerald-200 dark:border-emerald-800 animate-pop-in">
                🎉 {language === 'ar' ? 'إجابة رائعة وصحيحة!' : 'Great and accurate answer!'}
              </div>
            )}
            {answeredState === 'wrong' && (
              <div className="mt-3 text-center text-xs font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/80 p-2 rounded-xl border border-rose-200 dark:border-rose-800 animate-pop-in">
                💡 {language === 'ar' ? currentPage.interactiveQuestion.hint : currentPage.interactiveQuestion.hintEn}
              </div>
            )}
          </div>
        )}

        {/* Story Completed Screen */}
        {storyCompleted && (
          <div className="w-full max-w-xl bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-slate-900 dark:to-amber-950/40 border-2 border-amber-300 dark:border-amber-700 rounded-3xl p-6 text-center mb-8 animate-pop-in">
            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-3xl shadow-md">
              🏆
            </div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2">
              {language === 'ar' ? 'أحسنت يا بطل! أنهيت القصة الجميلة!' : 'Well done! You completed this lovely story!'}
            </h2>
            <div className="flex items-center justify-center gap-1.5 text-xs text-amber-900 dark:text-amber-200 font-bold bg-white/80 dark:bg-slate-800/80 p-3 rounded-2xl border border-amber-200 dark:border-amber-800 mb-4">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>{language === 'ar' ? `العبرة المستفادة: ${story.moral}` : `Key Takeaway: ${story.moralEn}`}</span>
            </div>
            <button
              onClick={handleRestartStory}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-black px-6 py-2.5 rounded-full text-sm shadow-md transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{language === 'ar' ? 'إعادة قراءة القصة' : 'Read Story Again'}</span>
            </button>
          </div>
        )}

        {/* Page Turn Controls */}
        <div className="w-full flex items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handlePrevPage}
            disabled={currentPageIdx === 0}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all ${
              currentPageIdx === 0
                ? 'opacity-40 bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer shadow-xs'
            }`}
          >
            {language === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{language === 'ar' ? 'الصفحة السابقة' : 'Previous Page'}</span>
          </button>

          <button
            onClick={handleNextPage}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full font-black text-sm text-white bg-gradient-to-r from-amber-500 to-orange-500 shadow-md hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>
              {isLastPage
                ? language === 'ar' ? 'إتمام القصة 🏆' : 'Complete Story 🏆'
                : language === 'ar' ? 'الصفحة التالية' : 'Next Page'}
            </span>
            {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

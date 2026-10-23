import React, { useState, useEffect, useCallback } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';
import { PATTERN_QUESTIONS } from '../../data/gameContent';
import { useLanguage } from '../../i18n/LanguageContext';

export const PatternGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const currentQ = PATTERN_QUESTIONS[currentIndex];

  const initGame = useCallback(() => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setFeedback('');
    setIsGameOver(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleSelectOption = (idx: number, isCorrect: boolean) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (isCorrect) {
      sound.playMatch();
      const newScore = score + 20;
      setScore(newScore);
      setFeedback(`🎉 ${language === 'ar' ? 'إجابة عبقرية!' : 'Brilliant answer!'} ${language === 'ar' ? currentQ.explanation : currentQ.explanationEn}`);
    } else {
      sound.playWrong();
      setFeedback(`❌ ${language === 'ar' ? 'حاول أن تلاحظ التسلسل بعناية:' : 'Look closely at the sequence:'} ${language === 'ar' ? currentQ.explanation : currentQ.explanationEn}`);
      setScore((prev) => Math.max(0, prev - 2));
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (currentIndex + 1 < PATTERN_QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setFeedback('');
    } else {
      saveGameProgress('pattern-complete', score, true);
      setIsGameOver(true);
    }
  };

  return (
    <div className="flex flex-col items-center w-full px-4 py-4 min-h-[85vh]">
      <GameHeader
        title={language === 'ar' ? 'إكمال النمط والتسلسل' : 'Pattern Completion'}
        icon="🔄"
        score={score}
        onRestart={initGame}
        onGoHome={onGoHome}
        accentGradient="from-[#00b4d8] to-[#0077b6]"
        badgeText={language === 'ar' ? `نمط ${currentIndex + 1} من ${PATTERN_QUESTIONS.length}` : `Pattern ${currentIndex + 1} of ${PATTERN_QUESTIONS.length}`}
      />

      <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-5 sm:p-8 shadow-xl border border-sky-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 max-w-2xl w-full flex flex-col items-center">
        {/* Guidance Prompt */}
        <div className="text-center mb-6">
          <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider block mb-1">
            {language === 'ar' ? 'لاحظ القاعدة المنطقية واكتشف الشكل المفقود' : 'Observe the sequence and find the missing piece'}
          </span>
          <h2 className="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100">
            {language === 'ar' ? 'ما هو الشكل المناسب لعلامة الاستفهام؟' : 'Which item replaces the question mark?'}
          </h2>
        </div>

        {/* Pattern Display Board */}
        <div className="w-full bg-slate-50 border-2 border-sky-200 rounded-3xl p-4 sm:p-6 flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-8 shadow-inner">
          {currentQ.sequence.map((item, idx) => (
            <div
              key={idx}
              className={`w-14 sm:w-16 h-14 sm:h-16 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-sm border-2 transition-all ${
                item === '؟'
                  ? 'bg-amber-100 border-amber-400 text-amber-700 animate-pulse font-black'
                  : 'bg-white border-slate-200'
              }`}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Option Choices */}
        <div className="w-full mb-6">
          <h3 className="text-xs sm:text-sm font-bold text-slate-500 mb-3 text-center">
            {language === 'ar' ? 'اختر الشكل الذي يكمل النمط:' : 'Choose the item that completes the pattern:'}
          </h3>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {currentQ.options.map((opt, idx) => {
              let btnClass = 'bg-slate-50 hover:bg-sky-50 border-slate-200 text-slate-800 hover:border-sky-300';
              if (isAnswered) {
                if (opt.isCorrect) {
                  btnClass = 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200 shadow-md scale-102';
                } else if (selectedOption === idx) {
                  btnClass = 'bg-rose-500 text-white border-rose-600 ring-2 ring-rose-200';
                } else {
                  btnClass = 'bg-slate-100 text-slate-400 border-slate-200 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx, opt.isCorrect)}
                  disabled={isAnswered}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all transform duration-150 cursor-pointer select-none ${
                    !isAnswered ? 'hover:scale-105 active:scale-95 shadow-sm' : ''
                  } ${btnClass}`}
                >
                  <span className="text-4xl sm:text-5xl filter drop-shadow">{opt.icon}</span>
                  <span className="text-xs sm:text-sm font-bold mt-1 text-center">{opt.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className="w-full text-center p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 font-bold mb-5 animate-pop-in text-sm sm:text-base">
            {feedback}
          </div>
        )}

        {/* Next Question Button */}
        {isAnswered && (
          <button
            onClick={handleNext}
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-extrabold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all"
          >
            {currentIndex + 1 < PATTERN_QUESTIONS.length
              ? language === 'ar' ? 'النمط التالي ⬅️' : 'Next Pattern ➡️'
              : language === 'ar' ? 'عرض النتيجة النهائية 🏆' : 'View Final Result 🏆'}
          </button>
        )}
      </div>

      {isGameOver && (
        <WinCelebration
          score={score}
          message={language === 'ar' ? '🎉 عبقري الأنماط! لقد حللت جميع الأنماط المنطقية بتفوق!' : '🎉 Pattern Genius! You solved all patterns with excellence!'}
          onRestart={initGame}
          onGoHome={onGoHome}
          stars={score >= 80 ? 3 : score >= 50 ? 2 : 1}
        />
      )}
    </div>
  );
};

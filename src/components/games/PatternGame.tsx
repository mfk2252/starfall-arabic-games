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
  const [wrongOption, setWrongOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const currentQ = PATTERN_QUESTIONS[currentIndex];

  const initGame = useCallback(() => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setWrongOption(null);
    setIsAnswered(false);
    setIsProcessing(false);
    setFeedback('');
    setIsGameOver(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleSelectOption = (idx: number, isCorrect: boolean) => {
    if (isProcessing || isAnswered) return;

    if (isCorrect) {
      setSelectedOption(idx);
      setIsAnswered(true);
      setIsProcessing(true);
      sound.playMatch();
      const newScore = score + 20;
      setScore(newScore);
      setFeedback(`🎉 ${language === 'ar' ? 'إجابة عبقرية!' : 'Brilliant answer!'} ${language === 'ar' ? currentQ.explanation : currentQ.explanationEn}`);

      setTimeout(() => {
        if (currentIndex + 1 < PATTERN_QUESTIONS.length) {
          setCurrentIndex((prev) => prev + 1);
          setSelectedOption(null);
          setWrongOption(null);
          setIsAnswered(false);
          setIsProcessing(false);
          setFeedback('');
        } else {
          saveGameProgress('pattern-complete', newScore, true);
          setIsGameOver(true);
        }
      }, 1100);
    } else {
      sound.playWrong();
      setWrongOption(idx);
      setFeedback(`❌ ${language === 'ar' ? 'لاحظ التسلسل بعناية:' : 'Look closely at the sequence:'} ${language === 'ar' ? currentQ.explanation : currentQ.explanationEn} ${language === 'ar' ? 'حاول مجدداً!' : 'Try again!'}`);
      setScore((prev) => Math.max(0, prev - 2));

      setTimeout(() => {
        setWrongOption(null);
      }, 700);
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

      <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-4 sm:p-6 shadow-xl border border-sky-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 max-w-2xl w-full flex flex-col items-center">
        {/* Guidance Prompt */}
        <div className="text-center mb-4">
          <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider block mb-1">
            {language === 'ar' ? 'لاحظ القاعدة المنطقية واكتشف الشكل المفقود' : 'Observe the sequence and find the missing piece'}
          </span>
          <h2 className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100">
            {language === 'ar' ? 'ما هو الشكل المناسب لعلامة الاستفهام؟' : 'Which item replaces the question mark?'}
          </h2>
        </div>

        {/* Pattern Display Board */}
        <div className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-sky-200 dark:border-slate-700 rounded-3xl p-3 sm:p-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6 shadow-inner">
          {currentQ.sequence.map((item, idx) => (
            <div
              key={idx}
              className={`w-12 sm:w-14 h-12 sm:h-14 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-sm border-2 transition-all ${
                item === '؟'
                  ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-400 text-amber-700 dark:text-amber-300 animate-pulse font-black'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Option Choices */}
        <div className="w-full mb-4">
          <h3 className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 mb-2.5 text-center">
            {language === 'ar' ? 'اختر الشكل الذي يكمل النمط:' : 'Choose the item that completes the pattern:'}
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isWrong = wrongOption === idx;
              let btnClass = 'bg-slate-50 hover:bg-sky-50 border-slate-200 text-slate-800 hover:border-sky-300 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100';

              if (isAnswered && opt.isCorrect) {
                btnClass = 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200 shadow-md scale-102';
              } else if (isWrong) {
                btnClass = 'bg-rose-500 text-white border-rose-600 ring-2 ring-rose-200 animate-shake';
              } else if (isSelected) {
                btnClass = 'bg-sky-600 text-white border-sky-700';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx, opt.isCorrect)}
                  disabled={isProcessing || isAnswered}
                  className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all transform duration-150 cursor-pointer select-none ${
                    !isAnswered && !isProcessing ? 'hover:scale-105 active:scale-95 shadow-sm' : ''
                  } ${btnClass}`}
                >
                  <span className="text-3xl sm:text-4xl filter drop-shadow">{opt.icon}</span>
                  <span className="text-xs sm:text-sm font-bold mt-0.5 text-center">{opt.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className={`w-full text-center p-2.5 rounded-2xl font-bold text-xs sm:text-sm animate-pop-in ${
            isAnswered
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
          }`}>
            {feedback}
          </div>
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

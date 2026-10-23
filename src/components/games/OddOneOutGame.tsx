import React, { useState, useEffect, useCallback } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';
import { ODD_ONE_OUT_QUESTIONS } from '../../data/gameContent';
import { useLanguage } from '../../i18n/LanguageContext';

export const OddOneOutGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [wrongItemId, setWrongItemId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const currentQ = ODD_ONE_OUT_QUESTIONS[currentIndex];

  const initGame = useCallback(() => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedItemId(null);
    setWrongItemId(null);
    setIsAnswered(false);
    setIsProcessing(false);
    setFeedback('');
    setIsGameOver(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleSelectItem = (item: typeof currentQ.items[0]) => {
    if (isProcessing || isAnswered) return;

    if (item.isOdd) {
      setSelectedItemId(item.id);
      setIsAnswered(true);
      setIsProcessing(true);
      sound.playMatch();
      const newScore = score + 20;
      setScore(newScore);
      setFeedback(`🎉 ${language === 'ar' ? 'صحيح وممتاز!' : 'Spot on!'} ${language === 'ar' ? item.reason : item.reasonEn}`);

      setTimeout(() => {
        if (currentIndex + 1 < ODD_ONE_OUT_QUESTIONS.length) {
          setCurrentIndex((prev) => prev + 1);
          setSelectedItemId(null);
          setWrongItemId(null);
          setIsAnswered(false);
          setIsProcessing(false);
          setFeedback('');
        } else {
          saveGameProgress('odd-one-out', newScore, true);
          setIsGameOver(true);
        }
      }, 1100);
    } else {
      sound.playWrong();
      setWrongItemId(item.id);
      setFeedback(`❌ ${language === 'ar' ? 'هذا العنصر ينتمي للمجموعة! حاول مجدداً.' : 'This item belongs to the group! Try again.'}`);
      setScore((prev) => Math.max(0, prev - 2));

      setTimeout(() => {
        setWrongItemId(null);
      }, 700);
    }
  };

  return (
    <div className="flex flex-col items-center w-full px-4 py-4 min-h-[85vh]">
      <GameHeader
        title={language === 'ar' ? 'اكتشف العنصر المختلف' : 'Odd One Out'}
        icon="🔍"
        score={score}
        onRestart={initGame}
        onGoHome={onGoHome}
        accentGradient="from-[#ffb703] to-[#fb8500]"
        badgeText={language === 'ar' ? `سؤال ${currentIndex + 1} من ${ODD_ONE_OUT_QUESTIONS.length}` : `Question ${currentIndex + 1} of ${ODD_ONE_OUT_QUESTIONS.length}`}
      />

      <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-4 sm:p-6 shadow-xl border border-amber-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 max-w-2xl w-full flex flex-col items-center">
        {/* Question Title */}
        <div className="text-center mb-4 w-full">
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-1">
            {language === 'ar' ? 'دقة الملاحظة والتصنيف' : 'Observation & Categorization'}
          </span>
          <h2 className="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100 leading-relaxed">
            {language === 'ar' ? currentQ.title : currentQ.titleEn}
          </h2>
        </div>

        {/* 4 Items to inspect */}
        <div className="grid grid-cols-2 gap-3.5 w-full mb-4">
          {currentQ.items.map((item) => {
            const isSelected = selectedItemId === item.id;
            const isWrong = wrongItemId === item.id;
            let btnStyle = 'bg-slate-50 hover:bg-amber-50 border-slate-200 text-slate-800 hover:border-amber-300 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100';

            if (isAnswered && item.isOdd) {
              btnStyle = 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200 shadow-lg scale-102';
            } else if (isWrong) {
              btnStyle = 'bg-rose-500 text-white border-rose-600 ring-2 ring-rose-200 animate-shake';
            } else if (isSelected) {
              btnStyle = 'bg-amber-600 text-white border-amber-700';
            }

            return (
              <button
                key={item.id}
                onClick={() => handleSelectItem(item)}
                disabled={isProcessing || isAnswered}
                className={`p-4 sm:p-5 rounded-3xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all transform duration-150 cursor-pointer select-none ${
                  !isAnswered && !isProcessing ? 'hover:scale-105 active:scale-95 shadow-sm' : ''
                } ${btnStyle}`}
              >
                <span className="text-4xl sm:text-5xl filter drop-shadow">{item.icon}</span>
                <span className="text-sm sm:text-base font-black mt-0.5">
                  {language === 'ar' ? item.name : item.nameEn}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback message */}
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
          message={language === 'ar' ? '🎉 ما شاء الله! قوة ملاحظتك وذكاؤك لا مثيل لهما!' : '🎉 Amazing! Your observation skills are top notch!'}
          onRestart={initGame}
          onGoHome={onGoHome}
          stars={score >= 70 ? 3 : score >= 50 ? 2 : 1}
        />
      )}
    </div>
  );
};

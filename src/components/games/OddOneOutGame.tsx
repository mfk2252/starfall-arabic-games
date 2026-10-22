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
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const currentQ = ODD_ONE_OUT_QUESTIONS[currentIndex];

  const initGame = useCallback(() => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedItemId(null);
    setIsAnswered(false);
    setFeedback('');
    setIsGameOver(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleSelectItem = (item: typeof currentQ.items[0]) => {
    if (isAnswered) return;
    setSelectedItemId(item.id);
    setIsAnswered(true);

    if (item.isOdd) {
      sound.playMatch();
      const newScore = score + 20;
      setScore(newScore);
      setFeedback(`🎉 ${language === 'ar' ? 'صحيح وممتاز!' : 'Spot on!'} ${language === 'ar' ? item.reason : item.reasonEn}`);
    } else {
      sound.playWrong();
      setFeedback(`❌ ${language === 'ar' ? 'هذا العنصر ينتمي للمجموعة!' : 'This item belongs to the group!'} ${language === 'ar' ? item.reason : item.reasonEn}`);
      setScore((prev) => Math.max(0, prev - 2));
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (currentIndex + 1 < ODD_ONE_OUT_QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedItemId(null);
      setIsAnswered(false);
      setFeedback('');
    } else {
      saveGameProgress('odd-one-out', score, true);
      setIsGameOver(true);
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

      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl border border-amber-100 max-w-2xl w-full flex flex-col items-center">
        {/* Question Title */}
        <div className="text-center mb-6 w-full">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-1">
            {language === 'ar' ? 'دقة الملاحظة والتصنيف' : 'Observation & Categorization'}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 leading-relaxed">
            {language === 'ar' ? currentQ.title : currentQ.titleEn}
          </h2>
        </div>

        {/* 4 Items to inspect */}
        <div className="grid grid-cols-2 gap-4 w-full mb-6">
          {currentQ.items.map((item) => {
            const isSelected = selectedItemId === item.id;
            let btnStyle = 'bg-slate-50 hover:bg-amber-50 border-slate-200 text-slate-800 hover:border-amber-300';

            if (isAnswered) {
              if (item.isOdd) {
                btnStyle = 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200 shadow-lg scale-102';
              } else if (isSelected) {
                btnStyle = 'bg-rose-500 text-white border-rose-600 ring-2 ring-rose-200';
              } else {
                btnStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-50';
              }
            }

            return (
              <button
                key={item.id}
                onClick={() => handleSelectItem(item)}
                disabled={isAnswered}
                className={`p-5 rounded-3xl border-2 flex flex-col items-center justify-center gap-2 transition-all transform duration-150 cursor-pointer select-none ${
                  !isAnswered ? 'hover:scale-105 active:scale-95 shadow-sm' : ''
                } ${btnStyle}`}
              >
                <span className="text-5xl sm:text-6xl filter drop-shadow">{item.icon}</span>
                <span className="text-base sm:text-lg font-black mt-1">
                  {language === 'ar' ? item.name : item.nameEn}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback message */}
        {feedback && (
          <div className="w-full text-center p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 font-bold mb-5 animate-pop-in text-sm sm:text-base">
            {feedback}
          </div>
        )}

        {/* Next Question Button */}
        {isAnswered && (
          <button
            onClick={handleNext}
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all"
          >
            {currentIndex + 1 < ODD_ONE_OUT_QUESTIONS.length
              ? language === 'ar' ? 'السؤال التالي ⬅️' : 'Next Question ➡️'
              : language === 'ar' ? 'عرض النتيجة النهائية 🏆' : 'View Final Result 🏆'}
          </button>
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

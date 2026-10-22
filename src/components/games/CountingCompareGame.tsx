import React, { useState, useEffect, useCallback } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';
import { useLanguage } from '../../i18n/LanguageContext';

interface CompareLevel {
  id: number;
  itemIcon: string;
  countA: number;
  countB: number;
  correctRelation: '>' | '<' | '=';
}

const COMPARE_LEVELS: CompareLevel[] = [
  { id: 1, itemIcon: '🍎', countA: 5, countB: 3, correctRelation: '>' },
  { id: 2, itemIcon: '⭐', countA: 2, countB: 4, correctRelation: '<' },
  { id: 3, itemIcon: '🐟', countA: 4, countB: 4, correctRelation: '=' },
  { id: 4, itemIcon: '🎈', countA: 6, countB: 2, correctRelation: '>' },
  { id: 5, itemIcon: '🐥', countA: 3, countB: 5, correctRelation: '<' },
];

export const CountingCompareGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const { language } = useLanguage();
  const [currentLevelIdx, setCurrentLevelIdx] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');

  const currentLevel = COMPARE_LEVELS[currentLevelIdx];

  const initGame = useCallback(() => {
    setCurrentLevelIdx(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setFeedback('');
    setIsGameOver(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleChooseRelation = (relation: '>' | '<' | '=') => {
    if (isAnswered) return;
    setSelectedAnswer(relation);
    setIsAnswered(true);

    if (relation === currentLevel.correctRelation) {
      sound.playMatch();
      const newScore = score + 20;
      setScore(newScore);

      const relationText =
        relation === '>'
          ? language === 'ar' ? 'المجموعة الأولى أكثر من الثانية!' : 'First group is greater than second!'
          : relation === '<'
          ? language === 'ar' ? 'المجموعة الأولى أقل من الثانية!' : 'First group is less than second!'
          : language === 'ar' ? 'المجموعتان متساويتان تماماً!' : 'Both groups are exactly equal!';

      setFeedback(`🎉 ${language === 'ar' ? 'ممتاز!' : 'Awesome!'} ${relationText} (${currentLevel.countA} ${relation} ${currentLevel.countB})`);
    } else {
      sound.playWrong();
      setFeedback(`❌ ${language === 'ar' ? 'حاول العد مجدداً:' : 'Try counting again:'} ${currentLevel.countA} ${language === 'ar' ? 'مقابل' : 'vs'} ${currentLevel.countB}`);
      setScore((prev) => Math.max(0, prev - 2));
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (currentLevelIdx + 1 < COMPARE_LEVELS.length) {
      setCurrentLevelIdx((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setFeedback('');
    } else {
      saveGameProgress('counting-compare', score, true);
      setIsGameOver(true);
    }
  };

  return (
    <div className="flex flex-col items-center w-full px-4 py-4 min-h-[85vh]">
      <GameHeader
        title={language === 'ar' ? 'العد والمقارنة بين الكميات' : 'Count & Compare Quantities'}
        icon="⚖️"
        score={score}
        onRestart={initGame}
        onGoHome={onGoHome}
        accentGradient="from-[#4361ee] to-[#3a0ca3]"
        badgeText={language === 'ar' ? `تحدي ${currentLevelIdx + 1} من ${COMPARE_LEVELS.length}` : `Challenge ${currentLevelIdx + 1} of ${COMPARE_LEVELS.length}`}
      />

      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl border border-indigo-100 max-w-2xl w-full flex flex-col items-center">
        <div className="text-center mb-6">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
            {language === 'ar' ? 'عد العناصر في الجانبين وقارن بينهما' : 'Count the items on each side and compare'}
          </span>
          <h2 className="text-lg sm:text-xl font-black text-slate-800">
            {language === 'ar' ? 'أي المجموعتين أكثر أو هل هما متساويتان؟' : 'Which group has more, or are they equal?'}
          </h2>
        </div>

        {/* The Two Groups Visual Stage */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full mb-8">
          {/* Group A Box */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-3xl p-4 flex flex-col items-center justify-between min-h-[170px] shadow-inner">
            <span className="text-xs font-bold text-indigo-700 mb-2">
              {language === 'ar' ? 'المجموعة الأولى' : 'Group A'}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 p-2">
              {Array.from({ length: currentLevel.countA }).map((_, i) => (
                <span
                  key={i}
                  className="text-3xl sm:text-4xl filter drop-shadow transform hover:scale-125 transition-transform cursor-pointer select-none"
                  onClick={() => sound.playClick()}
                  title={String(i + 1)}
                >
                  {currentLevel.itemIcon}
                </span>
              ))}
            </div>
            <div className="bg-white px-3 py-1 rounded-full text-sm font-black text-indigo-900 border border-indigo-200 mt-2">
              {currentLevel.countA}
            </div>
          </div>

          {/* Group B Box */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-3xl p-4 flex flex-col items-center justify-between min-h-[170px] shadow-inner">
            <span className="text-xs font-bold text-purple-700 mb-2">
              {language === 'ar' ? 'المجموعة الثانية' : 'Group B'}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 p-2">
              {Array.from({ length: currentLevel.countB }).map((_, i) => (
                <span
                  key={i}
                  className="text-3xl sm:text-4xl filter drop-shadow transform hover:scale-125 transition-transform cursor-pointer select-none"
                  onClick={() => sound.playClick()}
                  title={String(i + 1)}
                >
                  {currentLevel.itemIcon}
                </span>
              ))}
            </div>
            <div className="bg-white px-3 py-1 rounded-full text-sm font-black text-purple-900 border border-purple-200 mt-2">
              {currentLevel.countB}
            </div>
          </div>
        </div>

        {/* Relation Choices */}
        <div className="w-full mb-6">
          <h3 className="text-xs sm:text-sm font-bold text-slate-500 mb-3 text-center">
            {language === 'ar' ? 'اختر علامة المقارنة الصحيحة:' : 'Select the correct comparison sign:'}
          </h3>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {[
              {
                rel: '>' as const,
                label: language === 'ar' ? 'أكبر من (أكثر)' : 'Greater Than (>)'
              },
              {
                rel: '=' as const,
                label: language === 'ar' ? 'يساوي (متطابق)' : 'Equal (=)'
              },
              {
                rel: '<' as const,
                label: language === 'ar' ? 'أصغر من (أقل)' : 'Less Than (<)'
              },
            ].map(({ rel, label }) => {
              const isSelected = selectedAnswer === rel;
              let btnStyle = 'bg-slate-50 hover:bg-indigo-50 border-slate-200 text-slate-800 hover:border-indigo-300';

              if (isAnswered) {
                if (rel === currentLevel.correctRelation) {
                  btnStyle = 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200 shadow-lg scale-105';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-500 text-white border-rose-600 ring-2 ring-rose-200';
                } else {
                  btnStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-50';
                }
              }

              return (
                <button
                  key={rel}
                  onClick={() => handleChooseRelation(rel)}
                  disabled={isAnswered}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all transform duration-150 cursor-pointer select-none ${
                    !isAnswered ? 'hover:scale-105 active:scale-95 shadow-sm' : ''
                  } ${btnStyle}`}
                >
                  <span className="text-3xl sm:text-4xl font-mono font-black">{rel}</span>
                  <span className="text-[11px] sm:text-xs font-bold text-center mt-1">{label}</span>
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

        {/* Next Level Button */}
        {isAnswered && (
          <button
            onClick={handleNext}
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-extrabold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all"
          >
            {currentLevelIdx + 1 < COMPARE_LEVELS.length
              ? language === 'ar' ? 'التحدي التالي ⬅️' : 'Next Challenge ➡️'
              : language === 'ar' ? 'عرض النتيجة النهائية 🏆' : 'View Final Result 🏆'}
          </button>
        )}
      </div>

      {isGameOver && (
        <WinCelebration
          score={score}
          message={language === 'ar' ? '🎉 بطل الرياضيات الصغير! لقد أتقنت العد والمقارنة بين الكميات بدقة!' : '🎉 Math Champion! You mastered counting and comparing quantities perfectly!'}
          onRestart={initGame}
          onGoHome={onGoHome}
          stars={score >= 80 ? 3 : score >= 50 ? 2 : 1}
        />
      )}
    </div>
  );
};

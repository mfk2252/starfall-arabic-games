import React, { useState, useCallback } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { useLanguage } from '../../i18n/LanguageContext';
import { useMemoryMatch, MemoryCardBase } from '../../hooks/useMemoryMatch';
import { Volume2 } from 'lucide-react';

interface Card extends MemoryCardBase {
  value: number;
}

const ARABIC_DIGITS: Record<number, string> = {
  1: '١',
  2: '٢',
  3: '٣',
  4: '٤',
  5: '٥',
  6: '٦',
  7: '٧',
  8: '٨',
};

const NUMBER_WORDS_AR: Record<number, string> = {
  1: 'واحد',
  2: 'اثنان',
  3: 'ثلاثة',
  4: 'أربعة',
  5: 'خمسة',
  6: 'ستة',
  7: 'سبعة',
  8: 'ثمانية',
};

const NUMBER_WORDS_EN: Record<number, string> = {
  1: 'One',
  2: 'Two',
  3: 'Three',
  4: 'Four',
  5: 'Five',
  6: 'Six',
  7: 'Seven',
  8: 'Eight',
};

const DOTS: Record<number, string> = {
  1: '●',
  2: '●●',
  3: '●●●',
  4: '●●\n●●',
  5: '●●\n●\n●●',
  6: '●●●\n●●●',
  7: '●●●●\n●●●',
  8: '●●●●\n●●●●',
};

const NUMBERS_LIST = [1, 2, 3, 4, 5, 6, 7, 8];

export const NumbersGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [useArabicNumerals, setUseArabicNumerals] = useState<boolean>(false);
  const [feedbackKey, setFeedbackKey] = useState<'start' | 'match' | 'wrong'>('start');
  const [lastMatchedValue, setLastMatchedValue] = useState<number | null>(null);

  const buildCards = useCallback(
    () => [...NUMBERS_LIST, ...NUMBERS_LIST].map((value) => ({ value })),
    []
  );

  const isMatch = useCallback((a: Card, b: Card) => a.value === b.value, []);

  const handleMatch = useCallback(
    (first: Card) => {
      const spoken = isAr ? NUMBER_WORDS_AR[first.value] : NUMBER_WORDS_EN[first.value];
      sound.speakText(spoken, isAr ? 'ar' : 'en');
      setLastMatchedValue(first.value);
      setFeedbackKey('match');
    },
    [isAr]
  );

  const handleMismatch = useCallback(() => {
    setFeedbackKey('wrong');
  }, []);

  const { cards, score, matchedPairs, isGameOver, initGame, handleCardClick } = useMemoryMatch<Card>({
    gameId: 'numbers',
    totalPairs: NUMBERS_LIST.length,
    buildCards,
    isMatch,
    onMatch: handleMatch,
    onMismatch: handleMismatch,
  });

  const handleRestart = useCallback(() => {
    setFeedbackKey('start');
    setLastMatchedValue(null);
    initGame();
  }, [initGame]);

  const statusMessage =
    feedbackKey === 'match' && lastMatchedValue !== null
      ? isAr
        ? `أحسنت! تطابق الرقم ${useArabicNumerals ? ARABIC_DIGITS[lastMatchedValue] : lastMatchedValue} (+10)`
        : `Great! Matched number ${lastMatchedValue} (+10)`
      : feedbackKey === 'wrong'
      ? isAr
        ? 'حاول مرة أخرى!'
        : 'Try again!'
      : isAr
      ? 'ابحث عن الأرقام المتطابقة!'
      : 'Find the matching numbers!';

  return (
    <div className="flex flex-col items-center w-full px-4 py-4 min-h-[85vh]">
      <GameHeader
        title={isAr ? 'تطابق الأرقام' : 'Number Match'}
        icon="🔢"
        score={score}
        onRestart={handleRestart}
        onGoHome={onGoHome}
        accentGradient="from-[#4fc3f7] to-[#0288d1]"
        badgeText={isAr ? 'لعبة الذاكرة والحساب' : 'Memory & Counting'}
      />

      <div className="bg-white dark:bg-[#20091b] rounded-3xl p-5 sm:p-8 shadow-xl border border-sky-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 max-w-2xl w-full flex flex-col items-center">
        {/* Sub-controls: Status, Repeat Pronunciation & Numeral style toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2 w-full mb-4 px-2 text-sm text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{statusMessage}</span>
            {lastMatchedValue !== null && (
              <button
                onClick={() =>
                  sound.speakText(
                    isAr ? NUMBER_WORDS_AR[lastMatchedValue] : NUMBER_WORDS_EN[lastMatchedValue],
                    isAr ? 'ar' : 'en'
                  )
                }
                className="p-1.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 hover:bg-sky-200 transition-colors cursor-pointer"
                title={isAr ? 'إعادة النطق' : 'Repeat pronunciation'}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => {
              sound.playClick();
              setUseArabicNumerals(!useArabicNumerals);
            }}
            className="text-xs font-bold bg-sky-50 dark:bg-sky-950/80 hover:bg-sky-100 dark:hover:bg-sky-900/80 text-sky-700 dark:text-sky-300 px-3 py-1.5 rounded-full border border-sky-200 dark:border-sky-800 transition-colors cursor-pointer"
          >
            {useArabicNumerals
              ? isAr
                ? 'عرض أرقام إنجليزية (1 2 3)'
                : 'Show English Numerals (1 2 3)'
              : isAr
              ? 'عرض أرقام عربية (١ ٢ ٣)'
              : 'Show Arabic Numerals (١ ٢ ٣)'}
          </button>
        </div>

        {/* 4x4 Cards Grid */}
        <div className="grid grid-cols-4 gap-3 sm:gap-4 w-full">
          {cards.map((card, idx) => {
            const isRevealed = card.isFlipped || card.isMatched;
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(idx)}
                disabled={card.isMatched || card.isFlipped}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center font-black transition-all duration-300 transform select-none ${
                  card.isMatched
                    ? 'bg-gradient-to-br from-emerald-400 to-green-500 text-white shadow-md scale-95 border-2 border-emerald-300'
                    : card.isFlipped
                    ? 'bg-gradient-to-br from-amber-300 to-amber-400 text-slate-900 shadow-lg scale-105 border-2 border-amber-200'
                    : 'bg-gradient-to-br from-sky-400 to-cyan-500 hover:from-sky-500 hover:to-cyan-600 text-white shadow-md hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer'
                }`}
                style={{ minHeight: '65px' }}
              >
                {isRevealed ? (
                  <div className="flex flex-col items-center justify-center leading-none">
                    <span className="text-3xl sm:text-4xl font-extrabold">
                      {useArabicNumerals ? ARABIC_DIGITS[card.value] : card.value}
                    </span>
                    <span className="text-[10px] sm:text-xs opacity-75 mt-0.5 tracking-widest whitespace-pre">
                      {DOTS[card.value]}
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl sm:text-3xl opacity-90 drop-shadow">{isAr ? '؟' : '?'}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info message */}
        <div className="mt-6 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
          {isAr ? (
            <>
              تم مطابقة: <span className="text-sky-600 font-bold">{matchedPairs}</span> من أصل {NUMBERS_LIST.length} أزواج
            </>
          ) : (
            <>
              Matched: <span className="text-sky-600 font-bold">{matchedPairs}</span> of {NUMBERS_LIST.length} pairs
            </>
          )}
        </div>
      </div>

      {isGameOver && (
        <WinCelebration
          score={score}
          message={
            isAr
              ? '🎉 أحسنت صنعاً! لقد أتقنت تطابق الأرقام!'
              : '🎉 Well done! You mastered matching all numbers!'
          }
          onRestart={handleRestart}
          onGoHome={onGoHome}
          stars={score >= 70 ? 3 : score >= 50 ? 2 : 1}
        />
      )}
    </div>
  );
};

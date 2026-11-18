import React, { useState, useCallback } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { useLanguage } from '../../i18n/LanguageContext';
import { useMemoryMatch, MemoryCardBase } from '../../hooks/useMemoryMatch';
import { Volume2 } from 'lucide-react';

interface Card extends MemoryCardBase {
  letter: string;
}

const ARABIC_LETTERS = ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س'];

const LETTER_WORDS: Record<string, { ar: string; en: string }> = {
  'أ': { ar: 'أسد 🦁', en: 'Lion 🦁' },
  'ب': { ar: 'بطة 🦆', en: 'Duck 🦆' },
  'ت': { ar: 'تفاح 🍎', en: 'Apple 🍎' },
  'ث': { ar: 'ثعلب 🦊', en: 'Fox 🦊' },
  'ج': { ar: 'جمل 🐪', en: 'Camel 🐪' },
  'ح': { ar: 'حصان 🐴', en: 'Horse 🐴' },
  'خ': { ar: 'خروف 🐑', en: 'Sheep 🐑' },
  'د': { ar: 'ديك 🐓', en: 'Rooster 🐓' },
  'ذ': { ar: 'ذئب 🐺', en: 'Wolf 🐺' },
  'ر': { ar: 'رمان 🍇', en: 'Pomegranate 🍇' },
  'ز': { ar: 'زرافة 🦒', en: 'Giraffe 🦒' },
  'س': { ar: 'سمكة 🐟', en: 'Fish 🐟' },
};

const LETTER_NAMES: Record<string, string> = {
  'أ': 'ألف',
  'ب': 'باء',
  'ت': 'تاء',
  'ث': 'ثاء',
  'ج': 'جيم',
  'ح': 'حاء',
  'خ': 'خاء',
  'د': 'دال',
  'ذ': 'ذال',
  'ر': 'راء',
  'ز': 'زاي',
  'س': 'سين',
};

export const ArabicLettersGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [feedbackKey, setFeedbackKey] = useState<'start' | 'match' | 'wrong'>('start');
  const [lastLetter, setLastLetter] = useState<string | null>(null);

  const buildCards = useCallback(
    () => [...ARABIC_LETTERS, ...ARABIC_LETTERS].map((letter) => ({ letter })),
    []
  );

  const isMatch = useCallback((a: Card, b: Card) => a.letter === b.letter, []);

  const handleMatch = useCallback((first: Card) => {
    sound.speakText(LETTER_NAMES[first.letter] || first.letter, 'ar');
    setLastLetter(first.letter);
    setFeedbackKey('match');
  }, []);

  const handleMismatch = useCallback(() => {
    setFeedbackKey('wrong');
  }, []);

  const { cards, score, matchedPairs, isGameOver, initGame, handleCardClick } = useMemoryMatch<Card>({
    gameId: 'arabic-letters',
    totalPairs: ARABIC_LETTERS.length,
    buildCards,
    isMatch,
    onMatch: handleMatch,
    onMismatch: handleMismatch,
  });

  const handleRestart = useCallback(() => {
    setFeedbackKey('start');
    setLastLetter(null);
    initGame();
  }, [initGame]);

  const statusMessage =
    feedbackKey === 'match' && lastLetter
      ? isAr
        ? `🎉 رائع! حرف (${lastLetter}) (${LETTER_WORDS[lastLetter]?.ar || ''}) (+10)`
        : `🎉 Great! Letter (${lastLetter}) (${LETTER_WORDS[lastLetter]?.en || ''}) (+10)`
      : feedbackKey === 'wrong'
      ? isAr
        ? 'حاول مرة أخرى!'
        : 'Try again!'
      : isAr
      ? 'ابحث عن الحروف المتطابقة!'
      : 'Find matching Arabic letters!';

  return (
    <div className="flex flex-col items-center w-full px-4 py-4 min-h-[85vh]">
      <GameHeader
        title={isAr ? 'تطابق الحروف العربية' : 'Arabic Alphabet Match'}
        icon="أ"
        score={score}
        onRestart={handleRestart}
        onGoHome={onGoHome}
        accentGradient="from-[#81c784] to-[#388e3c]"
        badgeText={isAr ? 'لغة الضاد الجميلة' : 'Beautiful Arabic Letters'}
      />

      <div className="bg-white dark:bg-[#20091b] rounded-3xl p-4 sm:p-7 shadow-xl border border-emerald-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 max-w-3xl w-full flex flex-col items-center">
        <div className="w-full flex flex-wrap justify-between items-center gap-2 mb-4 px-2 text-sm text-slate-700 dark:text-slate-200">
          <div className="flex items-center gap-2">
            <span className="font-bold text-emerald-800 dark:text-emerald-400">{statusMessage}</span>
            {lastLetter && (
              <button
                onClick={() => sound.speakText(LETTER_NAMES[lastLetter] || lastLetter, 'ar')}
                className="p-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 transition-colors cursor-pointer"
                title={isAr ? 'إعادة النطق' : 'Repeat pronunciation'}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <span className="text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            {isAr
              ? `${matchedPairs} / ${ARABIC_LETTERS.length} أزواج`
              : `${matchedPairs} / ${ARABIC_LETTERS.length} pairs`}
          </span>
        </div>

        {/* 6 columns on desktop, 4 on mobile */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 sm:gap-3.5 w-full">
          {cards.map((card, idx) => {
            const isRevealed = card.isFlipped || card.isMatched;
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(idx)}
                disabled={card.isMatched || card.isFlipped}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center font-black transition-all duration-300 transform select-none ${
                  card.isMatched
                    ? 'bg-gradient-to-br from-sky-400 to-blue-500 text-white shadow-md scale-95 border-2 border-sky-300'
                    : card.isFlipped
                    ? 'bg-gradient-to-br from-amber-300 to-amber-400 text-slate-900 shadow-lg scale-105 border-2 border-amber-200'
                    : 'bg-gradient-to-br from-[#81c784] to-[#66bb6a] hover:from-[#66bb6a] hover:to-[#43a047] text-white shadow-md hover:scale-105 active:scale-95 cursor-pointer'
                }`}
                style={{ minHeight: '60px' }}
              >
                {isRevealed ? (
                  <span className="text-3xl sm:text-4xl font-extrabold">{card.letter}</span>
                ) : (
                  <span className="text-2xl sm:text-3xl opacity-90 drop-shadow">{isAr ? '؟' : '?'}</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {isAr
            ? 'اضغط على بطاقتين للبحث عن الحروف العربية المتشابهة!'
            : 'Tap two cards to match identical Arabic letters!'}
        </div>
      </div>

      {isGameOver && (
        <WinCelebration
          score={score}
          message={
            isAr
              ? '🎉 ممتاز! لقد تعلمت وتعرفت على الحروف العربية ببراعة!'
              : '🎉 Awesome! You matched all Arabic letters!'
          }
          onRestart={handleRestart}
          onGoHome={onGoHome}
          stars={score >= 100 ? 3 : score >= 80 ? 2 : 1}
        />
      )}
    </div>
  );
};

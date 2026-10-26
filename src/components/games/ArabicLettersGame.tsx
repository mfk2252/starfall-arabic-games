import React, { useState, useEffect, useCallback } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';

interface Card {
  id: number;
  letter: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const ARABIC_LETTERS = ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س'];

// Word examples for each letter
const LETTER_WORDS: Record<string, string> = {
  'أ': 'أسد 🦁',
  'ب': 'بطة 🦆',
  'ت': 'تفاح 🍎',
  'ث': 'ثعلب 🦊',
  'ج': 'جمل 🐪',
  'ح': 'حصان 🐴',
  'خ': 'خروف 🐑',
  'د': 'ديك 🐓',
  'ذ': 'ذئب 🐺',
  'ر': 'رمان 🍇',
  'ز': 'زرافة 🦒',
  'س': 'سمكة 🐟',
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
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [message, setMessage] = useState<string>('ابحث عن الحروف المتطابقة!');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const initGame = useCallback(() => {
    const pairs = [...ARABIC_LETTERS, ...ARABIC_LETTERS];

    for (let i = pairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }

    const initialCards: Card[] = pairs.map((letter, idx) => ({
      id: idx,
      letter,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(initialCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setScore(0);
    setIsGameOver(false);
    setMessage('ابحث عن الحروف المتطابقة!');
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleCardClick = (index: number) => {
    if (flippedCards.length >= 2) return;
    const clicked = cards[index];
    if (clicked.isFlipped || clicked.isMatched) return;

    sound.playFlip();

    const updated = cards.map((c, i) =>
      i === index ? { ...c, isFlipped: true } : c
    );
    setCards(updated);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = updated[firstIdx];
      const secondCard = updated[secondIdx];

      if (firstCard.letter === secondCard.letter) {
        // Matched!
        setTimeout(() => {
          sound.playMatch();
          sound.speakText(LETTER_NAMES[firstCard.letter] || firstCard.letter, 'ar');
          setCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isMatched: true } : c
            )
          );
          setFlippedCards([]);
          const newMatched = matchedPairs + 1;
          const newScore = score + 10;
          setMatchedPairs(newMatched);
          setScore(newScore);

          const hint = LETTER_WORDS[firstCard.letter] ? `(${LETTER_WORDS[firstCard.letter]})` : '';
          setMessage(`🎉 رائع! حرف (${firstCard.letter}) ${hint} (+10)`);

          if (newMatched === ARABIC_LETTERS.length) {
            saveGameProgress('arabic-letters', newScore, true);
            setIsGameOver(true);
          }
        }, 500);
      } else {
        // Mismatch
        setTimeout(() => {
          sound.playWrong();
          setCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedCards([]);
          setScore((prev) => Math.max(0, prev - 2));
          setMessage('حاول مرة أخرى!');
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full px-4 py-4 min-h-[85vh]">
      <GameHeader
        title="تطابق الحروف العربية"
        icon="أ"
        score={score}
        onRestart={initGame}
        onGoHome={onGoHome}
        accentGradient="from-[#81c784] to-[#388e3c]"
        badgeText="لغة الضاد الجميلة"
      />

      <div className="bg-white dark:bg-[#20091b] rounded-3xl p-4 sm:p-7 shadow-xl border border-emerald-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 max-w-3xl w-full flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-4 px-2 text-sm text-slate-700 dark:text-slate-200">
          <span className="font-bold text-emerald-800 dark:text-emerald-400">{message}</span>
          <span className="text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            {matchedPairs} / {ARABIC_LETTERS.length} أزواج
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
                  <span className="text-2xl sm:text-3xl opacity-90 drop-shadow">؟</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 text-center text-xs sm:text-sm text-slate-500">
          اضغط على بطاقتين للبحث عن الحروف العربية المتشابهة!
        </div>
      </div>

      {isGameOver && (
        <WinCelebration
          score={score}
          message="🎉 ممتاز! لقد تعلمت وتعرفت على الحروف العربية ببراعة!"
          onRestart={initGame}
          onGoHome={onGoHome}
          stars={score >= 100 ? 3 : score >= 80 ? 2 : 1}
        />
      )}
    </div>
  );
};

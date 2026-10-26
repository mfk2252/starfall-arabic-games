import React, { useState, useEffect, useCallback } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';

interface Card {
  id: number;
  value: number;
  isFlipped: boolean;
  isMatched: boolean;
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

// Dots pattern for toddler visual counting aid
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

export const NumbersGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [message, setMessage] = useState<string>('ابحث عن الأرقام المتطابقة!');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [useArabicNumerals, setUseArabicNumerals] = useState<boolean>(false);

  const initGame = useCallback(() => {
    const numbersList = [1, 2, 3, 4, 5, 6, 7, 8];
    const pairs = [...numbersList, ...numbersList];

    // Fisher-Yates shuffle
    for (let i = pairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }

    const initialCards: Card[] = pairs.map((val, idx) => ({
      id: idx,
      value: val,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(initialCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setScore(0);
    setIsGameOver(false);
    setMessage('ابحث عن الأرقام المتطابقة!');
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

      if (firstCard.value === secondCard.value) {
        // Matched!
        setTimeout(() => {
          sound.playMatch();
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
          setMessage(`أحسنت! تطابق الرقم ${useArabicNumerals ? ARABIC_DIGITS[firstCard.value] : firstCard.value} (+10)`);

          if (newMatched === 8) {
            saveGameProgress('numbers', newScore, true);
            setIsGameOver(true);
          }
        }, 500);
      } else {
        // Not matched
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
        title="تطابق الأرقام"
        icon="🔢"
        score={score}
        onRestart={initGame}
        onGoHome={onGoHome}
        accentGradient="from-[#4fc3f7] to-[#0288d1]"
        badgeText="لعبة الذاكرة والحساب"
      />

      <div className="bg-white dark:bg-[#20091b] rounded-3xl p-5 sm:p-8 shadow-xl border border-sky-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 max-w-2xl w-full flex flex-col items-center">
        {/* Sub-controls: Numeral style toggle */}
        <div className="flex items-center justify-between w-full mb-4 px-2 text-sm text-slate-600 dark:text-slate-300">
          <span className="font-semibold">{message}</span>
          <button
            onClick={() => {
              sound.playClick();
              setUseArabicNumerals(!useArabicNumerals);
            }}
            className="text-xs font-bold bg-sky-50 dark:bg-sky-950/80 hover:bg-sky-100 dark:hover:bg-sky-900/80 text-sky-700 dark:text-sky-300 px-3 py-1.5 rounded-full border border-sky-200 dark:border-sky-800 transition-colors cursor-pointer"
          >
            {useArabicNumerals ? 'عرض أرقام إنجليزية (1 2 3)' : 'عرض أرقام عربية (١ ٢ ٣)'}
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
                  <span className="text-2xl sm:text-3xl opacity-90 drop-shadow">؟</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info message */}
        <div className="mt-6 text-center text-sm font-semibold text-slate-500">
          تم مطابقة: <span className="text-sky-600 font-bold">{matchedPairs}</span> من أصل 8 أزواج
        </div>
      </div>

      {isGameOver && (
        <WinCelebration
          score={score}
          message="🎉 أحسنت صنعاً! لقد أتقنت تطابق الأرقام!"
          onRestart={initGame}
          onGoHome={onGoHome}
          stars={score >= 70 ? 3 : score >= 50 ? 2 : 1}
        />
      )}
    </div>
  );
};

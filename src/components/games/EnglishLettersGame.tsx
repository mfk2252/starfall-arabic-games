import React, { useState, useEffect, useCallback } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';

interface Card {
  id: number;
  pairKey: string; // e.g. "A"
  display: string; // "A" or "a"
  isFlipped: boolean;
  isMatched: boolean;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export const EnglishLettersGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [message, setMessage] = useState<string>('ابحث عن الحروف الإنجليزية المتطابقة!');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [matchCase, setMatchCase] = useState<boolean>(true); // Uppercase + Lowercase pair

  const initGame = useCallback(() => {
    const cardItems: { pairKey: string; display: string }[] = [];

    LETTERS.forEach((l) => {
      if (matchCase) {
        cardItems.push({ pairKey: l, display: l.toUpperCase() });
        cardItems.push({ pairKey: l, display: l.toLowerCase() });
      } else {
        cardItems.push({ pairKey: l, display: l });
        cardItems.push({ pairKey: l, display: l });
      }
    });

    for (let i = cardItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardItems[i], cardItems[j]] = [cardItems[j], cardItems[i]];
    }

    const initialCards: Card[] = cardItems.map((item, idx) => ({
      id: idx,
      pairKey: item.pairKey,
      display: item.display,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(initialCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setScore(0);
    setIsGameOver(false);
    setMessage('ابحث عن الحروف المتطابقة!');
  }, [matchCase]);

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

      if (firstCard.pairKey === secondCard.pairKey) {
        // Match!
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
          setMessage(`أحسنت! تطابق الحرف (${firstCard.pairKey}) (+10)`);

          if (newMatched === LETTERS.length) {
            saveGameProgress('english-letters', newScore, true);
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
        title="تطابق الحروف الإنجليزية"
        icon="🔤"
        score={score}
        onRestart={initGame}
        onGoHome={onGoHome}
        accentGradient="from-[#ffd54f] to-[#f57f17]"
        badgeText="English Alphabet"
      />

      <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-5 sm:p-8 shadow-xl border border-amber-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 max-w-2xl w-full flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-4 px-2 text-sm text-slate-700 dark:text-slate-200">
          <span className="font-bold text-amber-800 dark:text-amber-400">{message}</span>
          <button
            onClick={() => {
              sound.playClick();
              setMatchCase(!matchCase);
            }}
            className="text-xs font-bold bg-amber-50 dark:bg-amber-950/80 hover:bg-amber-100 dark:hover:bg-amber-900/80 text-amber-800 dark:text-amber-200 px-3 py-1.5 rounded-full border border-amber-200 dark:border-amber-800 cursor-pointer"
          >
            {matchCase ? 'مطابقة الكبير مع الصغير (A - a)' : 'مطابقة متطابقة (A - A)'}
          </button>
        </div>

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
                    ? 'bg-gradient-to-br from-sky-300 to-blue-400 text-white shadow-lg scale-105 border-2 border-sky-200'
                    : 'bg-gradient-to-br from-[#ffd54f] to-[#ffb300] hover:from-[#ffca28] hover:to-[#ffa000] text-amber-950 shadow-md hover:scale-105 active:scale-95 cursor-pointer'
                }`}
                style={{ minHeight: '65px' }}
              >
                {isRevealed ? (
                  <span className="text-3xl sm:text-4xl font-extrabold font-mono">{card.display}</span>
                ) : (
                  <span className="text-2xl sm:text-3xl opacity-80 drop-shadow">?</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 text-center text-sm font-semibold text-slate-500">
          تم إيجاد: <span className="text-amber-600 font-bold">{matchedPairs}</span> من أصل 8 أزواج
        </div>
      </div>

      {isGameOver && (
        <WinCelebration
          score={score}
          message="🎉 مذهل! لقد أتقنت الحروف الإنجليزية بنجاح!"
          onRestart={initGame}
          onGoHome={onGoHome}
          stars={score >= 70 ? 3 : score >= 50 ? 2 : 1}
        />
      )}
    </div>
  );
};

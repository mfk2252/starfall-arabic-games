import React, { useState, useEffect, useCallback } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';

interface Card {
  id: number;
  wordKey: string;
  type: 'word' | 'image';
  text: string;
  subText: string;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const ENGLISH_PAIRS = [
  { key: 'apple', word: 'Apple', icon: '🍎', letter: 'A', ar: 'تفاحة' },
  { key: 'ball', word: 'Ball', icon: '⚽', letter: 'B', ar: 'كرة' },
  { key: 'cat', word: 'Cat', icon: '🐱', letter: 'C', ar: 'قطة' },
  { key: 'duck', word: 'Duck', icon: '🦆', letter: 'D', ar: 'بطة' },
  { key: 'elephant', word: 'Elephant', icon: '🐘', letter: 'E', ar: 'فيل' },
  { key: 'fish', word: 'Fish', icon: '🐟', letter: 'F', ar: 'سمكة' },
  { key: 'giraffe', word: 'Giraffe', icon: '🦒', letter: 'G', ar: 'زرافة' },
  { key: 'house', word: 'House', icon: '🏠', letter: 'H', ar: 'بيت' },
];

export const EnglishWordsGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [message, setMessage] = useState<string>('صل الكلمة الإنجليزية بالصورة المناسبة!');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const initGame = useCallback(() => {
    const list: Omit<Card, 'id' | 'isFlipped' | 'isMatched'>[] = [];

    ENGLISH_PAIRS.forEach((item) => {
      // Word card
      list.push({
        wordKey: item.key,
        type: 'word',
        text: item.word,
        subText: `${item.letter} for ${item.word}`,
        icon: '🔤',
      });
      // Picture card
      list.push({
        wordKey: item.key,
        type: 'image',
        text: item.ar,
        subText: item.word,
        icon: item.icon,
      });
    });

    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }

    const initialCards: Card[] = list.map((item, idx) => ({
      ...item,
      id: idx,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(initialCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setScore(0);
    setIsGameOver(false);
    setMessage('صل الكلمة الإنجليزية بالصورة المناسبة!');
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

      if (firstCard.wordKey === secondCard.wordKey && firstCard.type !== secondCard.type) {
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

          const found = ENGLISH_PAIRS.find((p) => p.key === firstCard.wordKey);
          setMessage(`Good Job! ${found?.word} ${found?.icon} (${found?.ar})`);

          if (newMatched === ENGLISH_PAIRS.length) {
            saveGameProgress('english-words', newScore, true);
            setIsGameOver(true);
          }
        }, 500);
      } else {
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
        title="الكلمات الإنجليزية"
        icon="📖"
        score={score}
        onRestart={initGame}
        onGoHome={onGoHome}
        accentGradient="from-[#f48fb1] to-[#c2185b]"
        badgeText="English Words & Pictures"
      />

      <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-5 sm:p-8 shadow-xl border border-pink-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 max-w-2xl w-full flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-4 px-2 text-sm text-slate-700 dark:text-slate-200">
          <span className="font-bold text-pink-900 dark:text-pink-300">{message}</span>
          <span className="text-xs font-semibold bg-pink-50 dark:bg-pink-950/80 text-pink-700 dark:text-pink-300 px-3 py-1 rounded-full border border-pink-200 dark:border-pink-800">
            {matchedPairs} / {ENGLISH_PAIRS.length} أزواج
          </span>
        </div>

        <div className="grid grid-cols-4 gap-3 sm:gap-4 w-full">
          {cards.map((card, idx) => {
            const isRevealed = card.isFlipped || card.isMatched;
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(idx)}
                disabled={card.isMatched || card.isFlipped}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center font-bold p-2 transition-all duration-300 transform select-none ${
                  card.isMatched
                    ? 'bg-gradient-to-br from-emerald-400 to-green-500 text-white shadow-md scale-95 border-2 border-emerald-300'
                    : card.isFlipped
                    ? card.type === 'word'
                      ? 'bg-gradient-to-br from-pink-200 to-rose-300 text-pink-950 shadow-lg scale-105 border-2 border-pink-300'
                      : 'bg-gradient-to-br from-purple-200 to-pink-200 text-purple-950 shadow-lg scale-105 border-2 border-purple-300'
                    : 'bg-gradient-to-br from-[#f48fb1] to-[#ec407a] hover:from-[#ec407a] hover:to-[#d81b60] text-white shadow-md hover:scale-105 active:scale-95 cursor-pointer'
                }`}
                style={{ minHeight: '75px' }}
              >
                {isRevealed ? (
                  card.type === 'word' ? (
                    <div className="flex flex-col items-center text-center">
                      <span className="text-xl sm:text-2xl font-black font-sans">{card.text}</span>
                      <span className="text-[10px] font-semibold opacity-75 mt-0.5">{card.subText}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <span className="text-2xl sm:text-3xl filter drop-shadow">{card.icon}</span>
                      <span className="text-xs sm:text-sm font-black mt-0.5">{card.text}</span>
                    </div>
                  )
                ) : (
                  <span className="text-2xl sm:text-3xl opacity-80 drop-shadow">?</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 text-center text-xs sm:text-sm text-slate-500">
          اطابق الكلمة الإنجليزية بالبطاقة التي تحتوي صورتها ومعناها!
        </div>
      </div>

      {isGameOver && (
        <WinCelebration
          score={score}
          message="🎉 أحسنت صنعاً! لقد أتقنت الكلمات الإنجليزية بامتياز!"
          onRestart={initGame}
          onGoHome={onGoHome}
          stars={score >= 70 ? 3 : score >= 50 ? 2 : 1}
        />
      )}
    </div>
  );
};

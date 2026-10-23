import React, { useState, useEffect, useCallback } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';

interface Card {
  id: number;
  letter: string;
  type: 'letter' | 'word';
  text: string;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const ARABIC_LETTER_PAIRS = [
  { letter: 'أ', word: 'أسد', icon: '🦁' },
  { letter: 'ب', word: 'بطة', icon: '🦆' },
  { letter: 'ت', word: 'تفاح', icon: '🍎' },
  { letter: 'ث', word: 'ثعلب', icon: '🦊' },
  { letter: 'ج', word: 'جمل', icon: '🐪' },
  { letter: 'ح', word: 'حصان', icon: '🐴' },
  { letter: 'خ', word: 'خروف', icon: '🐑' },
  { letter: 'د', word: 'دلفين', icon: '🐬' },
];

export const ArabicWordsGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [message, setMessage] = useState<string>('صل الحرف بالكلمة التي تبدأ به!');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const initGame = useCallback(() => {
    const list: Omit<Card, 'id' | 'isFlipped' | 'isMatched'>[] = [];

    ARABIC_LETTER_PAIRS.forEach((item) => {
      // Letter card
      list.push({
        letter: item.letter,
        type: 'letter',
        text: item.letter,
        icon: '🔤',
      });
      // Word card
      list.push({
        letter: item.letter,
        type: 'word',
        text: item.word,
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
    setMessage('صل الحرف بالكلمة التي تبدأ به!');
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

      // Check match: same letter, one is 'letter' and one is 'word' (or both match letter)
      if (firstCard.letter === secondCard.letter && firstCard.type !== secondCard.type) {
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

          const pair = ARABIC_LETTER_PAIRS.find((p) => p.letter === firstCard.letter);
          setMessage(`🎉 رائع! حرف (${firstCard.letter}) يبدأ به (${pair?.word} ${pair?.icon})`);

          if (newMatched === ARABIC_LETTER_PAIRS.length) {
            saveGameProgress('arabic-words', newScore, true);
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
        title="الحروف والكلمات العربية"
        icon="📝"
        score={score}
        onRestart={initGame}
        onGoHome={onGoHome}
        accentGradient="from-[#ff8a65] to-[#d84315]"
        badgeText="ربط الحروف بالكلمات والصور"
      />

      <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-5 sm:p-8 shadow-xl border border-orange-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 max-w-2xl w-full flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-4 px-2 text-sm text-slate-700 dark:text-slate-200">
          <span className="font-bold text-orange-900 dark:text-orange-300">{message}</span>
          <span className="text-xs font-semibold bg-orange-50 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-800">
            {matchedPairs} / {ARABIC_LETTER_PAIRS.length} أزواج
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
                    ? card.type === 'letter'
                      ? 'bg-gradient-to-br from-amber-300 to-yellow-400 text-amber-950 shadow-lg scale-105 border-2 border-amber-300'
                      : 'bg-gradient-to-br from-orange-200 to-amber-200 text-orange-950 shadow-lg scale-105 border-2 border-orange-300'
                    : 'bg-gradient-to-br from-[#ff8a65] to-[#ff7043] hover:from-[#ff7043] hover:to-[#f4511e] text-white shadow-md hover:scale-105 active:scale-95 cursor-pointer'
                }`}
                style={{ minHeight: '75px' }}
              >
                {isRevealed ? (
                  card.type === 'letter' ? (
                    <div className="flex flex-col items-center">
                      <span className="text-3xl sm:text-4xl font-extrabold">{card.letter}</span>
                      <span className="text-[10px] font-semibold opacity-80 mt-1">حرف</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <span className="text-2xl sm:text-3xl filter drop-shadow">{card.icon}</span>
                      <span className="text-sm sm:text-base font-extrabold mt-0.5">{card.text}</span>
                    </div>
                  )
                ) : (
                  <span className="text-2xl sm:text-3xl opacity-80 drop-shadow">؟</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 text-center text-xs sm:text-sm text-slate-500">
          اطابق كل حرف مع الكلمة والصورة التي تبدأ به!
        </div>
      </div>

      {isGameOver && (
        <WinCelebration
          score={score}
          message="🎉 أحسنت صنعاً! لقد ربطت جميع الحروف بكلماتها بنجاح!"
          onRestart={initGame}
          onGoHome={onGoHome}
          stars={score >= 70 ? 3 : score >= 50 ? 2 : 1}
        />
      )}
    </div>
  );
};

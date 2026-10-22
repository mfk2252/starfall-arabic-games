import React, { useState, useEffect, useCallback } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';

interface Card {
  id: number;
  itemKey: string;
  name: string;
  icon: string;
  bgGradient: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const IMAGE_ITEMS = [
  { key: 'cat', name: 'قطة لطيفة', icon: '🐱', bgGradient: 'from-amber-200 to-orange-300' },
  { key: 'dog', name: 'كلب وفي', icon: '🐶', bgGradient: 'from-yellow-200 to-amber-300' },
  { key: 'apple', name: 'تفاحة حمراء', icon: '🍎', bgGradient: 'from-red-200 to-rose-300' },
  { key: 'car', name: 'سيارة سريعة', icon: '🚗', bgGradient: 'from-blue-200 to-cyan-300' },
  { key: 'rocket', name: 'صاروخ فضاء', icon: '🚀', bgGradient: 'from-indigo-200 to-purple-300' },
  { key: 'rainbow', name: 'قوس قزح', icon: '🌈', bgGradient: 'from-pink-200 to-purple-300' },
  { key: 'ball', name: 'كرة قدم', icon: '⚽', bgGradient: 'from-emerald-200 to-teal-300' },
  { key: 'sun', name: 'شمس مشرقة', icon: '☀️', bgGradient: 'from-amber-200 to-yellow-300' },
];

export const ImagesGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [message, setMessage] = useState<string>('ابحث عن الصور المتطابقة!');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const initGame = useCallback(() => {
    const list = [...IMAGE_ITEMS, ...IMAGE_ITEMS];

    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }

    const initialCards: Card[] = list.map((item, idx) => ({
      id: idx,
      itemKey: item.key,
      name: item.name,
      icon: item.icon,
      bgGradient: item.bgGradient,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(initialCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setScore(0);
    setIsGameOver(false);
    setMessage('ابحث عن الصور المتطابقة!');
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

      if (firstCard.itemKey === secondCard.itemKey) {
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
          setMessage(`أحسنت! تطابق صورة (${firstCard.name} ${firstCard.icon}) (+10)`);

          if (newMatched === IMAGE_ITEMS.length) {
            saveGameProgress('images', newScore, true);
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
        title="تطابق الصور"
        icon="🖼️"
        score={score}
        onRestart={initGame}
        onGoHome={onGoHome}
        accentGradient="from-[#ce93d8] to-[#8e24aa]"
        badgeText="لعبة الذاكرة البصرية الممتعة"
      />

      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl border border-purple-100 max-w-2xl w-full flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-4 px-2 text-sm text-slate-700">
          <span className="font-bold text-purple-900">{message}</span>
          <span className="text-xs font-semibold bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-200">
            {matchedPairs} / {IMAGE_ITEMS.length} أزواج
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
                    ? `bg-gradient-to-br ${card.bgGradient} text-slate-800 shadow-lg scale-105 border-2 border-amber-300`
                    : 'bg-gradient-to-br from-[#ce93d8] to-[#ab47bc] hover:from-[#ba68c8] hover:to-[#9c27b0] text-white shadow-md hover:scale-105 active:scale-95 cursor-pointer'
                }`}
                style={{ minHeight: '75px' }}
              >
                {isRevealed ? (
                  <div className="flex flex-col items-center text-center">
                    <span className="text-3xl sm:text-4xl filter drop-shadow">{card.icon}</span>
                    <span className="text-[11px] sm:text-xs font-bold mt-1 text-slate-800">{card.name}</span>
                  </div>
                ) : (
                  <span className="text-3xl opacity-80 drop-shadow">🎨</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 text-center text-xs sm:text-sm text-slate-500">
          تذكر أماكن الصور وابحث عن الصورتين المتطابقتين!
        </div>
      </div>

      {isGameOver && (
        <WinCelebration
          score={score}
          message="🎉 مبروك! ذاكرتك البصرية قوية ورائعة!"
          onRestart={initGame}
          onGoHome={onGoHome}
          stars={score >= 70 ? 3 : score >= 50 ? 2 : 1}
        />
      )}
    </div>
  );
};

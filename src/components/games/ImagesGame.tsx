import React, { useState, useCallback } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { useLanguage } from '../../i18n/LanguageContext';
import { useMemoryMatch, MemoryCardBase } from '../../hooks/useMemoryMatch';
import { Volume2 } from 'lucide-react';

interface Card extends MemoryCardBase {
  itemKey: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  bgGradient: string;
}

const IMAGE_ITEMS = [
  { key: 'cat', nameAr: 'قطة لطيفة', nameEn: 'Cute Cat', icon: '🐱', bgGradient: 'from-amber-200 to-orange-300' },
  { key: 'dog', nameAr: 'كلب وفي', nameEn: 'Loyal Dog', icon: '🐶', bgGradient: 'from-yellow-200 to-amber-300' },
  { key: 'apple', nameAr: 'تفاحة حمراء', nameEn: 'Red Apple', icon: '🍎', bgGradient: 'from-red-200 to-rose-300' },
  { key: 'car', nameAr: 'سيارة سريعة', nameEn: 'Fast Car', icon: '🚗', bgGradient: 'from-blue-200 to-cyan-300' },
  { key: 'rocket', nameAr: 'صاروخ فضاء', nameEn: 'Space Rocket', icon: '🚀', bgGradient: 'from-indigo-200 to-purple-300' },
  { key: 'rainbow', nameAr: 'قوس قزح', nameEn: 'Rainbow', icon: '🌈', bgGradient: 'from-pink-200 to-purple-300' },
  { key: 'ball', nameAr: 'كرة قدم', nameEn: 'Soccer Ball', icon: '⚽', bgGradient: 'from-emerald-200 to-teal-300' },
  { key: 'sun', nameAr: 'شمس مشرقة', nameEn: 'Bright Sun', icon: '☀️', bgGradient: 'from-amber-200 to-yellow-300' },
];

export const ImagesGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [feedbackKey, setFeedbackKey] = useState<'start' | 'match' | 'wrong'>('start');
  const [lastMatchedCard, setLastMatchedCard] = useState<{ nameAr: string; nameEn: string; icon: string } | null>(null);

  const buildCards = useCallback(
    () =>
      [...IMAGE_ITEMS, ...IMAGE_ITEMS].map((item) => ({
        itemKey: item.key,
        nameAr: item.nameAr,
        nameEn: item.nameEn,
        icon: item.icon,
        bgGradient: item.bgGradient,
      })),
    []
  );

  const isMatch = useCallback((a: Card, b: Card) => a.itemKey === b.itemKey, []);

  const handleMatch = useCallback(
    (first: Card) => {
      sound.speakText(isAr ? first.nameAr : first.nameEn, isAr ? 'ar' : 'en');
      setLastMatchedCard({ nameAr: first.nameAr, nameEn: first.nameEn, icon: first.icon });
      setFeedbackKey('match');
    },
    [isAr]
  );

  const handleMismatch = useCallback(() => {
    setFeedbackKey('wrong');
  }, []);

  const { cards, score, matchedPairs, isGameOver, initGame, handleCardClick } = useMemoryMatch<Card>({
    gameId: 'images',
    totalPairs: IMAGE_ITEMS.length,
    buildCards,
    isMatch,
    onMatch: handleMatch,
    onMismatch: handleMismatch,
  });

  const handleRestart = useCallback(() => {
    setFeedbackKey('start');
    setLastMatchedCard(null);
    initGame();
  }, [initGame]);

  const statusMessage =
    feedbackKey === 'match' && lastMatchedCard
      ? isAr
        ? `أحسنت! تطابق صورة (${lastMatchedCard.nameAr} ${lastMatchedCard.icon}) (+10)`
        : `Great! Matched (${lastMatchedCard.nameEn} ${lastMatchedCard.icon}) (+10)`
      : feedbackKey === 'wrong'
      ? isAr
        ? 'حاول مرة أخرى!'
        : 'Try again!'
      : isAr
      ? 'ابحث عن الصور المتطابقة!'
      : 'Find the matching pictures!';

  return (
    <div className="flex flex-col items-center w-full px-4 py-4 min-h-[85vh]">
      <GameHeader
        title={isAr ? 'تطابق الصور' : 'Visual Memory Match'}
        icon="🖼️"
        score={score}
        onRestart={handleRestart}
        onGoHome={onGoHome}
        accentGradient="from-[#ce93d8] to-[#8e24aa]"
        badgeText={isAr ? 'لعبة الذاكرة البصرية الممتعة' : 'Fun Visual Memory'}
      />

      <div className="bg-white dark:bg-[#20091b] rounded-3xl p-5 sm:p-8 shadow-xl border border-purple-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 max-w-2xl w-full flex flex-col items-center">
        <div className="w-full flex flex-wrap justify-between items-center gap-2 mb-4 px-2 text-sm text-slate-700 dark:text-slate-200">
          <div className="flex items-center gap-2">
            <span className="font-bold text-purple-900 dark:text-purple-300">{statusMessage}</span>
            {lastMatchedCard && (
              <button
                onClick={() =>
                  sound.speakText(
                    isAr ? lastMatchedCard.nameAr : lastMatchedCard.nameEn,
                    isAr ? 'ar' : 'en'
                  )
                }
                className="p-1.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 hover:bg-purple-200 transition-colors cursor-pointer"
                title={isAr ? 'إعادة النطق' : 'Repeat pronunciation'}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <span className="text-xs font-semibold bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800">
            {isAr
              ? `${matchedPairs} / ${IMAGE_ITEMS.length} أزواج`
              : `${matchedPairs} / ${IMAGE_ITEMS.length} pairs`}
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
                    <span className="text-[11px] sm:text-xs font-bold mt-1 text-slate-800">
                      {isAr ? card.nameAr : card.nameEn}
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl opacity-80 drop-shadow">🎨</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {isAr
            ? 'تذكر أماكن الصور وابحث عن الصورتين المتطابقتين!'
            : 'Remember picture positions and match identical pairs!'}
        </div>
      </div>

      {isGameOver && (
        <WinCelebration
          score={score}
          message={
            isAr
              ? '🎉 مبروك! ذاكرتك البصرية قوية ورائعة!'
              : '🎉 Congrats! Your visual memory is super strong!'
          }
          onRestart={handleRestart}
          onGoHome={onGoHome}
          stars={score >= 70 ? 3 : score >= 50 ? 2 : 1}
        />
      )}
    </div>
  );
};

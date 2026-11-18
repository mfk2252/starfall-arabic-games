import React, { useState, useCallback } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { useLanguage } from '../../i18n/LanguageContext';
import { useMemoryMatch, MemoryCardBase } from '../../hooks/useMemoryMatch';
import { Volume2 } from 'lucide-react';

interface Card extends MemoryCardBase {
  wordKey: string;
  type: 'word' | 'image';
  text: string;
  subText: string;
  icon: string;
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
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [feedbackKey, setFeedbackKey] = useState<'start' | 'match' | 'wrong'>('start');
  const [lastKey, setLastKey] = useState<string | null>(null);

  const buildCards = useCallback(() => {
    const list: Omit<Card, 'id' | 'isFlipped' | 'isMatched'>[] = [];
    ENGLISH_PAIRS.forEach((item) => {
      list.push({
        wordKey: item.key,
        type: 'word',
        text: item.word,
        subText: `${item.letter} for ${item.word}`,
        icon: '🔤',
      });
      list.push({
        wordKey: item.key,
        type: 'image',
        text: item.ar,
        subText: item.word,
        icon: item.icon,
      });
    });
    return list;
  }, []);

  const isMatch = useCallback(
    (a: Card, b: Card) => a.wordKey === b.wordKey && a.type !== b.type,
    []
  );

  const handleMatch = useCallback((first: Card) => {
    const found = ENGLISH_PAIRS.find((p) => p.key === first.wordKey);
    if (found) {
      sound.speakText(found.word, 'en');
    }
    setLastKey(first.wordKey);
    setFeedbackKey('match');
  }, []);

  const handleMismatch = useCallback(() => {
    setFeedbackKey('wrong');
  }, []);

  const { cards, score, matchedPairs, isGameOver, initGame, handleCardClick } = useMemoryMatch<Card>({
    gameId: 'english-words',
    totalPairs: ENGLISH_PAIRS.length,
    buildCards,
    isMatch,
    onMatch: handleMatch,
    onMismatch: handleMismatch,
  });

  const handleRestart = useCallback(() => {
    setFeedbackKey('start');
    setLastKey(null);
    initGame();
  }, [initGame]);

  const foundPair = lastKey ? ENGLISH_PAIRS.find((p) => p.key === lastKey) : null;

  const statusMessage =
    feedbackKey === 'match' && foundPair
      ? `Good Job! ${foundPair.word} ${foundPair.icon} (${foundPair.ar})`
      : feedbackKey === 'wrong'
      ? isAr
        ? 'حاول مرة أخرى!'
        : 'Try again!'
      : isAr
      ? 'صل الكلمة الإنجليزية بالصورة المناسبة!'
      : 'Match the English word with its picture!';

  return (
    <div className="flex flex-col items-center w-full px-4 py-4 min-h-[85vh]">
      <GameHeader
        title={isAr ? 'الكلمات الإنجليزية' : 'English Words & Pictures'}
        icon="📖"
        score={score}
        onRestart={handleRestart}
        onGoHome={onGoHome}
        accentGradient="from-[#f48fb1] to-[#c2185b]"
        badgeText="English Words & Pictures"
      />

      <div className="bg-white dark:bg-[#20091b] rounded-3xl p-5 sm:p-8 shadow-xl border border-pink-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 max-w-2xl w-full flex flex-col items-center">
        <div className="w-full flex flex-wrap justify-between items-center gap-2 mb-4 px-2 text-sm text-slate-700 dark:text-slate-200">
          <div className="flex items-center gap-2">
            <span className="font-bold text-pink-900 dark:text-pink-300">{statusMessage}</span>
            {foundPair && (
              <button
                onClick={() => sound.speakText(foundPair.word, 'en')}
                className="p-1.5 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 hover:bg-pink-200 transition-colors cursor-pointer"
                title={isAr ? 'إعادة النطق' : 'Repeat pronunciation'}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <span className="text-xs font-semibold bg-pink-50 dark:bg-pink-950/80 text-pink-700 dark:text-pink-300 px-3 py-1 rounded-full border border-pink-200 dark:border-pink-800">
            {isAr
              ? `${matchedPairs} / ${ENGLISH_PAIRS.length} أزواج`
              : `${matchedPairs} / ${ENGLISH_PAIRS.length} pairs`}
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

        <div className="mt-6 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {isAr
            ? 'طابق الكلمة الإنجليزية بالبطاقة التي تحتوي صورتها ومعناها!'
            : 'Pair each English word with its matching picture card!'}
        </div>
      </div>

      {isGameOver && (
        <WinCelebration
          score={score}
          message={
            isAr
              ? '🎉 أحسنت صنعاً! لقد أتقنت الكلمات الإنجليزية بامتياز!'
              : '🎉 Well done! You mastered all English words!'
          }
          onRestart={handleRestart}
          onGoHome={onGoHome}
          stars={score >= 70 ? 3 : score >= 50 ? 2 : 1}
        />
      )}
    </div>
  );
};

import React, { useState, useCallback, useEffect } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { useLanguage } from '../../i18n/LanguageContext';
import { useMemoryMatch, MemoryCardBase } from '../../hooks/useMemoryMatch';
import { Volume2 } from 'lucide-react';

interface Card extends MemoryCardBase {
  pairKey: string;
  display: string;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export const EnglishLettersGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [matchCase, setMatchCase] = useState<boolean>(true);
  const [feedbackKey, setFeedbackKey] = useState<'start' | 'match' | 'wrong'>('start');
  const [lastLetter, setLastLetter] = useState<string | null>(null);

  const buildCards = useCallback(() => {
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
    return cardItems;
  }, [matchCase]);

  const isMatch = useCallback((a: Card, b: Card) => a.pairKey === b.pairKey, []);

  const handleMatch = useCallback((first: Card) => {
    sound.speakText(first.pairKey, 'en');
    setLastLetter(first.pairKey);
    setFeedbackKey('match');
  }, []);

  const handleMismatch = useCallback(() => {
    setFeedbackKey('wrong');
  }, []);

  const { cards, score, matchedPairs, isGameOver, initGame, handleCardClick } = useMemoryMatch<Card>({
    gameId: 'english-letters',
    totalPairs: LETTERS.length,
    buildCards,
    isMatch,
    onMatch: handleMatch,
    onMismatch: handleMismatch,
  });

  useEffect(() => {
    setFeedbackKey('start');
    setLastLetter(null);
  }, [matchCase]);

  const handleRestart = useCallback(() => {
    setFeedbackKey('start');
    setLastLetter(null);
    initGame();
  }, [initGame]);

  const statusMessage =
    feedbackKey === 'match' && lastLetter
      ? isAr
        ? `أحسنت! تطابق الحرف (${lastLetter}) (+10)`
        : `Great! Matched letter (${lastLetter}) (+10)`
      : feedbackKey === 'wrong'
      ? isAr
        ? 'حاول مرة أخرى!'
        : 'Try again!'
      : isAr
      ? 'ابحث عن الحروف الإنجليزية المتطابقة!'
      : 'Find matching English letters!';

  return (
    <div className="flex flex-col items-center w-full px-4 py-4 min-h-[85vh]">
      <GameHeader
        title={isAr ? 'تطابق الحروف الإنجليزية' : 'English Alphabet Match'}
        icon="🔤"
        score={score}
        onRestart={handleRestart}
        onGoHome={onGoHome}
        accentGradient="from-[#ffd54f] to-[#f57f17]"
        badgeText="English Alphabet"
      />

      <div className="bg-white dark:bg-[#20091b] rounded-3xl p-5 sm:p-8 shadow-xl border border-amber-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 max-w-2xl w-full flex flex-col items-center">
        <div className="w-full flex flex-wrap justify-between items-center gap-2 mb-4 px-2 text-sm text-slate-700 dark:text-slate-200">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-800 dark:text-amber-400">{statusMessage}</span>
            {lastLetter && (
              <button
                onClick={() => sound.speakText(lastLetter, 'en')}
                className="p-1.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 hover:bg-amber-200 transition-colors cursor-pointer"
                title={isAr ? 'إعادة النطق' : 'Repeat pronunciation'}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => {
              sound.playClick();
              setMatchCase(!matchCase);
            }}
            className="text-xs font-bold bg-amber-50 dark:bg-amber-950/80 hover:bg-amber-100 dark:hover:bg-amber-900/80 text-amber-800 dark:text-amber-200 px-3 py-1.5 rounded-full border border-amber-200 dark:border-amber-800 cursor-pointer"
          >
            {matchCase
              ? isAr
                ? 'مطابقة الكبير مع الصغير (A - a)'
                : 'Match Upper & Lower (A - a)'
              : isAr
              ? 'مطابقة متطابقة (A - A)'
              : 'Match Identical (A - A)'}
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

        <div className="mt-6 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
          {isAr ? (
            <>
              تم إيجاد: <span className="text-amber-600 font-bold">{matchedPairs}</span> من أصل {LETTERS.length} أزواج
            </>
          ) : (
            <>
              Found: <span className="text-amber-600 font-bold">{matchedPairs}</span> of {LETTERS.length} pairs
            </>
          )}
        </div>
      </div>

      {isGameOver && (
        <WinCelebration
          score={score}
          message={
            isAr
              ? '🎉 مذهل! لقد أتقنت الحروف الإنجليزية بنجاح!'
              : '🎉 Amazing! You mastered the English alphabet!'
          }
          onRestart={handleRestart}
          onGoHome={onGoHome}
          stars={score >= 70 ? 3 : score >= 50 ? 2 : 1}
        />
      )}
    </div>
  );
};

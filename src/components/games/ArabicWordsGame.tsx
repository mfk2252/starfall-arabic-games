import React, { useState, useCallback } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { useLanguage } from '../../i18n/LanguageContext';
import { useMemoryMatch, MemoryCardBase } from '../../hooks/useMemoryMatch';
import { Volume2 } from 'lucide-react';

interface Card extends MemoryCardBase {
  letter: string;
  type: 'letter' | 'word';
  text: string;
  icon: string;
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
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [feedbackKey, setFeedbackKey] = useState<'start' | 'match' | 'wrong'>('start');
  const [lastLetter, setLastLetter] = useState<string | null>(null);

  const buildCards = useCallback(() => {
    const list: Omit<Card, 'id' | 'isFlipped' | 'isMatched'>[] = [];
    ARABIC_LETTER_PAIRS.forEach((item) => {
      list.push({ letter: item.letter, type: 'letter', text: item.letter, icon: '🔤' });
      list.push({ letter: item.letter, type: 'word', text: item.word, icon: item.icon });
    });
    return list;
  }, []);

  const isMatch = useCallback(
    (a: Card, b: Card) => a.letter === b.letter && a.type !== b.type,
    []
  );

  const handleMatch = useCallback((first: Card) => {
    const pair = ARABIC_LETTER_PAIRS.find((p) => p.letter === first.letter);
    if (pair) {
      sound.speakText(`${pair.letter}، ${pair.word}`, 'ar');
    }
    setLastLetter(first.letter);
    setFeedbackKey('match');
  }, []);

  const handleMismatch = useCallback(() => {
    setFeedbackKey('wrong');
  }, []);

  const { cards, score, matchedPairs, isGameOver, initGame, handleCardClick } = useMemoryMatch<Card>({
    gameId: 'arabic-words',
    totalPairs: ARABIC_LETTER_PAIRS.length,
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

  const lastPair = lastLetter ? ARABIC_LETTER_PAIRS.find((p) => p.letter === lastLetter) : null;

  const statusMessage =
    feedbackKey === 'match' && lastPair
      ? isAr
        ? `🎉 رائع! حرف (${lastPair.letter}) يبدأ به (${lastPair.word} ${lastPair.icon})`
        : `🎉 Great! (${lastPair.letter}) starts (${lastPair.word} ${lastPair.icon})`
      : feedbackKey === 'wrong'
      ? isAr
        ? 'حاول مرة أخرى!'
        : 'Try again!'
      : isAr
      ? 'صل الحرف بالكلمة التي تبدأ به!'
      : 'Match each Arabic letter with its word!';

  return (
    <div className="flex flex-col items-center w-full px-4 py-4 min-h-[85vh]">
      <GameHeader
        title={isAr ? 'الحروف والكلمات العربية' : 'Arabic Letters & Words'}
        icon="📝"
        score={score}
        onRestart={handleRestart}
        onGoHome={onGoHome}
        accentGradient="from-[#ff8a65] to-[#d84315]"
        badgeText={isAr ? 'ربط الحروف بالكلمات والصور' : 'Link Letters to Words'}
      />

      <div className="bg-white dark:bg-[#20091b] rounded-3xl p-5 sm:p-8 shadow-xl border border-orange-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 max-w-2xl w-full flex flex-col items-center">
        <div className="w-full flex flex-wrap justify-between items-center gap-2 mb-4 px-2 text-sm text-slate-700 dark:text-slate-200">
          <div className="flex items-center gap-2">
            <span className="font-bold text-orange-900 dark:text-orange-300">{statusMessage}</span>
            {lastPair && (
              <button
                onClick={() => sound.speakText(`${lastPair.letter}، ${lastPair.word}`, 'ar')}
                className="p-1.5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 hover:bg-orange-200 transition-colors cursor-pointer"
                title={isAr ? 'إعادة النطق' : 'Repeat pronunciation'}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <span className="text-xs font-semibold bg-orange-50 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-800">
            {isAr
              ? `${matchedPairs} / ${ARABIC_LETTER_PAIRS.length} أزواج`
              : `${matchedPairs} / ${ARABIC_LETTER_PAIRS.length} pairs`}
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
                      <span className="text-[10px] font-semibold opacity-80 mt-1">
                        {isAr ? 'حرف' : 'Letter'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <span className="text-2xl sm:text-3xl filter drop-shadow">{card.icon}</span>
                      <span className="text-sm sm:text-base font-extrabold mt-0.5">{card.text}</span>
                    </div>
                  )
                ) : (
                  <span className="text-2xl sm:text-3xl opacity-80 drop-shadow">{isAr ? '؟' : '?'}</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {isAr
            ? 'طابق كل حرف مع الكلمة والصورة التي تبدأ به!'
            : 'Pair each letter with the matching word and picture!'}
        </div>
      </div>

      {isGameOver && (
        <WinCelebration
          score={score}
          message={
            isAr
              ? '🎉 أحسنت صنعاً! لقد ربطت جميع الحروف بكلماتها بنجاح!'
              : '🎉 Well done! You matched all Arabic letters with their words!'
          }
          onRestart={handleRestart}
          onGoHome={onGoHome}
          stars={score >= 70 ? 3 : score >= 50 ? 2 : 1}
        />
      )}
    </div>
  );
};

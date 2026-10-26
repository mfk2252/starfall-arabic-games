import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';
import { EMOTIONS_DATA, EmotionItem } from '../../data/gameContent';
import { useLanguage } from '../../i18n/LanguageContext';
import { Heart, Sparkles } from 'lucide-react';

export const EmotionsKidsGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [wrongIdx, setWrongIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [roundQuestions, setRoundQuestions] = useState<EmotionItem[]>([]);

  // Initialize a round of 8 questions
  const initGame = useCallback(() => {
    const shuffled = [...EMOTIONS_DATA].sort(() => Math.random() - 0.5);
    setRoundQuestions(shuffled.slice(0, 8));
    setCurrentIndex(0);
    setScore(0);
    setSelectedIdx(null);
    setWrongIdx(null);
    setIsAnswered(false);
    setIsProcessing(false);
    setIsGameOver(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const targetEmotion = roundQuestions[currentIndex];

  // Generate 3 options: 1 correct, 2 random distractors
  const options = useMemo(() => {
    if (!targetEmotion) return [];
    const distractors = EMOTIONS_DATA.filter(e => e.id !== targetEmotion.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    return [targetEmotion, ...distractors].sort(() => Math.random() - 0.5);
  }, [targetEmotion]);

  const handleSelect = (idx: number, emotionId: string) => {
    if (isProcessing || isAnswered) return;

    if (emotionId === targetEmotion.id) {
      setSelectedIdx(idx);
      setIsAnswered(true);
      setIsProcessing(true);
      sound.playMatch();
      const newScore = score + 12.5; // 8 questions * 12.5 = 100
      setScore(Math.min(100, newScore));

      setTimeout(() => {
        if (currentIndex + 1 < roundQuestions.length) {
          setCurrentIndex((prev) => prev + 1);
          setSelectedIdx(null);
          setWrongIdx(null);
          setIsAnswered(false);
          setIsProcessing(false);
        } else {
          saveGameProgress('emotions-kids', Math.round(newScore), true);
          setIsGameOver(true);
        }
      }, 1200);
    } else {
      sound.playWrong();
      setWrongIdx(idx);
      setScore((prev) => Math.max(0, prev - 2));

      setTimeout(() => {
        setWrongIdx(null);
      }, 700);
    }
  };

  if (!targetEmotion) return null;

  return (
    <div className="flex flex-col items-center w-full px-4 py-4 min-h-[85vh] animate-in fade-in duration-500">
      <GameHeader
        title={language === 'ar' ? 'لعبة المشاعر' : 'Emotions Game'}
        icon="😊💖"
        score={Math.round(score)}
        onRestart={initGame}
        onGoHome={onGoHome}
        accentGradient="from-[#06d6a0] to-[#118ab2]"
        badgeText={language === 'ar' ? `تحدي ${currentIndex + 1} من ${roundQuestions.length}` : `Challenge ${currentIndex + 1} of ${roundQuestions.length}`}
      />

      <div className="bg-white dark:bg-[#20091b] rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 max-w-2xl w-full flex flex-col items-center gap-8">
        
        {/* Target Display */}
        <div className="w-full flex flex-col items-center gap-4 text-center">
          <div className="relative group">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-4 border-emerald-200 dark:border-emerald-800 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
              <span className="text-6xl sm:text-7xl drop-shadow-md animate-bounce-slow">
                {targetEmotion.emoji}
              </span>
            </div>
            <div className="absolute -top-2 -right-2 bg-amber-400 text-white p-2 rounded-full shadow-lg animate-pulse">
              <Heart className="w-5 h-5 fill-white" />
            </div>
          </div>
          
          <div className="space-y-1">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white">
              {language === 'ar' ? targetEmotion.labelAr : targetEmotion.labelEn}
            </h2>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {language === 'ar' ? 'طابق هذا الشعور!' : 'Match this feeling!'}
            </p>
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          {options.map((opt, idx) => {
            const isCorrect = isAnswered && opt.id === targetEmotion.id;
            const isWrong = wrongIdx === idx;
            
            let btnStyle = 'bg-slate-50 hover:bg-emerald-50 border-slate-200 text-slate-800 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100';

            if (isCorrect) {
              btnStyle = 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200 shadow-lg scale-105';
            } else if (isWrong) {
              btnStyle = 'bg-rose-500 text-white border-rose-600 ring-4 ring-rose-200 animate-shake';
            }

            return (
              <button
                key={`${opt.id}-${idx}`}
                onClick={() => handleSelect(idx, opt.id)}
                disabled={isProcessing || isAnswered}
                className={`p-6 rounded-3xl border-4 flex flex-col items-center justify-center gap-3 transition-all transform duration-200 cursor-pointer select-none ${
                  !isAnswered && !isProcessing ? 'hover:scale-105 active:scale-95 shadow-md' : ''
                } ${btnStyle}`}
              >
                <span className="text-5xl sm:text-6xl filter drop-shadow-sm">{opt.emoji}</span>
              </button>
            );
          })}
        </div>

        {/* Info / Hint */}
        {!isAnswered && (
          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>{language === 'ar' ? 'اختر الشكل المطابق' : 'Pick the matching face'}</span>
          </div>
        )}
      </div>

      {isGameOver && (
        <WinCelebration
          score={Math.round(score)}
          message={language === 'ar' ? '🎉 رائع! أنت بارع في التعرف على المشاعر!' : '🎉 Amazing! You are an expert at recognizing feelings!'}
          onRestart={initGame}
          onGoHome={onGoHome}
          stars={score >= 80 ? 3 : score >= 50 ? 2 : 1}
        />
      )}
    </div>
  );
};

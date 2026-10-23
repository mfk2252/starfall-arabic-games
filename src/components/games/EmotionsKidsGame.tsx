import React, { useState, useEffect, useCallback } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';
import { EMOTION_SCENARIOS } from '../../data/gameContent';
import { useLanguage } from '../../i18n/LanguageContext';
import { Heart } from 'lucide-react';

export const EmotionsKidsGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [wrongIdx, setWrongIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const currentQ = EMOTION_SCENARIOS[currentIndex];

  const initGame = useCallback(() => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedIdx(null);
    setWrongIdx(null);
    setIsAnswered(false);
    setIsProcessing(false);
    setFeedback('');
    setIsGameOver(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleSelectEmotion = (optIdx: number, isCorrect: boolean, explanation: string, explanationEn: string) => {
    if (isProcessing || isAnswered) return;

    if (isCorrect) {
      setSelectedIdx(optIdx);
      setIsAnswered(true);
      setIsProcessing(true);
      sound.playMatch();
      const newScore = score + 25;
      setScore(newScore);
      setFeedback(`🎉 ${language === 'ar' ? 'أحسنت فهم المشاعر!' : 'Great emotional understanding!'} ${language === 'ar' ? explanation : explanationEn}`);

      setTimeout(() => {
        if (currentIndex + 1 < EMOTION_SCENARIOS.length) {
          setCurrentIndex((prev) => prev + 1);
          setSelectedIdx(null);
          setWrongIdx(null);
          setIsAnswered(false);
          setIsProcessing(false);
          setFeedback('');
        } else {
          saveGameProgress('emotions-kids', newScore, true);
          setIsGameOver(true);
        }
      }, 1200);
    } else {
      sound.playWrong();
      setWrongIdx(optIdx);
      setFeedback(`❌ ${language === 'ar' ? 'فكر في هذا الموقف:' : 'Think about this situation:'} ${language === 'ar' ? explanation : explanationEn} ${language === 'ar' ? 'حاول مجدداً!' : 'Try again!'}`);
      setScore((prev) => Math.max(0, prev - 2));

      setTimeout(() => {
        setWrongIdx(null);
      }, 700);
    }
  };

  return (
    <div className="flex flex-col items-center w-full px-4 py-4 min-h-[85vh]">
      <GameHeader
        title={language === 'ar' ? 'التعرف على المشاعر والتواصل' : 'Emotions & Feelings'}
        icon="😊💖"
        score={score}
        onRestart={initGame}
        onGoHome={onGoHome}
        accentGradient="from-[#06d6a0] to-[#118ab2]"
        badgeText={language === 'ar' ? `موقف ${currentIndex + 1} من ${EMOTION_SCENARIOS.length}` : `Scenario ${currentIndex + 1} of ${EMOTION_SCENARIOS.length}`}
      />

      <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-4 sm:p-6 shadow-xl border border-emerald-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 max-w-2xl w-full flex flex-col items-center">
        {/* Scenario Card */}
        <div className="w-full bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-emerald-950/40 dark:to-slate-900 border-2 border-emerald-200 dark:border-slate-700 rounded-3xl p-5 text-center mb-4 shadow-sm">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1.5">
            <Heart className="w-4 h-4 fill-emerald-500 text-emerald-500" />
            <span>{language === 'ar' ? 'تأمل في هذا الموقف الإنساني:' : 'Reflect on this social situation:'}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100 leading-relaxed">
            {language === 'ar' ? currentQ.situation : currentQ.situationEn}
          </h2>
        </div>

        {/* Question Prompt */}
        <div className="w-full text-center mb-3">
          <h3 className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300">
            {language === 'ar' ? 'كيف يشعر الطفل في هذا الموقف؟' : 'How does the child feel in this situation?'}
          </h3>
        </div>

        {/* Emotion Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mb-4">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedIdx === idx;
            const isWrong = wrongIdx === idx;
            let btnStyle = 'bg-slate-50 hover:bg-emerald-50 border-slate-200 text-slate-800 hover:border-emerald-300 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100';

            if (isAnswered && opt.isCorrect) {
              btnStyle = 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200 shadow-lg scale-102';
            } else if (isWrong) {
              btnStyle = 'bg-rose-500 text-white border-rose-600 ring-2 ring-rose-200 animate-shake';
            } else if (isSelected) {
              btnStyle = 'bg-emerald-600 text-white border-emerald-700';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectEmotion(idx, opt.isCorrect, opt.explanation, opt.explanationEn)}
                disabled={isProcessing || isAnswered}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all transform duration-150 cursor-pointer select-none ${
                  !isAnswered && !isProcessing ? 'hover:scale-105 active:scale-95 shadow-sm' : ''
                } ${btnStyle}`}
              >
                <span className="text-4xl sm:text-5xl filter drop-shadow animate-pulse">{opt.icon}</span>
                <span className="text-sm font-black text-center mt-0.5">
                  {language === 'ar' ? opt.emotion : opt.emotionEn}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className={`w-full text-center p-2.5 rounded-2xl font-bold text-xs sm:text-sm animate-pop-in ${
            isAnswered
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
          }`}>
            {feedback}
          </div>
        )}
      </div>

      {isGameOver && (
        <WinCelebration
          score={score}
          message={language === 'ar' ? '🎉 قلبك طيب وذكي! لقد تعرفت على مشاعر الآخرين وتعلمت التعبير عنها بلطف!' : '🎉 Kind & Empathetic! You understood feelings and emotional communication!'}
          onRestart={initGame}
          onGoHome={onGoHome}
          stars={score >= 80 ? 3 : score >= 50 ? 2 : 1}
        />
      )}
    </div>
  );
};

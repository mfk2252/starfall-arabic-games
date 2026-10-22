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
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const currentQ = EMOTION_SCENARIOS[currentIndex];

  const initGame = useCallback(() => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedIdx(null);
    setIsAnswered(false);
    setFeedback('');
    setIsGameOver(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleSelectEmotion = (optIdx: number, isCorrect: boolean, explanation: string, explanationEn: string) => {
    if (isAnswered) return;
    setSelectedIdx(optIdx);
    setIsAnswered(true);

    if (isCorrect) {
      sound.playMatch();
      const newScore = score + 25;
      setScore(newScore);
      setFeedback(`🎉 ${language === 'ar' ? 'أحسنت فهم المشاعر!' : 'Great emotional understanding!'} ${language === 'ar' ? explanation : explanationEn}`);
    } else {
      sound.playWrong();
      setFeedback(`❌ ${language === 'ar' ? 'فكر في هذا الموقف:' : 'Think about this situation:'} ${language === 'ar' ? explanation : explanationEn}`);
      setScore((prev) => Math.max(0, prev - 2));
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (currentIndex + 1 < EMOTION_SCENARIOS.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedIdx(null);
      setIsAnswered(false);
      setFeedback('');
    } else {
      saveGameProgress('emotions-kids', score, true);
      setIsGameOver(true);
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

      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl border border-emerald-100 max-w-2xl w-full flex flex-col items-center">
        {/* Scenario Card */}
        <div className="w-full bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-2 border-emerald-200 rounded-3xl p-6 text-center mb-6 shadow-sm">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
            <Heart className="w-4 h-4 fill-emerald-500 text-emerald-500" />
            <span>{language === 'ar' ? 'تأمل في هذا الموقف الإنساني:' : 'Reflect on this social situation:'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 leading-relaxed">
            {language === 'ar' ? currentQ.situation : currentQ.situationEn}
          </h2>
        </div>

        {/* Question Prompt */}
        <div className="w-full text-center mb-4">
          <h3 className="text-sm sm:text-base font-bold text-slate-600">
            {language === 'ar' ? 'كيف يشعر الطفل في هذا الموقف؟' : 'How does the child feel in this situation?'}
          </h3>
        </div>

        {/* Emotion Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mb-6">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedIdx === idx;
            let btnStyle = 'bg-slate-50 hover:bg-emerald-50 border-slate-200 text-slate-800 hover:border-emerald-300';

            if (isAnswered) {
              if (opt.isCorrect) {
                btnStyle = 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200 shadow-lg scale-102';
              } else if (isSelected) {
                btnStyle = 'bg-rose-500 text-white border-rose-600 ring-2 ring-rose-200';
              } else {
                btnStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-50';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectEmotion(idx, opt.isCorrect, opt.explanation, opt.explanationEn)}
                disabled={isAnswered}
                className={`p-5 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all transform duration-150 cursor-pointer select-none ${
                  !isAnswered ? 'hover:scale-105 active:scale-95 shadow-sm' : ''
                } ${btnStyle}`}
              >
                <span className="text-5xl filter drop-shadow animate-pulse">{opt.icon}</span>
                <span className="text-base font-black text-center mt-1">
                  {language === 'ar' ? opt.emotion : opt.emotionEn}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className="w-full text-center p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 font-bold mb-5 animate-pop-in text-sm sm:text-base">
            {feedback}
          </div>
        )}

        {/* Next Scenario Button */}
        {isAnswered && (
          <button
            onClick={handleNext}
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all"
          >
            {currentIndex + 1 < EMOTION_SCENARIOS.length
              ? language === 'ar' ? 'الموقف التالي ⬅️' : 'Next Scenario ➡️'
              : language === 'ar' ? 'عرض النتيجة النهائية 🏆' : 'View Final Result 🏆'}
          </button>
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

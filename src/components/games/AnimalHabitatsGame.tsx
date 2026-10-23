import React, { useState, useEffect, useCallback } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';
import { ANIMAL_HABITATS } from '../../data/gameContent';
import { useLanguage } from '../../i18n/LanguageContext';
import { Sparkles, Utensils } from 'lucide-react';

export const AnimalHabitatsGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedHabitat, setSelectedHabitat] = useState<string | null>(null);
  const [wrongHabitat, setWrongHabitat] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');

  const currentQ = ANIMAL_HABITATS[currentIndex];

  const initGame = useCallback(() => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedHabitat(null);
    setWrongHabitat(null);
    setIsAnswered(false);
    setIsProcessing(false);
    setFeedback('');
    setIsGameOver(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleSelectHabitat = (habitatId: string, isCorrect: boolean) => {
    if (isProcessing || isAnswered) return;

    if (isCorrect) {
      setSelectedHabitat(habitatId);
      setIsAnswered(true);
      setIsProcessing(true);
      sound.playMatch();
      const newScore = score + 25;
      setScore(newScore);
      setFeedback(`🎉 ${language === 'ar' ? 'أحسنت! هذا هو الموطن الطبيعي المناسب!' : 'Correct! This is their natural habitat!'}`);

      setTimeout(() => {
        if (currentIndex + 1 < ANIMAL_HABITATS.length) {
          setCurrentIndex((prev) => prev + 1);
          setSelectedHabitat(null);
          setWrongHabitat(null);
          setIsAnswered(false);
          setIsProcessing(false);
          setFeedback('');
        } else {
          saveGameProgress('animal-habitats', newScore, true);
          setIsGameOver(true);
        }
      }, 1200);
    } else {
      sound.playWrong();
      setWrongHabitat(habitatId);
      setFeedback(`❌ ${language === 'ar' ? 'هذا المكان لا يناسب طبيعة هذا الحيوان! حاول مجدداً.' : 'This environment does not suit this animal! Try again.'}`);
      setScore((prev) => Math.max(0, prev - 2));

      setTimeout(() => {
        setWrongHabitat(null);
      }, 700);
    }
  };

  return (
    <div className="flex flex-col items-center w-full px-4 py-4 min-h-[85vh]">
      <GameHeader
        title={language === 'ar' ? 'الحيوانات ومواطنها وغذاؤها' : 'Animal Habitats & Food'}
        icon="🦁🌴"
        score={score}
        onRestart={initGame}
        onGoHome={onGoHome}
        accentGradient="from-[#2a9d8f] to-[#264653]"
        badgeText={language === 'ar' ? `حيوان ${currentIndex + 1} من ${ANIMAL_HABITATS.length}` : `Animal ${currentIndex + 1} of ${ANIMAL_HABITATS.length}`}
      />

      <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-4 sm:p-6 shadow-xl border border-teal-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 max-w-2xl w-full flex flex-col items-center">
        {/* Animal Hero Display */}
        <div className="w-full bg-gradient-to-r from-teal-50 via-emerald-50 to-cyan-50 dark:from-slate-900 dark:via-teal-950/40 dark:to-slate-900 rounded-3xl p-5 text-center border-2 border-teal-200 dark:border-slate-700 mb-4 shadow-sm">
          <span className="text-xs font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider block mb-1">
            {language === 'ar' ? 'ساعد هذا الصديق في العثور على بيئته الطبيعية:' : 'Help this friend find their true natural home:'}
          </span>
          <div className="text-6xl sm:text-7xl my-1 filter drop-shadow animate-bounce">
            {currentQ.animal.icon}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
            {language === 'ar' ? currentQ.animal.name : currentQ.animal.nameEn}
          </h2>
        </div>

        {/* Habitat Options */}
        <div className="w-full mb-4">
          <h3 className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 mb-2.5 text-center">
            {language === 'ar' ? 'أين يعيش هذا الحيوان؟' : 'Where does this animal live?'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {currentQ.habitats.map((habitat) => {
              const isSelected = selectedHabitat === habitat.id;
              const isWrong = wrongHabitat === habitat.id;

              let btnStyle = 'bg-slate-50 hover:bg-teal-50 border-slate-200 text-slate-800 hover:border-teal-300 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100';

              if (isAnswered && habitat.isCorrect) {
                btnStyle = 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200 shadow-lg scale-102';
              } else if (isWrong) {
                btnStyle = 'bg-rose-500 text-white border-rose-600 ring-2 ring-rose-200 animate-shake';
              } else if (isSelected) {
                btnStyle = 'bg-teal-600 text-white border-teal-700';
              }

              return (
                <button
                  key={habitat.id}
                  onClick={() => handleSelectHabitat(habitat.id, habitat.isCorrect)}
                  disabled={isProcessing || isAnswered}
                  className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all transform duration-150 cursor-pointer select-none ${
                    !isAnswered && !isProcessing ? 'hover:scale-105 active:scale-95 shadow-sm' : ''
                  } ${btnStyle}`}
                >
                  <span className="text-3xl sm:text-4xl filter drop-shadow">{habitat.icon}</span>
                  <span className="text-xs sm:text-sm font-black text-center mt-0.5">
                    {language === 'ar' ? habitat.name : habitat.nameEn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Discovery Box when answered */}
        {isAnswered && (
          <div className="w-full bg-teal-50 dark:bg-teal-950/50 border-2 border-teal-200 dark:border-teal-800 rounded-2xl p-3.5 mb-3 animate-pop-in">
            <div className="flex items-center gap-2 text-teal-900 dark:text-teal-200 font-extrabold text-xs sm:text-sm mb-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{language === 'ar' ? 'معلومة مشوقة:' : 'Fascinating Fact:'}</span>
            </div>
            <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-medium mb-2">
              {language === 'ar' ? currentQ.funFact : currentQ.funFactEn}
            </p>
            <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 p-2 rounded-xl border border-teal-100 dark:border-teal-900 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Utensils className="w-4 h-4 text-emerald-600" />
              <span>{language === 'ar' ? 'طعامه المفضل:' : 'Favorite Food:'}</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-black">
                {language === 'ar' ? currentQ.favoriteFood.name : currentQ.favoriteFood.nameEn} {currentQ.favoriteFood.icon}
              </span>
            </div>
          </div>
        )}

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
          message={language === 'ar' ? '🎉 صديق الطبيعة الصغير! لقد أعدت جميع الحيوانات إلى مواطنها الطبيعية بنجاح!' : '🎉 Nature Explorer! You guided all animals to their natural homes!'}
          onRestart={initGame}
          onGoHome={onGoHome}
          stars={score >= 80 ? 3 : score >= 50 ? 2 : 1}
        />
      )}
    </div>
  );
};


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
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');

  const currentQ = ANIMAL_HABITATS[currentIndex];

  const initGame = useCallback(() => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedHabitat(null);
    setIsAnswered(false);
    setFeedback('');
    setIsGameOver(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleSelectHabitat = (habitatId: string, isCorrect: boolean) => {
    if (isAnswered) return;
    setSelectedHabitat(habitatId);
    setIsAnswered(true);

    if (isCorrect) {
      sound.playMatch();
      const newScore = score + 25;
      setScore(newScore);
      setFeedback(`🎉 ${language === 'ar' ? 'أحسنت! هذا هو الموطن الطبيعي المناسب!' : 'Correct! This is their natural habitat!'}`);
    } else {
      sound.playWrong();
      setFeedback(`❌ ${language === 'ar' ? 'هذا المكان لا يناسب طبيعة هذا الحيوان!' : 'This environment does not suit this animal!'}`);
      setScore((prev) => Math.max(0, prev - 2));
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (currentIndex + 1 < ANIMAL_HABITATS.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedHabitat(null);
      setIsAnswered(false);
      setFeedback('');
    } else {
      saveGameProgress('animal-habitats', score, true);
      setIsGameOver(true);
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

      <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-5 sm:p-8 shadow-xl border border-teal-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 max-w-2xl w-full flex flex-col items-center">
        {/* Animal Hero Display */}
        <div className="w-full bg-gradient-to-r from-teal-50 via-emerald-50 to-cyan-50 dark:from-slate-900 dark:via-teal-950/40 dark:to-slate-900 rounded-3xl p-6 text-center border-2 border-teal-200 dark:border-slate-700 mb-6 shadow-sm">
          <span className="text-xs font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider block mb-1">
            {language === 'ar' ? 'ساعد هذا الصديق في العثور على بيئته الطبيعية:' : 'Help this friend find their true natural home:'}
          </span>
          <div className="text-7xl sm:text-8xl my-2 filter drop-shadow animate-bounce">
            {currentQ.animal.icon}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
            {language === 'ar' ? currentQ.animal.name : currentQ.animal.nameEn}
          </h2>
        </div>

        {/* Habitat Options */}
        <div className="w-full mb-6">
          <h3 className="text-xs sm:text-sm font-bold text-slate-600 mb-3 text-center">
            {language === 'ar' ? 'أين يعيش هذا الحيوان؟' : 'Where does this animal live?'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {currentQ.habitats.map((habitat) => {
              const isSelected = selectedHabitat === habitat.id;
              let btnStyle = 'bg-slate-50 hover:bg-teal-50 border-slate-200 text-slate-800 hover:border-teal-300';

              if (isAnswered) {
                if (habitat.isCorrect) {
                  btnStyle = 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200 shadow-lg scale-102';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-500 text-white border-rose-600 ring-2 ring-rose-200';
                } else {
                  btnStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-50';
                }
              }

              return (
                <button
                  key={habitat.id}
                  onClick={() => handleSelectHabitat(habitat.id, habitat.isCorrect)}
                  disabled={isAnswered}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all transform duration-150 cursor-pointer select-none ${
                    !isAnswered ? 'hover:scale-105 active:scale-95 shadow-sm' : ''
                  } ${btnStyle}`}
                >
                  <span className="text-4xl filter drop-shadow">{habitat.icon}</span>
                  <span className="text-sm font-black text-center mt-1">
                    {language === 'ar' ? habitat.name : habitat.nameEn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Discovery Box when answered */}
        {isAnswered && (
          <div className="w-full bg-teal-50 border-2 border-teal-200 rounded-2xl p-4 mb-6 animate-pop-in">
            <div className="flex items-center gap-2 text-teal-900 font-extrabold text-sm mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{language === 'ar' ? 'معلومة مشوقة:' : 'Fascinating Fact:'}</span>
            </div>
            <p className="text-slate-700 text-sm font-medium mb-3">
              {language === 'ar' ? currentQ.funFact : currentQ.funFactEn}
            </p>
            <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-teal-100 text-xs sm:text-sm font-bold text-slate-800">
              <Utensils className="w-4 h-4 text-emerald-600" />
              <span>{language === 'ar' ? 'طعامه المفضل:' : 'Favorite Food:'}</span>
              <span className="text-emerald-700 font-black">
                {language === 'ar' ? currentQ.favoriteFood.name : currentQ.favoriteFood.nameEn} {currentQ.favoriteFood.icon}
              </span>
            </div>
          </div>
        )}

        {/* Feedback Alert */}
        {feedback && (
          <div className="w-full text-center p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 font-bold mb-5 text-sm sm:text-base">
            {feedback}
          </div>
        )}

        {/* Next Animal Button */}
        {isAnswered && (
          <button
            onClick={handleNext}
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-extrabold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all"
          >
            {currentIndex + 1 < ANIMAL_HABITATS.length
              ? language === 'ar' ? 'الحيوان التالي ⬅️' : 'Next Animal ➡️'
              : language === 'ar' ? 'عرض النتيجة النهائية 🏆' : 'View Final Result 🏆'}
          </button>
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

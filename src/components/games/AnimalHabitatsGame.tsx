import React, { useState, useEffect, useCallback } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';
import { ANIMAL_HABITATS, type AnimalHabitatOption } from '../../data/gameContent';
import { useLanguage } from '../../i18n/LanguageContext';
import { Sparkles, Utensils, Compass } from 'lucide-react';

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const AnimalHabitatsGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [wrongOptionId, setWrongOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');
  const [shuffledOptions, setShuffledOptions] = useState<AnimalHabitatOption[]>([]);

  const currentQ = ANIMAL_HABITATS[currentIndex] || ANIMAL_HABITATS[0];
  const isFoodQ = currentQ.type === 'food';

  const initGame = useCallback(() => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedOptionId(null);
    setWrongOptionId(null);
    setIsAnswered(false);
    setIsProcessing(false);
    setFeedback('');
    setIsGameOver(false);
    if (ANIMAL_HABITATS[0]) {
      setShuffledOptions(shuffleArray(ANIMAL_HABITATS[0].habitats));
    }
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    if (currentQ) {
      setShuffledOptions(shuffleArray(currentQ.habitats));
      setSelectedOptionId(null);
      setWrongOptionId(null);
      setIsAnswered(false);
      setIsProcessing(false);
      setFeedback('');
    }
  }, [currentIndex]);

  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    if (isProcessing || isAnswered) return;

    if (isCorrect) {
      setSelectedOptionId(optionId);
      setIsAnswered(true);
      setIsProcessing(true);
      sound.playMatch();
      const newScore = score + 20;
      setScore(newScore);

      if (isFoodQ) {
        setFeedback(`🎉 ${language === 'ar' ? 'رائع جداً! هذا هو الغذاء المفضل والصحيح له!' : 'Awesome! This is their favorite healthy food!'}`);
      } else {
        setFeedback(`🎉 ${language === 'ar' ? 'أحسنت! هذا هو الموطن الطبيعي المناسب!' : 'Correct! This is their natural habitat!'}`);
      }

      setTimeout(() => {
        if (currentIndex + 1 < ANIMAL_HABITATS.length) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          saveGameProgress('animal-habitats', newScore, true);
          setIsGameOver(true);
        }
      }, 1300);
    } else {
      sound.playWrong();
      setWrongOptionId(optionId);
      if (isFoodQ) {
        setFeedback(`❌ ${language === 'ar' ? 'هذا ليس الغذاء المناسب لهذا الحيوان! فكر وجرب مجدداً.' : 'This is not the right food for this animal! Try again.'}`);
      } else {
        setFeedback(`❌ ${language === 'ar' ? 'هذا المكان لا يناسب طبيعة هذا الحيوان! حاول مجدداً.' : 'This environment does not suit this animal! Try again.'}`);
      }
      setScore((prev) => Math.max(0, prev - 2));

      setTimeout(() => {
        setWrongOptionId(null);
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
        badgeText={language === 'ar' ? `سؤال ${currentIndex + 1} من ${ANIMAL_HABITATS.length}` : `Question ${currentIndex + 1} of ${ANIMAL_HABITATS.length}`}
      />

      <div className="bg-white dark:bg-[#20091b] rounded-3xl p-4 sm:p-6 shadow-xl border border-teal-100 dark:border-[#3d122f] text-slate-800 dark:text-slate-100 max-w-2xl w-full flex flex-col items-center">
        {/* Animal Hero Display */}
        <div className="w-full bg-gradient-to-r from-teal-50 via-emerald-50 to-cyan-50 dark:from-slate-900 dark:via-teal-950/40 dark:to-slate-900 rounded-3xl p-5 text-center border-2 border-teal-200 dark:border-slate-700 mb-4 shadow-sm relative overflow-hidden">
          {/* Question Type Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black shadow-xs mb-2 bg-white/90 dark:bg-slate-800/90 border border-teal-200 dark:border-teal-700">
            {isFoodQ ? (
              <>
                <Utensils className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-amber-700 dark:text-amber-300">
                  {language === 'ar' ? 'غذاء الحيوان 🥗' : 'Animal Food 🥗'}
                </span>
              </>
            ) : (
              <>
                <Compass className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span className="text-teal-700 dark:text-teal-300">
                  {language === 'ar' ? 'موطن الحيوان 🌴' : 'Animal Habitat 🌴'}
                </span>
              </>
            )}
          </div>

          <span className="text-xs font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider block mb-1">
            {isFoodQ
              ? (language === 'ar' ? 'ماذا يحب أن يأكل هذا الصديق؟' : 'What does this animal love to eat?')
              : (language === 'ar' ? 'ساعد هذا الصديق في العثور على بيئته الطبيعية:' : 'Help this friend find their true natural home:')}
          </span>
          <div className="text-6xl sm:text-7xl my-1 filter drop-shadow animate-bounce">
            {currentQ.animal.icon}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
            {language === 'ar' ? currentQ.animal.name : currentQ.animal.nameEn}
          </h2>
        </div>

        {/* 3 Interactive Choices (Randomly Shuffled across slots 1, 2, and 3) */}
        <div className="w-full mb-4">
          <h3 className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 mb-2.5 text-center">
            {isFoodQ
              ? (language === 'ar' ? 'ماذا يأكل هذا الحيوان؟' : 'What does this animal eat?')
              : (language === 'ar' ? 'أين يعيش هذا الحيوان؟' : 'Where does this animal live?')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {shuffledOptions.map((option) => {
              const isSelected = selectedOptionId === option.id;
              const isWrong = wrongOptionId === option.id;

              let btnStyle = 'bg-slate-50 hover:bg-teal-50 border-slate-200 text-slate-800 hover:border-teal-300 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100';

              if (isAnswered && option.isCorrect) {
                btnStyle = 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200 shadow-lg scale-102';
              } else if (isWrong) {
                btnStyle = 'bg-rose-500 text-white border-rose-600 ring-2 ring-rose-200 animate-shake';
              } else if (isSelected) {
                btnStyle = 'bg-teal-600 text-white border-teal-700';
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id, option.isCorrect)}
                  disabled={isProcessing || isAnswered}
                  className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all transform duration-150 cursor-pointer select-none ${
                    !isAnswered && !isProcessing ? 'hover:scale-105 active:scale-95 shadow-sm' : ''
                  } ${btnStyle}`}
                >
                  <span className="text-3xl sm:text-4xl filter drop-shadow">{option.icon}</span>
                  <span className="text-xs sm:text-sm font-black text-center mt-0.5 leading-snug">
                    {language === 'ar' ? option.name : option.nameEn}
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
            <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-medium mb-2.5 leading-relaxed">
              {language === 'ar' ? currentQ.funFact : currentQ.funFactEn}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold">
              <div className="flex items-center gap-2 bg-white/90 dark:bg-slate-900/80 p-2 rounded-xl border border-teal-100 dark:border-teal-900 text-slate-800 dark:text-slate-200">
                <Utensils className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{language === 'ar' ? 'طعامه المفضل:' : 'Favorite Food:'}</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-black truncate">
                  {language === 'ar' ? currentQ.favoriteFood.name : currentQ.favoriteFood.nameEn} {currentQ.favoriteFood.icon}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/90 dark:bg-slate-900/80 p-2 rounded-xl border border-teal-100 dark:border-teal-900 text-slate-800 dark:text-slate-200">
                <Compass className="w-4 h-4 text-teal-600 shrink-0" />
                <span>{language === 'ar' ? 'موطنه الطبيعي:' : 'Natural Habitat:'}</span>
                <span className="text-teal-700 dark:text-teal-400 font-black truncate">
                  {language === 'ar' ? currentQ.habitatInfo.name : currentQ.habitatInfo.nameEn} {currentQ.habitatInfo.icon}
                </span>
              </div>
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
          message={language === 'ar' ? '🎉 صديق الطبيعة البطل! لقد أتقنت معرفة مواطن الحيوانات وغذائها بنجاح وتفوق!' : '🎉 Nature Explorer! You guided all animals to their homes and foods!'}
          onRestart={initGame}
          onGoHome={onGoHome}
          stars={score >= 700 ? 3 : score >= 350 ? 2 : 1}
        />
      )}
    </div>
  );
};



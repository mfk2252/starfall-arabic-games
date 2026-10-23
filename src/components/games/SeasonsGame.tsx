import React, { useState, useEffect, useCallback } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';

interface SeasonItem {
  id: 'spring' | 'summer' | 'autumn' | 'winter';
  name: string;
  icon: string;
  description: string;
  gradient: string;
}

const SEASONS: SeasonItem[] = [
  {
    id: 'spring',
    name: 'الربيع',
    icon: '🌸',
    description: 'فصل الأزهار والنمو والجمال',
    gradient: 'from-emerald-400 to-green-500',
  },
  {
    id: 'summer',
    name: 'الصيف',
    icon: '☀️',
    description: 'فصل الحر والشاطئ والعطلة',
    gradient: 'from-amber-400 to-orange-500',
  },
  {
    id: 'autumn',
    name: 'الخريف',
    icon: '🍂',
    description: 'فصل تساقط الأوراق وتغير الجو',
    gradient: 'from-orange-400 to-amber-600',
  },
  {
    id: 'winter',
    name: 'الشتاء',
    icon: '❄️',
    description: 'فصل البرد والمطر والثلوج',
    gradient: 'from-sky-400 to-blue-600',
  },
];

const QUESTIONS = [
  {
    question: 'في أي فصل تتفتح الأزهار وتنمو النباتات؟',
    answer: 'spring',
    explanation: 'الربيع هو فصل نمو النباتات وتفتح الأزهار الجميلة!',
  },
  {
    question: 'في أي فصل نذهب إلى الشاطئ ونسبح في البحر؟',
    answer: 'summer',
    explanation: 'الصيف هو فصل الحر والسباحة والعطلة المدرسية!',
  },
  {
    question: 'في أي فصل تتساقط أوراق الأشجار وتصبح صفراء وبرتقالية؟',
    answer: 'autumn',
    explanation: 'في الخريف تتساقط أوراق الأشجار وتستعد الطبيعة للشتاء!',
  },
  {
    question: 'في أي فصل يكون الطقس بارداً ونرتدي المعاطف وقد يتساقط الثلج؟',
    answer: 'winter',
    explanation: 'الشتاء هو فصل البرد والأمطار والثلوج البيضاء!',
  },
  {
    question: 'في أي فصل نحتفل بعيد الأم وتعم الخضرة في كل مكان؟',
    answer: 'spring',
    explanation: 'عيد الأم يكون في أول فصل الربيع مع تجدد الحياة!',
  },
  {
    question: 'في أي فصل نستمتع بأكل البطيخ اللذيذ والمانجو البارد؟',
    answer: 'summer',
    explanation: 'فواكه الصيف اللذيذة كالبطيخ والمانجو تنضج في فصل الصيف الحار!',
  },
];

export const SeasonsGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
  const [answered, setAnswered] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('اختر الفصل الصحيح للإجابة على السؤال');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const initGame = useCallback(() => {
    setCurrentQuestionIdx(0);
    setScore(0);
    setSelectedSeason(null);
    setAnswered(false);
    setMessage('اختر الفصل الصحيح للإجابة على السؤال');
    setIsGameOver(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const currentQ = QUESTIONS[currentQuestionIdx];

  const handleSelectSeason = (seasonId: string) => {
    if (answered) return;
    setSelectedSeason(seasonId);
    setAnswered(true);

    if (seasonId === currentQ.answer) {
      sound.playMatch();
      const newScore = score + 10;
      setScore(newScore);
      setMessage(`✅ إجابة صحيحة! ${currentQ.explanation}`);
    } else {
      sound.playWrong();
      setMessage(`❌ إجابة خاطئة. ${currentQ.explanation}`);
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (currentQuestionIdx + 1 < QUESTIONS.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedSeason(null);
      setAnswered(false);
      setMessage('اختر الفصل الصحيح للإجابة على السؤال');
    } else {
      saveGameProgress('seasons', score, true);
      setIsGameOver(true);
    }
  };

  return (
    <div className="flex flex-col items-center w-full px-4 py-4 min-h-[85vh]">
      <GameHeader
        title="فصول السنة الأربعة"
        icon="🌸"
        score={score}
        onRestart={initGame}
        onGoHome={onGoHome}
        accentGradient="from-[#f48fb1] to-[#ab47bc]"
        badgeText={`سؤال ${currentQuestionIdx + 1} من ${QUESTIONS.length}`}
      />

      <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-5 sm:p-8 shadow-xl border border-pink-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 max-w-3xl w-full flex flex-col items-center">
        {/* Question Box */}
        <div className="w-full bg-gradient-to-r from-emerald-50 via-pink-50 to-amber-50 dark:from-slate-900 dark:via-pink-950/30 dark:to-slate-900 rounded-2xl p-6 text-center border-2 border-emerald-200 dark:border-slate-700 mb-6 shadow-xs">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
            سؤال الفصل
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 leading-relaxed">
            {currentQ.question}
          </h2>
        </div>

        {/* 4 Seasons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-6">
          {SEASONS.map((season) => {
            const isSelected = selectedSeason === season.id;
            const isCorrect = season.id === currentQ.answer;

            let cardStateClasses = 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-pink-300 dark:hover:border-pink-500 hover:shadow-lg hover:scale-102';

            if (answered) {
              if (isCorrect) {
                cardStateClasses = 'bg-gradient-to-br from-emerald-50 to-green-100 border-3 border-emerald-500 ring-4 ring-emerald-200 shadow-md scale-102';
              } else if (isSelected) {
                cardStateClasses = 'bg-gradient-to-br from-rose-50 to-red-100 border-3 border-rose-500 ring-4 ring-rose-200';
              } else {
                cardStateClasses = 'bg-slate-50 border-slate-200 opacity-60';
              }
            }

            return (
              <button
                key={season.id}
                onClick={() => handleSelectSeason(season.id)}
                disabled={answered}
                className={`p-5 rounded-2xl flex items-center gap-4 text-right transition-all transform duration-200 cursor-pointer select-none ${cardStateClasses}`}
              >
                <div className="text-5xl filter drop-shadow">{season.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-black text-slate-800 mb-1">{season.name}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-semibold">{season.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback / Explanation Box */}
        <div className="w-full text-center p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 font-bold mb-6 text-sm sm:text-base">
          {message}
        </div>

        {/* Next Question / Finish Button */}
        {answered && (
          <button
            onClick={handleNext}
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all"
          >
            {currentQuestionIdx + 1 < QUESTIONS.length ? 'السؤال التالي ⬅️' : 'عرض النتيجة النهائية 🏆'}
          </button>
        )}
      </div>

      {isGameOver && (
        <WinCelebration
          score={score}
          message="🎉 أحسنت! لقد أصبحت خبيراً في فصول السنة الأربعة!"
          onRestart={initGame}
          onGoHome={onGoHome}
          stars={score >= 50 ? 3 : score >= 30 ? 2 : 1}
        />
      )}
    </div>
  );
};

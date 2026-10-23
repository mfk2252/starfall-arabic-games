import React, { useState, useEffect, useCallback } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';
import { Sun, Moon, Sparkles } from 'lucide-react';

interface DayNightItem {
  id: number;
  name: string;
  icon: string;
  timeOfDay: 'day' | 'night';
  description: string;
}

const ITEMS: DayNightItem[] = [
  {
    id: 1,
    name: 'شمس ساطعة ومشرقة',
    icon: '☀️',
    timeOfDay: 'day',
    description: 'تضيء الشمس السماء في وضح النهار',
  },
  {
    id: 2,
    name: 'قمر ونجوم لامعة',
    icon: '🌙',
    timeOfDay: 'night',
    description: 'يظهر القمر والنجوم عند حلول الليل',
  },
  {
    id: 3,
    name: 'الذهاب إلى المدرسة',
    icon: '🎒',
    timeOfDay: 'day',
    description: 'نذهب للمدرسة ونتعلم في الصباح الباكر',
  },
  {
    id: 4,
    name: 'النوم في السرير',
    icon: '🛏️',
    timeOfDay: 'night',
    description: 'ننام ونرتاح في الليل لنستيقظ بنشاط',
  },
  {
    id: 5,
    name: 'صياح الديك النشيط',
    icon: '🐓',
    timeOfDay: 'day',
    description: 'يصيح الديك مع شروق شمس الصباح',
  },
  {
    id: 6,
    name: 'بومة ساهرة في الغابة',
    icon: '🦉',
    timeOfDay: 'night',
    description: 'البومة طائر ليلي يرى جيداً في الظلام',
  },
  {
    id: 7,
    name: 'تناول طعام الفطور',
    icon: '🥞',
    timeOfDay: 'day',
    description: 'نتناول وجبة الفطور صباحاً في بداية يومنا',
  },
  {
    id: 8,
    name: 'سماء مرصعة بالشهب',
    icon: '🌠',
    timeOfDay: 'night',
    description: 'نشاهد الشهب والنجوم في سماء الليل الصافية',
  },
];

export const DayNightGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [message, setMessage] = useState<string>('هل هذا الشيء يحدث في النهار ☀️ أم في الليل 🌙؟');
  const [answeredState, setAnsweredState] = useState<'correct' | 'wrong' | null>(null);
  const [wrongChoice, setWrongChoice] = useState<'day' | 'night' | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [shuffledItems, setShuffledItems] = useState<DayNightItem[]>([]);

  const initGame = useCallback(() => {
    const list = [...ITEMS];
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    setShuffledItems(list);
    setCurrentIndex(0);
    setScore(0);
    setAnsweredState(null);
    setWrongChoice(null);
    setIsProcessing(false);
    setMessage('هل هذا الشيء يحدث في النهار ☀️ أم في الليل 🌙؟');
    setIsGameOver(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const currentItem = shuffledItems[currentIndex];

  const handleChoose = (choice: 'day' | 'night') => {
    if (isProcessing || answeredState === 'correct' || !currentItem) return;

    if (choice === currentItem.timeOfDay) {
      sound.playMatch();
      setAnsweredState('correct');
      setIsProcessing(true);
      const newScore = score + 15;
      setScore(newScore);
      setMessage(`✅ أحسنت! ${currentItem.description}`);

      setTimeout(() => {
        if (currentIndex + 1 < shuffledItems.length) {
          setCurrentIndex((prev) => prev + 1);
          setAnsweredState(null);
          setWrongChoice(null);
          setIsProcessing(false);
          setMessage('هل هذا الشيء يحدث في النهار ☀️ أم في الليل 🌙؟');
        } else {
          saveGameProgress('day-night', newScore, true);
          setIsGameOver(true);
        }
      }, 1200);
    } else {
      sound.playWrong();
      setWrongChoice(choice);
      setMessage(`❌ فكّر جيداً: ${currentItem.description} حاول مجدداً!`);
      setScore((prev) => Math.max(0, prev - 2));

      setTimeout(() => {
        setWrongChoice(null);
      }, 700);
    }
  };

  if (!currentItem) return null;

  return (
    <div className="flex flex-col items-center w-full px-4 py-4 min-h-[85vh]">
      <GameHeader
        title="الليل والنهار"
        icon="🌞🌙"
        score={score}
        onRestart={initGame}
        onGoHome={onGoHome}
        accentGradient="from-[#ce93d8] to-[#673ab7]"
        badgeText={`عنصر ${currentIndex + 1} من ${ITEMS.length}`}
      />

      <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-4 sm:p-6 shadow-xl border border-purple-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 max-w-2xl w-full flex flex-col items-center">
        {/* Item Display Card */}
        <div className="w-full bg-gradient-to-r from-sky-50 via-purple-50 to-amber-50 dark:from-slate-900 dark:via-purple-950/40 dark:to-slate-900 rounded-3xl p-5 sm:p-6 text-center border-2 border-purple-200 dark:border-slate-700 mb-4 shadow-sm">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
            انظر وتأمل في هذا الشيء:
          </span>
          <div className="text-6xl sm:text-7xl my-2 filter drop-shadow animate-bounce">
            {currentItem.icon}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
            {currentItem.name}
          </h2>
        </div>

        {/* Question & Feedback Prompt */}
        <div className={`w-full text-center p-3 rounded-2xl font-bold mb-5 text-xs sm:text-sm animate-pop-in ${
          answeredState === 'correct'
            ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
            : wrongChoice
            ? 'bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
            : 'bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
        }`}>
          {message}
        </div>

        {/* Big Interactive Decision Buttons */}
        <div className="grid grid-cols-2 gap-4 w-full mb-2">
          {/* Day Button */}
          <button
            onClick={() => handleChoose('day')}
            disabled={isProcessing || answeredState === 'correct'}
            className={`p-5 rounded-3xl border-3 flex flex-col items-center justify-center gap-1.5 transition-all transform duration-200 cursor-pointer select-none ${
              answeredState === 'correct' && currentItem.timeOfDay === 'day'
                ? 'bg-gradient-to-b from-amber-300 to-yellow-400 text-amber-950 border-amber-500 ring-4 ring-amber-200 scale-102 shadow-lg'
                : wrongChoice === 'day'
                ? 'bg-rose-500 text-white border-rose-600 ring-2 ring-rose-200 animate-shake'
                : 'bg-gradient-to-b from-amber-100 to-yellow-200 hover:from-amber-200 hover:to-yellow-300 border-amber-300 text-amber-950 hover:scale-105 shadow-md active:scale-95'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-amber-400/50 flex items-center justify-center">
              <Sun className="w-8 h-8 text-amber-700 animate-spin-slow" />
            </div>
            <span className="text-xl font-black mt-1">النهار ☀️</span>
            <span className="text-[10px] sm:text-xs font-semibold text-amber-800">وقت النور والحركة</span>
          </button>

          {/* Night Button */}
          <button
            onClick={() => handleChoose('night')}
            disabled={isProcessing || answeredState === 'correct'}
            className={`p-5 rounded-3xl border-3 flex flex-col items-center justify-center gap-1.5 transition-all transform duration-200 cursor-pointer select-none ${
              answeredState === 'correct' && currentItem.timeOfDay === 'night'
                ? 'bg-gradient-to-b from-indigo-500 to-purple-600 text-white border-indigo-700 ring-4 ring-indigo-200 scale-102 shadow-lg'
                : wrongChoice === 'night'
                ? 'bg-rose-500 text-white border-rose-600 ring-2 ring-rose-200 animate-shake'
                : 'bg-gradient-to-b from-indigo-100 to-purple-200 hover:from-indigo-200 hover:to-purple-300 border-indigo-300 text-indigo-950 hover:scale-105 shadow-md active:scale-95'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-indigo-300/40 flex items-center justify-center">
              <Moon className="w-8 h-8 text-indigo-800" />
            </div>
            <span className="text-xl font-black mt-1">الليل 🌙</span>
            <span className="text-[10px] sm:text-xs font-semibold text-indigo-900">وقت الهدوء والراحة</span>
          </button>
        </div>
      </div>

      {isGameOver && (
        <WinCelebration
          score={score}
          message="🎉 بارك الله فيك! أصبحت تميز بدقة بين ما ينتمي لليل وما ينتمي للنهار!"
          onRestart={initGame}
          onGoHome={onGoHome}
          stars={score >= 90 ? 3 : score >= 60 ? 2 : 1}
        />
      )}
    </div>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';
import { Sun, Moon, Sparkles, Volume2, Clock, CheckCircle2, RotateCcw } from 'lucide-react';
import { ButterflyIcon } from '../common/ButterflyIcon';

interface DayNightItem {
  id: number;
  name: string;
  icon: string;
  timeOfDay: 'day' | 'night';
  description: string;
  soundText: string;
}

const ITEMS: DayNightItem[] = [
  {
    id: 1,
    name: 'شمس ساطعة ومشرقة',
    icon: '☀️',
    timeOfDay: 'day',
    description: 'تضيء الشمس السماء بالدفء والنور في وضح النهار',
    soundText: 'شمس ساطعة ومشرقة في النهار',
  },
  {
    id: 2,
    name: 'قمر ونجوم لامعة',
    icon: '🌙',
    timeOfDay: 'night',
    description: 'يظهر القمر والنجوم الساطعة في سماء الليل الهادئة',
    soundText: 'قمر ونجوم لامعة في سماء الليل',
  },
  {
    id: 3,
    name: 'الذهاب إلى المدرسة',
    icon: '🎒',
    timeOfDay: 'day',
    description: 'نذهب للمدرسة ونتعلم مع الأصدقاء في الصباح الباكر',
    soundText: 'الذهاب إلى المدرسة في الصباح الباكر',
  },
  {
    id: 4,
    name: 'النوم والراحة في السرير',
    icon: '🛏️',
    timeOfDay: 'night',
    description: 'ننام ونرتاح في الليل لنستيقظ بنشاط وحيوية',
    soundText: 'النوم والراحة في السرير بالليل',
  },
  {
    id: 5,
    name: 'صياح الديك النشيط',
    icon: '🐓',
    timeOfDay: 'day',
    description: 'يصيح الديك مع إشراقة شمس الصباح الباكر',
    soundText: 'صياح الديك النشيط مع شروق الشمس',
  },
  {
    id: 6,
    name: 'بومة ساهرة في الغابة',
    icon: '🦉',
    timeOfDay: 'night',
    description: 'البومة طائر ليلي يرى ويتحرك جيداً في ظلام الليل',
    soundText: 'بومة ساهرة في الغابة ليلاً',
  },
  {
    id: 7,
    name: 'تناول طعام الفطور',
    icon: '🥞',
    timeOfDay: 'day',
    description: 'نتناول وجبة الفطور المغذية صباحاً في بداية يومنا',
    soundText: 'تناول طعام الفطور صباحاً',
  },
  {
    id: 8,
    name: 'سماء مرصعة بالشهب والنيزك',
    icon: '🌠',
    timeOfDay: 'night',
    description: 'نشاهد الشهب والنجوم البرّاقة في سماء الليل الصافية',
    soundText: 'شهب ونجوم برّاقة بالليل',
  },
  {
    id: 9,
    name: 'ظهور قوس قزح الملون',
    icon: '🌈',
    timeOfDay: 'day',
    description: 'يظهر قوس قزح بألوانه الزاهية في النهار بعد المطر',
    soundText: 'قوس قزح ملون في النهار',
  },
  {
    id: 10,
    name: 'تفريش الأسنان قبل النوم',
    icon: '🪥',
    timeOfDay: 'night',
    description: 'نُنظف أسناننا بالفرشاة والمجون قبل النوم ليلاً',
    soundText: 'تفريش الأسنان قبل النوم بالليل',
  },
  {
    id: 11,
    name: 'اللعب والركض في الحديقة',
    icon: '🏃',
    timeOfDay: 'day',
    description: 'نلعب ونركض تحت أشعة الشمس الدافئة بالنهار',
    soundText: 'اللعب والركض في الحديقة نهاراً',
  },
  {
    id: 12,
    name: 'قراءة قصة النوم الهادئة',
    icon: '📖',
    timeOfDay: 'night',
    description: 'نستمع لقصة جميلة وهادئة قبل أن نخلد للنوم ليلاً',
    soundText: 'قراءة قصة النوم بالليل',
  },
  {
    id: 13,
    name: 'تفتح أزهار عباد الشمس',
    icon: '🌻',
    timeOfDay: 'day',
    description: 'تتبع أزهار عباد الشمس حركة الضوء والنهار',
    soundText: 'تفتح أزهار عباد الشمس في النهار',
  },
  {
    id: 14,
    name: 'إضاءة مصابيح المنازل والشارع',
    icon: '🕯️',
    timeOfDay: 'night',
    description: 'تُضاء الأنوار والمصابيح لينير الشارع في الظلام',
    soundText: 'إضاءة المصابيح بالليل',
  },
  {
    id: 15,
    name: 'رحلة بحرية في القارب',
    icon: '⛵',
    timeOfDay: 'day',
    description: 'نستمتع بالرحلات البحرية تحت أجواء النهار المشرقة',
    soundText: 'رحلة بحرية في النهار',
  },
  {
    id: 16,
    name: 'صرير الجداجد الهادئ',
    icon: '🦗',
    timeOfDay: 'night',
    description: 'نسمع أصوات الطبيعة والجداجد الهادئة في الليل',
    soundText: 'أصوات الطبيعة الهادئة بالليل',
  },
];

type GameMode = 'quiz' | 'timeline';

export const DayNightGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const [gameMode, setGameMode] = useState<GameMode>('quiz');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [message, setMessage] = useState<string>('هل هذا الشيء يحدث في النهار ☀️ أم في الليل 🌙؟');
  const [answeredState, setAnsweredState] = useState<'correct' | 'wrong' | null>(null);
  const [wrongChoice, setWrongChoice] = useState<'day' | 'night' | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [shuffledItems, setShuffledItems] = useState<DayNightItem[]>([]);

  // Timeline mode states
  const [timelineStep, setTimelineStep] = useState<number>(0);

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
    setTimelineStep(0);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const currentItem = shuffledItems[currentIndex];

  const handleSpeak = (text: string) => {
    sound.speakText(text, 'ar');
  };

  const handleChoose = (choice: 'day' | 'night') => {
    if (isProcessing || answeredState === 'correct' || !currentItem) return;

    if (choice === currentItem.timeOfDay) {
      sound.playMatch();
      sound.speakText(currentItem.soundText, 'ar');
      setAnsweredState('correct');
      setIsProcessing(true);
      const newScore = score + 15;
      setScore(newScore);
      setMessage(`✅ ممتاز! ${currentItem.description}`);

      setTimeout(() => {
        if (currentIndex + 1 < shuffledItems.length) {
          setCurrentIndex((prev) => prev + 1);
          setAnsweredState(null);
          setWrongChoice(null);
          setIsProcessing(false);
          setMessage('هل هذا الشيء يحدث في النهار ☀️ أم في الليل 🌙؟');
        } else {
          sound.playWin();
          saveGameProgress('day-night', newScore, true);
          setIsGameOver(true);
        }
      }, 1300);
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

  // Active theme indicator
  const activeSky = answeredState === 'correct' 
    ? currentItem.timeOfDay 
    : wrongChoice === 'day' 
    ? 'night' 
    : wrongChoice === 'night' 
    ? 'day' 
    : 'neutral';

  return (
    <div className="flex flex-col items-center w-full px-2 sm:px-4 py-4 min-h-[85vh] animate-in fade-in duration-300">
      <GameHeader
        title="الليل والنهار"
        icon="🌞🌙"
        score={score}
        onRestart={initGame}
        onGoHome={onGoHome}
        accentGradient="from-[#ce93d8] via-[#8e24aa] to-[#311b92]"
        badgeText={`عنصر ${currentIndex + 1} من ${shuffledItems.length}`}
      />

      {/* Main Container Card */}
      <div className="bg-white dark:bg-[#20091b] rounded-3xl p-4 sm:p-7 shadow-xl border border-pink-100 dark:border-[#3d122f] text-slate-800 dark:text-pink-100 max-w-3xl w-full flex flex-col items-center space-y-6">
        
        {/* Mode Switcher */}
        <div className="flex items-center gap-2 bg-pink-50 dark:bg-[#1a0716] p-1.5 rounded-full border border-pink-200 dark:border-pink-900/40 text-xs sm:text-sm font-bold">
          <button
            onClick={() => { sound.playClick(); setGameMode('quiz'); initGame(); }}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
              gameMode === 'quiz'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                : 'text-slate-600 dark:text-pink-200 hover:text-pink-600'
            }`}
          >
            <span>☀️ اختبار الليل والنهار</span>
          </button>
          <button
            onClick={() => { sound.playClick(); setGameMode('timeline'); setTimelineStep(0); }}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
              gameMode === 'timeline'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-pink-200 hover:text-purple-600'
            }`}
          >
            <span>⏰ رحلة الـ 24 ساعة</span>
          </button>
        </div>

        {/* -------------------------------------------------------------
            MODE 1: QUIZ / DISCOVERY MODE
           ------------------------------------------------------------- */}
        {gameMode === 'quiz' && (
          <div className="w-full flex flex-col items-center space-y-6">
            
            {/* Dynamic Living Sky Stage */}
            <div className={`w-full rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden transition-all duration-700 shadow-md border-2 ${
              activeSky === 'day'
                ? 'bg-gradient-to-b from-sky-300 via-amber-100 to-amber-200 text-slate-900 border-amber-300 shadow-amber-200/50'
                : activeSky === 'night'
                ? 'bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#311b92] text-white border-indigo-500 shadow-indigo-900/50'
                : 'bg-gradient-to-r from-sky-100 via-purple-100 to-amber-100 dark:from-slate-900 dark:via-purple-950/50 dark:to-slate-900 text-slate-800 dark:text-pink-100 border-purple-200 dark:border-pink-900/40'
            }`}>
              
              {/* Sun or Stars Background Animation Effects */}
              {activeSky === 'day' && (
                <div className="absolute top-2 start-4 animate-spin-slow text-amber-500/30 text-7xl pointer-events-none">
                  ☀️
                </div>
              )}
              {activeSky === 'night' && (
                <div className="absolute top-2 end-4 animate-pulse text-amber-300/40 text-6xl pointer-events-none">
                  ✨
                </div>
              )}

              {/* Taleen Butterfly Mascot with Time-of-Day Outfit */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 bg-white/80 dark:bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-700 dark:text-pink-200">
                  <ButterflyIcon className="w-4 h-4 text-pink-500" />
                  <span>
                    {activeSky === 'day' 
                      ? 'نهار مشرق ومفعم بالحيوية 😎' 
                      : activeSky === 'night' 
                      ? 'ليل هادئ ونجوم ساطعة 🌙💤' 
                      : 'تأمل واكتشف معنا:'}
                  </span>
                </div>

                <button
                  onClick={() => handleSpeak(currentItem.soundText)}
                  className="p-2 rounded-full bg-white/80 dark:bg-black/40 hover:bg-white text-pink-600 dark:text-pink-300 shadow-sm transition-all cursor-pointer"
                  title="استمع للاسم"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* Large Animated Icon */}
              <div className="text-7xl sm:text-8xl my-3 filter drop-shadow-lg animate-bounce select-none">
                {currentItem.icon}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black mb-1">
                {currentItem.name}
              </h2>
            </div>

            {/* Prompt Prompt / Feedback */}
            <div className={`w-full text-center p-3.5 rounded-2xl font-bold text-xs sm:text-sm transition-all border ${
              answeredState === 'correct'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 shadow-sm'
                : wrongChoice
                ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 animate-shake'
                : 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
            }`}>
              {message}
            </div>

            {/* Interactive Decision Buttons */}
            <div className="grid grid-cols-2 gap-4 w-full">
              {/* Day Button */}
              <button
                onClick={() => handleChoose('day')}
                disabled={isProcessing || answeredState === 'correct'}
                className={`p-6 rounded-3xl border-4 flex flex-col items-center justify-center gap-2 transition-all transform duration-200 cursor-pointer select-none ${
                  answeredState === 'correct' && currentItem.timeOfDay === 'day'
                    ? 'bg-gradient-to-b from-amber-300 via-amber-400 to-yellow-500 text-amber-950 border-amber-600 ring-4 ring-amber-300 scale-105 shadow-xl'
                    : wrongChoice === 'day'
                    ? 'bg-rose-500 text-white border-rose-700 ring-4 ring-rose-200 animate-shake'
                    : 'bg-gradient-to-b from-amber-100 to-yellow-200 dark:from-amber-950/40 dark:to-amber-900/60 hover:from-amber-200 hover:to-yellow-300 text-amber-950 dark:text-amber-100 border-amber-300 dark:border-amber-700 hover:scale-105 shadow-md active:scale-95'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-400/40 flex items-center justify-center shadow-inner">
                  <Sun className="w-9 h-9 text-amber-700 dark:text-amber-300 animate-spin-slow" />
                </div>
                <span className="text-2xl font-black mt-1">النهار ☀️</span>
                <span className="text-xs font-bold text-amber-800 dark:text-amber-200">وقت النور والحركة والنشاط</span>
              </button>

              {/* Night Button */}
              <button
                onClick={() => handleChoose('night')}
                disabled={isProcessing || answeredState === 'correct'}
                className={`p-6 rounded-3xl border-4 flex flex-col items-center justify-center gap-2 transition-all transform duration-200 cursor-pointer select-none ${
                  answeredState === 'correct' && currentItem.timeOfDay === 'night'
                    ? 'bg-gradient-to-b from-indigo-600 via-purple-600 to-slate-900 text-white border-indigo-400 ring-4 ring-indigo-300 scale-105 shadow-xl'
                    : wrongChoice === 'night'
                    ? 'bg-rose-500 text-white border-rose-700 ring-4 ring-rose-200 animate-shake'
                    : 'bg-gradient-to-b from-indigo-100 to-purple-200 dark:from-indigo-950/50 dark:to-purple-950/70 text-indigo-950 dark:text-indigo-100 border-indigo-300 dark:border-indigo-800 hover:from-indigo-200 hover:to-purple-300 hover:scale-105 shadow-md active:scale-95'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-300/40 flex items-center justify-center shadow-inner">
                  <Moon className="w-9 h-9 text-indigo-800 dark:text-indigo-200" />
                </div>
                <span className="text-2xl font-black mt-1">الليل 🌙</span>
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">وقت الهدوء والراحة والسكينة</span>
              </button>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            MODE 2: 24-HOUR ROUTINE TIMELINE MODE
           ------------------------------------------------------------- */}
        {gameMode === 'timeline' && (
          <div className="w-full flex flex-col items-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-black text-slate-800 dark:text-pink-100">
                رحلة الـ 24 ساعة والروتين اليومي ⏰
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-pink-200/80 font-medium">
                تتبع أحداث اليوم بالترتيب من شروق الشمس حتى نوم الليل
              </p>
            </div>

            {/* Timeline Sequence Stage */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { time: 'الصباح الباكر (الشروق)', icon: '🐓', event: 'صياح الديك والإفطار', sky: 'bg-amber-100 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 border-amber-300' },
                { time: 'الظهيرة (وسط النهار)', icon: '🎒', event: 'المدرسة واللعب بالحديقة', sky: 'bg-sky-100 dark:bg-sky-950/40 text-sky-950 dark:text-sky-100 border-sky-300' },
                { time: 'المساء (الغروب)', icon: '🕯️', event: 'العودة للمنزل وتفريش الأسنان', sky: 'bg-orange-100 dark:bg-orange-950/40 text-orange-950 dark:text-orange-100 border-orange-300' },
                { time: 'منتصف الليل (الهدوء)', icon: '🛏️', event: 'قراءة القصة والنوم العميق', sky: 'bg-indigo-950 text-indigo-100 border-indigo-700' },
              ].map((step, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    sound.playPop();
                    sound.speakText(`${step.time}: ${step.event}`, 'ar');
                    setTimelineStep(idx);
                  }}
                  className={`p-4 rounded-3xl border-2 flex flex-col items-center text-center cursor-pointer transition-all transform hover:scale-105 ${step.sky} ${
                    timelineStep === idx ? 'ring-4 ring-pink-400 scale-102 shadow-lg' : 'opacity-90'
                  }`}
                >
                  <span className="text-4xl my-2 filter drop-shadow">{step.icon}</span>
                  <span className="text-xs font-black mb-0.5">{step.time}</span>
                  <span className="text-[11px] font-semibold opacity-90">{step.event}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 dark:from-[#2a0c24] dark:to-[#1a0716] border border-pink-200 dark:border-pink-900/40 text-center w-full">
              <p className="text-xs sm:text-sm font-bold text-pink-900 dark:text-pink-200">
                💡 معلمة تالين تقول: «النهار والليل نعمة عظيمة تُنظم وقتنا بين النشاط والراحة!»
              </p>
            </div>
          </div>
        )}

      </div>

      {isGameOver && (
        <WinCelebration
          score={score}
          message="🎉 بارك الله فيك! أصبحت تميز بدقة فائقة بين أنشطة الليل ومظاهر النهار!"
          onRestart={initGame}
          onGoHome={onGoHome}
          stars={score >= 120 ? 3 : score >= 80 ? 2 : 1}
        />
      )}
    </div>
  );
};

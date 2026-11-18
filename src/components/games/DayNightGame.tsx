import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';
import { RoundManager } from '../../utils/roundManager';
import { useLanguage } from '../../i18n/LanguageContext';
import { Sun, Moon, Volume2 } from 'lucide-react';
import { ButterflyIcon } from '../common/ButterflyIcon';

interface DayNightItem {
  id: number;
  nameAr: string;
  nameEn: string;
  icon: string;
  timeOfDay: 'day' | 'night';
  descriptionAr: string;
  descriptionEn: string;
  soundTextAr: string;
  soundTextEn: string;
}

const ITEMS: DayNightItem[] = [
  {
    id: 1,
    nameAr: 'شمس ساطعة ومشرقة',
    nameEn: 'Bright Shining Sun',
    icon: '☀️',
    timeOfDay: 'day',
    descriptionAr: 'تضيء الشمس السماء بالدفء والنور في وضح النهار',
    descriptionEn: 'The sun lights up the sky with warmth during the day',
    soundTextAr: 'شمس ساطعة ومشرقة في النهار',
    soundTextEn: 'Bright shining sun in the day',
  },
  {
    id: 2,
    nameAr: 'قمر ونجوم لامعة',
    nameEn: 'Moon & Shining Stars',
    icon: '🌙',
    timeOfDay: 'night',
    descriptionAr: 'يظهر القمر والنجوم الساطعة في سماء الليل الهادئة',
    descriptionEn: 'The moon and sparkling stars appear in the quiet night sky',
    soundTextAr: 'قمر ونجوم لامعة في سماء الليل',
    soundTextEn: 'Moon and shining stars at night',
  },
  {
    id: 3,
    nameAr: 'الذهاب إلى المدرسة',
    nameEn: 'Going to School',
    icon: '🎒',
    timeOfDay: 'day',
    descriptionAr: 'نذهب للمدرسة ونتعلم مع الأصدقاء في الصباح الباكر',
    descriptionEn: 'We go to school and learn with friends in the morning',
    soundTextAr: 'الذهاب إلى المدرسة في الصباح الباكر',
    soundTextEn: 'Going to school in the morning',
  },
  {
    id: 4,
    nameAr: 'النوم والراحة في السرير',
    nameEn: 'Sleeping in Bed',
    icon: '🛏️',
    timeOfDay: 'night',
    descriptionAr: 'ننام ونرتاح في الليل لنستيقظ بنشاط وحيوية',
    descriptionEn: 'We sleep peacefully at night to wake up energized',
    soundTextAr: 'النوم والراحة في السرير بالليل',
    soundTextEn: 'Sleeping peacefully at night',
  },
  {
    id: 5,
    nameAr: 'صياح الديك النشيط',
    nameEn: 'Rooster Crowing',
    icon: '🐓',
    timeOfDay: 'day',
    descriptionAr: 'يصيح الديك مع إشراقة شمس الصباح الباكر',
    descriptionEn: 'The rooster crows as the morning sun rises',
    soundTextAr: 'صياح الديك النشيط مع شروق الشمس',
    soundTextEn: 'Rooster crowing at sunrise',
  },
  {
    id: 6,
    nameAr: 'بومة ساهرة في الغابة',
    nameEn: 'Owl Awake in the Forest',
    icon: '🦉',
    timeOfDay: 'night',
    descriptionAr: 'البومة طائر ليلي يرى ويتحرك جيداً في ظلام الليل',
    descriptionEn: 'Owls are nocturnal birds that stay awake in the night',
    soundTextAr: 'بومة ساهرة في الغابة ليلاً',
    soundTextEn: 'An owl awake at night',
  },
  {
    id: 7,
    nameAr: 'تناول طعام الفطور',
    nameEn: 'Eating Breakfast',
    icon: '🥞',
    timeOfDay: 'day',
    descriptionAr: 'نتناول وجبة الفطور المغذية صباحاً في بداية يومنا',
    descriptionEn: 'We eat a healthy breakfast in the morning',
    soundTextAr: 'تناول طعام الفطور صباحاً',
    soundTextEn: 'Eating breakfast in the morning',
  },
  {
    id: 8,
    nameAr: 'سماء مرصعة بالشهب والنجوم',
    nameEn: 'Shooting Stars in the Sky',
    icon: '🌠',
    timeOfDay: 'night',
    descriptionAr: 'نشاهد الشهب والنجوم البرّاقة في سماء الليل الصافية',
    descriptionEn: 'We spot shooting stars in the clear night sky',
    soundTextAr: 'شهب ونجوم برّاقة بالليل',
    soundTextEn: 'Shooting stars at night',
  },
  {
    id: 9,
    nameAr: 'ظهور قوس قزح الملون',
    nameEn: 'Colorful Rainbow',
    icon: '🌈',
    timeOfDay: 'day',
    descriptionAr: 'يظهر قوس قزح بألوانه الزاهية في النهار بعد المطر',
    descriptionEn: 'Rainbows shine brightly in the daytime after rain',
    soundTextAr: 'قوس قزح ملون في النهار',
    soundTextEn: 'Colorful rainbow during the day',
  },
  {
    id: 10,
    nameAr: 'تفريش الأسنان قبل النوم',
    nameEn: 'Brushing Teeth Before Bed',
    icon: '🪥',
    timeOfDay: 'night',
    descriptionAr: 'نُنظف أسناننا بالفرشاة والمعجون قبل النوم ليلاً',
    descriptionEn: 'We brush our teeth before going to sleep at night',
    soundTextAr: 'تفريش الأسنان قبل النوم بالليل',
    soundTextEn: 'Brushing teeth before bed at night',
  },
  {
    id: 11,
    nameAr: 'اللعب والركض في الحديقة',
    nameEn: 'Playing in the Park',
    icon: '🏃',
    timeOfDay: 'day',
    descriptionAr: 'نلعب ونركض تحت أشعة الشمس الدافئة بالنهار',
    descriptionEn: 'We run and play outdoors under the warm daytime sun',
    soundTextAr: 'اللعب والركض في الحديقة نهاراً',
    soundTextEn: 'Playing in the park during the day',
  },
  {
    id: 12,
    nameAr: 'قراءة قصة النوم الهادئة',
    nameEn: 'Bedtime Story Reading',
    icon: '📖',
    timeOfDay: 'night',
    descriptionAr: 'نستمع لقصة جميلة وهادئة قبل أن نخلد للنوم ليلاً',
    descriptionEn: 'We listen to a calm bedtime story before sleeping',
    soundTextAr: 'قراءة قصة النوم بالليل',
    soundTextEn: 'Reading a bedtime story at night',
  },
  {
    id: 13,
    nameAr: 'تفتح أزهار عباد الشمس',
    nameEn: 'Sunflowers Blooming',
    icon: '🌻',
    timeOfDay: 'day',
    descriptionAr: 'تتبع أزهار عباد الشمس حركة الضوء والنهار',
    descriptionEn: 'Sunflowers face the bright daytime sunlight',
    soundTextAr: 'تفتح أزهار عباد الشمس في النهار',
    soundTextEn: 'Sunflowers blooming in the day',
  },
  {
    id: 14,
    nameAr: 'إضاءة مصابيح المنازل والشارع',
    nameEn: 'Glowing Lamps & Lanterns',
    icon: '🕯️',
    timeOfDay: 'night',
    descriptionAr: 'تُضاء الأنوار والمصابيح لينير الشارع في الظلام',
    descriptionEn: 'Lights and lanterns glow to brighten the dark night',
    soundTextAr: 'إضاءة المصابيح بالليل',
    soundTextEn: 'Lanterns glowing at night',
  },
  {
    id: 15,
    nameAr: 'رحلة بحرية في القارب',
    nameEn: 'Daytime Boat Sailing',
    icon: '⛵',
    timeOfDay: 'day',
    descriptionAr: 'نستمتع بالرحلات البحرية تحت أجواء النهار المشرقة',
    descriptionEn: 'We enjoy boat trips under sunny daytime skies',
    soundTextAr: 'رحلة بحرية في النهار',
    soundTextEn: 'Boat sailing in the day',
  },
  {
    id: 16,
    nameAr: 'صرير الجداجد الهادئ',
    nameEn: 'Crickets Chirping at Night',
    icon: '🦗',
    timeOfDay: 'night',
    descriptionAr: 'نسمع أصوات الطبيعة والجداجد الهادئة في الليل',
    descriptionEn: 'We hear peaceful cricket sounds during the night',
    soundTextAr: 'أصوات الطبيعة الهادئة بالليل',
    soundTextEn: 'Peaceful crickets at night',
  },
];

type GameMode = 'quiz' | 'timeline';

export const DayNightGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [gameMode, setGameMode] = useState<GameMode>('quiz');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [feedbackState, setFeedbackState] = useState<'prompt' | 'correct' | 'wrong'>('prompt');
  const [answeredState, setAnsweredState] = useState<'correct' | 'wrong' | null>(null);
  const [wrongChoice, setWrongChoice] = useState<'day' | 'night' | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [shuffledItems, setShuffledItems] = useState<DayNightItem[]>([]);
  const [timelineStep, setTimelineStep] = useState<number>(0);

  const timersRef = useRef<number[]>([]);
  const roundManagerRef = useRef(new RoundManager(ITEMS, ITEMS.length));

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const scheduleTimer = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timersRef.current = timersRef.current.filter((t) => t !== id);
      fn();
    }, ms);
    timersRef.current.push(id);
  }, []);

  const initGame = useCallback(() => {
    clearTimers();
    const list = roundManagerRef.current.shuffle(ITEMS);
    setShuffledItems(list);
    setCurrentIndex(0);
    setScore(0);
    setAnsweredState(null);
    setWrongChoice(null);
    setFeedbackState('prompt');
    setIsProcessing(false);
    setIsGameOver(false);
    setTimelineStep(0);
  }, [clearTimers]);

  useEffect(() => {
    initGame();
    return () => clearTimers();
  }, [initGame, clearTimers]);

  const currentItem = shuffledItems[currentIndex];

  const handleSpeak = (text: string) => {
    sound.speakText(text, isAr ? 'ar' : 'en');
  };

  const handleChoose = (choice: 'day' | 'night') => {
    if (isProcessing || answeredState === 'correct' || !currentItem) return;

    if (choice === currentItem.timeOfDay) {
      sound.playMatch();
      sound.speakText(isAr ? currentItem.soundTextAr : currentItem.soundTextEn, isAr ? 'ar' : 'en');
      setAnsweredState('correct');
      setFeedbackState('correct');
      setIsProcessing(true);
      const newScore = score + 15;
      setScore(newScore);

      scheduleTimer(() => {
        if (currentIndex + 1 < shuffledItems.length) {
          setCurrentIndex((prev) => prev + 1);
          setAnsweredState(null);
          setWrongChoice(null);
          setFeedbackState('prompt');
          setIsProcessing(false);
        } else {
          saveGameProgress('day-night', newScore, true);
          setIsGameOver(true);
        }
      }, 1300);
    } else {
      sound.playWrong();
      setWrongChoice(choice);
      setFeedbackState('wrong');
      setScore((prev) => Math.max(0, prev - 2));

      scheduleTimer(() => {
        setWrongChoice(null);
      }, 700);
    }
  };

  if (!currentItem) return null;

  const activeSky =
    answeredState === 'correct'
      ? currentItem.timeOfDay
      : wrongChoice === 'day'
      ? 'night'
      : wrongChoice === 'night'
      ? 'day'
      : 'neutral';

  const messageText =
    feedbackState === 'correct'
      ? `✅ ${isAr ? `ممتاز! ${currentItem.descriptionAr}` : `Great! ${currentItem.descriptionEn}`}`
      : feedbackState === 'wrong'
      ? isAr
        ? `❌ فكّر جيداً: ${currentItem.descriptionAr} حاول مجدداً!`
        : `❌ Think closely: ${currentItem.descriptionEn} Try again!`
      : isAr
      ? 'هل هذا الشيء يحدث في النهار ☀️ أم في الليل 🌙؟'
      : 'Does this happen during the Day ☀️ or at Night 🌙?';

  return (
    <div className="flex flex-col items-center w-full px-2 sm:px-4 py-4 min-h-[85vh] animate-in fade-in duration-300">
      <GameHeader
        title={isAr ? 'الليل والنهار' : 'Day and Night'}
        icon="🌞🌙"
        score={score}
        onRestart={initGame}
        onGoHome={onGoHome}
        accentGradient="from-[#ce93d8] via-[#8e24aa] to-[#311b92]"
        badgeText={
          isAr
            ? `عنصر ${currentIndex + 1} من ${shuffledItems.length}`
            : `Item ${currentIndex + 1} of ${shuffledItems.length}`
        }
      />

      {/* Main Container Card */}
      <div className="bg-white dark:bg-[#20091b] rounded-3xl p-4 sm:p-7 shadow-xl border border-pink-100 dark:border-[#3d122f] text-slate-800 dark:text-pink-100 max-w-3xl w-full flex flex-col items-center space-y-6">
        {/* Mode Switcher */}
        <div className="flex items-center gap-2 bg-pink-50 dark:bg-[#1a0716] p-1.5 rounded-full border border-pink-200 dark:border-pink-900/40 text-xs sm:text-sm font-bold">
          <button
            onClick={() => {
              sound.playClick();
              setGameMode('quiz');
              initGame();
            }}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
              gameMode === 'quiz'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                : 'text-slate-600 dark:text-pink-200 hover:text-pink-600'
            }`}
          >
            <span>{isAr ? '☀️ اختبار الليل والنهار' : '☀️ Day & Night Quiz'}</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              clearTimers();
              setGameMode('timeline');
              setTimelineStep(0);
            }}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
              gameMode === 'timeline'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-pink-200 hover:text-purple-600'
            }`}
          >
            <span>{isAr ? '⏰ رحلة الـ 24 ساعة' : '⏰ 24-Hour Routine'}</span>
          </button>
        </div>

        {/* MODE 1: QUIZ / DISCOVERY MODE */}
        {gameMode === 'quiz' && (
          <div className="w-full flex flex-col items-center space-y-6">
            {/* Dynamic Living Sky Stage */}
            <div
              className={`w-full rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden transition-all duration-700 shadow-md border-2 ${
                activeSky === 'day'
                  ? 'bg-gradient-to-b from-sky-300 via-amber-100 to-amber-200 text-slate-900 border-amber-300 shadow-amber-200/50'
                  : activeSky === 'night'
                  ? 'bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#311b92] text-white border-indigo-500 shadow-indigo-900/50'
                  : 'bg-gradient-to-r from-sky-100 via-purple-100 to-amber-100 dark:from-slate-900 dark:via-purple-950/50 dark:to-slate-900 text-slate-800 dark:text-pink-100 border-purple-200 dark:border-pink-900/40'
              }`}
            >
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

              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 bg-white/80 dark:bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-700 dark:text-pink-200">
                  <ButterflyIcon className="w-4 h-4 text-pink-500" />
                  <span>
                    {activeSky === 'day'
                      ? isAr
                        ? 'نهار مشرق ومفعم بالحيوية 😎'
                        : 'Bright & lively daytime 😎'
                      : activeSky === 'night'
                      ? isAr
                        ? 'ليل هادئ ونجوم ساطعة 🌙💤'
                        : 'Calm & starry night 🌙💤'
                      : isAr
                      ? 'تأمل واكتشف معنا:'
                      : 'Look & discover:'}
                  </span>
                </div>

                <button
                  onClick={() => handleSpeak(isAr ? currentItem.soundTextAr : currentItem.soundTextEn)}
                  className="p-2 rounded-full bg-white/80 dark:bg-black/40 hover:bg-white text-pink-600 dark:text-pink-300 shadow-sm transition-all cursor-pointer"
                  title={isAr ? 'استمع للاسم' : 'Listen'}
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              <div className="text-7xl sm:text-8xl my-3 filter drop-shadow-lg animate-bounce select-none">
                {currentItem.icon}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black mb-1">
                {isAr ? currentItem.nameAr : currentItem.nameEn}
              </h2>
            </div>

            {/* Prompt / Feedback */}
            <div
              className={`w-full text-center p-3.5 rounded-2xl font-bold text-xs sm:text-sm transition-all border ${
                answeredState === 'correct'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 shadow-sm'
                  : wrongChoice
                  ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 animate-shake'
                  : 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
              }`}
            >
              {messageText}
            </div>

            {/* Interactive Decision Buttons */}
            <div className="grid grid-cols-2 gap-4 w-full">
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
                <span className="text-2xl font-black mt-1">{isAr ? 'النهار ☀️' : 'Day ☀️'}</span>
                <span className="text-xs font-bold text-amber-800 dark:text-amber-200">
                  {isAr ? 'وقت النور والحركة والنشاط' : 'Time of light and activity'}
                </span>
              </button>

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
                <span className="text-2xl font-black mt-1">{isAr ? 'الليل 🌙' : 'Night 🌙'}</span>
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                  {isAr ? 'وقت الهدوء والراحة والسكينة' : 'Time of calm and rest'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* MODE 2: 24-HOUR ROUTINE TIMELINE MODE */}
        {gameMode === 'timeline' && (
          <div className="w-full flex flex-col items-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-black text-slate-800 dark:text-pink-100">
                {isAr ? 'رحلة الـ 24 ساعة والروتين اليومي ⏰' : '24-Hour Daily Routine Journey ⏰'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-pink-200/80 font-medium">
                {isAr
                  ? 'تتبع أحداث اليوم بالترتيب من شروق الشمس حتى نوم الليل'
                  : 'Follow the daily events from sunrise to bedtime'}
              </p>
            </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  timeAr: 'الصباح الباكر (الشروق)',
                  timeEn: 'Early Morning (Sunrise)',
                  icon: '🐓',
                  eventAr: 'صياح الديك والإفطار',
                  eventEn: 'Rooster crows & breakfast',
                  sky: 'bg-amber-100 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 border-amber-300',
                },
                {
                  timeAr: 'الظهيرة (وسط النهار)',
                  timeEn: 'Noon (Midday)',
                  icon: '🎒',
                  eventAr: 'المدرسة واللعب بالحديقة',
                  eventEn: 'School & park playtime',
                  sky: 'bg-sky-100 dark:bg-sky-950/40 text-sky-950 dark:text-sky-100 border-sky-300',
                },
                {
                  timeAr: 'المساء (الغروب)',
                  timeEn: 'Evening (Sunset)',
                  icon: '🕯️',
                  eventAr: 'العودة للمنزل وتفريش الأسنان',
                  eventEn: 'Home time & brushing teeth',
                  sky: 'bg-orange-100 dark:bg-orange-950/40 text-orange-950 dark:text-orange-100 border-orange-300',
                },
                {
                  timeAr: 'منتصف الليل (الهدوء)',
                  timeEn: 'Midnight (Quiet Time)',
                  icon: '🛏️',
                  eventAr: 'قراءة القصة والنوم العميق',
                  eventEn: 'Bedtime story & deep sleep',
                  sky: 'bg-indigo-950 text-indigo-100 border-indigo-700',
                },
              ].map((step, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    sound.playPop();
                    const timeStr = isAr ? step.timeAr : step.timeEn;
                    const evStr = isAr ? step.eventAr : step.eventEn;
                    sound.speakText(`${timeStr}: ${evStr}`, isAr ? 'ar' : 'en');
                    setTimelineStep(idx);
                  }}
                  className={`p-4 rounded-3xl border-2 flex flex-col items-center text-center cursor-pointer transition-all transform hover:scale-105 ${step.sky} ${
                    timelineStep === idx ? 'ring-4 ring-pink-400 scale-102 shadow-lg' : 'opacity-90'
                  }`}
                >
                  <span className="text-4xl my-2 filter drop-shadow">{step.icon}</span>
                  <span className="text-xs font-black mb-0.5">{isAr ? step.timeAr : step.timeEn}</span>
                  <span className="text-[11px] font-semibold opacity-90">{isAr ? step.eventAr : step.eventEn}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 dark:from-[#2a0c24] dark:to-[#1a0716] border border-pink-200 dark:border-pink-900/40 text-center w-full">
              <p className="text-xs sm:text-sm font-bold text-pink-900 dark:text-pink-200">
                {isAr
                  ? '💡 معلمة تالين تقول: «النهار والليل نعمة عظيمة تُنظم وقتنا بين النشاط والراحة!»'
                  : '💡 Tip: «Day and night help organize our time between active play and peaceful rest!»'}
              </p>
            </div>
          </div>
        )}
      </div>

      {isGameOver && (
        <WinCelebration
          score={score}
          message={
            isAr
              ? '🎉 بارك الله فيك! أصبحت تميز بدقة فائقة بين أنشطة الليل ومظاهر النهار!'
              : '🎉 Superstar! You accurately distinguished day and night activities!'
          }
          onRestart={initGame}
          onGoHome={onGoHome}
          stars={score >= 120 ? 3 : score >= 80 ? 2 : 1}
        />
      )}
    </div>
  );
};

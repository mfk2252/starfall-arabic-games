import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';
import { useLanguage } from '../../i18n/LanguageContext';
import { Volume2, CheckCircle2 } from 'lucide-react';
import { ButterflyIcon } from '../common/ButterflyIcon';

type SeasonKey = 'spring' | 'summer' | 'autumn' | 'winter';

interface SeasonInfo {
  id: SeasonKey;
  nameAr: string;
  nameEn: string;
  icon: string;
  descriptionAr: string;
  descriptionEn: string;
  bgGradient: string;
  borderColor: string;
  treeVisual: string;
  clothesAr: string;
  clothesEn: string;
  fruitsAr: string;
  fruitsEn: string;
  weatherSoundTextAr: string;
  weatherSoundTextEn: string;
}

const SEASONS_DATA: Record<SeasonKey, SeasonInfo> = {
  spring: {
    id: 'spring',
    nameAr: 'الربيع',
    nameEn: 'Spring',
    icon: '🌸',
    descriptionAr: 'فصل الأزهار اليانعة والنمو والطقس المعتدل المبهج',
    descriptionEn: 'Season of blooming flowers, butterflies, and mild cheerful weather',
    bgGradient: 'from-emerald-300 via-green-100 to-teal-200 text-emerald-950',
    borderColor: 'border-emerald-400',
    treeVisual: '🌳🌸🦋',
    clothesAr: '👗👕 (ملابس ربيعية خفيفة وزاهية)',
    clothesEn: '👗👕 (Light colorful spring outfits)',
    fruitsAr: '🍓🍒 (الفراولة والكرز اللذيذ)',
    fruitsEn: '🍓🍒 (Fresh strawberries and cherries)',
    weatherSoundTextAr: 'فصل الربيع المشرق وتفتح الأزهار والجو المعتدل',
    weatherSoundTextEn: 'Spring season with blooming flowers and mild weather',
  },
  summer: {
    id: 'summer',
    nameAr: 'الصيف',
    nameEn: 'Summer',
    icon: '☀️',
    descriptionAr: 'فصل الشمس الساطعة والشاطئ والعطلة المدرسية',
    descriptionEn: 'Season of bright sunshine, beach days, and summer holidays',
    bgGradient: 'from-amber-300 via-yellow-100 to-orange-200 text-amber-950',
    borderColor: 'border-amber-400',
    treeVisual: '🌳☀️🥭',
    clothesAr: '🩳👒🏊‍♂️ (قبعة الشمس والملابس الصيفية الخفيفة)',
    clothesEn: '🩳👒🏊‍♂️ (Sun hats and light summer clothes)',
    fruitsAr: '🍉🥭 (البطيخ والمانجو البارد اللذيذ)',
    fruitsEn: '🍉🥭 (Sweet watermelon and mango)',
    weatherSoundTextAr: 'فصل الصيف الحار والسباحة في البحر والعطلة',
    weatherSoundTextEn: 'Sunny summer season for beach swimming and fun',
  },
  autumn: {
    id: 'autumn',
    nameAr: 'الخريف',
    nameEn: 'Autumn',
    icon: '🍂',
    descriptionAr: 'فصل تساقط أوراق الأشجار البرتقالية وهبوب الرياح',
    descriptionEn: 'Season of falling orange leaves and gentle cool breezes',
    bgGradient: 'from-orange-300 via-amber-100 to-yellow-200 text-amber-950',
    borderColor: 'border-orange-400',
    treeVisual: '🍁🍂🪵',
    clothesAr: '🧥🧣 (معطف خفيف وشال دافئ)',
    clothesEn: '🧥🧣 (Light jacket and cozy scarf)',
    fruitsAr: '🍇🍎 (الرمان والتفاح والجوز)',
    fruitsEn: '🍇🍎 (Grapes, apples, and nuts)',
    weatherSoundTextAr: 'فصل الخريف وتساقط الأوراق البرتقالية والرياح',
    weatherSoundTextEn: 'Autumn season with falling orange leaves and breeze',
  },
  winter: {
    id: 'winter',
    nameAr: 'الشتاء',
    nameEn: 'Winter',
    icon: '❄️',
    descriptionAr: 'فصل البرد والمطر الغزير والثلوج والمشروبات الدافئة',
    descriptionEn: 'Season of rain, snowflakes, warm coats, and cozy drinks',
    bgGradient:
      'from-sky-300 via-indigo-100 to-blue-200 text-indigo-950 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 dark:text-blue-100',
    borderColor: 'border-sky-400',
    treeVisual: '🌲❄️⛄',
    clothesAr: '🧥🧢🧤☂️ (المعطف الثقيل والقبعة والقفازات والمظلة)',
    clothesEn: '🧥🧢🧤☂️ (Heavy coat, beanie, gloves, and umbrella)',
    fruitsAr: '🍊🍋 (البرتقال والليمون الغني بفيتامين ج)',
    fruitsEn: '🍊🍋 (Oranges and lemons rich in Vitamin C)',
    weatherSoundTextAr: 'فصل الشتاء البارد والمطر والثلوج والمعاطف الثقيلة',
    weatherSoundTextEn: 'Cold winter season with rain, snow, and warm coats',
  },
};

const QUESTIONS: {
  id: number;
  questionAr: string;
  questionEn: string;
  answer: SeasonKey;
  explanationAr: string;
  explanationEn: string;
}[] = [
  {
    id: 1,
    questionAr: 'في أي فصل تتفتح الأزهار الملونة وتطير الفراشات في كل مكان؟',
    questionEn: 'In which season do colorful flowers bloom and butterflies fly?',
    answer: 'spring',
    explanationAr: 'الربيع هو فصل تفتح الأزهار الجميلة وتجدد الحياة في الطبيعة!',
    explanationEn: 'Spring is the season of blooming flowers and lively nature!',
  },
  {
    id: 2,
    questionAr: 'في أي فصل نذهب إلى الشاطئ ونسبح في البحر تحت أشعة الشمس؟',
    questionEn: 'In which season do we go to the beach and swim in the sea?',
    answer: 'summer',
    explanationAr: 'الصيف هو فصل السباحة في البحر والاستمتاع بالعطلة المدرسية!',
    explanationEn: 'Summer is the season for swimming and sunny beach trips!',
  },
  {
    id: 3,
    questionAr: 'في أي فصل تتساقط أوراق الأشجار وتصبح برتقالية وصفراء؟',
    questionEn: 'In which season do tree leaves turn orange and fall down?',
    answer: 'autumn',
    explanationAr: 'في الخريف تتساقط أوراق الأشجار البرتقالية وتستعد الطبيعة للشتاء!',
    explanationEn: 'In Autumn, colorful leaves fall from trees!',
  },
  {
    id: 4,
    questionAr: 'في أي فصل يكون الطقس بارداً ونرتدي المعاطف الثقيلة والقفازات؟',
    questionEn: 'In which season is it cold so we wear heavy coats and gloves?',
    answer: 'winter',
    explanationAr: 'الشتاء هو فصل البرد والقفازات والمشروبات الدافئة الممتعة!',
    explanationEn: 'Winter brings cold weather, gloves, and warm drinks!',
  },
  {
    id: 5,
    questionAr: 'في أي فصل نستمتع بأكل البطيخ البارد والمانجو اللذيذة؟',
    questionEn: 'In which season do we enjoy cool watermelon and sweet mangoes?',
    answer: 'summer',
    explanationAr: 'البطيخ والمانجو فواكه صيفية منعشة ترطب جسمنا في الحر!',
    explanationEn: 'Watermelon and mango are refreshing summer fruits!',
  },
  {
    id: 6,
    questionAr: 'في أي فصل نستخدم المظلة لمنع قطرات المطر ونشاهد الثلج الأبيض؟',
    questionEn: 'In which season do we use an umbrella for rain and see snow?',
    answer: 'winter',
    explanationAr: 'المظلة تحمينا من المطر الغزير في أيام الشتاء الباردة!',
    explanationEn: 'An umbrella keeps us dry during rainy winter days!',
  },
  {
    id: 7,
    questionAr: 'في أي فصل تطير الطائرات الورقية بسبب هبوب الرياح اللطيفة؟',
    questionEn: 'In which season do kites fly high in the gentle breeze?',
    answer: 'autumn',
    explanationAr: 'هواء الخريف والرياح اللطيفة رائعة لتطير الطائرات الورقية بالسماء!',
    explanationEn: 'Cool autumn breezes are perfect for flying kites!',
  },
  {
    id: 8,
    questionAr: 'في أي فصل نحتفل بعيد الأم وتكتسي الأرض بالبساط الأخضر؟',
    questionEn: 'In which season does the earth turn green with fresh grass?',
    answer: 'spring',
    explanationAr: 'عيد الأم يأتي في بداية فصل الربيع الجميل المليء بالخضرة!',
    explanationEn: 'Spring fills the meadows with fresh green grass!',
  },
  {
    id: 9,
    questionAr: 'في أي فصل نأكل البرتقال والليمون الطازج للوقاية من الزكام؟',
    questionEn: 'In which season do we enjoy fresh oranges rich in Vitamin C?',
    answer: 'winter',
    explanationAr: 'حمضيات الشتاء كالبرتقال تمد جسمنا بالفيتامينات للوقاية من البرد!',
    explanationEn: 'Winter citrus fruits keep us healthy during cold weather!',
  },
  {
    id: 10,
    questionAr: 'في أي فصل نرتدي قبعة القش ونضع النظارات الشمسية للحماية؟',
    questionEn: 'In which season do we wear sun hats and sunglasses outdoors?',
    answer: 'summer',
    explanationAr: 'نحمي أعيننا وبشرتنا بالنظارات والقبعة في الأيام الصيفية المشمسة!',
    explanationEn: 'We protect our eyes on sunny summer days with sunglasses!',
  },
];

type GameMode = 'quiz' | 'tree' | 'closet';

export const SeasonsGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [gameMode, setGameMode] = useState<GameMode>('quiz');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
  const [wrongSeason, setWrongSeason] = useState<string | null>(null);
  const [answered, setAnswered] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [feedbackState, setFeedbackState] = useState<'prompt' | 'correct' | 'wrong'>('prompt');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [viewedSeason, setViewedSeason] = useState<SeasonKey>('spring');

  const timersRef = useRef<number[]>([]);

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
    setCurrentQuestionIdx(0);
    setScore(0);
    setSelectedSeason(null);
    setWrongSeason(null);
    setAnswered(false);
    setIsProcessing(false);
    setFeedbackState('prompt');
    setIsGameOver(false);
  }, [clearTimers]);

  useEffect(() => {
    initGame();
    return () => clearTimers();
  }, [initGame, clearTimers]);

  const currentQ = QUESTIONS[currentQuestionIdx];

  const handleSpeak = (text: string) => {
    sound.speakText(text, isAr ? 'ar' : 'en');
  };

  const handleSelectSeason = (seasonId: SeasonKey) => {
    if (isProcessing || answered) return;

    if (seasonId === currentQ.answer) {
      setSelectedSeason(seasonId);
      setAnswered(true);
      setIsProcessing(true);
      sound.playMatch();
      sound.speakText(
        isAr ? SEASONS_DATA[seasonId].weatherSoundTextAr : SEASONS_DATA[seasonId].weatherSoundTextEn,
        isAr ? 'ar' : 'en'
      );
      const newScore = score + 10;
      setScore(newScore);
      setFeedbackState('correct');

      scheduleTimer(() => {
        if (currentQuestionIdx + 1 < QUESTIONS.length) {
          setCurrentQuestionIdx((prev) => prev + 1);
          setSelectedSeason(null);
          setWrongSeason(null);
          setAnswered(false);
          setIsProcessing(false);
          setFeedbackState('prompt');
        } else {
          saveGameProgress('seasons', newScore, true);
          setIsGameOver(true);
        }
      }, 1300);
    } else {
      sound.playWrong();
      setWrongSeason(seasonId);
      setFeedbackState('wrong');
      setScore((prev) => Math.max(0, prev - 2));

      scheduleTimer(() => {
        setWrongSeason(null);
      }, 700);
    }
  };

  const activeSeasonInfo = SEASONS_DATA[viewedSeason];

  const messageText =
    feedbackState === 'correct'
      ? `✅ ${isAr ? `إجابة صحيحة! ${currentQ.explanationAr}` : `Correct! ${currentQ.explanationEn}`}`
      : feedbackState === 'wrong'
      ? isAr
        ? '❌ حاول مجدداً! فكر في خصائص هذا الفصل.'
        : '❌ Try again! Think about the clues for this season.'
      : isAr
      ? 'اختر الفصل الصحيح للإجابة على السؤال'
      : 'Choose the right season to answer the question';

  return (
    <div className="flex flex-col items-center w-full px-2 sm:px-4 py-4 min-h-[85vh] animate-in fade-in duration-300">
      <GameHeader
        title={isAr ? 'فصول السنة الأربعة' : 'The Four Seasons'}
        icon="🌸☀️🍂❄️"
        score={score}
        onRestart={initGame}
        onGoHome={onGoHome}
        accentGradient="from-[#f48fb1] via-[#ab47bc] to-[#6a1b9a]"
        badgeText={
          isAr
            ? `سؤال ${currentQuestionIdx + 1} من ${QUESTIONS.length}`
            : `Question ${currentQuestionIdx + 1} of ${QUESTIONS.length}`
        }
      />

      <div className="bg-white dark:bg-[#20091b] rounded-3xl p-4 sm:p-7 shadow-xl border border-pink-100 dark:border-[#3d122f] text-slate-800 dark:text-pink-100 max-w-3xl w-full flex flex-col items-center space-y-6">
        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap justify-center items-center gap-2 bg-pink-50 dark:bg-[#1a0716] p-1.5 rounded-full border border-pink-200 dark:border-pink-900/40 text-xs sm:text-sm font-bold">
          <button
            onClick={() => {
              sound.playClick();
              setGameMode('quiz');
              initGame();
            }}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
              gameMode === 'quiz'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-pink-200 hover:text-pink-600'
            }`}
          >
            <span>{isAr ? '🌸 مسابقة الفصول' : '🌸 Seasons Quiz'}</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              clearTimers();
              setGameMode('tree');
            }}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
              gameMode === 'tree'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                : 'text-slate-600 dark:text-pink-200 hover:text-emerald-600'
            }`}
          >
            <span>{isAr ? '🌳 شجرة الفصول' : '🌳 Season Tree'}</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              clearTimers();
              setGameMode('closet');
            }}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
              gameMode === 'closet'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                : 'text-slate-600 dark:text-pink-200 hover:text-amber-600'
            }`}
          >
            <span>{isAr ? '🧥 خزانة الملابس والطقس' : '🧥 Weather Closet'}</span>
          </button>
        </div>

        {/* MODE 1: QUIZ & DISCOVERY MODE */}
        {gameMode === 'quiz' && (
          <div className="w-full flex flex-col items-center space-y-5">
            <div className="w-full bg-gradient-to-r from-emerald-50 via-pink-50 to-amber-50 dark:from-slate-900 dark:via-pink-950/40 dark:to-slate-900 rounded-3xl p-5 sm:p-6 text-center border-2 border-pink-200 dark:border-pink-900/50 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <div className="inline-flex items-center gap-1.5 bg-white/80 dark:bg-black/30 px-3 py-1 rounded-full text-xs font-bold text-pink-700 dark:text-pink-300">
                  <ButterflyIcon className="w-4 h-4 text-pink-500" />
                  <span>{isAr ? 'سؤال خبير الفصول:' : 'Season Explorer Question:'}</span>
                </div>
                <button
                  onClick={() => handleSpeak(isAr ? currentQ.questionAr : currentQ.questionEn)}
                  className="p-2 rounded-full bg-white/80 dark:bg-black/30 hover:bg-white text-pink-600 dark:text-pink-300 shadow-xs cursor-pointer"
                  title={isAr ? 'استمع للسؤال' : 'Listen to question'}
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-pink-100 leading-relaxed">
                {isAr ? currentQ.questionAr : currentQ.questionEn}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
              {(Object.keys(SEASONS_DATA) as SeasonKey[]).map((key) => {
                const season = SEASONS_DATA[key];
                const isSelected = selectedSeason === season.id;
                const isWrong = wrongSeason === season.id;
                const isCorrect = season.id === currentQ.answer;

                let cardStateClasses =
                  'bg-white dark:bg-[#1a0716] border-2 border-pink-100 dark:border-pink-900/40 text-slate-800 dark:text-pink-100 hover:border-pink-400 dark:hover:border-pink-500 hover:shadow-md hover:scale-102';

                if (answered && isCorrect) {
                  cardStateClasses =
                    'bg-gradient-to-br from-emerald-100 to-green-200 dark:from-emerald-950 dark:to-green-900 border-3 border-emerald-500 ring-4 ring-emerald-300 text-emerald-950 dark:text-emerald-100 shadow-lg scale-102';
                } else if (isWrong) {
                  cardStateClasses = 'bg-rose-500 text-white border-rose-600 ring-4 ring-rose-200 animate-shake';
                } else if (isSelected) {
                  cardStateClasses = 'bg-pink-600 text-white border-pink-700';
                }

                return (
                  <button
                    key={season.id}
                    onClick={() => handleSelectSeason(season.id)}
                    disabled={isProcessing || answered}
                    className={`p-4 sm:p-5 rounded-3xl flex items-center gap-4 text-start transition-all transform duration-200 cursor-pointer select-none ${cardStateClasses}`}
                  >
                    <div className="text-4xl sm:text-5xl filter drop-shadow select-none">{season.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-black mb-0.5">{isAr ? season.nameAr : season.nameEn}</h3>
                      <p className="text-xs font-semibold opacity-90 leading-relaxed">
                        {isAr ? season.descriptionAr : season.descriptionEn}
                      </p>
                    </div>
                    {answered && isCorrect && (
                      <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            <div
              className={`w-full text-center p-3 rounded-2xl font-bold text-xs sm:text-sm animate-pop-in ${
                answered
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
              }`}
            >
              {messageText}
            </div>
          </div>
        )}

        {/* MODE 2: CHANGING SEASONS TREE EXPLORER */}
        {gameMode === 'tree' && (
          <div className="w-full flex flex-col items-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-black text-slate-800 dark:text-pink-100">
                {isAr ? 'استكشف شجرة الفصول التفاعلية 🌳' : 'Explore the Interactive Season Tree 🌳'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-pink-200/80 font-medium">
                {isAr
                  ? 'اضغط على أي فصل لمشاهدة التحول الطبيعي للشجرة وفواكهها'
                  : 'Tap any season to see how the tree and fruits change'}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full">
              {(Object.keys(SEASONS_DATA) as SeasonKey[]).map((key) => {
                const s = SEASONS_DATA[key];
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      sound.playPop();
                      sound.speakText(
                        isAr ? s.weatherSoundTextAr : s.weatherSoundTextEn,
                        isAr ? 'ar' : 'en'
                      );
                      setViewedSeason(s.id);
                    }}
                    className={`p-3 rounded-2xl border-2 font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      viewedSeason === s.id
                        ? 'bg-pink-600 text-white border-pink-700 shadow-md scale-105'
                        : 'bg-pink-50 dark:bg-[#1a0716] text-slate-700 dark:text-pink-200 border-pink-200 dark:border-pink-900/40 hover:bg-pink-100'
                    }`}
                  >
                    <span className="text-xl">{s.icon}</span>
                    <span>{isAr ? s.nameAr : s.nameEn}</span>
                  </button>
                );
              })}
            </div>

            <div
              className={`w-full rounded-3xl p-8 text-center border-3 transition-all duration-500 shadow-md ${activeSeasonInfo.bgGradient} ${activeSeasonInfo.borderColor}`}
            >
              <div className="text-8xl sm:text-9xl my-4 filter drop-shadow-xl animate-bounce select-none">
                {activeSeasonInfo.treeVisual}
              </div>

              <h2 className="text-2xl font-black mb-1">
                {isAr ? activeSeasonInfo.nameAr : activeSeasonInfo.nameEn}
              </h2>
              <p className="text-sm font-bold opacity-90 max-w-md mx-auto leading-relaxed">
                {isAr ? activeSeasonInfo.descriptionAr : activeSeasonInfo.descriptionEn}
              </p>

              <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold text-start">
                <div className="bg-white/70 dark:bg-black/30 p-3 rounded-2xl">
                  <span>
                    {isAr
                      ? `🍎 الفواكه والثمار: ${activeSeasonInfo.fruitsAr}`
                      : `🍎 Seasonal Fruits: ${activeSeasonInfo.fruitsEn}`}
                  </span>
                </div>
                <div className="bg-white/70 dark:bg-black/30 p-3 rounded-2xl">
                  <span>
                    {isAr
                      ? `🧥 الملابس والطقس: ${activeSeasonInfo.clothesAr}`
                      : `🧥 Clothes & Weather: ${activeSeasonInfo.clothesEn}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODE 3: CLOSET & WEATHER MATCHING MODE */}
        {gameMode === 'closet' && (
          <div className="w-full flex flex-col items-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-black text-slate-800 dark:text-pink-100">
                {isAr ? 'خزانة ملابس الفصول والطقس 🧥👒' : 'Seasonal Clothes & Weather Closet 🧥👒'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-pink-200/80 font-medium">
                {isAr
                  ? 'تعرف على الملابس والأغراض المناسبة لكل طقس وفصل من فصول السنة'
                  : 'Discover what clothes fit the weather in each season'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {(Object.keys(SEASONS_DATA) as SeasonKey[]).map((key) => {
                const s = SEASONS_DATA[key];
                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      sound.playPop();
                      sound.speakText(
                        isAr
                          ? `ملابس وطقس ${s.nameAr}: ${s.clothesAr}`
                          : `${s.nameEn} clothes: ${s.clothesEn}`,
                        isAr ? 'ar' : 'en'
                      );
                    }}
                    className="p-5 rounded-3xl bg-pink-50/80 dark:bg-[#1a0716] border-2 border-pink-200 dark:border-pink-900/40 flex flex-col gap-2 cursor-pointer hover:border-pink-400 transition-all shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{s.icon}</span>
                      <div>
                        <h4 className="text-lg font-black text-slate-800 dark:text-pink-100">
                          {isAr ? s.nameAr : s.nameEn}
                        </h4>
                        <span className="text-xs font-bold text-pink-600 dark:text-pink-300">
                          {isAr ? s.nameEn : s.nameAr}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-slate-700 dark:text-pink-200 leading-relaxed bg-white dark:bg-black/30 p-2.5 rounded-2xl">
                      {isAr ? s.clothesAr : s.clothesEn}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {isGameOver && (
        <WinCelebration
          score={score}
          message={
            isAr
              ? '🎉 أحسنت يا بطل! لقد أصبحت خبيراً حقيقياً في فصول السنة الأربعة وقادر على تمييز طقسها وملابسها!'
              : '🎉 Awesome! You mastered all four seasons and their weather!'
          }
          onRestart={initGame}
          onGoHome={onGoHome}
          stars={score >= 80 ? 3 : score >= 50 ? 2 : 1}
        />
      )}
    </div>
  );
};

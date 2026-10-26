import React, { useState, useEffect, useCallback } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';
import { Sun, Snowflake, CloudRain, Wind, Sparkles, Volume2, CheckCircle2, RotateCcw } from 'lucide-react';
import { ButterflyIcon } from '../common/ButterflyIcon';

interface SeasonInfo {
  id: 'spring' | 'summer' | 'autumn' | 'winter';
  name: string;
  nameEn: string;
  icon: string;
  description: string;
  bgGradient: string;
  borderColor: string;
  treeVisual: string;
  clothes: string;
  fruits: string;
  weatherSoundText: string;
}

const SEASONS_DATA: Record<'spring' | 'summer' | 'autumn' | 'winter', SeasonInfo> = {
  spring: {
    id: 'spring',
    name: 'الربيع',
    nameEn: 'Spring',
    icon: '🌸',
    description: 'فصل الأزهار اليانعة والنمو والطقس المعتدل المبهج',
    bgGradient: 'from-emerald-300 via-green-100 to-teal-200 text-emerald-950',
    borderColor: 'border-emerald-400',
    treeVisual: '🌳🌸🦋',
    clothes: '👗👕 (ملابس ربيعية خفيفة وزاهية)',
    fruits: '🍓🍒 (الفراولة والكرز اللذيذ)',
    weatherSoundText: 'فصل الربيع المشرق وتفتح الأزهار والجو المعتدل',
  },
  summer: {
    id: 'summer',
    name: 'الصيف',
    nameEn: 'Summer',
    icon: '☀️',
    description: 'فصل الشمس الساطعة والشاطئ والعطلة المدرسية',
    bgGradient: 'from-amber-300 via-yellow-100 to-orange-200 text-amber-950',
    borderColor: 'border-amber-400',
    treeVisual: '🌳☀️🥭',
    clothes: '🩳👒🏊‍♂️ (قبعة الشمس والملابس الصيفية الخفيفة)',
    fruits: '🍉🥭 (البطيخ والمانجو البارد اللذيذ)',
    weatherSoundText: 'فصل الصيف الحار والسباحة في البحر والعطلة',
  },
  autumn: {
    id: 'autumn',
    name: 'الخريف',
    nameEn: 'Autumn',
    icon: '🍂',
    description: 'فصل تساقط أوراق الأشجار البرتقالية وهبوب الرياح',
    bgGradient: 'from-orange-300 via-amber-100 to-yellow-200 text-amber-950',
    borderColor: 'border-orange-400',
    treeVisual: '🍁🍂🪵',
    clothes: '🧥🧣 (معطف خفيف وشال دافئ)',
    fruits: '🍇🍎 (الرمان والتفاح والجوز)',
    weatherSoundText: 'فصل الخريف وتساقط الأوراق البرتقالية والرياح',
  },
  winter: {
    id: 'winter',
    name: 'الشتاء',
    nameEn: 'Winter',
    icon: '❄️',
    description: 'فصل البرد والمطر الغزير والثلوج والمشروبات الدافئة',
    bgGradient: 'from-sky-300 via-indigo-100 to-blue-200 text-indigo-950 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 dark:text-blue-100',
    borderColor: 'border-sky-400',
    treeVisual: '🌲❄️⛄',
    clothes: '🧥🧢🧤☂️ (المعطف الثقيل والقبعة والقفازات والمظلة)',
    fruits: '🍊🍋 (البرتقال والليمون الغني بفيتامين ج)',
    weatherSoundText: 'فصل الشتاء البارد والمطر والثلوج المعاطف الثقيلة',
  },
};

const QUESTIONS = [
  {
    id: 1,
    question: 'في أي فصل تتفتح الأزهار الملونة وتطير الفراشات في كل مكان؟',
    answer: 'spring',
    explanation: 'الربيع هو فصل تفتح الأزهار الجميلة وتجدد الحياة في الطبيعة!',
  },
  {
    id: 2,
    question: 'في أي فصل نذهب إلى الشاطئ ونسبح في البحر تحت أشعة الشمس؟',
    answer: 'summer',
    explanation: 'الصيف هو فصل السباحة في البحر والاستمتاع بالعطلة المدرسية!',
  },
  {
    id: 3,
    question: 'في أي فصل تتساقط أوراق الأشجار وتصبح برتقالية وصفراء؟',
    answer: 'autumn',
    explanation: 'في الخريف تتساقط أوراق الأشجار البرتقالية وتستعد الطبيعة للشتاء!',
  },
  {
    id: 4,
    question: 'في أي فصل يكون الطقس بارداً ونرتدي المعاطف الثقيلة والقفازات؟',
    answer: 'winter',
    explanation: 'الشتاء هو فصل البرد والقفازات والمشروبات الدافئة الممتعة!',
  },
  {
    id: 5,
    question: 'في أي فصل نستمتع بأكل البطيخ البارد والمانجو اللذيذة؟',
    answer: 'summer',
    explanation: 'البطيخ والمانجو فواكه صيفية منعشة ترطب جسمنا في الحر!',
  },
  {
    id: 6,
    question: 'في أي فصل نستخدم المظلة لمنع قطرات المطر ونشاهد الثلج الأبيض؟',
    answer: 'winter',
    explanation: 'المظلة تحمينا من المطر الغزير في أيام الشتاء الباردة!',
  },
  {
    id: 7,
    question: 'في أي فصل تطير الطائرات الورقية بسبب هبوب الرياح اللطيفة؟',
    answer: 'autumn',
    explanation: 'هواء الخريف والرياح اللطيفة رائعة لتطير الطائرات الورقية بالسماء!',
  },
  {
    id: 8,
    question: 'في أي فصل نحتفل بعيد الأم وتكتسي الأرض بالبساط الأخضر؟',
    answer: 'spring',
    explanation: 'عيد الأم يأتي في بداية فصل الربيع الجميل المليء بالخضرة!',
  },
  {
    id: 9,
    question: 'في أي فصل نأكل البرتقال والليمون الطازج للوقاية من الزكام؟',
    answer: 'winter',
    explanation: 'حمضيات الشتاء كالبرتقال تمد جسمنا بالفيتامينات للوقاية من البرد!',
  },
  {
    id: 10,
    question: 'في أي فصل نرتدي قبعة القش ونضع النظارات الشمسية للحماية؟',
    answer: 'summer',
    explanation: 'نحمي أعيننا وبشرتنا بالنظارات والقبعة في الأيام الصيفية المشمشة!',
  },
];

type GameMode = 'quiz' | 'tree' | 'closet';

export const SeasonsGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const [gameMode, setGameMode] = useState<GameMode>('quiz');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
  const [wrongSeason, setWrongSeason] = useState<string | null>(null);
  const [answered, setAnswered] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('اختر الفصل الصحيح للإجابة على السؤال');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  // Tree & Closet active season viewer
  const [viewedSeason, setViewedSeason] = useState<'spring' | 'summer' | 'autumn' | 'winter'>('spring');

  const initGame = useCallback(() => {
    setCurrentQuestionIdx(0);
    setScore(0);
    setSelectedSeason(null);
    setWrongSeason(null);
    setAnswered(false);
    setIsProcessing(false);
    setMessage('اختر الفصل الصحيح للإجابة على السؤال');
    setIsGameOver(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const currentQ = QUESTIONS[currentQuestionIdx];

  const handleSpeak = (text: string) => {
    sound.speakText(text, 'ar');
  };

  const handleSelectSeason = (seasonId: 'spring' | 'summer' | 'autumn' | 'winter') => {
    if (isProcessing || answered) return;

    if (seasonId === currentQ.answer) {
      setSelectedSeason(seasonId);
      setAnswered(true);
      setIsProcessing(true);
      sound.playMatch();
      sound.speakText(SEASONS_DATA[seasonId].weatherSoundText, 'ar');
      const newScore = score + 10;
      setScore(newScore);
      setMessage(`✅ إجابة صحيحة! ${currentQ.explanation}`);

      setTimeout(() => {
        if (currentQuestionIdx + 1 < QUESTIONS.length) {
          setCurrentQuestionIdx((prev) => prev + 1);
          setSelectedSeason(null);
          setWrongSeason(null);
          setAnswered(false);
          setIsProcessing(false);
          setMessage('اختر الفصل الصحيح للإجابة على السؤال');
        } else {
          sound.playWin();
          saveGameProgress('seasons', newScore, true);
          setIsGameOver(true);
        }
      }, 1300);
    } else {
      sound.playWrong();
      setWrongSeason(seasonId);
      setMessage(`❌ حاول مجدداً! فكر في أصحاب هذا الفصل.`);
      setScore((prev) => Math.max(0, prev - 2));

      setTimeout(() => {
        setWrongSeason(null);
      }, 700);
    }
  };

  const activeSeasonInfo = SEASONS_DATA[viewedSeason];

  return (
    <div className="flex flex-col items-center w-full px-2 sm:px-4 py-4 min-h-[85vh] animate-in fade-in duration-300">
      <GameHeader
        title="فصول السنة الأربعة"
        icon="🌸☀️🍂❄️"
        score={score}
        onRestart={initGame}
        onGoHome={onGoHome}
        accentGradient="from-[#f48fb1] via-[#ab47bc] to-[#6a1b9a]"
        badgeText={`سؤال ${currentQuestionIdx + 1} من ${QUESTIONS.length}`}
      />

      <div className="bg-white dark:bg-[#20091b] rounded-3xl p-4 sm:p-7 shadow-xl border border-pink-100 dark:border-[#3d122f] text-slate-800 dark:text-pink-100 max-w-3xl w-full flex flex-col items-center space-y-6">
        
        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap justify-center items-center gap-2 bg-pink-50 dark:bg-[#1a0716] p-1.5 rounded-full border border-pink-200 dark:border-pink-900/40 text-xs sm:text-sm font-bold">
          <button
            onClick={() => { sound.playClick(); setGameMode('quiz'); initGame(); }}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
              gameMode === 'quiz'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-pink-200 hover:text-pink-600'
            }`}
          >
            <span>🌸 مسابقة الفصول</span>
          </button>
          <button
            onClick={() => { sound.playClick(); setGameMode('tree'); }}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
              gameMode === 'tree'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                : 'text-slate-600 dark:text-pink-200 hover:text-emerald-600'
            }`}
          >
            <span>🌳 شجرة الفصول</span>
          </button>
          <button
            onClick={() => { sound.playClick(); setGameMode('closet'); }}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
              gameMode === 'closet'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                : 'text-slate-600 dark:text-pink-200 hover:text-amber-600'
            }`}
          >
            <span>🧥 خزانة الملابس والطقس</span>
          </button>
        </div>

        {/* -------------------------------------------------------------
            MODE 1: QUIZ & DISCOVERY MODE
           ------------------------------------------------------------- */}
        {gameMode === 'quiz' && (
          <div className="w-full flex flex-col items-center space-y-5">
            {/* Question Box */}
            <div className="w-full bg-gradient-to-r from-emerald-50 via-pink-50 to-amber-50 dark:from-slate-900 dark:via-pink-950/40 dark:to-slate-900 rounded-3xl p-5 sm:p-6 text-center border-2 border-pink-200 dark:border-pink-900/50 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <div className="inline-flex items-center gap-1.5 bg-white/80 dark:bg-black/30 px-3 py-1 rounded-full text-xs font-bold text-pink-700 dark:text-pink-300">
                  <ButterflyIcon className="w-4 h-4 text-pink-500" />
                  <span>سؤال خبير الفصول:</span>
                </div>
                <button
                  onClick={() => handleSpeak(currentQ.question)}
                  className="p-2 rounded-full bg-white/80 dark:bg-black/30 hover:bg-white text-pink-600 dark:text-pink-300 shadow-xs cursor-pointer"
                  title="استمع للسؤال"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-pink-100 leading-relaxed">
                {currentQ.question}
              </h2>
            </div>

            {/* 4 Seasons Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
              {(Object.keys(SEASONS_DATA) as ('spring' | 'summer' | 'autumn' | 'winter')[]).map((key) => {
                const season = SEASONS_DATA[key];
                const isSelected = selectedSeason === season.id;
                const isWrong = wrongSeason === season.id;
                const isCorrect = season.id === currentQ.answer;

                let cardStateClasses = 'bg-white dark:bg-[#1a0716] border-2 border-pink-100 dark:border-pink-900/40 text-slate-800 dark:text-pink-100 hover:border-pink-400 dark:hover:border-pink-500 hover:shadow-md hover:scale-102';

                if (answered && isCorrect) {
                  cardStateClasses = 'bg-gradient-to-br from-emerald-100 to-green-200 dark:from-emerald-950 dark:to-green-900 border-3 border-emerald-500 ring-4 ring-emerald-300 text-emerald-950 dark:text-emerald-100 shadow-lg scale-102';
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
                    className={`p-4 sm:p-5 rounded-3xl flex items-center gap-4 text-right transition-all transform duration-200 cursor-pointer select-none ${cardStateClasses}`}
                  >
                    <div className="text-4xl sm:text-5xl filter drop-shadow select-none">{season.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-black mb-0.5">{season.name}</h3>
                      <p className="text-xs font-semibold opacity-90 leading-relaxed">{season.description}</p>
                    </div>
                    {answered && isCorrect && (
                      <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Prompt Prompt / Feedback */}
            <div className={`w-full text-center p-3 rounded-2xl font-bold text-xs sm:text-sm animate-pop-in ${
              answered
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
            }`}>
              {message}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            MODE 2: CHANGING SEASONS TREE EXPLORER
           ------------------------------------------------------------- */}
        {gameMode === 'tree' && (
          <div className="w-full flex flex-col items-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-black text-slate-800 dark:text-pink-100">
                استكشف شجرة الفصول التفاعلية 🌳
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-pink-200/80 font-medium">
                اضغط على أي فصل لمشاهدة التحول الطبيعي للشجرة وفواكهها
              </p>
            </div>

            {/* Season Pills selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full">
              {(Object.keys(SEASONS_DATA) as ('spring' | 'summer' | 'autumn' | 'winter')[]).map((key) => {
                const s = SEASONS_DATA[key];
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      sound.playPop();
                      sound.speakText(s.weatherSoundText, 'ar');
                      setViewedSeason(s.id);
                    }}
                    className={`p-3 rounded-2xl border-2 font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      viewedSeason === s.id
                        ? 'bg-pink-600 text-white border-pink-700 shadow-md scale-105'
                        : 'bg-pink-50 dark:bg-[#1a0716] text-slate-700 dark:text-pink-200 border-pink-200 dark:border-pink-900/40 hover:bg-pink-100'
                    }`}
                  >
                    <span className="text-xl">{s.icon}</span>
                    <span>{s.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Tree Stage Canvas */}
            <div className={`w-full rounded-3xl p-8 text-center border-3 transition-all duration-500 shadow-md ${activeSeasonInfo.bgGradient} ${activeSeasonInfo.borderColor}`}>
              <div className="text-8xl sm:text-9xl my-4 filter drop-shadow-xl animate-bounce select-none">
                {activeSeasonInfo.treeVisual}
              </div>

              <h2 className="text-2xl font-black mb-1">{activeSeasonInfo.name}</h2>
              <p className="text-sm font-bold opacity-90 max-w-md mx-auto leading-relaxed">
                {activeSeasonInfo.description}
              </p>

              <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold text-start">
                <div className="bg-white/70 dark:bg-black/30 p-3 rounded-2xl">
                  <span>🍎 الفواكه والثمار: {activeSeasonInfo.fruits}</span>
                </div>
                <div className="bg-white/70 dark:bg-black/30 p-3 rounded-2xl">
                  <span>🧥 الملابس والطقس: {activeSeasonInfo.clothes}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            MODE 3: CLOSET & WEATHER MATCHING MODE
           ------------------------------------------------------------- */}
        {gameMode === 'closet' && (
          <div className="w-full flex flex-col items-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-black text-slate-800 dark:text-pink-100">
                خزانة ملابس الفصول والطقس 🧥👒
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-pink-200/80 font-medium">
                تعرف على الملابس والأغراض المناسبة لكل طقس وفصل من فصول السنة
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {(Object.keys(SEASONS_DATA) as ('spring' | 'summer' | 'autumn' | 'winter')[]).map((key) => {
                const s = SEASONS_DATA[key];
                return (
                  <div 
                    key={s.id}
                    onClick={() => {
                      sound.playPop();
                      sound.speakText(`ملابس وطقس ${s.name}: ${s.clothes}`, 'ar');
                    }}
                    className="p-5 rounded-3xl bg-pink-50/80 dark:bg-[#1a0716] border-2 border-pink-200 dark:border-pink-900/40 flex flex-col gap-2 cursor-pointer hover:border-pink-400 transition-all shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{s.icon}</span>
                      <div>
                        <h4 className="text-lg font-black text-slate-800 dark:text-pink-100">{s.name}</h4>
                        <span className="text-xs font-bold text-pink-600 dark:text-pink-300">{s.nameEn}</span>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-slate-700 dark:text-pink-200 leading-relaxed bg-white dark:bg-black/30 p-2.5 rounded-2xl">
                      {s.clothes}
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
          message="🎉 أحسنت يا بطل! لقد أصبحت خبيراً حقيقياً في فصول السنة الأربعة وقادر على تمييز طقسها وملابسها!"
          onRestart={initGame}
          onGoHome={onGoHome}
          stars={score >= 80 ? 3 : score >= 50 ? 2 : 1}
        />
      )}
    </div>
  );
};

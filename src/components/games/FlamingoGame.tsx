import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';
import { useLanguage } from '../../i18n/LanguageContext';
import { Volume2, Heart, RefreshCw, Palette } from 'lucide-react';
import { ButterflyIcon } from '../common/ButterflyIcon';

export const CuteFlamingoVector: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg
    viewBox="0 0 200 240"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Cute Pink Flamingo"
  >
    <defs>
      <linearGradient id="flamingoBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f472b6" />
        <stop offset="50%" stopColor="#f43f5e" />
        <stop offset="100%" stopColor="#e11d48" />
      </linearGradient>
      <linearGradient id="flamingoWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbcfe8" />
        <stop offset="50%" stopColor="#f472b6" />
        <stop offset="100%" stopColor="#be185d" />
      </linearGradient>
      <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
        <stop offset="50%" stopColor="#f472b6" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.4" />
      </linearGradient>
      <linearGradient id="lilyPadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4ade80" />
        <stop offset="100%" stopColor="#15803d" />
      </linearGradient>
    </defs>

    <ellipse cx="100" cy="218" rx="75" ry="14" fill="url(#waterGrad)" />
    <ellipse cx="100" cy="212" rx="55" ry="10" fill="url(#lilyPadGrad)" />

    <path d="M135 204 Q140 194 145 204 Q150 194 155 204 Z" fill="#fb7185" />
    <circle cx="145" cy="202" r="3" fill="#fde047" />

    <line x1="100" y1="140" x2="100" y2="212" stroke="#f43f5e" strokeWidth="5" strokeLinecap="round" />
    <path d="M100 145 L80 170 L100 170" stroke="#f43f5e" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />

    <path
      d="M75 110 C60 120 60 145 80 150 C110 155 130 140 135 120 C140 100 115 95 95 100 C80 103 78 107 75 110 Z"
      fill="url(#flamingoBodyGrad)"
    />
    <path d="M130 115 C150 110 160 120 155 130 C145 135 135 125 130 115 Z" fill="#be185d" />
    <path
      d="M85 110 C70 120 75 142 95 142 C115 142 125 125 115 112 C105 100 92 102 85 110 Z"
      fill="url(#flamingoWingGrad)"
      stroke="#f472b6"
      strokeWidth="2"
    />
    <path d="M90 118 C80 125 85 138 100 138 C110 138 118 128 110 118 Z" fill="#fbcfe8" opacity="0.85" />
    <path
      d="M85 105 C75 80 65 65 80 45 C90 32 105 32 105 45 C105 55 95 70 95 95"
      fill="none"
      stroke="url(#flamingoBodyGrad)"
      strokeWidth="14"
      strokeLinecap="round"
    />
    <circle cx="95" cy="42" r="16" fill="#f472b6" />
    <path d="M95 42 Q115 42 120 52 Q110 62 95 50 Z" fill="#fde047" stroke="#eab308" strokeWidth="1" />
    <path d="M110 46 Q120 52 112 58 Z" fill="#1e293b" />
    <circle cx="90" cy="38" r="4.5" fill="#0f172a" />
    <circle cx="88.5" cy="36.5" r="1.8" fill="#ffffff" />
    <circle cx="91.5" cy="39.5" r="0.8" fill="#ffffff" />
    <ellipse cx="88" cy="45" rx="3.5" ry="2" fill="#f43f5e" opacity="0.6" />
    <path
      d="M45 50 Q45 42 50 42 Q55 42 55 50 Q55 58 45 65 Q35 58 35 50 Q35 42 40 42 Q45 42 45 50 Z"
      fill="#fb7185"
      transform="scale(0.3) translate(80, 80)"
    />
    <path
      d="M45 50 Q45 42 50 42 Q55 42 55 50 Q55 58 45 65 Q35 58 35 50 Q35 42 40 42 Q45 42 45 50 Z"
      fill="#f472b6"
      transform="scale(0.25) translate(520, 200)"
    />
  </svg>
);

interface BalanceQuestion {
  id: number;
  questionAr: string;
  questionEn: string;
  options: number[];
  answer: number;
  explanationAr: string;
  explanationEn: string;
  visualEmoji: string;
}

const BALANCE_QUESTIONS: BalanceQuestion[] = [
  {
    id: 1,
    questionAr: 'كم زهرة لوتس وردية تطفو في بحيرة الفلامينجو؟ 🪷🪷🪷',
    questionEn: 'How many pink lotus flowers are floating in the lake? 🪷🪷🪷',
    options: [2, 3, 4, 5],
    answer: 3,
    explanationAr: 'ممتازة! هناك ٣ أزهار لوتس وردية جميلة!',
    explanationEn: 'Excellent! There are 3 lovely pink lotus flowers!',
    visualEmoji: '🪷🪷🪷',
  },
  {
    id: 2,
    questionAr: 'الفلامينجو تناول ٣ جمبريات 🦐 ثم تناول ٢ جمبريتين إضافيتين. كم جمبرية تناول في المجموع؟',
    questionEn: 'Flamingo ate 3 shrimp 🦐 and then 2 more. How many in total?',
    options: [4, 5, 6, 7],
    answer: 5,
    explanationAr: 'أحسنتِ يا بطلة! ٣ + ٢ = ٥ جمبريات شهية!',
    explanationEn: 'Well done! 3 + 2 = 5 delicious shrimp!',
    visualEmoji: '🦐🦐🦐 + 🦐🦐',
  },
  {
    id: 3,
    questionAr: 'الفلامينجو يستطيع الوقوف على رجل واحدة! إذا كان لديه رجلان ورفع واحدة، كم رجل تبقى على الأرض؟',
    questionEn: 'Flamingo has 2 legs and lifts 1 up to balance. How many stay on the ground?',
    options: [1, 2, 0, 3],
    answer: 1,
    explanationAr: 'رائعة! ٢ - ١ = رجل واحدة متوازنة ورشيقة!',
    explanationEn: 'Awesome! 2 - 1 = 1 graceful balancing leg!',
    visualEmoji: '🦩',
  },
  {
    id: 4,
    questionAr: 'شاهد الفلامينجو ٤ أسماك ذهبية 🐟 ثم انضمت إليها ٤ أسماك أخرى. كم سمكة أصبحت في البحيرة؟',
    questionEn: 'Flamingo spotted 4 fish 🐟 and 4 more swam over. How many fish in total?',
    options: [6, 7, 8, 9],
    answer: 8,
    explanationAr: 'إجابة صحيحة! ٤ + ٤ = ٨ أسماك ملونة!',
    explanationEn: 'Correct! 4 + 4 = 8 colorful fish!',
    visualEmoji: '🐟🐟🐟🐟 + 🐟🐟🐟🐟',
  },
  {
    id: 5,
    questionAr: 'ما هو اللون المميز والجميل لريش الفلامينجو اللطيف؟',
    questionEn: 'What is the signature color of a cute flamingo’s feathers?',
    options: [1, 2, 3, 4],
    answer: 1,
    explanationAr: 'ممتازة جداً! الفلامينجو يتألق باللون الوردي المبهج!',
    explanationEn: 'Spot on! Flamingos shine with lovely pink feathers!',
    visualEmoji: '💖🦩✨',
  },
];

interface WordQuestion {
  id: number;
  wordAr: string;
  wordEn: string;
  meaningAr: string;
  meaningEn: string;
  scrambledAr: string[];
  scrambledEn: string[];
  emoji: string;
}

const WORD_QUESTIONS: WordQuestion[] = [
  {
    id: 1,
    wordAr: 'وردي',
    wordEn: 'PINK',
    meaningAr: 'لون ريش الفلامينجو المفضل',
    meaningEn: "Flamingo's favorite feather color",
    scrambledAr: ['ي', 'و', 'د', 'ر'],
    scrambledEn: ['K', 'P', 'N', 'I'],
    emoji: '🌸',
  },
  {
    id: 2,
    wordAr: 'بحيرة',
    wordEn: 'LAKE',
    meaningAr: 'المكان المائي الساحر الذي يعيش فيه الفلامينجو',
    meaningEn: 'The calm water home where flamingos wade',
    scrambledAr: ['ة', 'ب', 'ر', 'ح', 'ي'],
    scrambledEn: ['E', 'L', 'A', 'K'],
    emoji: '💧',
  },
  {
    id: 3,
    wordAr: 'ريش',
    wordEn: 'WING',
    meaningAr: 'الكساء الملون والأنيق لطائر الفلامينجو',
    meaningEn: 'Helps birds glide gracefully in the sky',
    scrambledAr: ['ش', 'ر', 'ي'],
    scrambledEn: ['G', 'W', 'N', 'I'],
    emoji: '🪶',
  },
  {
    id: 4,
    wordAr: 'جمال',
    wordEn: 'STAR',
    meaningAr: 'صفة الفلامينجو برقبته الطويلة ورشاقته',
    meaningEn: 'Shining bright like Taleen’s flamingo',
    scrambledAr: ['ل', 'ج', 'ا', 'م'],
    scrambledEn: ['R', 'S', 'T', 'A'],
    emoji: '✨',
  },
];

type FlamingoMode = 'balance' | 'words' | 'dressup';

interface Accessory {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  soundPhraseAr: string;
  soundPhraseEn: string;
}

const ACCESSORIES: Accessory[] = [
  {
    id: 'crown',
    nameAr: 'تاج الملكة الذهبي',
    nameEn: 'Golden Crown',
    icon: '👑',
    soundPhraseAr: 'تاج الملكة الذهبي الرائع!',
    soundPhraseEn: 'Sparkling golden crown!',
  },
  {
    id: 'garland',
    nameAr: 'طوق الزهور الوردي',
    nameEn: 'Pink Flower Garland',
    icon: '🌺',
    soundPhraseAr: 'طوق الزهور الوردي المبهج!',
    soundPhraseEn: 'Pretty pink flower garland!',
  },
  {
    id: 'glasses',
    nameAr: 'نظارات شمسية برّاقة',
    nameEn: 'Cool Sunglasses',
    icon: '😎',
    soundPhraseAr: 'نظارات شمسية أنيقة وجذابة!',
    soundPhraseEn: 'Stylish cool sunglasses!',
  },
  {
    id: 'bow',
    nameAr: 'فيونكة وردية لطيفة',
    nameEn: 'Cute Pink Bow',
    icon: '🎀',
    soundPhraseAr: 'فيونكة وردية في غاية اللطافة!',
    soundPhraseEn: 'Adorable pink ribbon bow!',
  },
  {
    id: 'sparkles',
    nameAr: 'بريق النجوم السحري',
    nameEn: 'Magic Star Sparkles',
    icon: '✨',
    soundPhraseAr: 'بريق النجوم السحرية المتلألئة!',
    soundPhraseEn: 'Magical shimmering star sparkles!',
  },
];

export const FlamingoGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [mode, setMode] = useState<FlamingoMode>('balance');
  const [score, setScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  // Balance mode state
  const [balanceIdx, setBalanceIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [wrongOption, setWrongOption] = useState<number | null>(null);
  const [answeredState, setAnsweredState] = useState<'correct' | 'wrong' | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [balanceFeedback, setBalanceFeedback] = useState<'prompt' | 'correct' | 'wrong'>('prompt');

  // Word mode state
  const [wordIdx, setWordIdx] = useState<number>(0);
  const [builtLetters, setBuiltLetters] = useState<string[]>([]);

  // Dress Up mode state
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>(['garland']);

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
    setBalanceIdx(0);
    setWordIdx(0);
    setScore(0);
    setSelectedOption(null);
    setWrongOption(null);
    setAnsweredState(null);
    setIsProcessing(false);
    setBalanceFeedback('prompt');
    setIsGameOver(false);
    setBuiltLetters([]);
  }, [clearTimers]);

  useEffect(() => {
    initGame();
    return () => clearTimers();
  }, [initGame, clearTimers]);

  const currentBalanceQ = BALANCE_QUESTIONS[balanceIdx];
  const currentWordQ = WORD_QUESTIONS[wordIdx];

  const handleSpeak = (text: string) => {
    sound.speakText(text, isAr ? 'ar' : 'en');
  };

  // 1. Balance Mode Option Click
  const handleBalanceChoose = (option: number) => {
    if (isProcessing || answeredState === 'correct') return;

    if (option === currentBalanceQ.answer) {
      setSelectedOption(option);
      setAnsweredState('correct');
      setBalanceFeedback('correct');
      setIsProcessing(true);
      sound.playMatch();
      sound.speakText(
        isAr ? currentBalanceQ.explanationAr : currentBalanceQ.explanationEn,
        isAr ? 'ar' : 'en'
      );
      const newScore = score + 20;
      setScore(newScore);

      scheduleTimer(() => {
        if (balanceIdx + 1 < BALANCE_QUESTIONS.length) {
          setBalanceIdx((prev) => prev + 1);
          setSelectedOption(null);
          setWrongOption(null);
          setAnsweredState(null);
          setIsProcessing(false);
          setBalanceFeedback('prompt');
        } else {
          saveGameProgress('flamingo-game', newScore, true);
          setIsGameOver(true);
        }
      }, 1400);
    } else {
      sound.playWrong();
      setWrongOption(option);
      setBalanceFeedback('wrong');
      setScore((prev) => Math.max(0, prev - 2));

      scheduleTimer(() => {
        setWrongOption(null);
      }, 700);
    }
  };

  // 2. Word Builder Letter Click
  const handleLetterClick = (letter: string) => {
    sound.playPop();
    const newBuilt = [...builtLetters, letter];
    setBuiltLetters(newBuilt);

    const targetWord = isAr ? currentWordQ.wordAr : currentWordQ.wordEn;
    const currentBuiltStr = newBuilt.join('');

    if (currentBuiltStr === targetWord) {
      sound.playMatch();
      sound.speakText(isAr ? `ممتازة! كلمة ${targetWord}` : `Awesome! ${targetWord}`, isAr ? 'ar' : 'en');
      const newScore = score + 25;
      setScore(newScore);

      scheduleTimer(() => {
        if (wordIdx + 1 < WORD_QUESTIONS.length) {
          setWordIdx((prev) => prev + 1);
          setBuiltLetters([]);
        } else {
          saveGameProgress('flamingo-game', newScore, true);
          setIsGameOver(true);
        }
      }, 1400);
    }
  };

  const handleResetLetters = () => {
    sound.playClick();
    setBuiltLetters([]);
  };

  // 3. Accessory Toggle in Dress Up Studio
  const handleToggleAccessory = (acc: Accessory) => {
    sound.playSparkle();
    sound.speakText(isAr ? acc.soundPhraseAr : acc.soundPhraseEn, isAr ? 'ar' : 'en');
    setSelectedAccessories((prev) =>
      prev.includes(acc.id) ? prev.filter((id) => id !== acc.id) : [...prev, acc.id]
    );
    setScore((prev) => prev + 5);
  };

  const balanceMessageText =
    balanceFeedback === 'correct'
      ? `✅ ${isAr ? `إجابة رائعة! ${currentBalanceQ.explanationAr}` : `Great! ${currentBalanceQ.explanationEn}`}`
      : balanceFeedback === 'wrong'
      ? isAr
        ? '❌ أوشك الفلامينجو على الاهتزاز! حاولي مرة أخرى بذكاء!'
        : '❌ Almost lost balance! Try another answer!'
      : isAr
      ? 'ساعدي الفلامينجو الوردي في الحفاظ على توازنه للإجابة على الأسئلة! 🦩'
      : 'Help the pink flamingo balance by solving the questions! 🦩';

  return (
    <div className="flex flex-col items-center w-full px-2 sm:px-4 py-4 min-h-[85vh] animate-in fade-in duration-300">
      <GameHeader
        title={isAr ? 'لعبة الفلامينجو الوردي' : 'Pink Flamingo Game'}
        icon="🦩✨"
        score={score}
        onRestart={initGame}
        onGoHome={onGoHome}
        accentGradient="from-[#f472b6] via-[#ec4899] to-[#be185d]"
        badgeText={isAr ? 'لعبة ترفيهية وتعليمية للأميرات' : 'Magical Learning Adventure'}
      />

      {/* Main Game Container */}
      <div className="bg-white dark:bg-[#20091b] rounded-3xl p-4 sm:p-7 shadow-xl border border-pink-200 dark:border-[#3d122f] text-slate-800 dark:text-pink-100 max-w-3xl w-full flex flex-col items-center space-y-6">
        {/* Mode Selector */}
        <div className="flex flex-wrap justify-center items-center gap-2 bg-pink-50 dark:bg-[#1a0716] p-1.5 rounded-full border border-pink-200 dark:border-pink-900/40 text-xs sm:text-sm font-bold">
          <button
            onClick={() => {
              sound.playClick();
              setMode('balance');
              initGame();
            }}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
              mode === 'balance'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                : 'text-slate-600 dark:text-pink-200 hover:text-pink-600'
            }`}
          >
            <span>{isAr ? '🦩 توازن الأرقام' : '🦩 Math Balance'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              clearTimers();
              setMode('words');
              setWordIdx(0);
              setBuiltLetters([]);
            }}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
              mode === 'words'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-pink-200 hover:text-purple-600'
            }`}
          >
            <span>{isAr ? '📝 كلمات الفلامينجو' : '📝 Flamingo Words'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              clearTimers();
              setMode('dressup');
            }}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
              mode === 'dressup'
                ? 'bg-gradient-to-r from-amber-400 to-pink-500 text-white shadow-md'
                : 'text-slate-600 dark:text-pink-200 hover:text-amber-600'
            }`}
          >
            <span>{isAr ? '👑 تزيين الفلامينجو' : '👑 Style Flamingo'}</span>
          </button>
        </div>

        {/* Hero Flamingo Display Card */}
        <div className="w-full rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100 dark:from-[#2d0e26] dark:via-[#1e0819] dark:to-[#160612] border-2 border-pink-200 dark:border-pink-900/50 flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden shadow-sm">
          <div className="relative group shrink-0">
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl bg-white/90 dark:bg-black/40 border-4 border-pink-300 dark:border-pink-800 shadow-md flex items-center justify-center p-2 relative overflow-hidden transition-transform group-hover:scale-105">
              <CuteFlamingoVector className="w-full h-full object-contain filter drop-shadow-md animate-bounce" />

              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-2">
                {selectedAccessories.includes('crown') && (
                  <span className="text-3xl sm:text-4xl absolute -top-1 animate-pulse">👑</span>
                )}
                {selectedAccessories.includes('garland') && (
                  <span className="text-2xl sm:text-3xl absolute top-10">🌺</span>
                )}
                {selectedAccessories.includes('glasses') && (
                  <span className="text-2xl sm:text-3xl absolute top-6">😎</span>
                )}
                {selectedAccessories.includes('bow') && (
                  <span className="text-2xl sm:text-3xl absolute bottom-6">🎀</span>
                )}
                {selectedAccessories.includes('sparkles') && (
                  <span className="text-3xl absolute top-2 right-2 animate-spin-slow">✨</span>
                )}
              </div>
            </div>

            <div className="absolute -bottom-2 -right-2 bg-pink-500 text-white rounded-full p-1.5 shadow-md">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
          </div>

          <div className="flex-1 text-center sm:text-start space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-white/80 dark:bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-pink-700 dark:text-pink-300">
              <ButterflyIcon className="w-4 h-4 text-pink-500" />
              <span>{isAr ? 'فلامينجو تالين الوردي 🦩' : "Taleen's Pink Flamingo 🦩"}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-pink-950 dark:text-pink-100">
              {isAr ? 'طائر الفلامينجو الرشيق والجميل' : 'The Graceful & Lovely Flamingo'}
            </h2>

            <p className="text-xs sm:text-sm text-pink-900/80 dark:text-pink-200/80 font-medium leading-relaxed">
              {isAr
                ? 'طائر استوائي لطيف يتميز بريشه الوردي الساحر ووقوفه المتوازن على رجل واحدة بجانب البحيرة!'
                : 'A charming tropical bird known for its rosy pink feathers and balancing gracefully on one leg!'}
            </p>

            <button
              onClick={() =>
                handleSpeak(
                  isAr
                    ? 'مرحباً بكِ في لعبة الفلامينجو الوردي اللطيف!'
                    : 'Welcome to the cute pink flamingo game!'
                )
              }
              className="inline-flex items-center gap-2 bg-white dark:bg-black/30 hover:bg-pink-100 text-pink-700 dark:text-pink-300 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs border border-pink-200 dark:border-pink-900/40 transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>{isAr ? 'ترحيب الفلامينجو الوردي' : 'Hear Flamingo Greeting'}</span>
            </button>
          </div>
        </div>

        {/* MODE 1: FLAMINGO BALANCE & MATH CHALLENGE */}
        {mode === 'balance' && currentBalanceQ && (
          <div className="w-full flex flex-col items-center space-y-5 animate-in fade-in duration-300">
            <div className="w-full bg-pink-50/80 dark:bg-[#1a0716] rounded-2xl p-4 sm:p-5 text-center border-2 border-pink-200 dark:border-pink-900/40 shadow-xs relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-pink-600 dark:text-pink-300">
                  {isAr
                    ? `تحدي التوازن رقم ${balanceIdx + 1} من ${BALANCE_QUESTIONS.length}`
                    : `Balance Challenge ${balanceIdx + 1} of ${BALANCE_QUESTIONS.length}`}
                </span>
                <button
                  onClick={() => handleSpeak(isAr ? currentBalanceQ.questionAr : currentBalanceQ.questionEn)}
                  className="p-1.5 rounded-full bg-white dark:bg-black/40 text-pink-600 dark:text-pink-300 shadow-xs cursor-pointer"
                  title={isAr ? 'استمع للسؤال' : 'Listen'}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-slate-800 dark:text-pink-100 leading-relaxed">
                {isAr ? currentBalanceQ.questionAr : currentBalanceQ.questionEn}
              </h3>

              <div className="text-3xl sm:text-4xl my-2 filter drop-shadow">{currentBalanceQ.visualEmoji}</div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
              {currentBalanceQ.options.map((opt, idx) => {
                const isSelected = selectedOption === opt;
                const isWrong = wrongOption === opt;
                const isCorrect = opt === currentBalanceQ.answer && answeredState === 'correct';

                const displayLabel =
                  currentBalanceQ.id === 5
                    ? opt === 1
                      ? isAr
                        ? 'وردي 🌸'
                        : 'Pink 🌸'
                      : opt === 2
                      ? isAr
                        ? 'أزرق 🔷'
                        : 'Blue 🔷'
                      : opt === 3
                      ? isAr
                        ? 'أسود ⬛'
                        : 'Black ⬛'
                      : isAr
                      ? 'أخضر 🟢'
                      : 'Green 🟢'
                    : opt.toString();

                return (
                  <button
                    key={idx}
                    onClick={() => handleBalanceChoose(opt)}
                    disabled={isProcessing || answeredState === 'correct'}
                    className={`p-4 rounded-2xl border-3 font-black text-lg sm:text-xl transition-all transform duration-200 cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      isCorrect
                        ? 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200 scale-105 shadow-md'
                        : isWrong
                        ? 'bg-rose-500 text-white border-rose-600 ring-4 ring-rose-200 animate-shake'
                        : isSelected
                        ? 'bg-pink-600 text-white border-pink-700'
                        : 'bg-white dark:bg-[#1a0716] border-pink-200 dark:border-pink-900/40 text-slate-800 dark:text-pink-100 hover:border-pink-400 dark:hover:border-pink-500 hover:scale-105 active:scale-95 shadow-xs'
                    }`}
                  >
                    <span>{displayLabel}</span>
                  </button>
                );
              })}
            </div>

            <div
              className={`w-full text-center p-3 rounded-2xl font-bold text-xs sm:text-sm animate-pop-in ${
                answeredState === 'correct'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-pink-50 dark:bg-[#1a0716] border border-pink-200 dark:border-pink-900/40 text-pink-900 dark:text-pink-200'
              }`}
            >
              {balanceMessageText}
            </div>
          </div>
        )}

        {/* MODE 2: PINK WORD BUILDER & SPELLING */}
        {mode === 'words' && currentWordQ && (
          <div className="w-full flex flex-col items-center space-y-5 animate-in fade-in duration-300">
            <div className="w-full bg-purple-50/80 dark:bg-[#1a0716] rounded-2xl p-4 sm:p-5 text-center border-2 border-purple-200 dark:border-purple-900/40 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                  {isAr
                    ? `كلمة ${wordIdx + 1} من ${WORD_QUESTIONS.length}: ${currentWordQ.meaningAr}`
                    : `Word ${wordIdx + 1} of ${WORD_QUESTIONS.length}: ${currentWordQ.meaningEn}`}
                </span>
                <button
                  onClick={() => handleSpeak(isAr ? currentWordQ.wordAr : currentWordQ.wordEn)}
                  className="p-1.5 rounded-full bg-white dark:bg-black/40 text-purple-600 dark:text-purple-300 shadow-xs cursor-pointer"
                  title={isAr ? 'استمع للكلمة' : 'Listen'}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-5xl my-2">{currentWordQ.emoji}</div>

              <div
                className="flex items-center justify-center gap-2 my-3 min-h-[50px]"
                dir={isAr ? 'rtl' : 'ltr'}
              >
                {(isAr ? currentWordQ.wordAr : currentWordQ.wordEn).split('').map((_, i) => (
                  <div
                    key={i}
                    className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-white dark:bg-black/40 border-2 border-purple-300 dark:border-purple-800 flex items-center justify-center text-xl font-black text-purple-900 dark:text-purple-200 shadow-inner"
                  >
                    {builtLetters[i] || ''}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 w-full" dir={isAr ? 'rtl' : 'ltr'}>
              {(isAr ? currentWordQ.scrambledAr : currentWordQ.scrambledEn).map((letter, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLetterClick(letter)}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-black text-xl shadow-md transition-all transform hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
                >
                  {letter}
                </button>
              ))}

              <button
                onClick={handleResetLetters}
                className="p-3 rounded-2xl bg-pink-100 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 hover:bg-pink-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-pink-200 dark:border-pink-900/40"
                title={isAr ? 'إعادة مسح الحروف' : 'Clear letters'}
              >
                <RefreshCw className="w-4 h-4" />
                <span>{isAr ? 'مسح' : 'Clear'}</span>
              </button>
            </div>
          </div>
        )}

        {/* MODE 3: FLAMINGO ACCESSORIES DRESS UP STUDIO */}
        {mode === 'dressup' && (
          <div className="w-full flex flex-col items-center space-y-5 animate-in fade-in duration-300">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-slate-800 dark:text-pink-100 flex items-center justify-center gap-2">
                <Palette className="w-5 h-5 text-pink-500" />
                <span>{isAr ? 'استوديو تزيين الفلامينجو الوردي' : 'Pink Flamingo Dress-Up Studio'}</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-pink-200/80 font-medium">
                {isAr
                  ? 'اضغطي على الاكسسوارات لإضافتها وتزيين طائر الفلامينجو بأجمل إطلالة!'
                  : 'Tap accessories to style your flamingo with sparkles and flowers!'}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
              {ACCESSORIES.map((acc) => {
                const isEquipped = selectedAccessories.includes(acc.id);
                return (
                  <button
                    key={acc.id}
                    onClick={() => handleToggleAccessory(acc)}
                    className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 transition-all cursor-pointer ${
                      isEquipped
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-600 shadow-md scale-102'
                        : 'bg-pink-50/80 dark:bg-[#1a0716] text-slate-700 dark:text-pink-100 border-pink-200 dark:border-pink-900/40 hover:bg-pink-100'
                    }`}
                  >
                    <span className="text-3xl filter drop-shadow">{acc.icon}</span>
                    <span className="text-xs font-black text-start">{isAr ? acc.nameAr : acc.nameEn}</span>
                  </button>
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
              ? '🎉 ألف مبروك يا أميرة! لقد أبدعتِ في لعبة الفلامينجو الوردي وتألقتِ في كل التحديات!'
              : '🎉 Congratulations! You shone brightly in the Pink Flamingo challenge!'
          }
          onRestart={initGame}
          onGoHome={onGoHome}
          stars={score >= 100 ? 3 : score >= 60 ? 2 : 1}
        />
      )}
    </div>
  );
};

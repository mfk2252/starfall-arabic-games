import React, { useState, useEffect, useCallback } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';
import { Sparkles, Volume2, CheckCircle2, Heart, Award, RefreshCw, Palette } from 'lucide-react';
import { ButterflyIcon } from '../common/ButterflyIcon';

// -------------------------------------------------------------
// ADORABLE KAWAII FLAMINGO VECTOR ARTWORK (100% Scalable & Crisp)
// -------------------------------------------------------------
export const CuteFlamingoVector: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg
    viewBox="0 0 200 240"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="رسوم فلامينجو وردي لطيف"
  >
    <defs>
      {/* Pink Body Gradient */}
      <linearGradient id="flamingoBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f472b6" />
        <stop offset="50%" stopColor="#f43f5e" />
        <stop offset="100%" stopColor="#e11d48" />
      </linearGradient>

      {/* Wing Gradient */}
      <linearGradient id="flamingoWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbcfe8" />
        <stop offset="50%" stopColor="#f472b6" />
        <stop offset="100%" stopColor="#be185d" />
      </linearGradient>

      {/* Water Ripple Gradient */}
      <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
        <stop offset="50%" stopColor="#f472b6" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.4" />
      </linearGradient>

      {/* Lily Pad Gradient */}
      <linearGradient id="lilyPadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4ade80" />
        <stop offset="100%" stopColor="#15803d" />
      </linearGradient>
    </defs>

    {/* Water & Lily Pad Base */}
    <ellipse cx="100" cy="218" rx="75" ry="14" fill="url(#waterGrad)" />
    <ellipse cx="100" cy="212" rx="55" ry="10" fill="url(#lilyPadGrad)" />
    
    {/* Lotus Flower */}
    <path d="M135 204 Q140 194 145 204 Q150 194 155 204 Z" fill="#fb7185" />
    <circle cx="145" cy="202" r="3" fill="#fde047" />

    {/* Standing Leg */}
    <line x1="100" y1="140" x2="100" y2="212" stroke="#f43f5e" strokeWidth="5" strokeLinecap="round" />
    
    {/* Bent Leg (One Leg Stance) */}
    <path d="M100 145 L80 170 L100 170" stroke="#f43f5e" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />

    {/* Body Base */}
    <path
      d="M75 110 C60 120 60 145 80 150 C110 155 130 140 135 120 C140 100 115 95 95 100 C80 103 78 107 75 110 Z"
      fill="url(#flamingoBodyGrad)"
    />

    {/* Tail Feathers */}
    <path d="M130 115 C150 110 160 120 155 130 C145 135 135 125 130 115 Z" fill="#be185d" />

    {/* Fluffy Wing Layer */}
    <path
      d="M85 110 C70 120 75 142 95 142 C115 142 125 125 115 112 C105 100 92 102 85 110 Z"
      fill="url(#flamingoWingGrad)"
      stroke="#f472b6"
      strokeWidth="2"
    />
    <path
      d="M90 118 C80 125 85 138 100 138 C110 138 118 128 110 118 Z"
      fill="#fbcfe8"
      opacity="0.85"
    />

    {/* S-Curved Graceful Long Neck */}
    <path
      d="M85 105 C75 80 65 65 80 45 C90 32 105 32 105 45 C105 55 95 70 95 95"
      fill="none"
      stroke="url(#flamingoBodyGrad)"
      strokeWidth="14"
      strokeLinecap="round"
    />

    {/* Head */}
    <circle cx="95" cy="42" r="16" fill="#f472b6" />

    {/* Beak */}
    <path
      d="M95 42 Q115 42 120 52 Q110 62 95 50 Z"
      fill="#fde047"
      stroke="#eab308"
      strokeWidth="1"
    />
    {/* Beak Black Tip */}
    <path d="M110 46 Q120 52 112 58 Z" fill="#1e293b" />

    {/* Kawaii Cute Eye */}
    <circle cx="90" cy="38" r="4.5" fill="#0f172a" />
    <circle cx="88.5" cy="36.5" r="1.8" fill="#ffffff" />
    <circle cx="91.5" cy="39.5" r="0.8" fill="#ffffff" />

    {/* Cute Pink Blush */}
    <ellipse cx="88" cy="45" rx="3.5" ry="2" fill="#f43f5e" opacity="0.6" />

    {/* Sparkle Hearts */}
    <path d="M45 50 Q45 42 50 42 Q55 42 55 50 Q55 58 45 65 Q35 58 35 50 Q35 42 40 42 Q45 42 45 50 Z" fill="#fb7185" transform="scale(0.3) translate(80, 80)" />
    <path d="M45 50 Q45 42 50 42 Q55 42 55 50 Q55 58 45 65 Q35 58 35 50 Q35 42 40 42 Q45 42 45 50 Z" fill="#f472b6" transform="scale(0.25) translate(520, 200)" />
  </svg>
);

interface BalanceQuestion {
  id: number;
  question: string;
  options: number[];
  answer: number;
  explanation: string;
  visualEmoji: string;
}

const BALANCE_QUESTIONS: BalanceQuestion[] = [
  {
    id: 1,
    question: 'كم زهرة لوتس وردية تطفو في بحيرة الفلامينجو؟ 🪷🪷🪷',
    options: [2, 3, 4, 5],
    answer: 3,
    explanation: 'ممتازة! هناك ٣ أزهار لوتس وردية جميلة!',
    visualEmoji: '🪷🪷🪷',
  },
  {
    id: 2,
    question: 'الفلامينجو تناول ٣ جمبريات 🦐 ثم تناول ٢ جمبريتين إضافيتين. كم جمبرية تناول في المجموع؟',
    options: [4, 5, 6, 7],
    answer: 5,
    explanation: 'أحسنتِ يا بطلة! ٣ + ٢ = ٥ جمبريات شهية!',
    visualEmoji: '🦐🦐🦐 + 🦐🦐',
  },
  {
    id: 3,
    question: 'الفلامينجو يستطيع الوقوف على رجل واحدة! إذا كان لديه رجلان ورفع واحدة، كم رجل تبقى على الأرض؟',
    options: [1, 2, 0, 3],
    answer: 1,
    explanation: 'رائعة! ٢ - ١ = رجل واحدة متوازنة ورشيقة!',
    visualEmoji: '🦩',
  },
  {
    id: 4,
    question: 'شاهد الفلامينجو ٤ أسماك ذهبية 🐟 ثم انضمت إليها ٤ أسماك أخرى. كم سمكة أصبحت في البحيرة؟',
    options: [6, 7, 8, 9],
    answer: 8,
    explanation: 'إجابة صحيحة! ٤ + ٤ = ٨ أسماك ملونة!',
    visualEmoji: '🐟🐟🐟🐟 + 🐟🐟🐟🐟',
  },
  {
    id: 5,
    question: 'ما هو اللون المميز والجميل لريش الفلامينجو اللطيف؟',
    options: [1, 2, 3, 4], // Option 1: وردي, Option 2: أزرق, Option 3: أسود, Option 4: أخضر
    answer: 1,
    explanation: 'ممتازة جداً! الفلامينجو يتألق باللون الوردي المبهج!',
    visualEmoji: '💖🦩✨',
  },
];

interface WordQuestion {
  id: number;
  word: string;
  meaning: string;
  scrambledLetters: string[];
  emoji: string;
}

const WORD_QUESTIONS: WordQuestion[] = [
  {
    id: 1,
    word: 'وردي',
    meaning: 'لون ريش الفلامينجو المفضل',
    scrambledLetters: ['ي', 'و', 'د', 'ر'],
    emoji: '🌸',
  },
  {
    id: 2,
    word: 'بحيرة',
    meaning: 'المكان المائي الساحر الذي يعيش فيه الفلامينجو',
    scrambledLetters: ['ة', 'ب', 'ر', 'ح', 'ي'],
    emoji: '💧',
  },
  {
    id: 3,
    word: 'ريش',
    meaning: 'الكساء الملون والأنيق لطائر الفلامينجو',
    scrambledLetters: ['ش', 'ر', 'ي'],
    emoji: '🪶',
  },
  {
    id: 4,
    word: 'جمال',
    meaning: 'صفة الفلامينجو برقبته الطويلة ورشاقته',
    scrambledLetters: ['ل', 'ج', 'ا', 'م'],
    emoji: '✨',
  },
];

type FlamingoMode = 'balance' | 'words' | 'dressup';

interface Accessory {
  id: string;
  name: string;
  icon: string;
  soundPhrase: string;
}

const ACCESSORIES: Accessory[] = [
  { id: 'crown', name: 'تاج الملكة الذهبى', icon: '👑', soundPhrase: 'تاج الملكة الذهبي الرائع!' },
  { id: 'garland', name: 'طوق الزهور الوردي', icon: '🌺', soundPhrase: 'طوق الزهور الوردي المبهج!' },
  { id: 'glasses', name: 'نظارات شمسية برّاقة', icon: '😎', soundPhrase: 'نظارات شمسية أنيقة وجذابة!' },
  { id: 'bow', name: 'فيونكة وردية لطيفة', icon: '🎀', soundPhrase: 'فيونكة وردية في غاية اللطافة!' },
  { id: 'sparkles', name: 'بريق النجوم السحري', icon: '✨', soundPhrase: 'بريق النجوم السحرية المتلألئة!' },
];

export const FlamingoGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const [mode, setMode] = useState<FlamingoMode>('balance');
  const [score, setScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  // Balance mode state
  const [balanceIdx, setBalanceIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [wrongOption, setWrongOption] = useState<number | null>(null);
  const [answeredState, setAnsweredState] = useState<'correct' | 'wrong' | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('ساعدي الفلامينجو الوردي في الحفاظ على توازنه للإجابة على الأسئلة! 🦩');

  // Word mode state
  const [wordIdx, setWordIdx] = useState<number>(0);
  const [builtLetters, setBuiltLetters] = useState<string[]>([]);

  // Dress Up mode state
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>(['garland']);

  const twemojiFlamingoUrl = 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f9a9.svg';
  const twemojiFallbackUrl = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f9a9.svg';

  const initGame = useCallback(() => {
    setBalanceIdx(0);
    setWordIdx(0);
    setScore(0);
    setSelectedOption(null);
    setWrongOption(null);
    setAnsweredState(null);
    setIsProcessing(false);
    setMessage('ساعدي الفلامينجو الوردي في الحفاظ على توازنه للإجابة على الأسئلة! 🦩');
    setIsGameOver(false);
    setBuiltLetters([]);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const currentBalanceQ = BALANCE_QUESTIONS[balanceIdx];
  const currentWordQ = WORD_QUESTIONS[wordIdx];

  const handleSpeak = (text: string) => {
    sound.speakText(text, 'ar');
  };

  // 1. Balance Mode Option Click
  const handleBalanceChoose = (option: number) => {
    if (isProcessing || answeredState === 'correct') return;

    if (option === currentBalanceQ.answer) {
      setSelectedOption(option);
      setAnsweredState('correct');
      setIsProcessing(true);
      sound.playMatch();
      sound.speakText(currentBalanceQ.explanation, 'ar');
      const newScore = score + 20;
      setScore(newScore);
      setMessage(`✅ إجابة رائعة! ${currentBalanceQ.explanation}`);

      setTimeout(() => {
        if (balanceIdx + 1 < BALANCE_QUESTIONS.length) {
          setBalanceIdx((prev) => prev + 1);
          setSelectedOption(null);
          setWrongOption(null);
          setAnsweredState(null);
          setIsProcessing(false);
          setMessage('ساعدي الفلامينجو الوردي في الحفاظ على توازنه للإجابة على الأسئلة! 🦩');
        } else {
          sound.playWin();
          saveGameProgress('flamingo-game', newScore, true);
          setIsGameOver(true);
        }
      }, 1400);
    } else {
      sound.playWrong();
      setWrongOption(option);
      setMessage('❌ أوشك الفلامينجو على الاهتزاز! حاولي مرة أخرى بذكاء!');
      setScore((prev) => Math.max(0, prev - 2));

      setTimeout(() => {
        setWrongOption(null);
      }, 700);
    }
  };

  // 2. Word Builder Letter Click
  const handleLetterClick = (letter: string) => {
    sound.playPop();
    const newBuilt = [...builtLetters, letter];
    setBuiltLetters(newBuilt);

    const targetWord = currentWordQ.word;
    const currentBuiltStr = newBuilt.join('');

    if (currentBuiltStr === targetWord) {
      sound.playMatch();
      sound.speakText(`ممتازة! كلمة ${targetWord}`, 'ar');
      const newScore = score + 25;
      setScore(newScore);
      setMessage(`✨ أحسنتِ! لقد كوّنتِ كلمة (${targetWord}) بنجاح!`);

      setTimeout(() => {
        if (wordIdx + 1 < WORD_QUESTIONS.length) {
          setWordIdx((prev) => prev + 1);
          setBuiltLetters([]);
          setMessage('رتبي الحروف لتكوين الكلمة الوردية التالية:');
        } else {
          sound.playWin();
          saveGameProgress('flamingo-game', newScore, true);
          setIsGameOver(true);
        }
      }, 1400);
    }
  };

  // Reset letter construction
  const handleResetLetters = () => {
    sound.playClick();
    setBuiltLetters([]);
  };

  // 3. Accessory Toggle in Dress Up Studio
  const handleToggleAccessory = (acc: Accessory) => {
    sound.playSparkle();
    sound.speakText(acc.soundPhrase, 'ar');
    setSelectedAccessories((prev) => {
      if (prev.includes(acc.id)) {
        return prev.filter((id) => id !== acc.id);
      } else {
        return [...prev, acc.id];
      }
    });
    setScore((prev) => prev + 5);
  };

  return (
    <div className="flex flex-col items-center w-full px-2 sm:px-4 py-4 min-h-[85vh] animate-in fade-in duration-300">
      <GameHeader
        title="لعبة الفلامينجو الوردي"
        icon="🦩✨"
        score={score}
        onRestart={initGame}
        onGoHome={onGoHome}
        accentGradient="from-[#f472b6] via-[#ec4899] to-[#be185d]"
        badgeText="لعبة ترفيهية وتعليمية للأميرات"
      />

      {/* Main Game Container */}
      <div className="bg-white dark:bg-[#20091b] rounded-3xl p-4 sm:p-7 shadow-xl border border-pink-200 dark:border-[#3d122f] text-slate-800 dark:text-pink-100 max-w-3xl w-full flex flex-col items-center space-y-6">
        
        {/* Mode Selector */}
        <div className="flex flex-wrap justify-center items-center gap-2 bg-pink-50 dark:bg-[#1a0716] p-1.5 rounded-full border border-pink-200 dark:border-pink-900/40 text-xs sm:text-sm font-bold">
          <button
            onClick={() => { sound.playClick(); setMode('balance'); initGame(); }}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
              mode === 'balance'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                : 'text-slate-600 dark:text-pink-200 hover:text-pink-600'
            }`}
          >
            <span>🦩 توازن الأرقام</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setMode('words'); setWordIdx(0); setBuiltLetters([]); }}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
              mode === 'words'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-pink-200 hover:text-purple-600'
            }`}
          >
            <span>📝 كلمات الفلامينجو</span>
          </button>

          <button
            onClick={() => { sound.playClick(); setMode('dressup'); }}
            className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
              mode === 'dressup'
                ? 'bg-gradient-to-r from-amber-400 to-pink-500 text-white shadow-md'
                : 'text-slate-600 dark:text-pink-200 hover:text-amber-600'
            }`}
          >
            <span>👑 تزيين الفلامينجو</span>
          </button>
        </div>

        {/* Hero Flamingo Display Card with High Fidelity Custom Vector Art */}
        <div className="w-full rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100 dark:from-[#2d0e26] dark:via-[#1e0819] dark:to-[#160612] border-2 border-pink-200 dark:border-pink-900/50 flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden shadow-sm">
          
          {/* Flamingo Asset Image Showcase */}
          <div className="relative group shrink-0">
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl bg-white/90 dark:bg-black/40 border-4 border-pink-300 dark:border-pink-800 shadow-md flex items-center justify-center p-2 relative overflow-hidden transition-transform group-hover:scale-105">
              
              {/* Custom Kawaii Vector Artwork */}
              <CuteFlamingoVector className="w-full h-full object-contain filter drop-shadow-md animate-bounce" />

              {/* Accessories Overlay on Flamingo */}
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

          {/* Description & Speech Trigger */}
          <div className="flex-1 text-center sm:text-start space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-white/80 dark:bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-pink-700 dark:text-pink-300">
              <ButterflyIcon className="w-4 h-4 text-pink-500" />
              <span>فلامينجو تالين الوردي 🦩</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-pink-950 dark:text-pink-100">
              طائر الفلامينجو الرشيق والجميل
            </h2>

            <p className="text-xs sm:text-sm text-pink-900/80 dark:text-pink-200/80 font-medium leading-relaxed">
              طائر استوائي لطيف يتميز بريشه الوردي الساحر ووقوفه المتوازن على رجل واحدة بجانب البحيرة!
            </p>

            <button
              onClick={() => handleSpeak('مرحباً بكِ في لعبة الفلامينجو الوردي اللطيف!')}
              className="inline-flex items-center gap-2 bg-white dark:bg-black/30 hover:bg-pink-100 text-pink-700 dark:text-pink-300 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs border border-pink-200 dark:border-pink-900/40 transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>ترحيب الفلامينجو الوردي</span>
            </button>
          </div>
        </div>

        {/* -------------------------------------------------------------
            MODE 1: FLAMINGO BALANCE & MATH CHALLENGE
           ------------------------------------------------------------- */}
        {mode === 'balance' && currentBalanceQ && (
          <div className="w-full flex flex-col items-center space-y-5 animate-in fade-in duration-300">
            
            {/* Question Prompt */}
            <div className="w-full bg-pink-50/80 dark:bg-[#1a0716] rounded-2xl p-4 sm:p-5 text-center border-2 border-pink-200 dark:border-pink-900/40 shadow-xs relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-pink-600 dark:text-pink-300">
                  تحدي التوازن رقم {balanceIdx + 1} من {BALANCE_QUESTIONS.length}
                </span>
                <button
                  onClick={() => handleSpeak(currentBalanceQ.question)}
                  className="p-1.5 rounded-full bg-white dark:bg-black/40 text-pink-600 dark:text-pink-300 shadow-xs cursor-pointer"
                  title="استمع للسؤال"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-slate-800 dark:text-pink-100 leading-relaxed">
                {currentBalanceQ.question}
              </h3>

              <div className="text-3xl sm:text-4xl my-2 filter drop-shadow">
                {currentBalanceQ.visualEmoji}
              </div>
            </div>

            {/* Multiple Choice Options */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
              {currentBalanceQ.options.map((opt, idx) => {
                const isSelected = selectedOption === opt;
                const isWrong = wrongOption === opt;
                const isCorrect = opt === currentBalanceQ.answer && answeredState === 'correct';

                // Specific formatting for color option in Q5
                const displayLabel = currentBalanceQ.id === 5 
                  ? (opt === 1 ? 'وردي 🌸' : opt === 2 ? 'أزرق 🔷' : opt === 3 ? 'أسود ⬛' : 'أخضر 🟢')
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

            {/* Prompt Feedback */}
            <div className={`w-full text-center p-3 rounded-2xl font-bold text-xs sm:text-sm animate-pop-in ${
              answeredState === 'correct'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-pink-50 dark:bg-[#1a0716] border border-pink-200 dark:border-pink-900/40 text-pink-900 dark:text-pink-200'
            }`}>
              {message}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            MODE 2: PINK WORD BUILDER & SPELLING
           ------------------------------------------------------------- */}
        {mode === 'words' && currentWordQ && (
          <div className="w-full flex flex-col items-center space-y-5 animate-in fade-in duration-300">
            <div className="w-full bg-purple-50/80 dark:bg-[#1a0716] rounded-2xl p-4 sm:p-5 text-center border-2 border-purple-200 dark:border-purple-900/40 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                  كلمة {wordIdx + 1} من {WORD_QUESTIONS.length}: {currentWordQ.meaning}
                </span>
                <button
                  onClick={() => handleSpeak(currentWordQ.word)}
                  className="p-1.5 rounded-full bg-white dark:bg-black/40 text-purple-600 dark:text-purple-300 shadow-xs cursor-pointer"
                  title="استمع للكلمة"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-5xl my-2">{currentWordQ.emoji}</div>

              {/* Constructed Word Slots */}
              <div className="flex items-center justify-center gap-2 my-3 min-h-[50px]">
                {currentWordQ.word.split('').map((_, i) => (
                  <div
                    key={i}
                    className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-white dark:bg-black/40 border-2 border-purple-300 dark:border-purple-800 flex items-center justify-center text-xl font-black text-purple-900 dark:text-purple-200 shadow-inner"
                  >
                    {builtLetters[i] || ''}
                  </div>
                ))}
              </div>
            </div>

            {/* Scrambled Letter Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 w-full">
              {currentWordQ.scrambledLetters.map((letter, idx) => (
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
                title="إعادة مسح الحروف"
              >
                <RefreshCw className="w-4 h-4" />
                <span>مسح</span>
              </button>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            MODE 3: FLAMINGO ACCESSORIES DRESS UP STUDIO
           ------------------------------------------------------------- */}
        {mode === 'dressup' && (
          <div className="w-full flex flex-col items-center space-y-5 animate-in fade-in duration-300">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-slate-800 dark:text-pink-100 flex items-center justify-center gap-2">
                <Palette className="w-5 h-5 text-pink-500" />
                <span>استوديو تزيين الفلامينجو الوردي</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-pink-200/80 font-medium">
                اضغطي على الاكسسوارات لإضافتها وتزيين طائر الفلامينجو بأجمل إطلالة!
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
                    <span className="text-xs font-black text-start">{acc.name}</span>
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
          message="🎉 ألف مبروك يا أميرة! لقد أبدعتِ في لعبة الفلامينجو الوردي وتألقتِ في كل التحديات!"
          onRestart={initGame}
          onGoHome={onGoHome}
          stars={score >= 100 ? 3 : score >= 60 ? 2 : 1}
        />
      )}
    </div>
  );
};

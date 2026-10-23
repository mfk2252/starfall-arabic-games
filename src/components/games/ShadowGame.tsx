import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';
import { useLanguage } from '../../i18n/LanguageContext';
import { SHADOW_GAME_DATA, ShadowQuestion } from '../../data/shadowGameData';
import { 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  Trophy, 
  Sparkles, 
  HelpCircle,
  CheckCircle2,
  XCircle,
  Lightbulb
} from 'lucide-react';

type Difficulty = 'easy' | 'medium' | 'advanced' | 'challenge';

interface GameState {
  currentQuestionIndex: number;
  score: number;
  questions: ShadowQuestion[];
  selectedDifficulty: Difficulty | null;
  status: 'menu' | 'playing' | 'round-end';
  userChoice: string | null; // ID of chosen shadow
  isCorrect: boolean | null;
  wrongChoices: string[];
}

// Resilient image component with CDN fallback and emoji fallback
const ImageWithFallback: React.FC<{
  src: string;
  fallbackSrc?: string;
  emoji?: string;
  alt: string;
  className?: string;
  isShadow?: boolean;
}> = ({ src, fallbackSrc, emoji, alt, className, isShadow }) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setHasFailed(false);
  }, [src]);

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setHasFailed(true);
    }
  };

  if (hasFailed && emoji) {
    return (
      <span 
        className={`text-5xl sm:text-7xl select-none transition-transform ${
          isShadow 
            ? 'filter grayscale-[1] brightness-0 opacity-80 contrast-[2]' 
            : 'drop-shadow-md'
        }`}
        role="img" 
        aria-label={alt}
      >
        {emoji}
      </span>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={handleError}
      className={`${className} ${isShadow ? 'filter brightness-0 contrast-125' : ''}`}
      loading="eager"
      decoding="async"
    />
  );
};

export const ShadowGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  const [game, setGame] = useState<GameState>({
    currentQuestionIndex: 0,
    score: 0,
    questions: [],
    selectedDifficulty: null,
    status: 'menu',
    userChoice: null,
    isCorrect: null,
    wrongChoices: [],
  });

  const [showHint, setShowHint] = useState(false);

  // Difficulty configurations
  const DIFFICULTY_CONFIG = {
    easy: { optionsCount: 2, labelAr: 'سهل', labelEn: 'Easy', icon: '👶', color: 'from-emerald-400 to-teal-600' },
    medium: { optionsCount: 3, labelAr: 'متوسط', labelEn: 'Medium', icon: '👦', color: 'from-sky-400 to-blue-600' },
    advanced: { optionsCount: 4, labelAr: 'متقدم', labelEn: 'Advanced', icon: '🧑', color: 'from-amber-400 to-orange-600' },
    challenge: { optionsCount: 5, labelAr: 'تحدي الأبطال', labelEn: 'Hero Challenge', icon: '🏆', color: 'from-purple-500 to-indigo-700' },
  };

  const shuffle = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const startNewGame = (difficulty: Difficulty) => {
    sound.playClick();
    
    // Filter questions by difficulty or just take random ones
    // For children games, it's better to mix but vary options count
    const pool = shuffle(SHADOW_GAME_DATA);
    const roundQuestions = pool.slice(0, 10);

    setGame({
      currentQuestionIndex: 0,
      score: 0,
      questions: roundQuestions,
      selectedDifficulty: difficulty,
      status: 'playing',
      userChoice: null,
      isCorrect: null,
      wrongChoices: [],
    });
    setShowHint(false);

    // Preload round images in background for instant display
    roundQuestions.forEach(q => {
      const img = new Image();
      img.src = q.image;
    });
  };

  const currentQuestion = game.questions[game.currentQuestionIndex];

  const currentOptions = useMemo(() => {
    if (!currentQuestion || !game.selectedDifficulty) return [];

    const optionsCount = DIFFICULTY_CONFIG[game.selectedDifficulty].optionsCount;
    const correctOption = currentQuestion;
    
    // Find distractors from the same category first, then from pool
    let pool = SHADOW_GAME_DATA.filter(q => q.id !== correctOption.id);
    let sameCategoryDistractors = pool.filter(q => q.category === correctOption.category);
    
    let distractors = shuffle(sameCategoryDistractors).slice(0, optionsCount - 1);
    
    // If not enough in same category, fill from pool
    if (distractors.length < optionsCount - 1) {
      const remainingPool = pool.filter(q => !distractors.some(d => d.id === q.id));
      distractors = [...distractors, ...shuffle(remainingPool).slice(0, optionsCount - 1 - distractors.length)];
    }

    return shuffle([correctOption, ...distractors]);
  }, [currentQuestion, game.selectedDifficulty]);

  const handleChoice = (choiceId: string) => {
    if (game.isCorrect || game.wrongChoices.includes(choiceId)) return;

    if (choiceId === currentQuestion.id) {
      sound.playMatch();
      setGame(prev => ({
        ...prev,
        userChoice: choiceId,
        isCorrect: true,
        score: prev.score + (prev.wrongChoices.length === 0 ? 10 : 5)
      }));
      
      // Auto-advance after a short delay
      setTimeout(() => {
        nextQuestion();
      }, 800);
    } else {
      sound.playClick();
      setGame(prev => ({
        ...prev,
        userChoice: choiceId,
        isCorrect: false,
        wrongChoices: [...prev.wrongChoices, choiceId]
      }));
    }
  };

  const nextQuestion = () => {
    sound.playClick();
    if (game.currentQuestionIndex + 1 < game.questions.length) {
      setGame(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        userChoice: null,
        isCorrect: null,
        wrongChoices: [],
      }));
      setShowHint(false);
    } else {
      sound.playWin();
      saveGameProgress('shadow-game', game.score, true);
      setGame(prev => ({ ...prev, status: 'round-end' }));
    }
  };

  const resetQuestion = () => {
    sound.playClick();
    setGame(prev => ({
      ...prev,
      userChoice: null,
      isCorrect: null,
      wrongChoices: [],
    }));
    setShowHint(false);
  };

  // -------------------------------------------------------------
  // 1. MENU VIEW
  // -------------------------------------------------------------
  if (game.status === 'menu') {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center space-y-8 py-4 px-2 animate-in fade-in duration-500">
        <div className="w-full flex items-center justify-between">
          <button
            onClick={() => { sound.playClick(); onGoHome(); }}
            className="flex items-center gap-2 bg-white dark:bg-[#0b1329] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-100 px-4 py-2.5 rounded-full font-bold shadow-sm border border-slate-200 dark:border-slate-800 transition-all"
          >
            <BackIcon className="w-5 h-5 text-indigo-500" />
            <span>{isAr ? 'الرجوع للقائمة' : 'Back to Games'}</span>
          </button>
          <div className="flex items-center gap-2 bg-gradient-to-r from-slate-700 to-slate-900 text-white px-4 py-2 rounded-full font-black text-sm shadow-sm">
            <span>👤</span>
            <span>{isAr ? 'اكتشف الظل' : 'Discover Shadow'}</span>
          </div>
        </div>

        <div className="text-center space-y-3">
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto shadow-inner border-4 border-white dark:border-slate-700">
            <span className="text-6xl filter grayscale">🐼</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white">
            {isAr ? 'لعبة اكتشف الظل' : 'Discover the Shadow'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium max-w-lg mx-auto leading-relaxed">
            {isAr 
              ? 'هل يمكنك معرفة صاحب الظل؟ انظر إلى الصورة الملونة واختر الظل الذي يطابق شكلها تماماً.'
              : 'Can you recognize the owner of the shadow? Look at the colored image and pick the shadow that matches its shape perfectly.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
          {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((level) => {
            const conf = DIFFICULTY_CONFIG[level];
            return (
              <button
                key={level}
                onClick={() => startNewGame(level)}
                className={`p-6 rounded-3xl bg-gradient-to-r ${conf.color} text-white shadow-md hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center gap-4 text-start cursor-pointer group`}
              >
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">
                  {conf.icon}
                </div>
                <div>
                  <h3 className="text-lg font-black">{isAr ? conf.labelAr : conf.labelEn}</h3>
                  <p className="text-xs text-white/90 font-medium mt-0.5">
                    {isAr 
                      ? `مطابقة بين ${conf.optionsCount} خيارات`
                      : `Match between ${conf.optionsCount} options`}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. ROUND END VIEW
  // -------------------------------------------------------------
  if (game.status === 'round-end') {
    return (
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center py-10 px-4 text-center space-y-6">
        <WinCelebration
          score={game.score}
          onRestart={() => startNewGame(game.selectedDifficulty!)}
          onGoHome={() => setGame(prev => ({ ...prev, status: 'menu' }))}
        />
        
        <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800 w-full space-y-6 animate-in zoom-in duration-500">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-600 flex items-center justify-center text-6xl shadow-md animate-bounce">
            🏆
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">
              {isAr ? 'أحسنت يا بطل!' : 'Great job, Hero!'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              {isAr 
                ? `لقد اكتشفت جميع الظلال بنجاح وحصلت على ${game.score} نقطة!`
                : `You successfully discovered all shadows and earned ${game.score} points!`}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => startNewGame(game.selectedDifficulty!)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-md transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isAr ? 'لعب جولة أخرى' : 'Play Again'}</span>
            </button>

            <button
              onClick={() => setGame(prev => ({ ...prev, status: 'menu' }))}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-8 py-3 rounded-2xl font-black text-sm transition-all"
            >
              <BackIcon className="w-4 h-4" />
              <span>{isAr ? 'تغيير المستوى' : 'Change Level'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. PLAYING VIEW
  // -------------------------------------------------------------
  const progressPercent = Math.round(((game.currentQuestionIndex) / game.questions.length) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center py-4 space-y-6 px-2 animate-in fade-in duration-300">
      {/* Top Game Bar */}
      <div className="w-full flex items-center justify-between gap-3 flex-wrap">
        <button
          onClick={() => setGame(prev => ({ ...prev, status: 'menu' }))}
          className="flex items-center gap-2 bg-white dark:bg-[#0b1329] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-100 px-4 py-2 rounded-full font-bold shadow-sm border border-slate-200 dark:border-slate-800 transition-all"
        >
          <BackIcon className="w-4 h-4 text-indigo-500" />
          <span>{isAr ? 'خروج' : 'Exit'}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Progress badge */}
          <div className="flex items-center gap-2 bg-white dark:bg-[#0b1329] text-slate-700 dark:text-slate-100 px-4 py-1.5 rounded-full font-black text-xs sm:text-sm shadow-sm border border-slate-200 dark:border-slate-800">
            <span>{isAr ? 'السؤال' : 'Question'}</span>
            <span className="text-indigo-600 dark:text-indigo-400">{game.currentQuestionIndex + 1}</span>
            <span className="opacity-30">/</span>
            <span>{game.questions.length}</span>
          </div>
          
          {/* Score badge */}
          <div className="flex items-center gap-2 bg-amber-400 text-amber-950 px-4 py-1.5 rounded-full font-black text-xs sm:text-sm shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>{game.score}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden shadow-inner">
        <div 
          className="bg-gradient-to-r from-indigo-500 to-sky-500 h-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Game Area */}
      <div className="w-full bg-white dark:bg-[#0b1329] rounded-3xl p-6 sm:p-10 border border-slate-100 dark:border-slate-800 shadow-lg flex flex-col items-center space-y-8">
        
        {/* Current Item Image */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative group">
            <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-[2rem] bg-slate-50 dark:bg-slate-900/50 border-4 border-white dark:border-slate-800 shadow-xl flex items-center justify-center p-8 transition-transform group-hover:scale-105">
              <ImageWithFallback 
                src={currentQuestion.image} 
                fallbackSrc={currentQuestion.fallbackImage}
                emoji={currentQuestion.emoji}
                alt={isAr ? currentQuestion.nameAr : currentQuestion.nameEn}
                className="w-full h-full object-contain drop-shadow-md animate-in zoom-in duration-300"
              />
            </div>
            
            {/* Success/Error overlays */}
            {game.isCorrect === true && (
              <div className="absolute inset-0 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center animate-in fade-in duration-300">
                <CheckCircle2 className="w-20 h-20 text-emerald-500 drop-shadow-lg" />
              </div>
            )}

            <button 
              onClick={() => setShowHint(!showHint)}
              className="absolute top-2 end-2 w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-lg hover:bg-indigo-600 transition-colors"
              title={isAr ? 'تلميح' : 'Hint'}
            >
              <Lightbulb className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">
              {isAr ? 'أي ظل يطابقني؟' : 'Which shadow matches me?'}
            </h2>
            {showHint && (
              <p className="mt-1 text-sm font-bold text-indigo-600 dark:text-indigo-400 animate-in fade-in slide-in-from-top-2">
                {isAr ? currentQuestion.nameAr : currentQuestion.nameEn}
              </p>
            )}
          </div>
        </div>

        {/* Options (Shadows) */}
        <div className={`grid gap-4 w-full justify-center ${
          game.selectedDifficulty === 'easy' ? 'grid-cols-2 max-w-sm' : 
          game.selectedDifficulty === 'medium' ? 'grid-cols-3 max-w-xl' :
          'grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 max-w-4xl'
        }`}>
          {currentOptions.map((option) => {
            const isSelected = game.userChoice === option.id;
            const isWrong = game.wrongChoices.includes(option.id);
            const isRight = game.isCorrect && option.id === currentQuestion.id;

            return (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                disabled={game.isCorrect === true || isWrong}
                className={`
                  aspect-square rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-4 transition-all transform duration-300 relative
                  flex items-center justify-center overflow-hidden
                  ${isRight ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 scale-105 shadow-lg' : 
                    isWrong ? 'border-rose-300 bg-rose-50 dark:bg-rose-950/20 opacity-50 scale-95' :
                    isSelected && !game.isCorrect ? 'border-slate-400 bg-slate-100 dark:bg-slate-800' :
                    'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 hover:border-indigo-400 dark:hover:border-indigo-600 hover:scale-105 cursor-pointer shadow-sm'}
                `}
              >
                <ImageWithFallback 
                  src={option.image} 
                  fallbackSrc={option.fallbackImage}
                  emoji={option.emoji}
                  alt="Shadow candidate"
                  isShadow={true}
                  className={`w-full h-full object-contain filter brightness-0 transition-opacity ${isWrong ? 'opacity-30' : 'opacity-100'}`}
                />
                
                {isRight && (
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
                  </div>
                )}
                
                {isWrong && (
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                    <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="w-full flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
          <button 
            onClick={resetQuestion}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-bold text-sm transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isAr ? 'إعادة المحاولة' : 'Try Again'}</span>
          </button>

          {game.isCorrect && (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-sm animate-bounce">
              <Sparkles className="w-5 h-5 fill-emerald-500" />
              <span>{isAr ? 'إجابة رائعة! جاري الانتقال...' : 'Great! Moving next...'}</span>
            </div>
          )}

          {!game.isCorrect && (
            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
              <HelpCircle className="w-4 h-4" />
              <span>{isAr ? 'اختر الظل المطابق للصورة' : 'Select the matching shadow'}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { WinCelebration } from '../common/WinCelebration';
import { BackButton } from '../common/BackButton';
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

// Resilient image component with CDN fallback, emoji fallback, and crisp silhouette filters
const ImageWithFallback: React.FC<{
  src: string;
  fallbackSrc?: string;
  emoji?: string;
  alt: string;
  className?: string;
  isShadow?: boolean;
}> = ({ src, fallbackSrc, emoji, alt, className = '', isShadow }) => {
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
        className={`text-4xl sm:text-6xl select-none transition-transform flex items-center justify-center leading-none ${
          isShadow 
            ? 'filter grayscale brightness-0 contrast-200 dark:drop-shadow-[0_0_2px_rgba(255,255,255,0.95)] opacity-90' 
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
      className={`${className} ${
        isShadow 
          ? 'filter brightness-0 contrast-125 drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_0_2px_rgba(255,255,255,0.95)]' 
          : 'drop-shadow-md'
      }`}
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

  // Difficulty configurations with exactly 6 options for Advanced and Challenge modes
  const DIFFICULTY_CONFIG: Record<Difficulty, { optionsCount: number; labelAr: string; labelEn: string; icon: string; color: string }> = {
    easy: { optionsCount: 2, labelAr: 'سهل (خياران)', labelEn: 'Easy (2 Options)', icon: '👶', color: 'from-emerald-400 to-teal-600' },
    medium: { optionsCount: 4, labelAr: 'متوسط (٤ خيارات)', labelEn: 'Medium (4 Options)', icon: '👦', color: 'from-sky-400 to-blue-600' },
    advanced: { optionsCount: 6, labelAr: 'متقدم (٦ خيارات)', labelEn: 'Advanced (6 Options)', icon: '🧑', color: 'from-pink-500 to-rose-600' },
    challenge: { optionsCount: 6, labelAr: 'تحدي الأبطال (٦ خيارات)', labelEn: 'Hero Challenge (6 Options)', icon: '🏆', color: 'from-purple-500 to-indigo-700' },
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

  // Guaranteed distinct options according to difficulty optionsCount (e.g. 6 in advanced)
  const currentOptions = useMemo(() => {
    if (!currentQuestion || !game.selectedDifficulty) return [];

    const optionsCount = DIFFICULTY_CONFIG[game.selectedDifficulty].optionsCount;
    const correctOption = currentQuestion;
    
    // Find distractors from the same category first to make the matching engaging
    const pool = SHADOW_GAME_DATA.filter(q => q.id !== correctOption.id);
    const sameCategoryDistractors = pool.filter(q => q.category === correctOption.category);
    
    let distractors = shuffle(sameCategoryDistractors).slice(0, optionsCount - 1);
    
    // If not enough in same category, fill remaining from global pool
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
      sound.playWrong();
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
          <BackButton onClick={onGoHome} />
          <div className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white px-4 py-2 rounded-full font-black text-sm shadow-sm">
            <span>👤</span>
            <span>{isAr ? 'اكتشف الظل' : 'Discover Shadow'}</span>
          </div>
        </div>

        <div className="text-center space-y-3">
          <div className="w-24 h-24 bg-pink-50 dark:bg-[#20091b] rounded-full flex items-center justify-center mx-auto shadow-inner border-4 border-white dark:border-pink-900/40">
            <span className="text-6xl filter grayscale brightness-0 drop-shadow-md">🐼</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-pink-100">
            {isAr ? 'لعبة الشكل والظل' : 'Shape & Shadow Game'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-pink-200/80 font-medium max-w-lg mx-auto leading-relaxed">
            {isAr 
              ? 'هل يمكنك معرفة صاحب الظل؟ انظر إلى الصورة الملونة بالأعلى واختر الظل الذي يطابق شكلها تماماً.'
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
                      ? `مطابقة بين ${conf.optionsCount} خيارات متطابقة الظلال`
                      : `Match between ${conf.optionsCount} shadow options`}
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
        
        <div className="bg-white dark:bg-[#20091b] rounded-3xl p-8 shadow-xl border border-pink-100 dark:border-pink-900/40 w-full space-y-6 animate-in zoom-in duration-500">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-600 flex items-center justify-center text-6xl shadow-md animate-bounce">
            🏆
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-pink-100">
              {isAr ? 'أحسنت يا بطل!' : 'Great job, Hero!'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-pink-200/80 font-medium leading-relaxed">
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
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-pink-50 hover:bg-pink-100 dark:bg-pink-950/40 text-pink-700 dark:text-pink-200 px-8 py-3 rounded-2xl font-black text-sm transition-all border border-pink-200 dark:border-pink-900/50"
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
          className="flex items-center gap-2 bg-white/95 dark:bg-[#20091b] hover:bg-pink-50 dark:hover:bg-[#2d0e26] text-slate-700 dark:text-pink-100 px-4 py-2 rounded-full font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 border border-pink-200/80 dark:border-[#3d122f] cursor-pointer"
          title={isAr ? 'تغيير المستوى' : 'Change Level'}
        >
          <BackIcon className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          <span>{isAr ? 'تغيير المستوى' : 'Change Level'}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Progress badge */}
          <div className="flex items-center gap-2 bg-white dark:bg-[#20091b] text-slate-700 dark:text-pink-100 px-4 py-1.5 rounded-full font-black text-xs sm:text-sm shadow-sm border border-pink-200/80 dark:border-pink-900/40">
            <span>{isAr ? 'السؤال' : 'Question'}</span>
            <span className="text-pink-600 dark:text-pink-400 font-extrabold">{game.currentQuestionIndex + 1}</span>
            <span className="opacity-30">/</span>
            <span>{game.questions.length}</span>
          </div>
          
          {/* Score badge */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 px-4 py-1.5 rounded-full font-black text-xs sm:text-sm shadow-sm border border-amber-300">
            <Sparkles className="w-4 h-4" />
            <span>{game.score}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-pink-100 dark:bg-pink-950/40 h-2.5 rounded-full overflow-hidden shadow-inner">
        <div 
          className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 h-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Game Area */}
      <div className="w-full bg-white dark:bg-[#20091b] rounded-3xl p-6 sm:p-10 border border-pink-100 dark:border-pink-900/40 shadow-lg flex flex-col items-center space-y-8">
        
        {/* Current Item Colored Image */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative group">
            <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-[2rem] bg-gradient-to-br from-pink-50 to-rose-50/50 dark:from-slate-900/60 dark:to-pink-950/30 border-4 border-pink-100 dark:border-pink-900/50 shadow-xl flex items-center justify-center p-8 transition-transform group-hover:scale-105">
              <ImageWithFallback 
                src={currentQuestion.image} 
                fallbackSrc={currentQuestion.fallbackImage}
                emoji={currentQuestion.emoji}
                alt={isAr ? currentQuestion.nameAr : currentQuestion.nameEn}
                className="w-full h-full object-contain drop-shadow-md animate-in zoom-in duration-300"
              />
            </div>
            
            {/* Success overlay */}
            {game.isCorrect === true && (
              <div className="absolute inset-0 bg-emerald-500/15 rounded-[2rem] flex items-center justify-center animate-in fade-in duration-300">
                <CheckCircle2 className="w-20 h-20 text-emerald-500 drop-shadow-lg" />
              </div>
            )}

            <button 
              onClick={() => setShowHint(!showHint)}
              className="absolute top-2 end-2 w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-lg hover:bg-pink-600 transition-colors"
              title={isAr ? 'تلميح' : 'Hint'}
            >
              <Lightbulb className="w-5 h-5 text-amber-300" />
            </button>
          </div>

          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-pink-100">
              {isAr ? 'أي ظل يطابقني؟' : 'Which shadow matches me?'}
            </h2>
            {showHint && (
              <p className="mt-1 text-sm font-bold text-pink-600 dark:text-pink-300 animate-in fade-in slide-in-from-top-2">
                {isAr ? currentQuestion.nameAr : currentQuestion.nameEn}
              </p>
            )}
          </div>
        </div>

        {/* Shadow Options Grid: Exactly 6 options in Advanced mode */}
        <div className={`grid gap-3 sm:gap-4 w-full justify-center ${
          game.selectedDifficulty === 'easy' 
            ? 'grid-cols-2 max-w-sm' 
            : game.selectedDifficulty === 'medium' 
            ? 'grid-cols-2 sm:grid-cols-4 max-w-2xl' 
            : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 max-w-5xl'
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
                  aspect-square rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 border-3 sm:border-4 transition-all transform duration-200 relative
                  flex items-center justify-center overflow-hidden group
                  ${isRight 
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 scale-105 shadow-lg shadow-emerald-500/20' 
                    : isWrong 
                    ? 'border-rose-400 bg-rose-50 dark:bg-rose-950/30 opacity-40 scale-95' 
                    : isSelected && !game.isCorrect 
                    ? 'border-slate-400 bg-slate-100 dark:bg-slate-800' 
                    : 'border-pink-100/90 dark:border-pink-900/40 bg-white dark:bg-[#1a0716] hover:border-pink-400 dark:hover:border-pink-500 hover:scale-105 active:scale-95 cursor-pointer shadow-xs hover:shadow-md'}
                `}
                aria-label={isAr ? `خيار ظل ${option.nameAr}` : `Shadow option ${option.nameEn}`}
              >
                {/* Dedicated Inner Spotlight Pedestal for 100% Crisp Contrast */}
                <div className="w-full h-full rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-100/80 to-slate-200/60 dark:from-white/10 dark:to-white/5 flex items-center justify-center p-2.5 sm:p-3.5 transition-colors">
                  <ImageWithFallback 
                    src={option.image} 
                    fallbackSrc={option.fallbackImage}
                    emoji={option.emoji}
                    alt={isAr ? `ظل ${option.nameAr}` : `Shadow of ${option.nameEn}`}
                    isShadow={true}
                    className={`w-full h-full object-contain transition-transform duration-200 group-hover:scale-110 ${isWrong ? 'opacity-30' : 'opacity-100'}`}
                  />
                </div>
                
                {isRight && (
                  <div className="absolute top-2 end-2 bg-white dark:bg-emerald-900 rounded-full shadow-md p-0.5">
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
                  </div>
                )}
                
                {isWrong && (
                  <div className="absolute top-2 end-2 bg-white dark:bg-rose-900 rounded-full shadow-md p-0.5">
                    <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="w-full flex items-center justify-between pt-4 border-t border-pink-50 dark:border-pink-900/40">
          <button 
            onClick={resetQuestion}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-pink-200/70 dark:hover:text-pink-100 font-bold text-sm transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-amber-500" />
            <span>{isAr ? 'إعادة المحاولة' : 'Retry'}</span>
          </button>

          <span className="text-xs font-bold text-slate-400 dark:text-pink-300/60">
            {isAr ? 'المستوى: ' + DIFFICULTY_CONFIG[game.selectedDifficulty!].labelAr : 'Difficulty: ' + DIFFICULTY_CONFIG[game.selectedDifficulty!].labelEn}
          </span>
        </div>

      </div>
    </div>
  );
};

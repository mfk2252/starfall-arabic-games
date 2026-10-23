import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';
import { useLanguage } from '../../i18n/LanguageContext';
import { LISTEN_CHOOSE_DATA, ListenChooseQuestion, ListenChooseType } from '../../data/listenChooseData';
import { 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  Volume2, 
  Sparkles, 
  HelpCircle,
  CheckCircle2,
  XCircle,
  Play
} from 'lucide-react';

type Difficulty = 'easy' | 'medium' | 'advanced' | 'challenge';

interface GameState {
  currentQuestionIndex: number;
  score: number;
  questions: ListenChooseQuestion[];
  selectedDifficulty: Difficulty | null;
  selectedMode: ListenChooseType | null;
  status: 'menu' | 'playing' | 'round-end';
  userChoice: string | null;
  isCorrect: boolean | null;
  wrongChoices: string[];
}

export const ListenChooseGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  const [game, setGame] = useState<GameState>({
    currentQuestionIndex: 0,
    score: 0,
    questions: [],
    selectedDifficulty: null,
    selectedMode: null,
    status: 'menu',
    userChoice: null,
    isCorrect: null,
    wrongChoices: [],
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const DIFFICULTY_CONFIG = {
    easy: { optionsCount: 2, labelAr: 'سهل', labelEn: 'Easy', color: 'from-emerald-400 to-teal-600' },
    medium: { optionsCount: 3, labelAr: 'متوسط', labelEn: 'Medium', color: 'from-sky-400 to-blue-600' },
    advanced: { optionsCount: 4, labelAr: 'متقدم', labelEn: 'Advanced', color: 'from-amber-400 to-orange-600' },
    challenge: { optionsCount: 5, labelAr: 'تحدي الأبطال', labelEn: 'Hero Challenge', color: 'from-purple-500 to-indigo-700' },
  };

  const shuffle = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const playQuestionAudio = useCallback((question: ListenChooseQuestion) => {
    if (!question) return;

    // Cleanup previous
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (question.type === 'sound' && question.audioUrl) {
      const audio = new Audio(question.audioUrl);
      audioRef.current = audio;
      audio.play().catch(err => console.error("Audio play failed:", err));
    } else {
      // Words mode or fallback: use SpeechSynthesis
      const utterance = new SpeechSynthesisUtterance(isAr ? question.nameAr : question.nameEn);
      utterance.lang = isAr ? 'ar-SA' : 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }, [isAr]);

  const startNewGame = (mode: ListenChooseType, difficulty: Difficulty) => {
    sound.playClick();
    
    const filtered = LISTEN_CHOOSE_DATA.filter(q => q.type === mode);
    const roundQuestions = shuffle(filtered).slice(0, 10);

    setGame({
      currentQuestionIndex: 0,
      score: 0,
      questions: roundQuestions,
      selectedDifficulty: difficulty,
      selectedMode: mode,
      status: 'playing',
      userChoice: null,
      isCorrect: null,
      wrongChoices: [],
    });

    // Play first sound after state update
    setTimeout(() => playQuestionAudio(roundQuestions[0]), 500);
  };

  const currentQuestion = game.questions[game.currentQuestionIndex];

  const currentOptions = useMemo(() => {
    if (!currentQuestion || !game.selectedDifficulty) return [];

    const optionsCount = DIFFICULTY_CONFIG[game.selectedDifficulty].optionsCount;
    const correctOption = currentQuestion;
    
    let pool = LISTEN_CHOOSE_DATA.filter(q => q.id !== correctOption.id && q.type === game.selectedMode);
    
    // Mix from same category if possible
    let sameCat = pool.filter(q => q.category === correctOption.category);
    let distractors = shuffle(sameCat).slice(0, optionsCount - 1);
    
    if (distractors.length < optionsCount - 1) {
      const others = pool.filter(q => !distractors.find(d => d.id === q.id));
      distractors = [...distractors, ...shuffle(others).slice(0, optionsCount - 1 - distractors.length)];
    }

    return shuffle([correctOption, ...distractors]);
  }, [currentQuestion, game.selectedDifficulty, game.selectedMode]);

  const nextQuestion = useCallback(() => {
    if (game.currentQuestionIndex + 1 < game.questions.length) {
      const nextIdx = game.currentQuestionIndex + 1;
      setGame(prev => ({
        ...prev,
        currentQuestionIndex: nextIdx,
        userChoice: null,
        isCorrect: null,
        wrongChoices: [],
      }));
      playQuestionAudio(game.questions[nextIdx]);
    } else {
      sound.playWin();
      saveGameProgress('listen-choose', game.score, true);
      setGame(prev => ({ ...prev, status: 'round-end' }));
    }
  }, [game.currentQuestionIndex, game.questions, game.score, playQuestionAudio]);

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

      // Auto transition after 1.5s
      transitionTimerRef.current = setTimeout(() => {
        nextQuestion();
      }, 1500);
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

  const handleRepeatAudio = () => {
    sound.playClick();
    playQuestionAudio(currentQuestion);
  };

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  // -------------------------------------------------------------
  // 1. MENU VIEW
  // -------------------------------------------------------------
  if (game.status === 'menu') {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center space-y-8 py-4 px-2 animate-in fade-in duration-500">
        <div className="w-full flex items-center justify-between">
          <button
            onClick={() => { sound.playClick(); onGoHome(); }}
            className="flex items-center gap-2 bg-white dark:bg-[#0b1329] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-100 px-4 py-2.5 rounded-full font-bold shadow-sm border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
          >
            <BackIcon className="w-5 h-5 text-violet-500" />
            <span>{isAr ? 'الرجوع للقائمة' : 'Back to Games'}</span>
          </button>
          <div className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-2 rounded-full font-black text-sm shadow-sm">
            <span>👂</span>
            <span>{isAr ? 'اسمع واختر' : 'Listen & Choose'}</span>
          </div>
        </div>

        <div className="text-center space-y-3">
          <div className="w-24 h-24 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto shadow-inner border-4 border-white dark:border-violet-800">
            <Volume2 className="w-12 h-12 text-violet-600 animate-pulse" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white">
            {isAr ? 'لعبة اسمع واختر' : 'Listen & Choose Game'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium max-w-lg mx-auto leading-relaxed">
            {isAr 
              ? 'استمع جيداً للصوت أو الكلمة ثم اختر الصورة الصحيحة من بين الخيارات المتاحة.'
              : 'Listen carefully to the sound or word, then pick the correct image from the choices.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
          {/* Sounds Mode */}
          <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center space-y-4">
            <h2 className="text-xl font-black text-violet-600">{isAr ? '١. اسمع الصوت' : '1. Listen to Sound'}</h2>
            <p className="text-xs text-slate-500 text-center">{isAr ? 'تعرف على أصوات الحيوانات والمركبات' : 'Identify animal and vehicle sounds'}</p>
            <div className="grid grid-cols-2 gap-3 w-full">
              {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map(level => (
                <button
                  key={level}
                  onClick={() => startNewGame('sound', level)}
                  className={`p-3 rounded-2xl bg-gradient-to-r ${DIFFICULTY_CONFIG[level].color} text-white font-bold text-sm shadow-sm hover:scale-105 transition-all cursor-pointer`}
                >
                  {isAr ? DIFFICULTY_CONFIG[level].labelAr : DIFFICULTY_CONFIG[level].labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Words Mode */}
          <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center space-y-4">
            <h2 className="text-xl font-black text-indigo-600">{isAr ? '٢. اسمع الكلمة' : '2. Listen to Word'}</h2>
            <p className="text-xs text-slate-500 text-center">{isAr ? 'تعرف على الكلمات العربية المنطوقة' : 'Identify spoken Arabic words'}</p>
            <div className="grid grid-cols-2 gap-3 w-full">
              {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map(level => (
                <button
                  key={level}
                  onClick={() => startNewGame('word', level)}
                  className={`p-3 rounded-2xl bg-gradient-to-r ${DIFFICULTY_CONFIG[level].color} text-white font-bold text-sm shadow-sm hover:scale-105 transition-all cursor-pointer`}
                >
                  {isAr ? DIFFICULTY_CONFIG[level].labelAr : DIFFICULTY_CONFIG[level].labelEn}
                </button>
              ))}
            </div>
          </div>
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
          onRestart={() => startNewGame(game.selectedMode!, game.selectedDifficulty!)}
          onGoHome={() => setGame(prev => ({ ...prev, status: 'menu' }))}
        />
        <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800 w-full space-y-6 animate-in zoom-in duration-500">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-violet-400 to-indigo-600 flex items-center justify-center text-6xl shadow-md">
            🏆
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">
              {isAr ? 'أحسنت يا بطل السمع!' : 'Great job, Auditory Hero!'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              {isAr 
                ? `لقد أكملت جميع الأسئلة بنجاح وحصلت على ${game.score} نقطة!`
                : `You successfully completed all questions and earned ${game.score} points!`}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => startNewGame(game.selectedMode!, game.selectedDifficulty!)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-md hover:scale-105 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isAr ? 'لعب جولة أخرى' : 'Play Again'}</span>
            </button>
            <button
              onClick={() => setGame(prev => ({ ...prev, status: 'menu' }))}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-8 py-3 rounded-2xl font-black text-sm transition-all"
            >
              <BackIcon className="w-4 h-4" />
              <span>{isAr ? 'تغيير النمط' : 'Change Mode'}</span>
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
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center py-4 space-y-6 px-2">
      {/* Top Bar */}
      <div className="w-full flex items-center justify-between gap-3 flex-wrap">
        <button
          onClick={() => setGame(prev => ({ ...prev, status: 'menu' }))}
          className="flex items-center gap-2 bg-white dark:bg-[#0b1329] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-100 px-4 py-2 rounded-full font-bold shadow-sm border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
        >
          <BackIcon className="w-4 h-4 text-violet-500" />
          <span>{isAr ? 'خروج' : 'Exit'}</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white dark:bg-[#0b1329] text-slate-700 dark:text-slate-100 px-4 py-1.5 rounded-full font-black text-xs sm:text-sm shadow-sm border border-slate-200 dark:border-slate-800">
            <span>{isAr ? 'سؤال' : 'Q'}</span>
            <span className="text-violet-600 dark:text-violet-400">{game.currentQuestionIndex + 1}</span>
            <span className="opacity-30">/</span>
            <span>{game.questions.length}</span>
          </div>
          <div className="flex items-center gap-2 bg-amber-400 text-amber-950 px-4 py-1.5 rounded-full font-black text-xs sm:text-sm shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>{game.score}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden shadow-inner">
        <div 
          className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Area */}
      <div className="w-full bg-white dark:bg-[#0b1329] rounded-3xl p-6 sm:p-10 border border-slate-100 dark:border-slate-800 shadow-lg flex flex-col items-center space-y-8">
        
        {/* Big Play Button */}
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={handleRepeatAudio}
            disabled={game.isCorrect === true}
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-150 transition-transform duration-700 rounded-full opacity-0 group-hover:opacity-100" />
            <Volume2 className="w-16 h-16 sm:w-20 sm:h-20 animate-pulse relative z-10" />
          </button>
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">
              {isAr ? 'استمع جيداً للصوت...' : 'Listen carefully to the sound...'}
            </h2>
            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest">{isAr ? 'اضغط للسماع مرة أخرى' : 'Tap to hear again'}</p>
          </div>
        </div>

        {/* Success/Transition Message */}
        {game.isCorrect && (
          <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-black text-lg animate-bounce">
            <Sparkles className="w-6 h-6 fill-emerald-500" />
            <span>{isAr ? 'إجابة صحيحة! أحسنت 🌟' : 'Correct! Great job 🌟'}</span>
          </div>
        )}

        {/* Images Grid */}
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
                  aspect-square rounded-3xl p-4 sm:p-6 border-4 transition-all transform duration-300 relative
                  flex items-center justify-center overflow-hidden
                  ${isRight ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 scale-105 shadow-lg' : 
                    isWrong ? 'border-rose-300 bg-rose-50 dark:bg-rose-950/10 opacity-40 scale-95' :
                    'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 hover:border-violet-400 dark:hover:border-violet-600 hover:scale-105 cursor-pointer shadow-sm'}
                `}
              >
                <img 
                  src={option.imageUrl} 
                  alt="Choice candidate"
                  className="w-full h-full object-contain drop-shadow-md"
                />
                
                {isRight && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  </div>
                )}
                
                {isWrong && (
                  <div className="absolute top-2 right-2">
                    <XCircle className="w-6 h-6 text-rose-500" />
                  </div>
                )}

                {/* Show label only after correct choice */}
                {isRight && (
                  <div className="absolute bottom-2 inset-x-0 text-center">
                    <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      {isAr ? option.nameAr : option.nameEn}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        {!game.isCorrect && (
          <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
            <HelpCircle className="w-4 h-4" />
            <span>{isAr ? 'اختر الصورة التي تطابق الصوت الذي تسمعه' : 'Pick the image that matches the sound'}</span>
          </div>
        )}
      </div>
    </div>
  );
};

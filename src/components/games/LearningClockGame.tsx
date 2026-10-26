import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';
import { useLanguage } from '../../i18n/LanguageContext';
import { 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  Clock, 
  Sparkles, 
  HelpCircle,
  Trophy,
  CheckCircle2,
  Play
} from 'lucide-react';

type GameMode = 'explore' | 'quiz-analog' | 'quiz-digital';
type Difficulty = 'easy' | 'medium' | 'advanced';

interface GameState {
  hour: number;
  minute: number;
  targetHour: number;
  targetMinute: number;
  score: number;
  round: number;
  status: 'menu' | 'playing' | 'feedback' | 'win';
  currentMode: GameMode | null;
  difficulty: Difficulty;
  isCorrect: boolean | null;
}

export const LearningClockGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  const [gameState, setGameState] = useState<GameState>({
    hour: 12,
    minute: 0,
    targetHour: 12,
    targetMinute: 0,
    score: 0,
    round: 1,
    status: 'menu',
    currentMode: null,
    difficulty: 'easy',
    isCorrect: null,
  });

  const clockRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState<'hour' | 'minute' | null>(null);

  // Helper to format Arabic numbers
  const toArNum = (n: number | string) => {
    if (!isAr) return n.toString();
    const arNums = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return n.toString().replace(/\d/g, d => arNums[parseInt(d)]);
  };

  const formatTime = (h: number, m: number) => {
    const hh = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const mm = m.toString().padStart(2, '0');
    return `${toArNum(hh)}:${toArNum(mm)}`;
  };

  const generateNewTarget = useCallback((diff: Difficulty) => {
    let h = Math.floor(Math.random() * 12) + 1;
    let m = 0;

    if (diff === 'easy') {
      m = 0; // Full hours
    } else if (diff === 'medium') {
      m = Math.random() > 0.5 ? 0 : 30; // Half hours
    } else if (diff === 'advanced') {
      const options = [0, 15, 30, 45]; // Quarter hours
      m = options[Math.floor(Math.random() * options.length)];
    }

    return { h, m };
  }, []);

  const startMode = (mode: GameMode, diff: Difficulty) => {
    sound.playClick();
    const target = generateNewTarget(diff);
    setGameState({
      hour: 12,
      minute: 0,
      targetHour: target.h,
      targetMinute: target.m,
      score: 0,
      round: 1,
      status: 'playing',
      currentMode: mode,
      difficulty: diff,
      isCorrect: null,
    });
  };

  const handleHandMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !clockRef.current) return;

    const rect = clockRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI) + 90;
    const normalizedAngle = (angle + 360) % 360;

    if (isDragging === 'minute') {
      // Snap to 5 mins for easier interaction for kids, but 1 min precision in advanced?
      // Let's keep it 5 mins for now as it's for 4-5 year olds
      const m = Math.round(normalizedAngle / 6) % 60;
      const snappedM = Math.round(m / 5) * 5 % 60;
      setGameState(prev => ({ ...prev, minute: snappedM }));
    } else if (isDragging === 'hour') {
      let h = Math.round(normalizedAngle / 30);
      if (h === 0) h = 12;
      if (h > 12) h = 12;
      setGameState(prev => ({ ...prev, hour: h }));
    }
  }, [isDragging]);

  const checkAnswer = () => {
    const { hour, minute, targetHour, targetMinute } = gameState;
    
    const isHourMatch = hour === targetHour;
    // For kids, if they are within 2 mins, it's correct
    const isMinuteMatch = Math.abs(minute - targetMinute) <= 2 || (targetMinute === 0 && minute >= 58);

    if (isHourMatch && isMinuteMatch) {
      sound.playMatch();
      setGameState(prev => ({ ...prev, isCorrect: true, score: prev.score + 10 }));
      
      setTimeout(() => {
        if (gameState.round >= 5) {
          setGameState(prev => ({ ...prev, status: 'win' }));
          saveGameProgress('learning-clock', gameState.score + 10, true);
        } else {
          const nextTarget = generateNewTarget(gameState.difficulty);
          setGameState(prev => ({
            ...prev,
            round: prev.round + 1,
            targetHour: nextTarget.h,
            targetMinute: nextTarget.m,
            hour: 12,
            minute: 0,
            isCorrect: null
          }));
        }
      }, 1500);
    } else {
      sound.playWrong();
      setGameState(prev => ({ ...prev, isCorrect: false }));
      setTimeout(() => setGameState(prev => ({ ...prev, isCorrect: null })), 1000);
    }
  };

  const handleChoiceDigital = (h: number, m: number) => {
    if (gameState.isCorrect !== null) return;
    
    if (h === gameState.targetHour && m === gameState.targetMinute) {
      sound.playMatch();
      setGameState(prev => ({ ...prev, isCorrect: true, score: prev.score + 10 }));
      
      setTimeout(() => {
        if (gameState.round >= 5) {
          setGameState(prev => ({ ...prev, status: 'win' }));
          saveGameProgress('learning-clock', gameState.score + 10, true);
        } else {
          const nextTarget = generateNewTarget(gameState.difficulty);
          setGameState(prev => ({
            ...prev,
            round: prev.round + 1,
            targetHour: nextTarget.h,
            targetMinute: nextTarget.m,
            isCorrect: null
          }));
        }
      }, 1500);
    } else {
      sound.playWrong();
      setGameState(prev => ({ ...prev, isCorrect: false }));
      setTimeout(() => setGameState(prev => ({ ...prev, isCorrect: null })), 1000);
    }
  };

  // Generate options for digital quiz
  const digitalOptions = useMemo(() => {
    if (gameState.currentMode !== 'quiz-digital') return [];
    const correct = { h: gameState.targetHour, m: gameState.targetMinute };
    const options = [correct];
    
    while (options.length < 3) {
      const h = Math.floor(Math.random() * 12) + 1;
      let m = 0;
      if (gameState.difficulty === 'medium') m = [0, 30][Math.floor(Math.random() * 2)];
      else if (gameState.difficulty === 'advanced') m = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
      
      if (!options.find(o => o.h === h && o.m === m)) {
        options.push({ h, m });
      }
    }
    return options.sort(() => Math.random() - 0.5);
  }, [gameState.targetHour, gameState.targetMinute, gameState.currentMode, gameState.difficulty]);

  useEffect(() => {
    const handleUp = () => setIsDragging(null);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
    };
  }, []);

  // --------------------------------------------------------------------------
  // RENDER HELPERS
  // --------------------------------------------------------------------------

  const renderClock = (h: number, m: number, interactive = false) => {
    const hourAngle = (h % 12) * 30 + m * 0.5;
    const minuteAngle = m * 6;

    return (
      <svg 
        ref={clockRef}
        viewBox="0 0 200 200" 
        className="w-64 h-64 sm:w-80 sm:h-80 drop-shadow-2xl"
        onMouseMove={interactive ? handleHandMove : undefined}
        onTouchMove={interactive ? handleHandMove : undefined}
      >
        {/* Outer Ring */}
        <circle cx="100" cy="100" r="95" className="fill-white stroke-slate-200" strokeWidth="8" />
        <circle cx="100" cy="100" r="85" className="fill-white stroke-sky-100" strokeWidth="2" />
        
        {/* Numbers */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => {
          const angle = (num * 30 - 90) * (Math.PI / 180);
          const x = 100 + 70 * Math.cos(angle);
          const y = 100 + 70 * Math.sin(angle);
          return (
            <text 
              key={num} 
              x={x} 
              y={y + 5} 
              textAnchor="middle" 
              className="fill-slate-700 font-black text-lg select-none"
            >
              {toArNum(num)}
            </text>
          );
        })}

        {/* Ticks */}
        {Array.from({ length: 60 }).map((_, i) => {
          const angle = (i * 6 - 90) * (Math.PI / 180);
          const length = i % 5 === 0 ? 8 : 4;
          const x1 = 100 + (85 - length) * Math.cos(angle);
          const y1 = 100 + (85 - length) * Math.sin(angle);
          const x2 = 100 + 85 * Math.cos(angle);
          const y2 = 100 + 85 * Math.sin(angle);
          return (
            <line 
              key={i} 
              x1={x1} y1={y1} x2={x2} y2={y2} 
              className={i % 5 === 0 ? "stroke-slate-400" : "stroke-slate-200"} 
              strokeWidth={i % 5 === 0 ? 2 : 1} 
            />
          );
        })}

        {/* Hands */}
        {/* Hour Hand */}
        <g 
          transform={`rotate(${hourAngle}, 100, 100)`}
          onMouseDown={interactive ? () => setIsDragging('hour') : undefined}
          onTouchStart={interactive ? () => setIsDragging('hour') : undefined}
          className={interactive ? "cursor-pointer group" : ""}
        >
          <line x1="100" y1="100" x2="100" y2="55" className="stroke-slate-800" strokeWidth="6" strokeLinecap="round" />
          {interactive && <circle cx="100" cy="55" r="8" className="fill-slate-800 opacity-0 group-hover:opacity-20 transition-opacity" />}
        </g>

        {/* Minute Hand */}
        <g 
          transform={`rotate(${minuteAngle}, 100, 100)`}
          onMouseDown={interactive ? () => setIsDragging('minute') : undefined}
          onTouchStart={interactive ? () => setIsDragging('minute') : undefined}
          className={interactive ? "cursor-pointer group" : ""}
        >
          <line x1="100" y1="100" x2="100" y2="35" className="stroke-sky-500" strokeWidth="4" strokeLinecap="round" />
          {interactive && <circle cx="100" cy="35" r="8" className="fill-sky-500 opacity-0 group-hover:opacity-20 transition-opacity" />}
        </g>

        {/* Center pin */}
        <circle cx="100" cy="100" r="5" className="fill-slate-800" />
      </svg>
    );
  };

  // --------------------------------------------------------------------------
  // VIEWS
  // --------------------------------------------------------------------------

  if (gameState.status === 'menu') {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center space-y-8 py-6 px-4 animate-in fade-in duration-500">
        <div className="w-full flex items-center justify-between">
          <button
            onClick={() => { sound.playClick(); onGoHome(); }}
            className="flex items-center gap-2 bg-white dark:bg-[#20091b] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-100 px-4 py-2.5 rounded-full font-bold shadow-sm border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
          >
            <BackIcon className="w-5 h-5 text-rose-500" />
            <span>{isAr ? 'الرجوع للقائمة' : 'Back to Games'}</span>
          </button>
          <div className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 text-white px-4 py-2 rounded-full font-black text-sm shadow-sm">
            <span>⏰</span>
            <span>{isAr ? 'تعلم الساعة' : 'Learning Clock'}</span>
          </div>
        </div>

        <div className="text-center space-y-3">
          <div className="w-24 h-24 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto shadow-inner border-4 border-white dark:border-rose-800">
            <Clock className="w-12 h-12 text-rose-600 animate-pulse" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white">
            {isAr ? 'مغامرة الوقت الممتعة' : 'Fun Time Adventure'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium max-w-lg mx-auto leading-relaxed">
            {isAr 
              ? 'هيا نتعلم كيف نقرأ الساعة العقارب والساعة الرقمية بذكاء!'
              : 'Let\'s learn how to read analog and digital clocks together!'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {/* Explore Mode */}
          <div className="bg-white dark:bg-[#20091b] rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center space-y-4 hover:shadow-md transition-shadow">
            <div className="text-4xl">🔍</div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white">{isAr ? 'استكشف الساعة' : 'Explore Clock'}</h2>
            <p className="text-xs text-slate-500 text-center">{isAr ? 'حرك العقارب وشاهد الوقت يتغير' : 'Move hands and watch time change'}</p>
            <button
              onClick={() => startMode('explore', 'easy')}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-400 to-blue-600 text-white font-bold text-sm shadow-sm hover:scale-105 transition-all cursor-pointer"
            >
              {isAr ? 'بدء الاستكشاف' : 'Start Exploring'}
            </button>
          </div>

          {/* Quiz Mode: Analog to Digital */}
          <div className="bg-white dark:bg-[#20091b] rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center space-y-4 hover:shadow-md transition-shadow">
            <div className="text-4xl">🧩</div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white">{isAr ? 'تحدي العقارب' : 'Analog Challenge'}</h2>
            <p className="text-xs text-slate-500 text-center">{isAr ? 'اضبط الساعة لتطابق الوقت المطلوب' : 'Set the clock to match the time'}</p>
            <div className="flex flex-col gap-2 w-full">
              <button
                onClick={() => startMode('quiz-analog', 'easy')}
                className="py-2 rounded-xl bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600 transition-colors cursor-pointer"
              >
                {isAr ? 'سهل (ساعات كاملة)' : 'Easy (Full Hours)'}
              </button>
              <button
                onClick={() => startMode('quiz-analog', 'medium')}
                className="py-2 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition-colors cursor-pointer"
              >
                {isAr ? 'متوسط (نصف ساعة)' : 'Medium (Half Hours)'}
              </button>
            </div>
          </div>

          {/* Quiz Mode: Digital to Analog */}
          <div className="bg-white dark:bg-[#20091b] rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center space-y-4 hover:shadow-md transition-shadow">
            <div className="text-4xl">🤔</div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white">{isAr ? 'تحدي القراءة' : 'Reading Challenge'}</h2>
            <p className="text-xs text-slate-500 text-center">{isAr ? 'ما هو الوقت الظاهر على الساعة؟' : 'What time is shown on the clock?'}</p>
            <div className="flex flex-col gap-2 w-full">
              <button
                onClick={() => startMode('quiz-digital', 'easy')}
                className="py-2 rounded-xl bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600 transition-colors cursor-pointer"
              >
                {isAr ? 'سهل' : 'Easy'}
              </button>
              <button
                onClick={() => startMode('quiz-digital', 'medium')}
                className="py-2 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition-colors cursor-pointer"
              >
                {isAr ? 'متوسط' : 'Medium'}
              </button>
              <button
                onClick={() => startMode('quiz-digital', 'advanced')}
                className="py-2 rounded-xl bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 transition-colors cursor-pointer"
              >
                {isAr ? 'متقدم' : 'Advanced'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState.status === 'win') {
    return (
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center py-10 px-4 text-center">
        <WinCelebration 
          score={gameState.score} 
          onRestart={() => setGameState(prev => ({ ...prev, status: 'menu' }))}
          onGoHome={onGoHome}
        />
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // GAMEPLAY VIEW
  // --------------------------------------------------------------------------

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center py-4 space-y-6 px-4" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="w-full flex items-center justify-between gap-4">
        <button
          onClick={() => setGameState(prev => ({ ...prev, status: 'menu' }))}
          className="flex items-center gap-2 bg-white dark:bg-[#20091b] text-slate-700 dark:text-slate-100 px-4 py-2 rounded-full font-bold shadow-sm border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
        >
          <BackIcon className="w-4 h-4 text-rose-500" />
          <span>{isAr ? 'خروج' : 'Exit'}</span>
        </button>

        {gameState.currentMode !== 'explore' && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white dark:bg-[#20091b] px-4 py-1.5 rounded-full font-black text-sm shadow-sm border border-slate-200 dark:border-slate-800">
              <span>{isAr ? 'جولة' : 'Round'}</span>
              <span className="text-rose-600">{gameState.round}</span>
              <span className="opacity-30">/</span>
              <span>٥</span>
            </div>
            <div className="flex items-center gap-2 bg-amber-400 text-amber-950 px-4 py-1.5 rounded-full font-black text-sm shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span>{gameState.score}</span>
            </div>
          </div>
        )}
      </div>

      <div className="w-full bg-white dark:bg-[#20091b] rounded-[40px] p-8 sm:p-12 border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col items-center space-y-10 relative overflow-hidden">
        {/* Progress Background */}
        <div className="absolute top-0 left-0 h-1.5 bg-rose-500 transition-all duration-500" style={{ width: `${(gameState.round / 5) * 100}%` }} />

        {/* Mode Specific Prompt */}
        <div className="text-center space-y-2">
          {gameState.currentMode === 'explore' ? (
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">
              {isAr ? 'استكشف الوقت' : 'Explore Time'}
            </h2>
          ) : gameState.currentMode === 'quiz-analog' ? (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-600 dark:text-slate-400">
                {isAr ? 'اضبط الساعة على:' : 'Set the clock to:'}
              </h2>
              <div className="bg-slate-900 text-emerald-400 font-mono text-5xl sm:text-7xl p-4 rounded-3xl shadow-inner border-4 border-slate-800 tracking-widest inline-block">
                {formatTime(gameState.targetHour, gameState.targetMinute)}
              </div>
            </div>
          ) : (
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">
              {isAr ? 'ما هو الوقت الصحيح؟' : 'What is the correct time?'}
            </h2>
          )}
        </div>

        {/* Clock Section */}
        <div className="flex flex-col items-center space-y-8 w-full">
          {renderClock(
            gameState.currentMode === 'quiz-digital' ? gameState.targetHour : gameState.hour, 
            gameState.currentMode === 'quiz-digital' ? gameState.targetMinute : gameState.minute,
            gameState.currentMode !== 'quiz-digital'
          )}

          {/* Digital Display for Explore/Analog Quiz */}
          {gameState.currentMode !== 'quiz-digital' && (
            <div className="flex flex-col items-center space-y-4">
              {gameState.currentMode === 'explore' && (
                <div className="bg-slate-900 text-emerald-400 font-mono text-5xl p-4 rounded-2xl shadow-inner border-2 border-slate-800 tracking-widest">
                  {formatTime(gameState.hour, gameState.minute)}
                </div>
              )}
              
              {gameState.currentMode === 'quiz-analog' && (
                <button
                  onClick={checkAnswer}
                  disabled={gameState.isCorrect !== null}
                  className={`px-12 py-4 rounded-3xl font-black text-xl shadow-lg transition-all transform active:scale-95 cursor-pointer ${
                    gameState.isCorrect === true ? 'bg-emerald-500 text-white' :
                    gameState.isCorrect === false ? 'bg-rose-500 text-white animate-shake' :
                    'bg-slate-800 text-white hover:bg-slate-700'
                  }`}
                >
                  {gameState.isCorrect === true ? (isAr ? 'رائع!' : 'Great!') : 
                   gameState.isCorrect === false ? (isAr ? 'حاول ثانية' : 'Try Again') :
                   (isAr ? 'تحقق' : 'Check')}
                </button>
              )}
            </div>
          )}

          {/* Choices for Digital Quiz */}
          {gameState.currentMode === 'quiz-digital' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
              {digitalOptions.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoiceDigital(opt.h, opt.m)}
                  disabled={gameState.isCorrect !== null}
                  className={`
                    p-6 rounded-3xl font-mono text-3xl font-black transition-all transform active:scale-95 cursor-pointer shadow-md border-4
                    ${gameState.isCorrect === true && opt.h === gameState.targetHour && opt.m === gameState.targetMinute
                      ? 'bg-emerald-500 text-white border-emerald-300 scale-105'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white border-slate-100 dark:border-slate-700 hover:border-rose-400'}
                  `}
                >
                  {formatTime(opt.h, opt.m)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Helper Footer */}
        <div className="flex items-center gap-2 text-slate-400 font-bold text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/50 px-6 py-2 rounded-full">
          <HelpCircle className="w-4 h-4 text-rose-400" />
          <span>
            {gameState.currentMode === 'explore' 
              ? (isAr ? 'حرك عقرب الساعات (الأسود) أو الدقائق (الأزرق) لترى كيف يعمل الوقت' : 'Move the hour hand (black) or minute hand (blue) to see how time works')
              : (isAr ? 'اسحب العقارب لتصل إلى الوقت المطلوب ثم اضغط تحقق' : 'Drag the hands to set the time then click check')}
          </span>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';
import { useLanguage } from '../../i18n/LanguageContext';
import { Sparkles, RotateCcw, ArrowRight, ArrowLeft, Award, HelpCircle } from 'lucide-react';

type MathLevel = 'counting' | 'addition' | 'subtraction' | 'add-sub' | 'multiplication' | 'all';

interface Question {
  id: number;
  type: 'counting' | 'addition' | 'subtraction' | 'multiplication';
  questionAr: string;
  questionEn: string;
  visualEmoji?: string;
  visualCount1?: number;
  visualCount2?: number;
  operatorSymbol?: string;
  correctAnswer: number;
  options: number[];
  hintAr: string;
  hintEn: string;
}

export const MathGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const { language } = useLanguage();
  const BackIcon = language === 'ar' ? ArrowRight : ArrowLeft;

  // States
  const [gameState, setGameState] = useState<'menu' | 'play' | 'win'>('menu');
  const [selectedLevel, setSelectedLevel] = useState<MathLevel>('counting');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [wrongAttempts, setWrongAttempts] = useState<number>(0);

  // Helper to shuffle options
  const shuffleArray = (array: number[]): number[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Generate questions based on level
  const generateQuestions = useCallback((level: MathLevel): Question[] => {
    const list: Question[] = [];
    const emojis = ['🍎', '⭐', '🐱', '🚗', '🎈', '🐟', '🌸', '⚽'];

    const count = 8; // 8 questions per round
    for (let i = 0; i < count; i++) {
      let qType: 'counting' | 'addition' | 'subtraction' | 'multiplication' = 'counting';
      if (level === 'counting') qType = 'counting';
      else if (level === 'addition') qType = 'addition';
      else if (level === 'subtraction') qType = 'subtraction';
      else if (level === 'add-sub') qType = i % 2 === 0 ? 'addition' : 'subtraction';
      else if (level === 'multiplication') qType = 'multiplication';
      else {
        // 'all'
        const types: ('counting' | 'addition' | 'subtraction' | 'multiplication')[] = ['counting', 'addition', 'subtraction', 'multiplication'];
        qType = types[Math.floor(Math.random() * types.length)];
      }

      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      let correctAns = 0;
      let qAr = '';
      let qEn = '';
      let vCount1 = undefined;
      let vCount2 = undefined;
      let op = undefined;

      if (qType === 'counting') {
        const num = Math.floor(Math.random() * 8) + 2; // 2 to 9
        correctAns = num;
        vCount1 = num;
        qAr = `كم عدد ${emoji} في الصورة؟`;
        qEn = `How many ${emoji} items are there?`;
      } else if (qType === 'addition') {
        const a = Math.floor(Math.random() * 6) + 1; // 1 to 6
        const b = Math.floor(Math.random() * 5) + 1; // 1 to 5
        correctAns = a + b;
        vCount1 = a;
        vCount2 = b;
        op = '+';
        qAr = `إذا كان لديك ${a} ${emoji} وأضفت إليها ${b} ${emoji}، فكم يصبح المجموع؟`;
        qEn = `If you have ${a} and add ${b}, what is the total?`;
      } else if (qType === 'subtraction') {
        const a = Math.floor(Math.random() * 7) + 3; // 3 to 9
        const b = Math.floor(Math.random() * (a - 1)) + 1; // 1 to a-1
        correctAns = a - b;
        vCount1 = a;
        vCount2 = b;
        op = '-';
        qAr = `كان لديك ${a} ${emoji} وأخذت منها ${b} ${emoji}، كم تبقّى؟`;
        qEn = `You had ${a} and took away ${b}, how many are left?`;
      } else {
        // multiplication
        const a = Math.floor(Math.random() * 5) + 1; // 1 to 5
        const b = Math.floor(Math.random() * 5) + 1; // 1 to 5
        correctAns = a * b;
        vCount1 = a;
        vCount2 = b;
        op = '×';
        qAr = `ما هو ناتج ضرب ${a} × ${b}؟ (${a} مجموعات في كل منها ${b})`;
        qEn = `What is the product of ${a} × ${b}?`;
      }

      // Generate options (correct + 3 distinct incorrect)
      const optionSet = new Set<number>([correctAns]);
      while (optionSet.size < 4) {
        const offset = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const wrongAns = correctAns + (offset === 0 ? 1 : offset);
        if (wrongAns >= 0 && wrongAns !== correctAns) {
          optionSet.add(wrongAns);
        } else {
          optionSet.add(Math.abs(correctAns + Math.floor(Math.random() * 4) + 1));
        }
      }

      list.push({
        id: i + 1,
        type: qType,
        questionAr: qAr,
        questionEn: qEn,
        visualEmoji: emoji,
        visualCount1: vCount1,
        visualCount2: vCount2,
        operatorSymbol: op,
        correctAnswer: correctAns,
        options: shuffleArray(Array.from(optionSet)),
        hintAr: `حاول العد ببطء أو استخدم أصابعك للمساعدة! الإجابة قريبة من ${Math.max(0, correctAns - 1)}`,
        hintEn: `Try counting slowly or using your fingers! The answer is close to ${Math.max(0, correctAns - 1)}`,
      });
    }

    return list;
  }, []);

  // Start game with level
  const startGame = (level: MathLevel) => {
    sound.playClick();
    setSelectedLevel(level);
    const newQuestions = generateQuestions(level);
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setStreak(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowHint(false);
    setWrongAttempts(0);
    setGameState('play');
  };

  const currentQ = questions[currentQuestionIndex];

  // Handle answer selection
  const handleSelectAnswer = (answer: number) => {
    if (isCorrect === true) return; // Prevent double clicking after correct answer

    setSelectedAnswer(answer);
    if (answer === currentQ.correctAnswer) {
      // Correct!
      sound.playMatch();
      setIsCorrect(true);
      const earned = 15 + streak * 5;
      setScore((s) => s + earned);
      setStreak((st) => st + 1);

      // Advance after delay
      setTimeout(() => {
        if (currentQuestionIndex + 1 < questions.length) {
          setCurrentQuestionIndex((idx) => idx + 1);
          setSelectedAnswer(null);
          setIsCorrect(null);
          setShowHint(false);
          setWrongAttempts(0);
        } else {
          // Finished round!
          sound.playWin();
          const finalScore = score + earned;
          saveGameProgress('math-game', finalScore, true);
          setGameState('win');
        }
      }, 1200);
    } else {
      // Incorrect - DO NOT skip automatically, give hint and retry
      sound.playClick();
      setIsCorrect(false);
      setStreak(0);
      setWrongAttempts((w) => w + 1);
      if (wrongAttempts >= 1) {
        setShowHint(true);
      }
    }
  };

  // -------------------------------------------------------------
  // 1. MENU & LEVEL SELECT SCREEN
  // -------------------------------------------------------------
  if (gameState === 'menu') {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center space-y-8 py-4 px-2">
        {/* Header bar */}
        <div className="w-full flex items-center justify-between">
          <button
            onClick={() => {
              sound.playClick();
              onGoHome();
            }}
            className="flex items-center gap-2 bg-white dark:bg-[#20091b] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-100 px-4 py-2.5 rounded-full font-bold shadow-sm border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
          >
            <BackIcon className="w-5 h-5 text-amber-500" />
            <span>{language === 'ar' ? 'الرجوع للقائمة' : 'Back to Games'}</span>
          </button>
          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-full font-black text-sm shadow-sm">
            <span>🧮</span>
            <span>{language === 'ar' ? 'لعبة الحساب الذكي' : 'Math Adventures'}</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white">
            {language === 'ar' ? 'اختر مستوى الحساب المناسب' : 'Select Math Level'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            {language === 'ar'
              ? 'تدرّب على العد، الجمع، الطرح، وجداول الضرب بمتعة وتشويق'
              : 'Practice counting, addition, subtraction, and multiplication with fun'}
          </p>
        </div>

        {/* Level Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-3xl">
          {[
            { id: 'counting' as MathLevel, titleAr: 'العد والأرقام', titleEn: 'Counting & Numbers', descAr: 'مناسب لعمر 4-5 سنوات (عد الأشياء)', icon: '🔢', gradient: 'from-emerald-400 to-teal-600' },
            { id: 'addition' as MathLevel, titleAr: 'الجمع البسيط', titleEn: 'Simple Addition', descAr: 'جمع المجموعات والأعداد الصغيرة', icon: '➕', gradient: 'from-sky-400 to-blue-600' },
            { id: 'subtraction' as MathLevel, titleAr: 'الطرح البسيط', titleEn: 'Simple Subtraction', descAr: 'إزالة الأشياء وفهم الفرق', icon: '➖', gradient: 'from-amber-400 to-orange-600' },
            { id: 'add-sub' as MathLevel, titleAr: 'الجمع والطرح معا', titleEn: 'Add & Subtract', descAr: 'مسائل ممتعة بالجمع والطرح', icon: '➗', gradient: 'from-indigo-500 to-purple-700' },
            { id: 'multiplication' as MathLevel, titleAr: 'جداول الضرب', titleEn: 'Multiplication Tables', descAr: 'المجموعات المتساوية والضرب', icon: '✖️', gradient: 'from-pink-500 to-rose-600' },
            { id: 'all' as MathLevel, titleAr: 'تحدي الحساب الشامل', titleEn: 'All Math Challenge', descAr: 'مزيج رائع من جميع العمليات', icon: '🌟', gradient: 'from-violet-500 to-fuchsia-600' },
          ].map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => startGame(lvl.id)}
              className={`p-6 rounded-3xl bg-gradient-to-r ${lvl.gradient} text-white shadow-md hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 flex flex-col items-center text-center gap-3 cursor-pointer`}
            >
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner">
                {lvl.icon}
              </div>
              <div>
                <h3 className="text-lg font-black">{language === 'ar' ? lvl.titleAr : lvl.titleEn}</h3>
                <p className="text-xs text-white/90 font-medium mt-1">{lvl.descAr}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. WIN / CELEBRATION SCREEN
  // -------------------------------------------------------------
  if (gameState === 'win') {
    return (
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center py-10 px-4 text-center space-y-6">
        <WinCelebration
          score={score}
          onRestart={() => startGame(selectedLevel)}
          onGoHome={() => setGameState('menu')}
        />
        
        <div className="bg-white dark:bg-[#20091b] rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800 w-full space-y-6">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-blue-400 to-indigo-600 flex items-center justify-center text-6xl shadow-md animate-bounce">
            🏆
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">
              {language === 'ar' ? 'أحسنت! أتممت التحدي الرياضي بنجاح' : 'Amazing! Math Round Completed'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              {language === 'ar'
                ? `لقد جمعت ${score} نقطة في لعبة الحساب بكل ذكاء وإتقان!`
                : `You earned ${score} points in Math Adventures!`}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => startGame(selectedLevel)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-md transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{language === 'ar' ? 'لعب جولة أخرى' : 'Play Another Round'}</span>
            </button>

            <button
              onClick={() => setGameState('menu')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-2xl font-black text-sm transition-all cursor-pointer"
            >
              <BackIcon className="w-4 h-4" />
              <span>{language === 'ar' ? 'تغيير المستوى' : 'Change Level'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. GAMEPLAY SCREEN
  // -------------------------------------------------------------
  if (!currentQ) return null;
  const progressPercent = Math.round(((currentQuestionIndex) / questions.length) * 100);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center py-4 space-y-6 px-2">
      {/* Top Bar */}
      <div className="w-full flex items-center justify-between gap-3 flex-wrap">
        <button
          onClick={() => {
            sound.playClick();
            setGameState('menu');
          }}
          className="flex items-center gap-2 bg-white dark:bg-[#20091b] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-100 px-4 py-2.5 rounded-full font-bold shadow-sm border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
        >
          <BackIcon className="w-5 h-5 text-blue-500" />
          <span>{language === 'ar' ? 'المستويات' : 'Levels'}</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-200 px-4 py-2 rounded-full font-bold border border-amber-200">
            <Award className="w-4 h-4 text-amber-500" />
            <span>{score} {language === 'ar' ? 'نقطة' : 'Pts'}</span>
          </div>

          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-full font-black text-sm shadow-sm">
            <span>🧮</span>
            <span>{currentQuestionIndex + 1} / {questions.length}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white dark:bg-[#20091b] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-center">
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="w-full bg-white dark:bg-[#20091b] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-lg text-center space-y-6">
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white leading-relaxed">
          {language === 'ar' ? currentQ.questionAr : currentQ.questionEn}
        </h2>

        {/* Visual Aids (Emojis counting) */}
        {currentQ.visualEmoji && (
          <div className="py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center gap-3">
            {currentQ.type === 'counting' && currentQ.visualCount1 && (
              <div className="flex flex-wrap items-center justify-center gap-3 max-w-md px-4">
                {Array.from({ length: currentQ.visualCount1 }).map((_, i) => (
                  <span key={i} className="text-4xl sm:text-5xl animate-pulse">
                    {currentQ.visualEmoji}
                  </span>
                ))}
              </div>
            )}

            {(currentQ.type === 'addition' || currentQ.type === 'subtraction' || currentQ.type === 'multiplication') &&
              currentQ.visualCount1 !== undefined &&
              currentQ.visualCount2 !== undefined && (
                <div className="flex items-center justify-center gap-4 flex-wrap px-4">
                  <div className="flex flex-wrap gap-2 justify-center bg-white dark:bg-slate-900 p-3 rounded-xl shadow-inner">
                    {Array.from({ length: currentQ.visualCount1 }).map((_, i) => (
                      <span key={i} className="text-3xl sm:text-4xl">{currentQ.visualEmoji}</span>
                    ))}
                  </div>
                  <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                    {currentQ.operatorSymbol}
                  </span>
                  <div className="flex flex-wrap gap-2 justify-center bg-white dark:bg-slate-900 p-3 rounded-xl shadow-inner">
                    {Array.from({ length: currentQ.visualCount2 }).map((_, i) => (
                      <span key={i} className="text-3xl sm:text-4xl">{currentQ.visualEmoji}</span>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Answer Options Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedAnswer === option;
            let btnStyle = 'bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700';

            if (isSelected) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-500 text-white border-emerald-600 scale-105 shadow-md';
              } else {
                btnStyle = 'bg-rose-500 text-white border-rose-600 animate-shake';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectAnswer(option)}
                className={`py-5 px-6 rounded-2xl font-black text-2xl sm:text-3xl border-2 transition-all transform hover:scale-105 active:scale-95 shadow-sm cursor-pointer ${btnStyle}`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Feedback & Hint */}
        {isCorrect === false && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold text-sm flex items-center justify-center gap-2 animate-bounce">
            <span>❌</span>
            <span>{language === 'ar' ? 'إجابة غير صحيحة، حاول مرة أخرى!' : 'Incorrect, try again!'}</span>
          </div>
        )}

        {isCorrect === true && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-sm flex items-center justify-center gap-2 animate-bounce">
            <span>✨</span>
            <span>{language === 'ar' ? 'إجابة صحيحة! أحسنت 🌟' : 'Correct! Well done 🌟'}</span>
          </div>
        )}

        {showHint && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 text-xs sm:text-sm font-medium flex items-center gap-3 text-start">
            <HelpCircle className="w-5 h-5 text-amber-500 shrink-0" />
            <span>{language === 'ar' ? currentQ.hintAr : currentQ.hintEn}</span>
          </div>
        )}
      </div>
    </div>
  );
};

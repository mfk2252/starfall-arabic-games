import React, { useState, useEffect, useMemo } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';
import { CheckCircle2, ArrowRight, ArrowLeft, HelpCircle, Sparkles, Trophy } from 'lucide-react';
import { OPPOSITES_DATA, OppositePair, OppositeDifficulty } from '../../data/oppositesData';
import { useLanguage } from '../../i18n/LanguageContext';

interface GameState {
  status: 'menu' | 'playing' | 'round-end';
  difficulty: OppositeDifficulty | null;
  currentPairs: OppositePair[];
  matchedIds: string[];
  selectedLeft: string | null;
  selectedRight: string | null;
  score: number;
  message: string;
  isProcessing: boolean;
}

export const OppositesGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const { language, dir } = useLanguage();
  const isAr = language === 'ar';
  const BackIcon = dir === 'rtl' ? ArrowRight : ArrowLeft;

  const [game, setGame] = useState<GameState>({
    status: 'menu',
    difficulty: null,
    currentPairs: [],
    matchedIds: [],
    selectedLeft: null,
    selectedRight: null,
    score: 0,
    message: '',
    isProcessing: false,
  });

  const shuffle = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const startNewGame = (diff: OppositeDifficulty) => {
    sound.playClick();

    // Filter by difficulty across the entire 125-pair dataset
    let pool: OppositePair[] = [];
    if (diff === 'easy') {
      pool = OPPOSITES_DATA.filter((p) => p.difficulty === 'easy');
    } else if (diff === 'medium') {
      pool = OPPOSITES_DATA.filter((p) => p.difficulty === 'easy' || p.difficulty === 'medium');
    } else {
      pool = OPPOSITES_DATA; // All for advanced
    }

    const count = diff === 'easy' ? 4 : diff === 'medium' ? 6 : 8;
    const selected = shuffle(pool).slice(0, count);

    setGame({
      status: 'playing',
      difficulty: diff,
      currentPairs: selected,
      matchedIds: [],
      selectedLeft: null,
      selectedRight: null,
      score: 0,
      message: isAr ? 'طابق كل شيء مع ما يضاده وعكسه!' : 'Match each item with its opposite!',
      isProcessing: false,
    });
  };

  const handleSelectLeft = (id: string) => {
    if (game.matchedIds.includes(id) || game.isProcessing || game.status !== 'playing') return;
    sound.playClick();

    if (game.selectedLeft === id) {
      setGame((prev) => ({ ...prev, selectedLeft: null }));
      return;
    }

    setGame((prev) => ({ ...prev, selectedLeft: id }));
  };

  const handleSelectRight = (id: string) => {
    if (game.matchedIds.includes(id) || game.isProcessing || game.status !== 'playing') return;
    sound.playClick();

    if (game.selectedRight === id) {
      setGame((prev) => ({ ...prev, selectedRight: null }));
      return;
    }

    setGame((prev) => ({ ...prev, selectedRight: id }));
  };

  // Evaluate match effect
  useEffect(() => {
    if (game.selectedLeft && game.selectedRight && !game.isProcessing) {
      const leftId = game.selectedLeft;
      const rightId = game.selectedRight;

      if (leftId === rightId) {
        sound.playMatch();
        const updatedMatched = [...game.matchedIds, leftId];
        const pair = game.currentPairs.find((p) => p.id === leftId);
        const explanation = isAr ? pair?.explanationAr : pair?.explanationEn;

        setGame((prev) => ({
          ...prev,
          matchedIds: updatedMatched,
          selectedLeft: null,
          selectedRight: null,
          score: prev.score + 20,
          message: `✅ ${explanation}`,
        }));

        if (updatedMatched.length === game.currentPairs.length) {
          setTimeout(() => {
            sound.playWin();
            saveGameProgress('opposites', game.score + 20, true);
            setGame((prev) => ({ ...prev, status: 'round-end' }));
          }, 1500);
        }
      } else {
        sound.playWrong();
        setGame((prev) => ({
          ...prev,
          isProcessing: true,
          message: isAr
            ? '❌ هذان الشيئان غير متضادين، حاول مرة أخرى!'
            : '❌ These are not opposites, try again!',
        }));

        setTimeout(() => {
          setGame((prev) => ({
            ...prev,
            selectedLeft: null,
            selectedRight: null,
            isProcessing: false,
            score: Math.max(0, prev.score - 2),
          }));
        }, 800);
      }
    }
  }, [
    game.selectedLeft,
    game.selectedRight,
    game.isProcessing,
    game.matchedIds,
    game.currentPairs,
    game.score,
    isAr,
  ]);

  // Shuffled columns for rendering
  const leftColumn = useMemo(() => shuffle(game.currentPairs), [game.currentPairs]);
  const rightColumn = useMemo(() => shuffle(game.currentPairs), [game.currentPairs]);

  // --------------------------------------------------------------------------
  // UI - MENU (Child-friendly level selection starting from 4 years old)
  // --------------------------------------------------------------------------
  if (game.status === 'menu') {
    return (
      <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4 py-8 animate-pop-in">
        <div className="w-full flex items-center justify-between mb-8">
          <button
            onClick={() => {
              sound.playClick();
              onGoHome();
            }}
            className="flex items-center gap-2 bg-white dark:bg-[#0b1329] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-100 px-4 py-2.5 rounded-full font-bold shadow-sm border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
          >
            <BackIcon className="w-5 h-5 text-emerald-500" />
            <span>{isAr ? 'الرجوع للمكتبة' : 'Back to Library'}</span>
          </button>
          <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-full font-black text-sm shadow-sm">
            <span>⬆️⬇️</span>
            <span>{isAr ? 'لعبة المعكوسات' : 'Opposites Game'}</span>
          </div>
        </div>

        <div className="text-center space-y-4 mb-10">
          <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto shadow-inner border-4 border-white dark:border-emerald-800">
            <span className="text-5xl filter drop-shadow animate-pulse">⬆️⬇️</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black text-slate-800 dark:text-white">
            {isAr ? 'تحدي المعكوسات والمفاهيم المتضادة' : 'Opposites & Antonyms Challenge'}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium max-w-lg mx-auto leading-relaxed">
            {isAr
              ? 'ساعد في مطابقة كل شيء مع ما يضاده في المعنى (مثل: كبير وصغير، حار وبارد، فوق وتحت). اختر المستوى وابدأ المرح!'
              : 'Help pair opposite concepts together (like big and small, hot and cold). Pick a level and start having fun!'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl">
          {[
            {
              id: 'easy',
              label: isAr ? 'سهل' : 'Easy',
              sublabel: isAr ? '٤ أزواج بصرية واضحة' : '4 Visual Pairs',
              icon: '🐣',
              color: 'from-emerald-400 to-teal-600',
            },
            {
              id: 'medium',
              label: isAr ? 'متوسط' : 'Medium',
              sublabel: isAr ? '٦ أزواج متنوعة' : '6 Fun Pairs',
              icon: '🚀',
              color: 'from-sky-400 to-blue-600',
            },
            {
              id: 'advanced',
              label: isAr ? 'متقدم' : 'Advanced',
              sublabel: isAr ? '٨ أزواج لتحدي الأبطال' : '8 Super Pairs',
              icon: '🧠',
              color: 'from-purple-500 to-indigo-700',
            },
          ].map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => startNewGame(lvl.id as OppositeDifficulty)}
              className={`p-6 sm:p-7 rounded-3xl bg-gradient-to-br ${lvl.color} text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 flex flex-col items-center gap-2.5 cursor-pointer group select-none`}
            >
              <span className="text-5xl group-hover:scale-110 transition-transform filter drop-shadow">
                {lvl.icon}
              </span>
              <span className="font-heading text-2xl font-black">{lvl.label}</span>
              <span className="text-xs text-white/90 font-semibold">{lvl.sublabel}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // UI - PLAYING (Same harmonious structure as RelationsGame)
  // --------------------------------------------------------------------------
  return (
    <div className="flex flex-col items-center w-full px-4 py-4 min-h-[85vh]">
      <GameHeader
        title={isAr ? 'المعكوسات والمفاهيم المتضادة' : 'Opposites & Antonyms'}
        icon="⬆️⬇️"
        score={game.score}
        onRestart={() => setGame((prev) => ({ ...prev, status: 'menu' }))}
        onGoHome={onGoHome}
        accentGradient="from-emerald-500 to-teal-600"
        badgeText={
          isAr
            ? `مستوى: ${
                game.difficulty === 'easy'
                  ? 'سهل'
                  : game.difficulty === 'medium'
                  ? 'متوسط'
                  : 'متقدم'
              }`
            : `Level: ${game.difficulty}`
        }
      />

      <div className="bg-white dark:bg-[#0b1329] rounded-[2.5rem] p-5 sm:p-10 shadow-2xl border border-emerald-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 max-w-4xl w-full flex flex-col items-center">
        {/* Feedback Message */}
        <div className="w-full text-center mb-8 h-16 flex items-center justify-center">
          <div
            className={`inline-block px-6 py-3 rounded-2xl font-bold text-sm sm:text-lg transition-all transform animate-pop-in shadow-sm ${
              game.message.startsWith('✅')
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300'
                : game.message.startsWith('❌')
                ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-800 dark:text-rose-300'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300'
            }`}
          >
            {game.message}
          </div>
        </div>

        {/* Two Matching Columns */}
        <div className="grid grid-cols-2 gap-4 sm:gap-10 w-full relative">
          {/* Connector Decoration (Desktop only) */}
          <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
            <Sparkles className="w-32 h-32 text-emerald-500" />
          </div>

          {/* Left Column (Items A) */}
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center justify-center gap-2 mb-2">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <h3 className="font-heading font-black text-slate-500 text-xs sm:text-sm uppercase tracking-wider">
                {isAr ? 'المجموعة الأولى' : 'Group A'}
              </h3>
            </div>
            {leftColumn.map((pair) => {
              const isMatched = game.matchedIds.includes(pair.id);
              const isSelected = game.selectedLeft === pair.id;

              return (
                <button
                  key={`left-${pair.id}`}
                  onClick={() => handleSelectLeft(pair.id)}
                  disabled={isMatched || game.isProcessing}
                  className={`relative p-4 sm:p-5 rounded-[1.5rem] flex flex-col sm:flex-row items-center gap-3 transition-all transform duration-200 select-none border-4 ${
                    isMatched
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400 opacity-60'
                      : isSelected
                      ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-400 dark:border-amber-600 shadow-xl scale-105 z-10'
                      : 'bg-white dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-slate-700 border-slate-100 dark:border-slate-800 hover:border-emerald-300 shadow-md cursor-pointer active:scale-95'
                  }`}
                >
                  <span
                    className={`text-4xl sm:text-5xl filter drop-shadow transition-transform ${
                      isSelected ? 'scale-110' : ''
                    }`}
                  >
                    {pair.itemA.icon}
                  </span>
                  <div className="flex-1 font-heading font-black text-sm sm:text-lg text-center sm:text-start leading-tight">
                    {isAr ? pair.itemA.nameAr : pair.itemA.nameEn}
                  </div>
                  {isMatched && (
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Column (Items B) */}
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center justify-center gap-2 mb-2">
              <h3 className="font-heading font-black text-slate-500 text-xs sm:text-sm uppercase tracking-wider">
                {isAr ? 'المجموعة المتضادة' : 'Opposite Group'}
              </h3>
              <HelpCircle className="w-4 h-4 text-slate-400" />
            </div>
            {rightColumn.map((pair) => {
              const isMatched = game.matchedIds.includes(pair.id);
              const isSelected = game.selectedRight === pair.id;

              return (
                <button
                  key={`right-${pair.id}`}
                  onClick={() => handleSelectRight(pair.id)}
                  disabled={isMatched || game.isProcessing}
                  className={`relative p-4 sm:p-5 rounded-[1.5rem] flex flex-col sm:flex-row-reverse items-center gap-3 transition-all transform duration-200 select-none border-4 ${
                    isMatched
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400 opacity-60'
                      : isSelected
                      ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-400 dark:border-amber-600 shadow-xl scale-105 z-10'
                      : 'bg-white dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-slate-700 border-slate-100 dark:border-slate-800 hover:border-emerald-300 shadow-md cursor-pointer active:scale-95'
                  }`}
                >
                  <span
                    className={`text-4xl sm:text-5xl filter drop-shadow transition-transform ${
                      isSelected ? 'scale-110' : ''
                    }`}
                  >
                    {pair.itemB.icon}
                  </span>
                  <div className="flex-1 font-heading font-black text-sm sm:text-lg text-center sm:text-end leading-tight">
                    {isAr ? pair.itemB.nameAr : pair.itemB.nameEn}
                  </div>
                  {isMatched && (
                    <div className="absolute top-2 left-2 bg-emerald-500 text-white rounded-full p-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Progress Summary */}
        <div className="mt-10 sm:mt-12 w-full border-t border-slate-100 dark:border-slate-800 pt-6">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 mb-4 px-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>{isAr ? 'التقدم المحرز:' : 'Round Progress:'}</span>
            </div>
            <span>
              {game.matchedIds.length} / {game.currentPairs.length}
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-3.5 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500 ease-out"
              style={{
                width: `${(game.matchedIds.length / (game.currentPairs.length || 1)) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {game.status === 'round-end' && (
        <WinCelebration
          score={game.score}
          message={
            isAr
              ? '🎉 مذهل يا بطل! لقد أتقنت جميع المعكوسات والمفاهيم المتضادة في هذا المستوى!'
              : '🎉 Amazing! You mastered all opposites in this level!'
          }
          onRestart={() => setGame((prev) => ({ ...prev, status: 'menu' }))}
          onGoHome={onGoHome}
          stars={3}
        />
      )}
    </div>
  );
};

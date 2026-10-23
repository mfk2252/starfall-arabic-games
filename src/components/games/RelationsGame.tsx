import React, { useState, useEffect, useMemo, useRef } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';
import { CheckCircle2, ArrowRight, ArrowLeft, HelpCircle, Sparkles, Trophy } from 'lucide-react';
import { RELATIONS_DATA, RelationPair } from '../../data/relationsData';
import { RoundManager } from '../../utils/roundManager';
import { useLanguage } from '../../i18n/LanguageContext';

type Difficulty = 'easy' | 'medium' | 'advanced';

interface GameState {
  status: 'menu' | 'playing' | 'round-end';
  difficulty: Difficulty | null;
  currentPairs: RelationPair[];
  matchedIds: string[];
  selectedLeft: string | null;
  selectedRight: string | null;
  score: number;
  message: string;
  isProcessing: boolean;
}

export const RelationsGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const { language, dir } = useLanguage();
  const isAr = language === 'ar';
  const BackIcon = dir === 'rtl' ? ArrowRight : ArrowLeft;

  // Persistent round manager across re-renders
  const roundManagerRef = useRef(new RoundManager<RelationPair>(RELATIONS_DATA, 40));

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

  const startNewGame = (diff: Difficulty) => {
    sound.playClick();
    
    // Filter by difficulty using RoundManager
    const count = diff === 'easy' ? 5 : diff === 'medium' ? 6 : 8;
    const filterFn = (r: RelationPair) => {
      if (diff === 'easy') return r.difficulty === 'easy';
      if (diff === 'medium') return r.difficulty === 'easy' || r.difficulty === 'medium';
      return true;
    };

    const selected = roundManagerRef.current.getNextRoundItems(count, filterFn);

    setGame({
      status: 'playing',
      difficulty: diff,
      currentPairs: selected,
      matchedIds: [],
      selectedLeft: null,
      selectedRight: null,
      score: 0,
      message: isAr ? 'طابق كل عنصر مع ما يناسبه!' : 'Match each item with its partner!',
      isProcessing: false,
    });
  };

  const handleSelectLeft = (id: string) => {
    if (game.matchedIds.includes(id) || game.isProcessing || game.status !== 'playing') return;
    sound.playClick();
    
    if (game.selectedLeft === id) {
      setGame(prev => ({ ...prev, selectedLeft: null }));
      return;
    }

    setGame(prev => ({ ...prev, selectedLeft: id }));
  };

  const handleSelectRight = (id: string) => {
    if (game.matchedIds.includes(id) || game.isProcessing || game.status !== 'playing') return;
    sound.playClick();

    if (game.selectedRight === id) {
      setGame(prev => ({ ...prev, selectedRight: null }));
      return;
    }

    setGame(prev => ({ ...prev, selectedRight: id }));
  };

  // Evaluate match effect
  useEffect(() => {
    if (game.selectedLeft && game.selectedRight && !game.isProcessing) {
      const leftId = game.selectedLeft;
      const rightId = game.selectedRight;

      if (leftId === rightId) {
        sound.playMatch();
        const updatedMatched = [...game.matchedIds, leftId];
        const rel = game.currentPairs.find(r => r.id === leftId);
        const explanation = isAr ? rel?.explanationAr : rel?.explanationEn;
        
        setGame(prev => ({
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
            saveGameProgress('relations', game.score + 20, true);
            setGame(prev => ({ ...prev, status: 'round-end' }));
          }, 1500);
        }
      } else {
        sound.playWrong();
        setGame(prev => ({ 
          ...prev, 
          isProcessing: true,
          message: isAr ? '❌ هذان الشيئان غير مترابطين، حاول مرة أخرى!' : '❌ These are not related, try again!'
        }));
        
        setTimeout(() => {
          setGame(prev => ({
            ...prev,
            selectedLeft: null,
            selectedRight: null,
            isProcessing: false,
            score: Math.max(0, prev.score - 2)
          }));
        }, 800);
      }
    }
  }, [game.selectedLeft, game.selectedRight, game.isProcessing, game.matchedIds, game.currentPairs, game.score, isAr]);

  // Shuffled columns for rendering
  const leftColumn = useMemo(() => roundManagerRef.current.shuffle(game.currentPairs), [game.currentPairs]);
  const rightColumn = useMemo(() => roundManagerRef.current.shuffle(game.currentPairs), [game.currentPairs]);

  // --------------------------------------------------------------------------
  // UI - MENU
  // --------------------------------------------------------------------------
  if (game.status === 'menu') {
    return (
      <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4 py-8 animate-in fade-in duration-500">
        <div className="w-full flex items-center justify-between mb-8">
          <button
            onClick={() => { sound.playClick(); onGoHome(); }}
            className="flex items-center gap-2 bg-white dark:bg-[#0b1329] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-100 px-4 py-2.5 rounded-full font-bold shadow-sm border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
          >
            <BackIcon className="w-5 h-5 text-sky-500" />
            <span>{isAr ? 'الرجوع للمكتبة' : 'Back to Library'}</span>
          </button>
          <div className="flex items-center gap-2 bg-gradient-to-r from-sky-600 to-indigo-600 text-white px-4 py-2 rounded-full font-black text-sm shadow-sm">
            <span>🔗</span>
            <span>{isAr ? 'لعبة العلاقات' : 'Relations Game'}</span>
          </div>
        </div>

        <div className="text-center space-y-4 mb-10">
          <div className="w-24 h-24 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center mx-auto shadow-inner border-4 border-white dark:border-sky-800">
            <Sparkles className="w-12 h-12 text-sky-600 animate-pulse" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white">
            {isAr ? 'تحدي الربط المنطقي والعلاقات' : 'Logic & Relations Matching'}
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 font-medium max-w-lg mx-auto leading-relaxed">
            {isAr 
              ? 'أكثر من ١٠٠ علاقة تعليمية متنوعة! طابق بين الأشياء المترابطة باختيار المستوى المناسب.'
              : 'Over 100 educational relationships! Match related concepts by picking a level.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl">
          {[
            { id: 'easy', label: isAr ? 'سهل' : 'Easy', sublabel: isAr ? '٥ أزواج بسيطة' : '5 Easy Pairs', icon: '🐣', color: 'from-emerald-400 to-teal-600' },
            { id: 'medium', label: isAr ? 'متوسط' : 'Medium', sublabel: isAr ? '٦ أزواج متنوعة' : '6 Fun Pairs', icon: '🚀', color: 'from-sky-400 to-blue-600' },
            { id: 'advanced', label: isAr ? 'متقدم' : 'Advanced', sublabel: isAr ? '٨ أزواج ذكية' : '8 Smart Pairs', icon: '🧠', color: 'from-purple-500 to-indigo-700' },
          ].map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => startNewGame(lvl.id as Difficulty)}
              className={`p-6 rounded-3xl bg-gradient-to-br ${lvl.color} text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 flex flex-col items-center gap-2 cursor-pointer group select-none`}
            >
              <span className="text-5xl group-hover:animate-bounce">{lvl.icon}</span>
              <span className="text-2xl font-black">{lvl.label}</span>
              <span className="text-xs text-white/90 font-semibold">{lvl.sublabel}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // UI - PLAYING
  // --------------------------------------------------------------------------
  return (
    <div className="flex flex-col items-center w-full px-4 py-4 min-h-[85vh]">
      <GameHeader
        title={isAr ? 'التعرف على العلاقات' : 'Relations Discovery'}
        icon="🔗"
        score={game.score}
        onRestart={() => setGame(prev => ({ ...prev, status: 'menu' }))}
        onGoHome={onGoHome}
        accentGradient="from-[#4fc3f7] to-[#0288d1]"
        badgeText={isAr ? `مستوى: ${game.difficulty === 'easy' ? 'سهل' : game.difficulty === 'medium' ? 'متوسط' : 'متقدم'}` : `Level: ${game.difficulty}`}
      />

      <div className="bg-white dark:bg-[#0b1329] rounded-[2.5rem] p-5 sm:p-10 shadow-2xl border border-sky-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 max-w-4xl w-full flex flex-col items-center">
        
        {/* Feedback Message */}
        <div className="w-full text-center mb-8 h-16 flex items-center justify-center">
          <div className={`inline-block px-6 py-3 rounded-2xl font-bold text-sm sm:text-lg transition-all transform animate-pop-in shadow-sm ${
            game.message.startsWith('✅') 
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300'
              : game.message.startsWith('❌')
              ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-800 dark:text-rose-300'
              : 'bg-sky-50 dark:bg-sky-950/40 border border-sky-200 text-sky-800 dark:text-sky-300'
          }`}>
            {game.message}
          </div>
        </div>

        {/* Two Matching Columns */}
        <div className="grid grid-cols-2 gap-4 sm:gap-10 w-full relative">
          {/* Connector Decoration (Desktop only) */}
          <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
            <Sparkles className="w-32 h-32 text-sky-500" />
          </div>

          {/* Left Column (Items A) */}
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center justify-center gap-2 mb-2">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <h3 className="font-black text-slate-500 text-xs sm:text-sm uppercase tracking-wider">
                {isAr ? 'المجموعة الأولى' : 'Group A'}
              </h3>
            </div>
            {leftColumn.map((rel) => {
              const isMatched = game.matchedIds.includes(rel.id);
              const isSelected = game.selectedLeft === rel.id;
              return (
                <button
                  key={`left-${rel.id}`}
                  onClick={() => handleSelectLeft(rel.id)}
                  disabled={isMatched || game.isProcessing}
                  className={`relative p-4 sm:p-5 rounded-[1.5rem] flex flex-col sm:flex-row items-center gap-3 transition-all transform duration-200 select-none border-4 ${
                    isMatched
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400 opacity-60'
                      : isSelected
                      ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-400 dark:border-amber-600 shadow-xl scale-105 z-10'
                      : 'bg-white dark:bg-slate-800/50 hover:bg-sky-50 dark:hover:bg-slate-700 border-slate-100 dark:border-slate-800 hover:border-sky-300 shadow-md cursor-pointer active:scale-95'
                  }`}
                >
                  <span className={`text-4xl sm:text-5xl transition-transform ${isSelected ? 'scale-110' : ''}`}>
                    {rel.itemA.icon}
                  </span>
                  <div className="flex-1 font-black text-xs sm:text-base text-center sm:text-start leading-tight">
                    {isAr ? rel.itemA.nameAr : rel.itemA.nameEn}
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
              <h3 className="font-black text-slate-500 text-xs sm:text-sm uppercase tracking-wider">
                {isAr ? 'المجموعة الثانية' : 'Group B'}
              </h3>
              <HelpCircle className="w-4 h-4 text-slate-400" />
            </div>
            {rightColumn.map((rel) => {
              const isMatched = game.matchedIds.includes(rel.id);
              const isSelected = game.selectedRight === rel.id;
              return (
                <button
                  key={`right-${rel.id}`}
                  onClick={() => handleSelectRight(rel.id)}
                  disabled={isMatched || game.isProcessing}
                  className={`relative p-4 sm:p-5 rounded-[1.5rem] flex flex-col sm:flex-row-reverse items-center gap-3 transition-all transform duration-200 select-none border-4 ${
                    isMatched
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400 opacity-60'
                      : isSelected
                      ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-400 dark:border-amber-600 shadow-xl scale-105 z-10'
                      : 'bg-white dark:bg-slate-800/50 hover:bg-sky-50 dark:hover:bg-slate-700 border-slate-100 dark:border-slate-800 hover:border-sky-300 shadow-md cursor-pointer active:scale-95'
                  }`}
                >
                  <span className={`text-4xl sm:text-5xl transition-transform ${isSelected ? 'scale-110' : ''}`}>
                    {rel.itemB.icon}
                  </span>
                  <div className="flex-1 font-black text-xs sm:text-base text-center sm:text-end leading-tight">
                    {isAr ? rel.itemB.nameAr : rel.itemB.nameEn}
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
            <span>{game.matchedIds.length} / {game.currentPairs.length}</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-3.5 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-all duration-500 ease-out"
              style={{ width: `${(game.matchedIds.length / (game.currentPairs.length || 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {game.status === 'round-end' && (
        <WinCelebration
          score={game.score}
          message={isAr ? "🎉 مذهل! لقد أتقنت جميع العلاقات في هذا المستوى!" : "🎉 Amazing! You mastered all relations in this level!"}
          onRestart={() => setGame(prev => ({ ...prev, status: 'menu' }))}
          onGoHome={onGoHome}
          stars={3}
        />
      )}
    </div>
  );
};

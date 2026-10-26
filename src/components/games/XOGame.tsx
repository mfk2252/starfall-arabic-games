import React, { useState, useEffect, useCallback } from 'react';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';
import { useLanguage } from '../../i18n/LanguageContext';
import { RotateCcw, ArrowRight, ArrowLeft, User, Monitor, Trophy } from 'lucide-react';

type Player = 'P1' | 'P2' | null;
type GameMode = 'PvP' | 'PvE';
type SymbolType = 'classic' | 'numbers' | 'arabic' | 'english';

interface SymbolPair {
  p1: string;
  p2: string;
}

const SYMBOL_PAIRS: Record<SymbolType, SymbolPair[]> = {
  classic: [{ p1: 'X', p2: 'O' }],
  numbers: [
    { p1: '1', p2: '2' },
    { p1: '5', p2: '0' },
    { p1: '3', p2: '4' }
  ],
  arabic: [
    { p1: 'أ', p2: 'ب' },
    { p1: 'ج', p2: 'د' },
    { p1: 'س', p2: 'ش' }
  ],
  english: [
    { p1: 'A', p2: 'B' },
    { p1: 'Y', p2: 'Z' },
    { p1: 'M', p2: 'W' }
  ]
};

export const XOGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  const [gameState, setGameState] = useState<'menu' | 'play' | 'win'>('menu');
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'P1' | 'P2'>('P1');
  const [gameMode, setGameMode] = useState<GameMode>('PvE');
  const [symbolType, setSymbolType] = useState<SymbolType>('classic');
  const [currentPair, setCurrentPair] = useState<SymbolPair>(SYMBOL_PAIRS.classic[0]);
  const [winner, setWinner] = useState<Player | 'Draw'>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  const checkWinner = (squares: Player[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    
    if (squares.every(s => s !== null)) return { winner: 'Draw' as const, line: null };
    return null;
  };

  const minimax = (squares: Player[], isMaximizing: boolean): number => {
    const res = checkWinner(squares);
    if (res?.winner === 'P2') return 10;
    if (res?.winner === 'P1') return -10;
    if (res?.winner === 'Draw') return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
          squares[i] = 'P2';
          const score = minimax(squares, false);
          squares[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
          squares[i] = 'P1';
          const score = minimax(squares, true);
          squares[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const getBestMove = (squares: Player[]) => {
    let bestScore = -Infinity;
    let move = -1;
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        squares[i] = 'P2';
        const score = minimax(squares, false);
        squares[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  };

  const handleSquareClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
      if (result.winner === 'P1' || (gameMode === 'PvP' && result.winner === 'P2')) {
        sound.playWin();
        saveGameProgress('xo-game', 50, true);
      } else {
        sound.playClick();
      }
      setTimeout(() => setGameState('win'), 1000);
      return;
    }

    sound.playClick();
    setCurrentPlayer(currentPlayer === 'P1' ? 'P2' : 'P1');
  };

  useEffect(() => {
    if (gameMode === 'PvE' && currentPlayer === 'P2' && !winner) {
      const timer = setTimeout(() => {
        const move = getBestMove(board);
        if (move !== -1) handleSquareClick(move);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, board, winner, gameMode]);

  const startGame = (mode: GameMode, type: SymbolType) => {
    sound.playClick();
    setGameMode(mode);
    setSymbolType(type);
    const pairs = SYMBOL_PAIRS[type];
    setCurrentPair(pairs[Math.floor(Math.random() * pairs.length)]);
    setBoard(Array(9).fill(null));
    setCurrentPlayer('P1');
    setWinner(null);
    setWinningLine(null);
    setGameState('play');
  };

  const resetGame = () => {
    sound.playClick();
    setBoard(Array(9).fill(null));
    setCurrentPlayer('P1');
    setWinner(null);
    setWinningLine(null);
    setGameState('play');
  };

  // Menu View
  if (gameState === 'menu') {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center space-y-8 py-4 px-2">
        <div className="w-full flex items-center justify-between">
          <button onClick={() => { sound.playClick(); onGoHome(); }} className="flex items-center gap-2 bg-white dark:bg-[#20091b] px-4 py-2.5 rounded-full font-bold shadow-sm border border-slate-200 dark:border-slate-800">
            <BackIcon className="w-5 h-5 text-amber-500" />
            <span>{isAr ? 'الرجوع للقائمة' : 'Back to Games'}</span>
          </button>
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-full font-black text-sm shadow-sm">
            XO
          </div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white">
            {isAr ? 'اختر نمط اللعب' : 'Choose Game Mode'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            {isAr ? 'العب ضد الكمبيوتر أو مع صديقك باستخدام الحروف والأرقام' : 'Play vs CPU or with a friend using letters and numbers'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
          {/* PvE Section */}
          <div className="bg-white dark:bg-[#20091b] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600">
                <Monitor className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black">{isAr ? 'ضد الكمبيوتر' : 'vs Computer'}</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'classic', label: 'X / O', icon: '❌' },
                { id: 'numbers', label: '1 / 2', icon: '🔢' },
                { id: 'arabic', label: 'أ / ب', icon: 'أ' },
                { id: 'english', label: 'A / B', icon: '🔤' }
              ].map(t => (
                <button key={t.id} onClick={() => startGame('PvE', t.id as any)} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-slate-200 dark:border-slate-700 transition-all font-bold flex flex-col items-center gap-2 cursor-pointer">
                  <span className="text-2xl">{t.icon}</span>
                  <span className="text-xs">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* PvP Section */}
          <div className="bg-white dark:bg-[#20091b] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl text-emerald-600">
                <User className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black">{isAr ? 'لاعبان (محلي)' : 'Two Players'}</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'classic', label: 'X / O', icon: '❌' },
                { id: 'numbers', label: '1 / 2', icon: '🔢' },
                { id: 'arabic', label: 'أ / ب', icon: 'أ' },
                { id: 'english', label: 'A / B', icon: '🔤' }
              ].map(t => (
                <button key={t.id} onClick={() => startGame('PvP', t.id as any)} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-slate-200 dark:border-slate-700 transition-all font-bold flex flex-col items-center gap-2 cursor-pointer">
                  <span className="text-2xl">{t.icon}</span>
                  <span className="text-xs">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Win View
  if (gameState === 'win') {
    const isHumanWinner = winner === 'P1' || (gameMode === 'PvP' && winner === 'P2');
    const isDraw = winner === 'Draw';

    return (
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center py-10 px-4 text-center space-y-6">
        {isHumanWinner && (
          <WinCelebration score={50} onRestart={resetGame} onGoHome={() => setGameState('menu')} />
        )}
        <div className="bg-white dark:bg-[#20091b] rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800 w-full space-y-6">
          <div className={`w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr ${isDraw ? 'from-slate-400 to-slate-500' : 'from-amber-400 to-orange-600'} flex items-center justify-center text-6xl shadow-md animate-bounce`}>
            {isDraw ? '🤝' : <Trophy className="w-12 h-12 text-white" />}
          </div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white">
            {isDraw 
              ? (isAr ? 'تعادل! حاول مرة أخرى' : 'It is a Draw!') 
              : (winner === 'P1' 
                  ? (isAr ? 'فوز مستحق للاعب الأول!' : 'Player 1 Wins!') 
                  : (gameMode === 'PvE' 
                      ? (isAr ? 'حظ أوفر، فاز الكمبيوتر' : 'CPU Wins!') 
                      : (isAr ? 'فوز مستحق للاعب الثاني!' : 'Player 2 Wins!')))}
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button onClick={resetGame} className={`w-full sm:w-auto ${isDraw ? 'bg-slate-600' : 'bg-gradient-to-r from-amber-500 to-orange-600'} text-white px-8 py-3 rounded-2xl font-black text-sm shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2`}>
              <RotateCcw className="w-4 h-4" />
              <span>{isAr ? 'لعب مرة أخرى' : 'Play Again'}</span>
            </button>
            <button onClick={() => setGameState('menu')} className="w-full sm:w-auto bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-2xl font-black text-sm">
              {isAr ? 'تغيير النمط' : 'Change Mode'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Play View
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center py-4 space-y-8 px-2">
      <div className="w-full flex items-center justify-between">
        <button onClick={() => setGameState('menu')} className="flex items-center gap-2 bg-white dark:bg-[#20091b] px-4 py-2.5 rounded-full font-bold shadow-sm border border-slate-200 dark:border-slate-800">
          <BackIcon className="w-5 h-5 text-amber-500" />
          <span>{isAr ? 'الرجوع' : 'Back'}</span>
        </button>
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full font-bold text-sm">
          <span>{isAr ? 'النمط:' : 'Mode:'}</span>
          <span className="text-amber-600">{gameMode === 'PvE' ? (isAr ? 'ضد الكمبيوتر' : 'vs CPU') : (isAr ? 'لاعبان' : 'Two Players')}</span>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center gap-8 bg-white dark:bg-[#20091b] p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm w-full max-w-md justify-around">
        <div className={`flex flex-col items-center gap-2 transition-all duration-300 ${currentPlayer === 'P1' ? 'scale-110 opacity-100' : 'opacity-40'}`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-black bg-blue-500 text-white shadow-md ${currentPlayer === 'P1' ? 'ring-4 ring-blue-500/20' : ''}`}>
            {currentPair.p1}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">{isAr ? 'اللاعب 1' : 'Player 1'}</span>
        </div>

        <div className="text-slate-300 font-black text-xl">VS</div>

        <div className={`flex flex-col items-center gap-2 transition-all duration-300 ${currentPlayer === 'P2' ? 'scale-110 opacity-100' : 'opacity-40'}`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-black bg-rose-500 text-white shadow-md ${currentPlayer === 'P2' ? 'ring-4 ring-rose-500/20' : ''}`}>
            {currentPair.p2}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">{gameMode === 'PvE' ? (isAr ? 'الكمبيوتر' : 'CPU') : (isAr ? 'اللاعب 2' : 'Player 2')}</span>
        </div>
      </div>

      {/* XO Grid */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-[360px] aspect-square bg-slate-200 dark:bg-slate-800 p-3 rounded-3xl shadow-inner relative">
        {board.map((square, i) => {
          const isWinningSquare = winningLine?.includes(i);
          return (
            <button
              key={i}
              onClick={() => handleSquareClick(i)}
              disabled={square !== null || !!winner || (gameMode === 'PvE' && currentPlayer === 'P2')}
              className={`aspect-square rounded-2xl text-4xl sm:text-5xl font-black transition-all transform active:scale-95 flex items-center justify-center ${
                !square 
                  ? 'bg-white dark:bg-[#20091b] hover:bg-blue-50 dark:hover:bg-blue-900/10 cursor-pointer shadow-sm' 
                  : square === 'P1'
                    ? (isWinningSquare ? 'bg-blue-500 text-white scale-105 z-10' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600')
                    : (isWinningSquare ? 'bg-rose-500 text-white scale-105 z-10' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-600')
              }`}
            >
              {square === 'P1' ? currentPair.p1 : square === 'P2' ? currentPair.p2 : ''}
            </button>
          );
        })}
      </div>

      <div className="flex gap-4">
        <button onClick={resetGame} className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-[#20091b] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-full font-bold transition-all cursor-pointer">
          <RotateCcw className="w-4 h-4" />
          <span>{isAr ? 'إعادة البدء' : 'Reset Board'}</span>
        </button>
      </div>
    </div>
  );
};

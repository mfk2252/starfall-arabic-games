import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';
import { useLanguage } from '../../i18n/LanguageContext';
import { Shuffle, Eye, EyeOff, Lightbulb, Trophy, RotateCcw, Hash } from 'lucide-react';

type GridSize = 3 | 4 | 5; // 3x3 (1-8), 4x4 (1-15), 5x5 (1-24)
type NumFormat = 'ar' | 'en';

export const NumberSortingGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const { language } = useLanguage();
  const [gridSize, setGridSize] = useState<GridSize>(4);
  const [numFormat, setNumFormat] = useState<NumFormat>(language === 'ar' ? 'ar' : 'en');
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Convert numbers to Arabic or English display string
  const formatNumber = useCallback(
    (num: number): string => {
      if (num === 0) return '';
      if (numFormat === 'ar') {
        const arDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        return num
          .toString()
          .split('')
          .map((d) => arDigits[parseInt(d, 10)] || d)
          .join('');
      }
      return num.toString();
    },
    [numFormat]
  );

  // Check if grid is in target solved state [1, 2, 3, ..., N-1, 0]
  const isSolved = useCallback((board: number[]): boolean => {
    if (board.length === 0) return false;
    for (let i = 0; i < board.length - 1; i++) {
      if (board[i] !== i + 1) return false;
    }
    return board[board.length - 1] === 0;
  }, []);

  // Generate solvable puzzle state by taking valid random slides from solved state
  const shuffleTiles = useCallback((size: GridSize) => {
    const total = size * size;
    let board = Array.from({ length: total }, (_, i) => (i === total - 1 ? 0 : i + 1));
    let emptyIdx = total - 1;

    const numShuffles = size * size * 25;
    for (let i = 0; i < numShuffles; i++) {
      const validNeighbors: number[] = [];
      const row = Math.floor(emptyIdx / size);
      const col = emptyIdx % size;

      if (row > 0) validNeighbors.push(emptyIdx - size); // UP
      if (row < size - 1) validNeighbors.push(emptyIdx + size); // DOWN
      if (col > 0) validNeighbors.push(emptyIdx - 1); // LEFT
      if (col < size - 1) validNeighbors.push(emptyIdx + 1); // RIGHT

      const chosenNeighbor = validNeighbors[Math.floor(Math.random() * validNeighbors.length)];
      board[emptyIdx] = board[chosenNeighbor];
      board[chosenNeighbor] = 0;
      emptyIdx = chosenNeighbor;
    }

    // Ensure it is not already solved by chance
    if (isSolved(board)) {
      const temp = board[0];
      board[0] = board[1];
      board[1] = temp;
    }

    return board;
  }, [isSolved]);

  // Initialize or restart the game
  const initGame = useCallback(
    (size: GridSize = gridSize) => {
      const newBoard = shuffleTiles(size);
      setTiles(newBoard);
      setMoves(0);
      setSeconds(0);
      setIsTimerRunning(true);
      setIsGameOver(false);
      setScore(0);
    },
    [gridSize, shuffleTiles]
  );

  useEffect(() => {
    initGame(gridSize);
  }, [gridSize, initGame]);

  // Timer logic
  useEffect(() => {
    if (isTimerRunning && !isGameOver) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, isGameOver]);

  // Handle tile clicking or dragging
  const handleTileClick = (index: number) => {
    if (isGameOver) return;

    const emptyIdx = tiles.indexOf(0);
    if (emptyIdx === -1) return;

    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    const emptyRow = Math.floor(emptyIdx / gridSize);
    const emptyCol = emptyIdx % gridSize;

    // Check if directly adjacent (orthogonally)
    const isAdjacent =
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow);

    // If same row or column (multi-tile push)
    const isSameRow = row === emptyRow;
    const isSameCol = col === emptyCol;

    if (isAdjacent || isSameRow || isSameCol) {
      const newTiles = [...tiles];

      if (isAdjacent) {
        newTiles[emptyIdx] = newTiles[index];
        newTiles[index] = 0;
      } else if (isSameRow) {
        const step = col < emptyCol ? 1 : -1;
        for (let c = emptyCol; c !== col; c -= step) {
          newTiles[row * gridSize + c] = newTiles[row * gridSize + (c - step)];
        }
        newTiles[index] = 0;
      } else if (isSameCol) {
        const step = row < emptyRow ? 1 : -1;
        for (let r = emptyRow; r !== row; r -= step) {
          newTiles[r * gridSize + col] = newTiles[(r - step) * gridSize + col];
        }
        newTiles[index] = 0;
      }

      sound.playPop();
      setTiles(newTiles);
      setMoves((prev) => prev + 1);

      // Check win
      if (isSolved(newTiles)) {
        sound.playMatch();
        setIsTimerRunning(false);
        setIsGameOver(true);

        const calculatedScore = Math.max(
          100,
          Math.round(1000 - moves * 15 - seconds * 3 + gridSize * 150)
        );
        setScore(calculatedScore);
        saveGameProgress('number-sorting', calculatedScore, true);
      }
    } else {
      sound.playWrong();
    }
  };

  // Provide a subtle helpful hint (move one tile closer to solved position)
  const handleHint = () => {
    if (isGameOver) return;
    const emptyIdx = tiles.indexOf(0);
    const row = Math.floor(emptyIdx / gridSize);
    const col = emptyIdx % gridSize;

    const targetPosForEmpty = tiles.length - 1;
    const targetEmptyRow = Math.floor(targetPosForEmpty / gridSize);
    const targetEmptyCol = targetPosForEmpty % gridSize;

    const neighbors: number[] = [];
    if (row > 0) neighbors.push(emptyIdx - gridSize);
    if (row < gridSize - 1) neighbors.push(emptyIdx + gridSize);
    if (col > 0) neighbors.push(emptyIdx - 1);
    if (col < gridSize - 1) neighbors.push(emptyIdx + 1);

    // Pick a neighbor tile that is not in its correct position
    const candidate = neighbors.find((n) => tiles[n] !== n + 1) ?? neighbors[0];
    if (candidate !== undefined) {
      handleTileClick(candidate);
    }
  };

  const emptyIdx = tiles.indexOf(0);

  // Format mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center w-full px-2 sm:px-4 py-3 min-h-[85vh]">
      <GameHeader
        title={language === 'ar' ? 'لعبة الترتيب' : 'Number Sorting Game'}
        icon="🧩"
        score={moves}
        onRestart={() => initGame(gridSize)}
        onGoHome={onGoHome}
        accentGradient="from-[#dc2626] via-[#f59e0b] to-[#1e293b]"
        badgeText={
          language === 'ar'
            ? `الخطوات: ${formatNumber(moves)} | الوقت: ${formatTime(seconds)}`
            : `Moves: ${moves} | Time: ${formatTime(seconds)}`
        }
      />

      {/* Main Game Container */}
      <div className="bg-white dark:bg-[#20091b] rounded-3xl p-4 sm:p-6 shadow-xl border border-rose-100 dark:border-[#3d122f] text-slate-800 dark:text-slate-100 max-w-xl w-full flex flex-col items-center">
        
        {/* Controls Bar: Grid Size & Number Format */}
        <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-4 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800">
          
          {/* Grid Size Selectors */}
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 hidden sm:inline">
              {language === 'ar' ? 'الحجم:' : 'Grid:'}
            </span>
            {([3, 4, 5] as GridSize[]).map((size) => (
              <button
                key={size}
                onClick={() => {
                  sound.playClick();
                  setGridSize(size);
                }}
                className={`px-2.5 py-1 text-xs font-black rounded-xl transition-all cursor-pointer ${
                  gridSize === size
                    ? 'bg-rose-600 text-white shadow-md scale-105'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50'
                }`}
              >
                {size}x{size} {size === 4 && '⭐'}
              </button>
            ))}
          </div>

          {/* Action Buttons: Language toggle, Preview, Hint */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                sound.playClick();
                setNumFormat((prev) => (prev === 'ar' ? 'en' : 'ar'));
              }}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700 rounded-xl hover:scale-105 transition-all cursor-pointer"
              title={language === 'ar' ? 'تبديل شكل الأرقام' : 'Switch Number Format'}
            >
              <Hash className="w-3.5 h-3.5" />
              <span>{numFormat === 'ar' ? '١٢٣' : '123'}</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setShowPreview((prev) => !prev);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                showPreview
                  ? 'bg-emerald-600 text-white border-emerald-700'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200'
              }`}
            >
              {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">
                {language === 'ar' ? (showPreview ? 'إخفاء الهدف' : 'معاينة الهدف') : showPreview ? 'Hide Target' : 'Target'}
              </span>
            </button>

            <button
              onClick={handleHint}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-amber-500 text-white rounded-xl shadow-sm hover:bg-amber-600 transition-all cursor-pointer active:scale-95"
              title={language === 'ar' ? 'تلميح تحريك' : 'Hint'}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'تلميح' : 'Hint'}</span>
            </button>
          </div>
        </div>

        {/* Target Solution Preview Modal/Box */}
        {showPreview && (
          <div className="w-full bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-300 dark:border-emerald-700 rounded-2xl p-3 mb-4 animate-pop-in text-center">
            <span className="text-xs font-black text-emerald-800 dark:text-emerald-200 block mb-2">
              {language === 'ar'
                ? `الشكل النهائي المطلوب للوحة (${gridSize}×${gridSize}):`
                : `Target Solved Pattern (${gridSize}x${gridSize}):`}
            </span>
            <div
              className="grid gap-1.5 max-w-[200px] mx-auto p-2 bg-slate-900 rounded-xl"
              style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
                const val = idx === gridSize * gridSize - 1 ? 0 : idx + 1;
                const col = idx % gridSize;
                const isEvenCol = col % 2 === 0;
                return (
                  <div
                    key={idx}
                    className={`h-7 rounded-md flex items-center justify-center font-bold text-xs shadow-xs ${
                      val === 0
                        ? 'bg-slate-950 border border-slate-800 text-transparent'
                        : isEvenCol
                        ? 'bg-white text-amber-600 border border-amber-200'
                        : 'bg-rose-600 text-yellow-200 border border-rose-700'
                    }`}
                  >
                    {formatNumber(val)}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Physical Tray Toy Frame (Exactly styled after AliExpress physical puzzle photo!) */}
        <div className="relative w-full max-w-[420px] aspect-square bg-gradient-to-b from-slate-900 via-zinc-900 to-black p-3.5 sm:p-5 rounded-[2.5rem] shadow-2xl border-4 sm:border-8 border-slate-800 dark:border-slate-900 flex items-center justify-center select-none overflow-hidden">
          {/* Inner Inset Tray Shadow */}
          <div
            className="w-full h-full grid gap-2 sm:gap-3 bg-zinc-950/90 p-2 sm:p-3 rounded-2xl border-2 border-zinc-800/80 shadow-inner"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
            }}
          >
            {tiles.map((val, idx) => {
              const isEmpty = val === 0;

              // Alternating columns color pattern (White vs Red, matching physical reference photo!)
              const col = idx % gridSize;
              const isEvenCol = col % 2 === 0;

              // Calculate distance to empty slot
              const row = Math.floor(idx / gridSize);
              const emptyRow = Math.floor(emptyIdx / gridSize);
              const emptyCol = emptyIdx % gridSize;
              const isAdjacent =
                (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
                (Math.abs(col - emptyCol) === 1 && row === emptyRow);

              let tileStyle = '';
              let textStyle = '';

              if (isEmpty) {
                tileStyle = 'bg-zinc-950/80 border-2 border-dashed border-zinc-800 shadow-inner opacity-40';
              } else if (isEvenCol) {
                // White tile with Gold text
                tileStyle =
                  'bg-gradient-to-b from-white via-slate-50 to-slate-100 border-2 border-amber-300/80 text-amber-600 dark:text-amber-500 shadow-md hover:shadow-lg hover:border-amber-400';
                textStyle = 'drop-shadow-[0_1px_1px_rgba(217,119,6,0.3)] font-serif';
              } else {
                // Red tile with Light Gold text
                tileStyle =
                  'bg-gradient-to-b from-rose-600 via-red-600 to-rose-700 border-2 border-red-500/80 text-amber-200 dark:text-yellow-300 shadow-md hover:shadow-lg hover:border-amber-300';
                textStyle = 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] font-serif';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleTileClick(idx)}
                  disabled={isEmpty || isGameOver}
                  className={`relative rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center transition-all duration-200 transform cursor-pointer ${
                    isEmpty ? 'cursor-default' : 'active:scale-95 hover:scale-[1.02]'
                  } ${isAdjacent && !isEmpty ? 'ring-2 sm:ring-4 ring-amber-400/60 animate-pulse' : ''} ${tileStyle}`}
                >
                  {!isEmpty && (
                    <span
                      className={`font-black text-2xl sm:text-4xl md:text-5xl leading-none select-none ${textStyle}`}
                    >
                      {formatNumber(val)}
                    </span>
                  )}
                  {/* Solved position indicator badge */}
                  {!isEmpty && val === idx + 1 && (
                    <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 shadow-xs" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Controls Footer */}
        <div className="w-full flex items-center justify-between gap-3 mt-5">
          <button
            onClick={() => {
              sound.playClick();
              initGame(gridSize);
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-amber-600 text-white py-3 px-4 rounded-2xl font-black text-sm shadow-md hover:opacity-95 transition-all cursor-pointer active:scale-95"
          >
            <Shuffle className="w-4 h-4" />
            <span>{language === 'ar' ? 'خلط جديد 🔀' : 'Shuffle Board 🔀'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              initGame(gridSize);
            }}
            className="flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-3 px-4 rounded-2xl font-extrabold text-sm border border-slate-300 dark:border-slate-700 hover:bg-slate-200 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'ar' ? 'إعادة' : 'Reset'}</span>
          </button>
        </div>
      </div>

      {/* Win Celebration Modal */}
      {isGameOver && (
        <WinCelebration
          score={score}
          message={
            language === 'ar'
              ? `🎉 رائع جداً بطل الترتيب! لقد نجحت في ترتيب جميع الأرقام في ${formatNumber(
                  moves
                )} خطوة وخلال ${formatTime(seconds)}!`
              : `🎉 Brilliant sorting champion! You completed the puzzle in ${moves} moves and ${formatTime(
                  seconds
                )}!`
          }
          onRestart={() => initGame(gridSize)}
          onGoHome={onGoHome}
          stars={moves <= gridSize * gridSize * 3 ? 3 : moves <= gridSize * gridSize * 5 ? 2 : 1}
        />
      )}
    </div>
  );
};

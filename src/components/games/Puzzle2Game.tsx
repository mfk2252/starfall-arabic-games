import React, { useState, useEffect, useCallback } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface Puzzle2Item {
  id: string;
  name: string;
  fullEmoji: string;
  leftEmoji: string;
  rightEmoji: string;
  description: string;
  color: string;
}

const PUZZLES_2: Puzzle2Item[] = [
  {
    id: 'lion',
    name: 'الأسد الشجاع',
    fullEmoji: '🦁',
    leftEmoji: '🦁 نصف',
    rightEmoji: '🦁 نصف',
    description: 'ملك الغابة القوي',
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: 'car',
    name: 'السيارة السريعة',
    fullEmoji: '🚗',
    leftEmoji: '🚗 نصف',
    rightEmoji: '🚗 نصف',
    description: 'سيارة تسير على الطريق',
    color: 'from-sky-400 to-blue-500',
  },
  {
    id: 'rocket',
    name: 'الصاروخ الفضائي',
    fullEmoji: '🚀',
    leftEmoji: '🚀 نصف',
    rightEmoji: '🚀 نصف',
    description: 'ينطلق بسرعة نحو النجوم',
    color: 'from-purple-400 to-indigo-600',
  },
  {
    id: 'apple',
    name: 'التفاحة اللذيذة',
    fullEmoji: '🍎',
    leftEmoji: '🍎 نصف',
    rightEmoji: '🍎 نصف',
    description: 'فاكهة صحية ومفيدة',
    color: 'from-rose-400 to-red-600',
  },
];

export const Puzzle2Game: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [solvedLevels, setSolvedLevels] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('اختر النصف الأيمن والنصف الأيسر لتكوين الصورة كاملة!');
  const [shuffledRightList, setShuffledRightList] = useState<string[]>([]);

  const initLevel = useCallback((level: number) => {
    setSelectedLeft(null);
    setSelectedRight(null);
    setMessage('اختر النصف الأيمن والنصف الأيسر لتكوين الصورة كاملة!');

    // Shuffle other puzzle IDs for candidate pieces
    const currentPuzzle = PUZZLES_2[level];
    const pool = PUZZLES_2.map((p) => p.id);
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    // ensure currentPuzzle is in options
    if (!shuffled.slice(0, 3).includes(currentPuzzle.id)) {
      shuffled[0] = currentPuzzle.id;
    }
    setShuffledRightList(shuffled.slice(0, 3));
  }, []);

  const initGame = useCallback(() => {
    setCurrentLevel(0);
    setSolvedLevels([]);
    setScore(0);
    setIsGameOver(false);
    initLevel(0);
  }, [initLevel]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const target = PUZZLES_2[currentLevel];

  const handleSelectPiece = (side: 'left' | 'right', puzzleId: string) => {
    sound.playClick();
    if (side === 'left') {
      setSelectedLeft(puzzleId);
      if (selectedRight) {
        checkAssembly(puzzleId, selectedRight);
      }
    } else {
      setSelectedRight(puzzleId);
      if (selectedLeft) {
        checkAssembly(selectedLeft, puzzleId);
      }
    }
  };

  const checkAssembly = (leftId: string, rightId: string) => {
    if (leftId === target.id && rightId === target.id) {
      // Puzzle completed!
      sound.playMatch();
      const newScore = score + 25;
      setScore(newScore);
      const updatedSolved = [...solvedLevels, currentLevel];
      setSolvedLevels(updatedSolved);
      setMessage(`🎉 رائع جداً! لقد كوّنت صورة (${target.name}) بنجاح!`);

      setTimeout(() => {
        if (currentLevel + 1 < PUZZLES_2.length) {
          setCurrentLevel((prev) => prev + 1);
          initLevel(currentLevel + 1);
        } else {
          saveGameProgress('puzzle-2', newScore, true);
          setIsGameOver(true);
        }
      }, 1500);
    } else {
      sound.playWrong();
      setMessage('❌ النصفان لا يكوّنان نفس الصورة! حاول مجدداً.');
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 900);
    }
  };

  const isCurrentSolved = solvedLevels.includes(currentLevel);

  return (
    <div className="flex flex-col items-center w-full px-4 py-4 min-h-[85vh]">
      <GameHeader
        title="ترتيب الصور - قطعتان"
        icon="🧩"
        score={score}
        onRestart={initGame}
        onGoHome={onGoHome}
        accentGradient="from-[#ffd54f] to-[#f57c00]"
        badgeText={`مستوى ${currentLevel + 1} من ${PUZZLES_2.length}`}
      />

      <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-5 sm:p-8 shadow-xl border border-amber-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 max-w-2xl w-full flex flex-col items-center">
        {/* Target name and guidance */}
        <div className="text-center mb-6">
          <div className="inline-block bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 font-bold px-4 py-2 rounded-2xl text-sm sm:text-base mb-2">
            {message}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
            المطلوب تكوين: <span className="text-amber-600">{target.name}</span>
          </h2>
        </div>

        {/* Assembly Stage */}
        <div className="w-full max-w-md bg-slate-100 border-4 border-dashed border-amber-300 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[220px] mb-8 relative overflow-hidden">
          {isCurrentSolved ? (
            <div className="flex flex-col items-center animate-pop-in">
              <span className="text-7xl sm:text-8xl filter drop-shadow-md">{target.fullEmoji}</span>
              <span className="text-lg font-black text-emerald-600 mt-2 flex items-center gap-1">
                <Check className="w-5 h-5" /> اكتملت الصورة!
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Left Slot */}
              <div
                className={`w-28 sm:w-36 h-36 sm:h-44 rounded-l-2xl border-2 flex flex-col items-center justify-center transition-all ${
                  selectedLeft
                    ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-md'
                    : 'bg-white/80 border-dashed border-slate-300 text-slate-400'
                }`}
              >
                {selectedLeft ? (
                  <div className="flex flex-col items-center">
                    <span className="text-5xl filter drop-shadow">
                      {PUZZLES_2.find((p) => p.id === selectedLeft)?.fullEmoji}
                    </span>
                    <span className="text-xs font-bold text-slate-600 mt-2">النصف الأيمن</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center p-2">
                    <ArrowRight className="w-6 h-6 mb-1 text-slate-300" />
                    <span className="text-xs font-bold">ضع القطعة الأولى</span>
                  </div>
                )}
              </div>

              {/* Right Slot */}
              <div
                className={`w-28 sm:w-36 h-36 sm:h-44 rounded-r-2xl border-2 flex flex-col items-center justify-center transition-all ${
                  selectedRight
                    ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-md'
                    : 'bg-white/80 border-dashed border-slate-300 text-slate-400'
                }`}
              >
                {selectedRight ? (
                  <div className="flex flex-col items-center">
                    <span className="text-5xl filter drop-shadow">
                      {PUZZLES_2.find((p) => p.id === selectedRight)?.fullEmoji}
                    </span>
                    <span className="text-xs font-bold text-slate-600 mt-2">النصف الأيسر</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center p-2">
                    <ArrowLeft className="w-6 h-6 mb-1 text-slate-300" />
                    <span className="text-xs font-bold">ضع القطعة الثانية</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Piece Selection Area */}
        {!isCurrentSolved && (
          <div className="w-full">
            <h3 className="text-sm font-bold text-slate-600 mb-3 text-center">اضغط على القطع لتجميع الصورة:</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Left Pieces (candidates) */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-center text-slate-500">قطع النصف الأيمن</span>
                {PUZZLES_2.slice(0, 3).map((p) => (
                  <button
                    key={`left-piece-${p.id}`}
                    onClick={() => handleSelectPiece('left', p.id)}
                    className={`p-3 rounded-2xl border-2 flex items-center justify-center gap-2 transition-all transform duration-150 ${
                      selectedLeft === p.id
                        ? 'bg-amber-400 border-amber-500 text-white scale-102 shadow-md'
                        : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-slate-800 hover:scale-102'
                    }`}
                  >
                    <span className="text-3xl">{p.fullEmoji}</span>
                    <span className="text-xs font-bold">نصف {p.name}</span>
                  </button>
                ))}
              </div>

              {/* Right Pieces (candidates) */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-center text-slate-500">قطع النصف الأيسر</span>
                {shuffledRightList.map((id) => {
                  const p = PUZZLES_2.find((item) => item.id === id);
                  if (!p) return null;
                  return (
                    <button
                      key={`right-piece-${p.id}`}
                      onClick={() => handleSelectPiece('right', p.id)}
                      className={`p-3 rounded-2xl border-2 flex items-center justify-center gap-2 transition-all transform duration-150 ${
                        selectedRight === p.id
                          ? 'bg-amber-400 border-amber-500 text-white scale-102 shadow-md'
                          : 'bg-orange-50 hover:bg-orange-100 border-orange-200 text-slate-800 hover:scale-102'
                      }`}
                    >
                      <span className="text-3xl">{p.fullEmoji}</span>
                      <span className="text-xs font-bold">نصف {p.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {isGameOver && (
        <WinCelebration
          score={score}
          message="🎉 بطل البازل الصغير! لقد جمعت وركبت جميع الصور المكونة من قطعتين!"
          onRestart={initGame}
          onGoHome={onGoHome}
          stars={3}
        />
      )}
    </div>
  );
};

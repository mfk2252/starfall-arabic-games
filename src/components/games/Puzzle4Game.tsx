import React, { useState, useEffect, useCallback } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';
import { Check } from 'lucide-react';

interface Puzzle4Item {
  id: string;
  name: string;
  emoji: string;
  themeColor: string;
  quadrants: {
    id: number; // 0: Top-Left, 1: Top-Right, 2: Bottom-Left, 3: Bottom-Right
    name: string;
    subSymbol: string;
  }[];
}

const PUZZLES_4: Puzzle4Item[] = [
  {
    id: 'dolphin',
    name: 'الدلفين في البحر',
    emoji: '🐬',
    themeColor: 'from-cyan-400 to-blue-600',
    quadrants: [
      { id: 0, name: 'سماء وغيوم', subSymbol: '☁️' },
      { id: 1, name: 'رأس الدلفين', subSymbol: '🐬' },
      { id: 2, name: 'أمواج البحر', subSymbol: '🌊' },
      { id: 3, name: 'ذيل الدلفين والماء', subSymbol: '💧' },
    ],
  },
  {
    id: 'castle',
    name: 'القلعة العجيبة',
    emoji: '🏰',
    themeColor: 'from-amber-400 to-purple-600',
    quadrants: [
      { id: 0, name: 'برج القلعة وعلم', subSymbol: '🚩' },
      { id: 1, name: 'شمس مشرقة وسحاب', subSymbol: '☀️' },
      { id: 2, name: 'بوابة القلعة الخشبية', subSymbol: '🚪' },
      { id: 3, name: 'حديقة وأزهار القلعة', subSymbol: '🌷' },
    ],
  },
  {
    id: 'rocket',
    name: 'الصاروخ والنجوم',
    emoji: '🚀',
    themeColor: 'from-indigo-500 to-purple-800',
    quadrants: [
      { id: 0, name: 'كوكب وقمر', subSymbol: '🪐' },
      { id: 1, name: 'مقدمة الصاروخ', subSymbol: '🚀' },
      { id: 2, name: 'نجوم مضيئة', subSymbol: '⭐' },
      { id: 3, name: 'لهب انطلاق الصاروخ', subSymbol: '🔥' },
    ],
  },
];

export const Puzzle4Game: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [placedQuadrants, setPlacedQuadrants] = useState<Record<number, number>>({}); // slotIdx -> quadrantId
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('اختر قطعة ثم ضعها في مكانها المناسب في البازل!');
  const [shuffledPieces, setShuffledPieces] = useState<number[]>([]);

  const target = PUZZLES_4[currentLevel];

  const initLevel = useCallback((lvl: number) => {
    setPlacedQuadrants({});
    setSelectedPiece(null);
    setIsProcessing(false);
    setMessage('اختر قطعة ثم ضعها في مكانها المناسب في البازل!');

    const pieces = [0, 1, 2, 3];
    for (let i = pieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }
    setShuffledPieces(pieces);
  }, []);

  const initGame = useCallback(() => {
    setCurrentLevel(0);
    setScore(0);
    setIsGameOver(false);
    initLevel(0);
  }, [initLevel]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleSelectTrayPiece = (quadrantId: number) => {
    if (isProcessing) return;
    sound.playClick();
    setSelectedPiece(quadrantId);
    setMessage(`اختر المكان الصحيح للقطعة: ${target.quadrants[quadrantId].name}`);
  };

  const handleSlotClick = (slotIdx: number) => {
    if (isProcessing || placedQuadrants[slotIdx] !== undefined) return;
    if (selectedPiece === null) {
      setMessage('يرجى اختيار قطعة من الأسفل أولاً!');
      return;
    }

    if (selectedPiece === slotIdx) {
      // Correct placement!
      sound.playMatch();
      const updated = { ...placedQuadrants, [slotIdx]: selectedPiece };
      setPlacedQuadrants(updated);
      setSelectedPiece(null);
      const newScore = score + 15;
      setScore(newScore);
      setMessage(`أحسنت! وضعت (${target.quadrants[selectedPiece].name}) في مكانها الصحيح!`);

      // Check if all 4 are placed
      if (Object.keys(updated).length === 4) {
        setIsProcessing(true);
        setTimeout(() => {
          sound.playWin();
          if (currentLevel + 1 < PUZZLES_4.length) {
            setCurrentLevel((prev) => prev + 1);
            initLevel(currentLevel + 1);
          } else {
            saveGameProgress('puzzle-4', newScore + 20, true);
            setIsGameOver(true);
          }
        }, 1200);
      }
    } else {
      // Wrong placement
      sound.playWrong();
      setMessage('❌ مكان غير صحيح لهذه القطعة! جرب مكاناً آخر.');
      setScore((prev) => Math.max(0, prev - 2));
    }
  };

  const unplacedPieces = shuffledPieces.filter(
    (p) => !Object.values(placedQuadrants).includes(p)
  );

  return (
    <div className="flex flex-col items-center w-full px-4 py-4 min-h-[85vh]">
      <GameHeader
        title="ترتيب الصور - أربع قطع"
        icon="🧩"
        score={score}
        onRestart={initGame}
        onGoHome={onGoHome}
        accentGradient="from-[#ff8a65] to-[#e64a19]"
        badgeText={`مستوى ${currentLevel + 1} من ${PUZZLES_4.length}`}
      />

      <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-5 sm:p-8 shadow-xl border border-orange-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 max-w-2xl w-full flex flex-col items-center">
        <div className="text-center mb-5">
          <div className="inline-block bg-orange-50 dark:bg-orange-950/80 border border-orange-200 dark:border-orange-800 text-orange-950 dark:text-orange-200 font-bold px-4 py-2 rounded-2xl text-sm sm:text-base mb-2">
            {message}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
            تركيب صورة: <span className="text-orange-600 dark:text-orange-400">{target.name} {target.emoji}</span>
          </h2>
        </div>

        {/* 2x2 Puzzle Board */}
        <div className="w-64 sm:w-80 h-64 sm:h-80 bg-slate-100 dark:bg-slate-900 rounded-3xl border-4 border-dashed border-orange-300 dark:border-slate-700 grid grid-cols-2 p-3 gap-2 shadow-inner mb-6">
          {[0, 1, 2, 3].map((slotIdx) => {
            const placedPiece = placedQuadrants[slotIdx];
            const isFilled = placedPiece !== undefined;

            return (
              <button
                key={slotIdx}
                onClick={() => handleSlotClick(slotIdx)}
                className={`rounded-2xl border-2 flex flex-col items-center justify-center p-2 transition-all relative overflow-hidden select-none ${
                  isFilled
                    ? 'bg-gradient-to-br from-amber-200 to-orange-200 border-amber-400 shadow-md scale-98'
                    : 'bg-white hover:bg-orange-50 border-dashed border-slate-300 hover:border-orange-400 cursor-pointer'
                }`}
              >
                {isFilled ? (
                  <div className="flex flex-col items-center text-center animate-pop-in">
                    <span className="text-3xl sm:text-4xl filter drop-shadow">
                      {target.quadrants[placedPiece].subSymbol}
                    </span>
                    <span className="text-[11px] font-bold text-slate-700 mt-1">
                      {target.quadrants[placedPiece].name}
                    </span>
                    <Check className="w-4 h-4 text-emerald-600 absolute top-1.5 left-1.5" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <span className="text-slate-300 text-2xl font-black">؟</span>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1">
                      المربع {slotIdx + 1}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Available Pieces Tray */}
        <div className="w-full">
          <h3 className="text-xs sm:text-sm font-bold text-slate-600 mb-3 text-center">
            {unplacedPieces.length > 0 ? 'قطع البازل المتبقية (اضغط لاختيار قطعة):' : '🎉 اكتملت جميع القطع!'}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {unplacedPieces.map((quadrantId) => {
              const item = target.quadrants[quadrantId];
              const isSelected = selectedPiece === quadrantId;
              return (
                <button
                  key={quadrantId}
                  onClick={() => handleSelectTrayPiece(quadrantId)}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all transform duration-150 select-none ${
                    isSelected
                      ? 'bg-orange-400 text-white border-orange-600 scale-105 shadow-lg ring-4 ring-orange-200'
                      : 'bg-orange-50 hover:bg-orange-100 border-orange-200 text-slate-800 hover:scale-102 cursor-pointer shadow-xs'
                  }`}
                >
                  <span className="text-3xl filter drop-shadow">{item.subSymbol}</span>
                  <span className="text-xs font-bold text-center leading-tight">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {isGameOver && (
        <WinCelebration
          score={score}
          message="🎉 بطل الذكاء والتركيز! لقد ركبت جميع الألغاز المكونة من 4 قطع بنجاح باهر!"
          onRestart={initGame}
          onGoHome={onGoHome}
          stars={3}
        />
      )}
    </div>
  );
};

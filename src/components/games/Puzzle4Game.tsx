import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';
import { Check, Hand, Sparkles } from 'lucide-react';

interface PuzzlePiece {
  id: number; // 0, 1, 2, 3
  name: string;
  subSymbol: string;
  bgGradient: string;
}

interface PuzzleItem {
  id: string;
  name: string;
  emoji: string;
  themeColor: string;
  pieces: PuzzlePiece[];
}

const PUZZLES_DATA: PuzzleItem[] = [
  {
    id: 'dolphin',
    name: 'الدلفين في البحر',
    emoji: '🐬',
    themeColor: 'from-cyan-400 to-blue-600',
    pieces: [
      { id: 0, name: 'السماء والغيوم', subSymbol: '☁️', bgGradient: 'bg-gradient-to-br from-sky-200 to-blue-200 text-sky-900 border-sky-400' },
      { id: 1, name: 'رأس الدلفين', subSymbol: '🐬', bgGradient: 'bg-gradient-to-br from-cyan-200 to-teal-300 text-cyan-950 border-cyan-400' },
      { id: 2, name: 'أمواج البحر', subSymbol: '🌊', bgGradient: 'bg-gradient-to-br from-blue-300 to-indigo-300 text-indigo-950 border-blue-400' },
      { id: 3, name: 'ذيل الدلفين والماء', subSymbol: '💧', bgGradient: 'bg-gradient-to-br from-teal-200 to-sky-300 text-teal-950 border-teal-400' },
    ],
  },
  {
    id: 'castle',
    name: 'القلعة العجيبة',
    emoji: '🏰',
    themeColor: 'from-amber-400 to-purple-600',
    pieces: [
      { id: 0, name: 'برج القلعة وعلم', subSymbol: '🚩', bgGradient: 'bg-gradient-to-br from-amber-200 to-yellow-300 text-amber-950 border-amber-400' },
      { id: 1, name: 'شمس مشرقة وسحاب', subSymbol: '☀️', bgGradient: 'bg-gradient-to-br from-orange-200 to-amber-300 text-orange-950 border-orange-400' },
      { id: 2, name: 'بوابة القلعة الخشبية', subSymbol: '🚪', bgGradient: 'bg-gradient-to-br from-stone-300 to-amber-400 text-stone-900 border-stone-400' },
      { id: 3, name: 'حديقة وأزهار القلعة', subSymbol: '🌷', bgGradient: 'bg-gradient-to-br from-emerald-200 to-green-300 text-emerald-950 border-emerald-400' },
    ],
  },
  {
    id: 'rocket',
    name: 'الصاروخ الفضائي',
    emoji: '🚀',
    themeColor: 'from-indigo-500 to-purple-800',
    pieces: [
      { id: 0, name: 'كوكب وقمر', subSymbol: '🪐', bgGradient: 'bg-gradient-to-br from-purple-200 to-indigo-300 text-purple-950 border-purple-400' },
      { id: 1, name: 'مقدمة الصاروخ', subSymbol: '🚀', bgGradient: 'bg-gradient-to-br from-sky-300 to-indigo-400 text-indigo-950 border-indigo-400' },
      { id: 2, name: 'نجوم لامعة', subSymbol: '⭐', bgGradient: 'bg-gradient-to-br from-yellow-200 to-amber-300 text-amber-950 border-amber-400' },
      { id: 3, name: 'لهب انطلاق الصاروخ', subSymbol: '🔥', bgGradient: 'bg-gradient-to-br from-rose-300 to-orange-400 text-rose-950 border-rose-400' },
    ],
  },
  {
    id: 'garden',
    name: 'فراشة الحديقة',
    emoji: '🦋',
    themeColor: 'from-emerald-400 to-teal-600',
    pieces: [
      { id: 0, name: 'فراشة ملونة', subSymbol: '🦋', bgGradient: 'bg-gradient-to-br from-pink-200 to-rose-300 text-pink-950 border-pink-400' },
      { id: 1, name: 'أزهار الربيع', subSymbol: '🌸', bgGradient: 'bg-gradient-to-br from-purple-200 to-pink-300 text-purple-950 border-purple-400' },
      { id: 2, name: 'عشبة خضراء', subSymbol: '🌿', bgGradient: 'bg-gradient-to-br from-emerald-200 to-green-300 text-emerald-950 border-emerald-400' },
      { id: 3, name: 'نحلة نشيطة', subSymbol: '🐝', bgGradient: 'bg-gradient-to-br from-amber-200 to-yellow-400 text-amber-950 border-amber-400' },
    ],
  },
];

export const Puzzle4Game: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [placedPieces, setPlacedPieces] = useState<Record<number, number>>({}); // slotIndex -> pieceId
  const [trayPieces, setTrayPieces] = useState<number[]>([]);
  const [draggedPieceId, setDraggedPieceId] = useState<number | null>(null);
  const [selectedPieceId, setSelectedPieceId] = useState<number | null>(null); // Tap-to-place fallback for kids
  const [score, setScore] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('اسحب كل قطعة وابلغ بها موضعها الصحيح في اللوحة!');

  const puzzle = PUZZLES_DATA[currentLevel];

  const initLevel = useCallback((lvl: number) => {
    setPlacedPieces({});
    setDraggedPieceId(null);
    setSelectedPieceId(null);
    setIsProcessing(false);
    setMessage('اسحب كل قطعة وابلغ بها موضعها الصحيح في اللوحة!');

    const pz = PUZZLES_DATA[lvl];
    const ids = pz.pieces.map((p) => p.id);
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    setTrayPieces(ids);
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

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, pieceId: number) => {
    if (isProcessing) return;
    setDraggedPieceId(pieceId);
    e.dataTransfer.setData('text/plain', String(pieceId));
    sound.playFlip();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnSlot = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    if (isProcessing || placedPieces[slotIndex] !== undefined) return;

    const pieceIdStr = e.dataTransfer.getData('text/plain');
    const pieceId = Number(pieceIdStr);
    if (!isNaN(pieceId)) {
      validateAndPlacePiece(pieceId, slotIndex);
    }
  };

  // Touch fallback & Click to select for mobile / accessibility
  const handleTrayPieceClick = (pieceId: number) => {
    if (isProcessing) return;
    sound.playClick();
    if (selectedPieceId === pieceId) {
      setSelectedPieceId(null);
      setMessage('اسحب كل قطعة وابلغ بها موضعها الصحيح في اللوحة!');
    } else {
      setSelectedPieceId(pieceId);
      const pieceObj = puzzle.pieces.find((p) => p.id === pieceId);
      setMessage(`تم اختيار (${pieceObj?.name}). الآن اضغط على المكان الفارغ المناسب لها في اللوحة!`);
    }
  };

  const handleSlotClick = (slotIndex: number) => {
    if (isProcessing || placedPieces[slotIndex] !== undefined) return;
    if (selectedPieceId !== null) {
      validateAndPlacePiece(selectedPieceId, slotIndex);
      setSelectedPieceId(null);
    } else if (draggedPieceId !== null) {
      validateAndPlacePiece(draggedPieceId, slotIndex);
      setDraggedPieceId(null);
    } else {
      setMessage('يرجى اختيار أو سحب قطعة من الأسفل أولاً!');
    }
  };

  const validateAndPlacePiece = (pieceId: number, slotIndex: number) => {
    if (pieceId === slotIndex) {
      // Correct placement!
      sound.playMatch();
      const updated = { ...placedPieces, [slotIndex]: pieceId };
      setPlacedPieces(updated);
      setTrayPieces((prev) => prev.filter((id) => id !== pieceId));
      const newScore = score + 20;
      setScore(newScore);
      setMessage(`🎉 ممتاز! وضعت (${puzzle.pieces[pieceId].name}) في مكانها بدقة!`);

      // Check if all 4 pieces are placed
      if (Object.keys(updated).length === 4) {
        setIsProcessing(true);
        setTimeout(() => {
          sound.playWin();
          if (currentLevel + 1 < PUZZLES_DATA.length) {
            setCurrentLevel((prev) => prev + 1);
            initLevel(currentLevel + 1);
          } else {
            saveGameProgress('puzzle-4', newScore + 30, true);
            setIsGameOver(true);
          }
        }, 1300);
      }
    } else {
      // Wrong placement
      sound.playWrong();
      setMessage(`❌ عذراً، هذا ليس المكان الصحيح لـ (${puzzle.pieces[pieceId].name}). حاول مجدداً!`);
      setScore((prev) => Math.max(0, prev - 2));
    }
  };

  return (
    <div className="flex flex-col items-center w-full px-4 py-4 min-h-[85vh]">
      <GameHeader
        title="ترتيب الصور - أربع قطع (سحب وإفلات)"
        icon="🧩"
        score={score}
        onRestart={initGame}
        onGoHome={onGoHome}
        accentGradient="from-[#ff8a65] to-[#e64a19]"
        badgeText={`مستوى ${currentLevel + 1} من ${PUZZLES_DATA.length}`}
      />

      <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-4 sm:p-7 shadow-xl border border-orange-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 max-w-2xl w-full flex flex-col items-center">
        {/* Guidance Prompt */}
        <div className="text-center mb-4 w-full">
          <div className="inline-block bg-orange-50 dark:bg-orange-950/80 border border-orange-200 dark:border-orange-800 text-orange-950 dark:text-orange-200 font-bold px-4 py-2 rounded-2xl text-xs sm:text-sm mb-2 shadow-xs">
            {message}
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100 flex items-center justify-center gap-2">
            <span>تركيب أحجية:</span>
            <span className="text-orange-600 dark:text-orange-400">{puzzle.name} {puzzle.emoji}</span>
          </h2>
        </div>

        {/* 2x2 Jigsaw Assembly Board */}
        <div className="w-64 sm:w-80 h-64 sm:h-80 bg-slate-100 dark:bg-slate-900 rounded-3xl border-4 border-dashed border-orange-300 dark:border-slate-700 grid grid-cols-2 p-3 gap-2.5 shadow-inner mb-5">
          {[0, 1, 2, 3].map((slotIndex) => {
            const placedPieceId = placedPieces[slotIndex];
            const isFilled = placedPieceId !== undefined;
            const pieceData = isFilled ? puzzle.pieces[placedPieceId] : null;

            return (
              <div
                key={slotIndex}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropOnSlot(e, slotIndex)}
                onClick={() => handleSlotClick(slotIndex)}
                className={`rounded-2xl border-2 flex flex-col items-center justify-center p-2.5 transition-all relative overflow-hidden select-none ${
                  isFilled
                    ? `${pieceData?.bgGradient} shadow-md scale-98 border-solid`
                    : selectedPieceId !== null || draggedPieceId !== null
                    ? 'bg-orange-100/70 dark:bg-orange-950/40 border-dashed border-orange-400 animate-pulse cursor-pointer'
                    : 'bg-white dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-slate-700 border-dashed border-slate-300 dark:border-slate-700 cursor-pointer'
                }`}
                style={{ minHeight: '110px' }}
              >
                {isFilled ? (
                  <div className="flex flex-col items-center text-center animate-pop-in">
                    <span className="text-4xl sm:text-5xl filter drop-shadow">
                      {pieceData?.subSymbol}
                    </span>
                    <span className="text-xs font-black mt-1 text-slate-800 dark:text-slate-100">
                      {pieceData?.name}
                    </span>
                    <Check className="w-4 h-4 text-emerald-600 bg-white/90 rounded-full p-0.5 absolute top-2 left-2 shadow" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center pointer-events-none">
                    <span className="text-slate-300 dark:text-slate-600 text-2xl font-black">؟</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-1">
                      موضع {slotIndex + 1}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pieces Tray for Dragging / Tapping */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
              <Hand className="w-3.5 h-3.5 text-orange-500" />
              <span>قطع الأحجية المتاحة (اسحب أو اضغط للوضع):</span>
            </span>
            <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 px-2.5 py-0.5 rounded-full border border-orange-200 dark:border-orange-800">
              متبقي: {trayPieces.length} قطع
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {puzzle.pieces.map((piece) => {
              const isPlaced = Object.values(placedPieces).includes(piece.id);
              if (isPlaced) return null;
              const isSelected = selectedPieceId === piece.id;

              return (
                <div
                  key={piece.id}
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, piece.id)}
                  onClick={() => handleTrayPieceClick(piece.id)}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all transform duration-150 cursor-grab active:cursor-grabbing select-none shadow-sm ${
                    isSelected
                      ? 'bg-orange-500 text-white border-orange-600 scale-105 shadow-lg ring-4 ring-orange-200'
                      : `${piece.bgGradient} hover:scale-103`
                  }`}
                >
                  <span className="text-3xl sm:text-4xl filter drop-shadow pointer-events-none">{piece.subSymbol}</span>
                  <span className="text-xs font-extrabold text-center leading-tight pointer-events-none">{piece.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {isGameOver && (
        <WinCelebration
          score={score}
          message="🎉 بطل الأحجية المتميز! لقد ركبت جميع الصور بدقة وتسلسل بصري رائع!"
          onRestart={initGame}
          onGoHome={onGoHome}
          stars={3}
        />
      )}
    </div>
  );
};


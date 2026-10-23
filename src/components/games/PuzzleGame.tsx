import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';
import { useLanguage } from '../../i18n/LanguageContext';
import { PUZZLE_IMAGES_LIBRARY, PuzzleImageItem } from '../../data/puzzleImages';
import { Sparkles, Eye, RotateCcw, ArrowRight, ArrowLeft } from 'lucide-react';

type GridSize = 2 | 4 | 6 | 9; // 2 pieces (2x1), 4 pieces (2x2), 6 pieces (3x2), 9 pieces (3x3)

interface PieceData {
  id: number;
  dataUrl: string;
}

export const PuzzleGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const { language } = useLanguage();
  const BackIcon = language === 'ar' ? ArrowRight : ArrowLeft;

  // Game flow states: 'select-level' -> 'play' -> 'win'
  const [gameState, setGameState] = useState<'select-level' | 'play' | 'win'>('select-level');
  const [gridSize, setGridSize] = useState<GridSize>(4);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  
  // Gameplay states
  const [pieces, setPieces] = useState<PieceData[]>([]); // Sliced pieces
  const [trayPieces, setTrayPieces] = useState<number[]>([]); // Randomized piece IDs currently in tray
  const [placedSlots, setPlacedSlots] = useState<Record<number, number | null>>({}); // slotIndex -> pieceId
  const [selectedPieceId, setSelectedPieceId] = useState<number | null>(null); // For tap-to-place touch fallback
  const [score, setScore] = useState<number>(0);
  const [showHintModal, setShowHintModal] = useState<boolean>(false);
  const [hintUsedCount, setHintUsedCount] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const activePuzzleItem: PuzzleImageItem = PUZZLE_IMAGES_LIBRARY[currentImageIndex];

  // Helper to get grid dimensions (cols, rows)
  const getGridDims = (size: GridSize): { cols: number; rows: number } => {
    switch (size) {
      case 2: return { cols: 2, rows: 1 };
      case 4: return { cols: 2, rows: 2 };
      case 6: return { cols: 3, rows: 2 };
      case 9: return { cols: 3, rows: 3 };
      default: return { cols: 2, rows: 2 };
    }
  };

  // Generate true jigsaw sliced pieces using HTML5 Canvas
  const generateJigsawPieces = useCallback((puzzleItem: PuzzleImageItem, size: GridSize): Promise<PieceData[]> => {
    return new Promise((resolve) => {
      const { cols, rows } = getGridDims(size);
      const masterSize = 600;
      const masterCanvas = document.createElement('canvas');
      masterCanvas.width = masterSize;
      masterCanvas.height = masterSize;
      const ctx = masterCanvas.getContext('2d');

      if (!ctx) {
        resolve([]);
        return;
      }

      // 1. Draw Master Image Background & Content
      const grad = ctx.createLinearGradient(0, 0, masterSize, masterSize);
      grad.addColorStop(0, puzzleItem.colors[0]);
      grad.addColorStop(1, puzzleItem.colors[1]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, masterSize, masterSize);

      // Add decorative background pattern / circles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      ctx.arc(100, 100, 80, 0, Math.PI * 2);
      ctx.arc(500, 500, 120, 0, Math.PI * 2);
      ctx.fill();

      // Draw Emoji
      ctx.font = '160px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(puzzleItem.emoji, masterSize / 2, masterSize / 2 - 40);

      // Draw Title text banner
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.roundRect(masterSize / 2 - 220, masterSize - 120, 440, 70, 20);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText(language === 'ar' ? puzzleItem.titleAr : puzzleItem.titleEn, masterSize / 2, masterSize - 85);

      // 2. Slice into Pieces
      const pieceWidth = masterSize / cols;
      const pieceHeight = masterSize / rows;
      const generatedPieces: PieceData[] = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const pieceId = r * cols + c;
          const pCanvas = document.createElement('canvas');
          // Add padding for jigsaw tabs
          const pad = 40;
          pCanvas.width = pieceWidth + pad * 2;
          pCanvas.height = pieceHeight + pad * 2;
          const pCtx = pCanvas.getContext('2d');

          if (pCtx) {
            pCtx.save();
            pCtx.translate(pad - c * pieceWidth, pad - r * pieceHeight);

            // Create jigsaw clipping path for this cell
            pCtx.beginPath();
            const startX = c * pieceWidth;
            const startY = r * pieceHeight;
            const w = pieceWidth;
            const h = pieceHeight;

            // Draw interlocking puzzle border
            pCtx.moveTo(startX, startY);
            // Top edge (tab pointing up/down based on row)
            if (r > 0) {
              pCtx.bezierCurveTo(startX + w * 0.3, startY - 15, startX + w * 0.7, startY - 15, startX + w, startY);
            } else {
              pCtx.lineTo(startX + w, startY);
            }

            // Right edge
            if (c < cols - 1) {
              pCtx.bezierCurveTo(startX + w + 15, startY + h * 0.3, startX + w + 15, startY + h * 0.7, startX + w, startY + h);
            } else {
              pCtx.lineTo(startX + w, startY + h);
            }

            // Bottom edge
            if (r < rows - 1) {
              pCtx.bezierCurveTo(startX + w * 0.7, startY + h + 15, startX + w * 0.3, startY + h + 15, startX, startY + h);
            } else {
              pCtx.lineTo(startX, startY + h);
            }

            // Left edge
            if (c > 0) {
              pCtx.bezierCurveTo(startX - 15, startY + h * 0.7, startX - 15, startY + h * 0.3, startX, startY);
            } else {
              pCtx.lineTo(startX, startY);
            }

            pCtx.closePath();
            pCtx.clip();

            // Draw master image onto piece
            pCtx.drawImage(masterCanvas, 0, 0);

            // Add inner shadow and border stroke for true puzzle feel
            pCtx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            pCtx.lineWidth = 3;
            pCtx.stroke();

            pCtx.restore();

            generatedPieces.push({
              id: pieceId,
              dataUrl: pCanvas.toDataURL(),
            });
          }
        }
      }

      resolve(generatedPieces);
    });
  }, [language]);

  // Start a puzzle round
  const startPuzzleRound = async (imgIndex: number, size: GridSize) => {
    sound.playClick();
    setIsGenerating(true);
    setCurrentImageIndex(imgIndex);
    setGridSize(size);
    setSelectedPieceId(null);
    setShowHintModal(false);

    const slicedPieces = await generateJigsawPieces(PUZZLE_IMAGES_LIBRARY[imgIndex], size);
    setPieces(slicedPieces);

    // Shuffle tray piece IDs
    const pieceIds = slicedPieces.map((p) => p.id);
    for (let i = pieceIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pieceIds[i], pieceIds[j]] = [pieceIds[j], pieceIds[i]];
    }
    setTrayPieces(pieceIds);

    const initialSlots: Record<number, number | null> = {};
    for (let i = 0; i < size; i++) {
      initialSlots[i] = null;
    }
    setPlacedSlots(initialSlots);
    setIsGenerating(false);
    setGameState('play');
  };

  // Check if puzzle is completed
  useEffect(() => {
    if (gameState !== 'play') return;
    const slotsCount = gridSize;
    let completed = true;
    for (let i = 0; i < slotsCount; i++) {
      if (placedSlots[i] !== i) {
        completed = false;
        break;
      }
    }

    if (completed && slotsCount > 0 && pieces.length > 0) {
      sound.playWin();
      const earnedScore = gridSize * 30 - hintUsedCount * 5;
      const finalScore = Math.max(10, earnedScore);
      setScore(finalScore);
      saveGameProgress('puzzle-4', finalScore, true);
      setGameState('win');
    }
  }, [placedSlots, gridSize, gameState, hintUsedCount, pieces.length]);

  // Handle piece placement into a slot
  const handlePlacePiece = (slotIndex: number, pieceId: number) => {
    if (placedSlots[slotIndex] !== null && placedSlots[slotIndex] !== undefined) {
      return; // slot occupied
    }

    if (pieceId === slotIndex) {
      // Correct placement!
      sound.playMatch();
      const updatedSlots = { ...placedSlots, [slotIndex]: pieceId };
      setPlacedSlots(updatedSlots);
      setTrayPieces((prev) => prev.filter((id) => id !== pieceId));
      setSelectedPieceId(null);
    } else {
      // Incorrect slot
      sound.playClick();
    }
  };

  // Tap-to-place touch support
  const handleTrayPieceClick = (pieceId: number) => {
    sound.playClick();
    if (selectedPieceId === pieceId) {
      setSelectedPieceId(null);
    } else {
      setSelectedPieceId(pieceId);
    }
  };

  const handleSlotClick = (slotIndex: number) => {
    if (selectedPieceId !== null) {
      handlePlacePiece(slotIndex, selectedPieceId);
    }
  };

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, pieceId: number) => {
    e.dataTransfer.setData('text/plain', pieceId.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    const pieceId = parseInt(data, 10);
    if (!isNaN(pieceId)) {
      handlePlacePiece(slotIndex, pieceId);
    }
  };

  const handleNextPuzzle = () => {
    sound.playClick();
    const nextIdx = (currentImageIndex + 1) % PUZZLE_IMAGES_LIBRARY.length;
    startPuzzleRound(nextIdx, gridSize);
  };

  // -------------------------------------------------------------
  // 1. SELECT LEVEL & PUZZLE SCREEN
  // -------------------------------------------------------------
  if (gameState === 'select-level') {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center space-y-8 py-4 px-2">
        {/* Header bar */}
        <div className="w-full flex items-center justify-between">
          <button
            onClick={() => {
              sound.playClick();
              onGoHome();
            }}
            className="flex items-center gap-2 bg-white dark:bg-[#0b1329] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-100 px-4 py-2.5 rounded-full font-bold shadow-sm border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
          >
            <BackIcon className="w-5 h-5 text-amber-500" />
            <span>{language === 'ar' ? 'الرجوع للقائمة' : 'Back to Games'}</span>
          </button>
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 px-4 py-2 rounded-full font-black text-sm shadow-sm">
            <span>🧩</span>
            <span>{language === 'ar' ? 'لعبة تجميع البازل' : 'Jigsaw Puzzle'}</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white">
            {language === 'ar' ? 'اختر مستوى الصعوبة' : 'Select Difficulty Level'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            {language === 'ar'
              ? 'اختر قطع البازل المتشابكة واستمتع بتركيب الصور الحقيقية بدقة وسهولة'
              : 'Choose interlocking puzzle pieces and enjoy authentic picture assembly'}
          </p>
        </div>

        {/* Level Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
          {[
            { size: 2 as GridSize, titleAr: 'قطعتان (تمهيدي 2×1)', titleEn: '2 Pieces (Easy)', descAr: 'مناسب للأطفال الصغار (نصفين)', icon: '🧩', gradient: 'from-emerald-400 to-teal-600' },
            { size: 4 as GridSize, titleAr: '4 قطع (شبكة 2×2)', titleEn: '4 Pieces (2x2 Grid)', descAr: 'أربع قطع بازل متشابكة أساسية', icon: '🧩', gradient: 'from-sky-400 to-blue-600' },
            { size: 6 as GridSize, titleAr: '6 قطع (شبكة 3×2)', titleEn: '6 Pieces (3x2 Grid)', descAr: 'تحدي ممتع ومتوسط الاحترافية', icon: '🧩', gradient: 'from-amber-400 to-orange-600' },
            { size: 9 as GridSize, titleAr: '9 قطع (شبكة 3×3)', titleEn: '9 Pieces (3x3 Grid)', descAr: 'لعبة بازل حقيقية ومتكاملة', icon: '🧩', gradient: 'from-purple-500 to-indigo-700' },
          ].map((lvl) => (
            <button
              key={lvl.size}
              onClick={() => {
                sound.playClick();
                const randomImgIdx = Math.floor(Math.random() * PUZZLE_IMAGES_LIBRARY.length);
                startPuzzleRound(randomImgIdx, lvl.size);
              }}
              className={`p-6 rounded-3xl bg-gradient-to-r ${lvl.gradient} text-white shadow-md hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center gap-4 text-start cursor-pointer`}
            >
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shrink-0 shadow-inner">
                {lvl.icon}
              </div>
              <div>
                <h3 className="text-lg font-black">{language === 'ar' ? lvl.titleAr : lvl.titleEn}</h3>
                <p className="text-xs text-white/90 font-medium mt-0.5">{lvl.descAr}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Quick Image Gallery Preview */}
        <div className="w-full bg-white dark:bg-[#0b1329] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-200">
              {language === 'ar' ? 'مكتبة الصور (100 صورة جاهزة للبازل)' : 'Puzzle Library (100+ Images)'}
            </h3>
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950 px-3 py-1 rounded-full">
              {PUZZLE_IMAGES_LIBRARY.length} {language === 'ar' ? 'صورة' : 'Images'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {PUZZLE_IMAGES_LIBRARY.slice(0, 10).map((img, idx) => (
              <button
                key={img.id}
                onClick={() => {
                  sound.playClick();
                  startPuzzleRound(idx, gridSize);
                }}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-sky-50 dark:hover:bg-sky-950/60 border border-slate-200 dark:border-slate-700 flex flex-col items-center gap-1.5 transition-all hover:scale-105 cursor-pointer group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">{img.emoji}</span>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate w-full text-center">
                  {language === 'ar' ? img.titleAr : img.titleEn}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Loading generation state
  if (isGenerating) {
    return (
      <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center py-24 space-y-6 text-center px-4">
        <div className="w-20 h-20 rounded-3xl bg-amber-400 flex items-center justify-center text-4xl animate-spin shadow-lg">
          🧩
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white">
          {language === 'ar' ? 'جاري تقسيم وتقطيع الصورة إلى قطع بازل حقيقية...' : 'Slicing image into interlocking jigsaw pieces...'}
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          {language === 'ar' ? 'يرجى الانتظار ثوانٍ معدودة' : 'Please wait a moment'}
        </p>
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
          onRestart={() => startPuzzleRound(currentImageIndex, gridSize)}
          onGoHome={() => setGameState('select-level')}
        />
        
        <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800 w-full space-y-6">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-6xl shadow-md animate-bounce">
            {activePuzzleItem.emoji}
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">
              {language === 'ar' ? 'أحسنت! أتممت تركيب البازل بنجاح' : 'Amazing! Puzzle Completed'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              {language === 'ar'
                ? `لقد قمت بتركيب صورة "${activePuzzleItem.titleAr}" (${gridSize} قطع متشابكة) بكل إتقان!`
                : `You successfully assembled "${activePuzzleItem.titleEn}" (${gridSize} interlocking pieces)!`}
            </p>
          </div>

          {/* Completed Image Showcase */}
          <div
            className="w-48 h-48 mx-auto rounded-3xl shadow-lg border-4 border-white dark:border-slate-800 flex flex-col items-center justify-center p-4 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${activePuzzleItem.colors[0]}, ${activePuzzleItem.colors[1]})`,
            }}
          >
            <span className="text-6xl mb-2 drop-shadow-md">{activePuzzleItem.emoji}</span>
            <span className="text-lg font-black text-white bg-black/20 px-3 py-1 rounded-xl backdrop-blur-xs">
              {language === 'ar' ? activePuzzleItem.titleAr : activePuzzleItem.titleEn}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleNextPuzzle}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-md transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{language === 'ar' ? 'البازل التالي' : 'Next Puzzle'}</span>
            </button>

            <button
              onClick={() => startPuzzleRound(currentImageIndex, gridSize)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-sky-100 hover:bg-sky-200 dark:bg-sky-950 dark:hover:bg-sky-900 text-sky-700 dark:text-sky-300 px-6 py-3 rounded-2xl font-black text-sm transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{language === 'ar' ? 'إعادة اللعب' : 'Play Again'}</span>
            </button>

            <button
              onClick={() => setGameState('select-level')}
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
  const completedCount = Object.values(placedSlots).filter((v) => v !== null && v !== undefined).length;
  const progressPercent = Math.round((completedCount / gridSize) * 100);

  const { cols } = getGridDims(gridSize);
  const gridColsClass = cols === 2 ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center py-4 space-y-6 px-2">
      {/* Top Game Bar */}
      <div className="w-full flex items-center justify-between gap-3 flex-wrap">
        <button
          onClick={() => {
            sound.playClick();
            setGameState('select-level');
          }}
          className="flex items-center gap-2 bg-white dark:bg-[#0b1329] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-100 px-4 py-2.5 rounded-full font-bold shadow-sm border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
        >
          <BackIcon className="w-5 h-5 text-amber-500" />
          <span>{language === 'ar' ? 'تغيير المستوى' : 'Levels'}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Hint button */}
          <button
            onClick={() => {
              sound.playClick();
              setShowHintModal(true);
              setHintUsedCount((c) => c + 1);
            }}
            className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950 hover:bg-amber-100 text-amber-800 dark:text-amber-200 px-3.5 py-2.5 rounded-full font-bold border border-amber-200 dark:border-amber-800 transition-all cursor-pointer"
            title={language === 'ar' ? 'معاينة الصورة الأصلية' : 'Preview Image'}
          >
            <Eye className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">{language === 'ar' ? 'تلميح' : 'Hint'}</span>
          </button>

          {/* Restart round */}
          <button
            onClick={() => startPuzzleRound(currentImageIndex, gridSize)}
            className="flex items-center gap-1.5 bg-sky-50 dark:bg-sky-950 hover:bg-sky-100 text-sky-800 dark:text-sky-200 px-3.5 py-2.5 rounded-full font-bold border border-sky-200 dark:border-sky-800 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'ar' ? 'إعادة' : 'Reset'}</span>
          </button>

          {/* Progress badge */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 px-4 py-2 rounded-full font-black text-sm shadow-sm border border-amber-300">
            <Sparkles className="w-4 h-4 fill-amber-200" />
            <span>{completedCount} / {gridSize}</span>
          </div>
        </div>
      </div>

      {/* Title & Progress Bar */}
      <div className="w-full bg-white dark:bg-[#0b1329] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl">{activePuzzleItem.emoji}</span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">
            {language === 'ar' ? activePuzzleItem.titleAr : activePuzzleItem.titleEn}
          </h2>
        </div>
        
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Puzzle Area: 2 Columns on desktop (Assembly Board left, Tray right) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* Left: Target Slots Board */}
        <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            {language === 'ar' ? 'لوحة التركيب (أسقط القطع هنا)' : 'Assembly Board'}
          </h3>

          <div className={`grid ${gridColsClass} gap-3 w-full max-w-sm justify-center`}>
            {Array.from({ length: gridSize }).map((_, slotIndex) => {
              const pieceIdInSlot = placedSlots[slotIndex];
              const isFilled = pieceIdInSlot !== null && pieceIdInSlot !== undefined;
              const matchedPiece = pieces.find((p) => p.id === pieceIdInSlot);

              return (
                <div
                  key={slotIndex}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, slotIndex)}
                  onClick={() => handleSlotClick(slotIndex)}
                  className={`aspect-square rounded-2xl border-2 flex items-center justify-center transition-all cursor-pointer relative overflow-hidden ${
                    isFilled
                      ? 'border-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-xs'
                      : selectedPieceId !== null
                      ? 'border-sky-500 bg-sky-50/80 dark:bg-sky-950/50 animate-pulse'
                      : 'border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 hover:border-sky-400'
                  }`}
                >
                  {isFilled && matchedPiece ? (
                    <img src={matchedPiece.dataUrl} alt={`Piece ${pieceIdInSlot}`} className="w-full h-full object-contain p-1" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                      <span className="text-xl font-black opacity-40">#{slotIndex + 1}</span>
                      <span className="text-[10px] font-medium">{language === 'ar' ? 'موضع القطعة' : 'Slot'}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Pieces Tray */}
        <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            {language === 'ar' ? 'قطع البازل المبعثرة (اسحب أو انقر للتثبيت)' : 'Scrambled Pieces Tray'}
          </h3>

          {trayPieces.length === 0 ? (
            <div className="py-12 text-center text-emerald-600 font-bold text-sm">
              ✨ {language === 'ar' ? 'تم وضع جميع قطع البازل بنجاح!' : 'All pieces placed successfully!'}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full justify-center">
              {trayPieces.map((pieceId) => {
                const piece = pieces.find((p) => p.id === pieceId);
                const isSelected = selectedPieceId === pieceId;
                if (!piece) return null;

                return (
                  <div
                    key={pieceId}
                    draggable
                    onDragStart={(e) => handleDragStart(e, pieceId)}
                    onClick={() => handleTrayPieceClick(pieceId)}
                    className={`aspect-square rounded-2xl cursor-grab active:cursor-grabbing transition-all transform hover:scale-105 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-1.5 shadow-sm ${
                      isSelected ? 'ring-4 ring-sky-500 scale-105 shadow-md bg-sky-50 dark:bg-sky-950' : ''
                    }`}
                  >
                    <img src={piece.dataUrl} alt={`Piece ${pieceId}`} className="w-full h-full object-contain pointer-events-none" />
                  </div>
                );
              })}
            </div>
          )}

          {selectedPieceId !== null && (
            <div className="mt-4 text-xs font-bold text-sky-600 bg-sky-50 dark:bg-sky-950 px-4 py-2 rounded-xl animate-bounce">
              👆 {language === 'ar' ? 'الآن انقر على الموضع الصحيح في لوحة التركيب' : 'Now tap the correct slot on the assembly board'}
            </div>
          )}
        </div>

      </div>

      {/* Hint Modal / Original Preview */}
      {showHintModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <h3 className="text-lg font-black text-slate-800 dark:text-white">
              {language === 'ar' ? 'معاينة الصورة الأصلية الكاملة' : 'Original Image Preview'}
            </h3>

            <div
              className="w-48 h-48 mx-auto rounded-3xl shadow-lg flex flex-col items-center justify-center p-4 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${activePuzzleItem.colors[0]}, ${activePuzzleItem.colors[1]})`,
              }}
            >
              <span className="text-6xl mb-2 drop-shadow-md">{activePuzzleItem.emoji}</span>
              <span className="text-sm font-black text-white bg-black/20 px-3 py-1 rounded-xl backdrop-blur-xs">
                {language === 'ar' ? activePuzzleItem.titleAr : activePuzzleItem.titleEn}
              </span>
            </div>

            <button
              onClick={() => setShowHintModal(false)}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2.5 rounded-xl font-black text-sm shadow-sm transition-all cursor-pointer"
            >
              {language === 'ar' ? 'حسناً، العودة للعبة' : 'Resume Playing'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

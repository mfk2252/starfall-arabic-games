import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';
import { useLanguage } from '../../i18n/LanguageContext';
import { PUZZLE_IMAGES_LIBRARY, PuzzleImageItem } from '../../data/puzzleImages';
import { Sparkles, Eye, RotateCcw, ArrowRight, ArrowLeft, Image as ImageIcon } from 'lucide-react';

type GridSize = 2 | 4 | 6 | 9;

interface PieceData {
  id: number;
  row: number;
  col: number;
  dataUrl: string;
  isPlaced: boolean;
}

// Edge types
type EdgeType = 'flat' | 'tab' | 'blank';

interface EdgeDefinitions {
  horizontal: EdgeType[][]; // [row][edgeIndex] - edges between rows
  vertical: EdgeType[][];   // [col][edgeIndex] - edges between columns
}

export const PuzzleGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  const [gameState, setGameState] = useState<'select-level' | 'play' | 'win'>('select-level');
  const [gridSize, setGridSize] = useState<GridSize>(4);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  
  const [pieces, setPieces] = useState<PieceData[]>([]);
  const [trayPieceIds, setTrayPieceIds] = useState<number[]>([]);
  const [selectedPieceId, setSelectedPieceId] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [showHintModal, setShowHintModal] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const activePuzzleItem: PuzzleImageItem = PUZZLE_IMAGES_LIBRARY[currentImageIndex];

  const getGridDims = (size: GridSize): { cols: number; rows: number } => {
    switch (size) {
      case 2: return { cols: 2, rows: 1 };
      case 4: return { cols: 2, rows: 2 };
      case 6: return { cols: 3, rows: 2 };
      case 9: return { cols: 3, rows: 3 };
      default: return { cols: 2, rows: 2 };
    }
  };

  const drawJigsawPath = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    edges: { top: EdgeType; right: EdgeType; bottom: EdgeType; left: EdgeType },
    tabSize: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x, y);

    // Top edge
    if (edges.top === 'flat') {
      ctx.lineTo(x + w, y);
    } else {
      const dir = edges.top === 'tab' ? -1 : 1;
      ctx.lineTo(x + w * 0.35, y);
      ctx.bezierCurveTo(x + w * 0.35, y + tabSize * dir, x + w * 0.65, y + tabSize * dir, x + w * 0.65, y);
      ctx.lineTo(x + w, y);
    }

    // Right edge
    if (edges.right === 'flat') {
      ctx.lineTo(x + w, y + h);
    } else {
      const dir = edges.right === 'tab' ? 1 : -1;
      ctx.lineTo(x + w, y + h * 0.35);
      ctx.bezierCurveTo(x + w + tabSize * dir, y + h * 0.35, x + w + tabSize * dir, y + h * 0.65, x + w, y + h * 0.65);
      ctx.lineTo(x + w, y + h);
    }

    // Bottom edge
    if (edges.bottom === 'flat') {
      ctx.lineTo(x, y + h);
    } else {
      const dir = edges.bottom === 'tab' ? 1 : -1;
      ctx.lineTo(x + w * 0.65, y + h);
      ctx.bezierCurveTo(x + w * 0.65, y + h + tabSize * dir, x + w * 0.35, y + h + tabSize * dir, x + w * 0.35, y + h);
      ctx.lineTo(x, y + h);
    }

    // Left edge
    if (edges.left === 'flat') {
      ctx.lineTo(x, y);
    } else {
      const dir = edges.left === 'tab' ? -1 : 1;
      ctx.lineTo(x, y + h * 0.65);
      ctx.bezierCurveTo(x + tabSize * dir, y + h * 0.65, x + tabSize * dir, y + h * 0.35, x, y + h * 0.35);
      ctx.lineTo(x, y);
    }

    ctx.closePath();
  };

  const generateJigsawPieces = useCallback((puzzleItem: PuzzleImageItem, size: GridSize): Promise<PieceData[]> => {
    return new Promise((resolve) => {
      const { cols, rows } = getGridDims(size);
      const masterSize = 600;
      const tabSize = masterSize / Math.max(cols, rows) * 0.25;
      
      const masterCanvas = document.createElement('canvas');
      masterCanvas.width = masterSize;
      masterCanvas.height = masterSize;
      const ctx = masterCanvas.getContext('2d');
      if (!ctx) return resolve([]);

      // Draw Master Image
      const grad = ctx.createLinearGradient(0, 0, masterSize, masterSize);
      grad.addColorStop(0, puzzleItem.colors[0]);
      grad.addColorStop(1, puzzleItem.colors[1]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, masterSize, masterSize);
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      ctx.arc(100, 100, 80, 0, Math.PI * 2);
      ctx.arc(500, 500, 120, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '160px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(puzzleItem.emoji, masterSize / 2, masterSize / 2 - 40);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.roundRect(masterSize / 2 - 200, masterSize - 120, 400, 60, 20);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 30px sans-serif';
      ctx.fillText(isAr ? puzzleItem.titleAr : puzzleItem.titleEn, masterSize / 2, masterSize - 88);

      // Edge generation
      const vEdges: EdgeType[][] = Array.from({ length: rows }, () => 
        Array.from({ length: cols - 1 }, () => Math.random() > 0.5 ? 'tab' : 'blank')
      );
      const hEdges: EdgeType[][] = Array.from({ length: rows - 1 }, () => 
        Array.from({ length: cols }, () => Math.random() > 0.5 ? 'tab' : 'blank')
      );

      const pieceWidth = masterSize / cols;
      const pieceHeight = masterSize / rows;
      const generated: PieceData[] = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const pieceId = r * cols + c;
          const pCanvas = document.createElement('canvas');
          const pad = tabSize * 1.5;
          pCanvas.width = pieceWidth + pad * 2;
          pCanvas.height = pieceHeight + pad * 2;
          const pCtx = pCanvas.getContext('2d');
          
          if (pCtx) {
            pCtx.save();
            pCtx.translate(pad - c * pieceWidth, pad - r * pieceHeight);

            const edges = {
              top: r === 0 ? 'flat' : (hEdges[r - 1][c] === 'tab' ? 'blank' : 'tab'),
              right: c === cols - 1 ? 'flat' : vEdges[r][c],
              bottom: r === rows - 1 ? 'flat' : hEdges[r][c],
              left: c === 0 ? 'flat' : (vEdges[r][c - 1] === 'tab' ? 'blank' : 'tab')
            };

            drawJigsawPath(pCtx, c * pieceWidth, r * pieceHeight, pieceWidth, pieceHeight, edges as any, tabSize);
            pCtx.clip();
            pCtx.drawImage(masterCanvas, 0, 0);

            // Piece shadow/edge
            pCtx.strokeStyle = 'rgba(0,0,0,0.2)';
            pCtx.lineWidth = 2;
            pCtx.stroke();
            pCtx.restore();

            generated.push({
              id: pieceId,
              row: r,
              col: c,
              dataUrl: pCanvas.toDataURL(),
              isPlaced: false
            });
          }
        }
      }
      resolve(generated);
    });
  }, [isAr]);

  const startPuzzleRound = async (imgIndex: number, size: GridSize) => {
    sound.playClick();
    setIsGenerating(true);
    setCurrentImageIndex(imgIndex);
    setGridSize(size);
    setSelectedPieceId(null);
    setShowHintModal(false);
    setShowPreview(false);

    const newPieces = await generateJigsawPieces(PUZZLE_IMAGES_LIBRARY[imgIndex], size);
    setPieces(newPieces);

    const ids = newPieces.map(p => p.id);
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    setTrayPieceIds(ids);
    setIsGenerating(false);
    setGameState('play');
  };

  const handleSnapPiece = (pieceId: number, slotIndex: number) => {
    if (pieceId === slotIndex) {
      sound.playMatch();
      setPieces(prev => prev.map(p => p.id === pieceId ? { ...p, isPlaced: true } : p));
      setTrayPieceIds(prev => prev.filter(id => id !== pieceId));
      setSelectedPieceId(null);
      return true;
    }
    sound.playClick();
    return false;
  };

  useEffect(() => {
    if (gameState === 'play' && pieces.length > 0 && pieces.every(p => p.isPlaced)) {
      sound.playWin();
      const finalScore = gridSize * 25;
      setScore(finalScore);
      saveGameProgress('puzzle-4', finalScore, true);
      setGameState('win');
    }
  }, [pieces, gameState, gridSize]);

  // Level Selection
  if (gameState === 'select-level') {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center space-y-8 py-4 px-2">
        <div className="w-full flex items-center justify-between">
          <button onClick={() => { sound.playClick(); onGoHome(); }} className="flex items-center gap-2 bg-white dark:bg-[#0b1329] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-100 px-4 py-2.5 rounded-full font-bold shadow-sm border border-slate-200 dark:border-slate-800 transition-all cursor-pointer">
            <BackIcon className="w-5 h-5 text-amber-500" />
            <span>{isAr ? 'الرجوع للقائمة' : 'Back to Games'}</span>
          </button>
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 px-4 py-2 rounded-full font-black text-sm shadow-sm">
            <span>🧩</span>
            <span>{isAr ? 'تحدي تجميع البازل' : 'Jigsaw Puzzle'}</span>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white">{isAr ? 'اختر مستوى التحدي' : 'Select Level'}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{isAr ? 'استمتع بتركيب قطع البازل المتشابكة لتكوين الصورة الكاملة' : 'Assemble interlocking pieces to reveal the full picture'}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
          {[
            { size: 2 as GridSize, tAr: 'قطعتان (2×1)', tEn: '2 Pieces', dAr: 'سهل جداً للمبتدئين', g: 'from-emerald-400 to-teal-600' },
            { size: 4 as GridSize, tAr: '4 قطع (2×2)', tEn: '4 Pieces', dAr: 'تحدي بسيط وممتع', g: 'from-sky-400 to-blue-600' },
            { size: 6 as GridSize, tAr: '6 قطع (3×2)', tEn: '6 Pieces', dAr: 'مستوى متوسط للأذكياء', g: 'from-amber-400 to-orange-600' },
            { size: 9 as GridSize, tAr: '9 قطع (3×3)', tEn: '9 Pieces', dAr: 'تحدي كامل للمحترفين', g: 'from-purple-500 to-indigo-700' },
          ].map((lvl) => (
            <button key={lvl.size} onClick={() => startPuzzleRound(Math.floor(Math.random() * PUZZLE_IMAGES_LIBRARY.length), lvl.size)} className={`p-6 rounded-3xl bg-gradient-to-r ${lvl.g} text-white shadow-md hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center gap-4 text-start cursor-pointer`}>
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shrink-0">🧩</div>
              <div>
                <h3 className="text-lg font-black">{isAr ? lvl.tAr : lvl.tEn}</h3>
                <p className="text-xs text-white/90 font-medium mt-0.5">{isAr ? lvl.dAr : 'Fun jigsaw challenge'}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center py-32 space-y-6 text-center px-4">
        <div className="w-20 h-20 rounded-3xl bg-amber-400 flex items-center justify-center text-4xl animate-spin shadow-lg">🧩</div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white">{isAr ? 'جاري تحضير قطع البازل...' : 'Preparing jigsaw pieces...'}</h2>
      </div>
    );
  }

  if (gameState === 'win') {
    return (
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center py-10 px-4 text-center space-y-6">
        <WinCelebration score={score} onRestart={() => startPuzzleRound(currentImageIndex, gridSize)} onGoHome={() => setGameState('select-level')} />
        <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800 w-full space-y-6">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-6xl shadow-md animate-bounce">{activePuzzleItem.emoji}</div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">{isAr ? 'رائع! لقد أتممت المهمة بنجاح' : 'Amazing! You solved it!'}</h2>
          <div className="w-48 h-48 mx-auto rounded-3xl shadow-lg border-4 border-white dark:border-slate-800 flex flex-col items-center justify-center p-4 overflow-hidden relative" style={{ background: `linear-gradient(135deg, ${activePuzzleItem.colors[0]}, ${activePuzzleItem.colors[1]})` }}>
            <span className="text-6xl mb-2">{activePuzzleItem.emoji}</span>
            <span className="text-sm font-black text-white bg-black/20 px-3 py-1 rounded-lg">{isAr ? activePuzzleItem.titleAr : activePuzzleItem.titleEn}</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={() => startPuzzleRound((currentImageIndex + 1) % PUZZLE_IMAGES_LIBRARY.length, gridSize)} className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-md hover:scale-105 active:scale-95 cursor-pointer">
              {isAr ? 'اللغز التالي' : 'Next Puzzle'}
            </button>
            <button onClick={() => setGameState('select-level')} className="w-full sm:w-auto bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-2xl font-black text-sm">
              {isAr ? 'تغيير المستوى' : 'Change Level'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Gameplay UI
  const { cols, rows } = getGridDims(gridSize);
  const boardSize = 320; // Base board size for mobile, will scale on desktop
  const cellW = boardSize / cols;
  const cellH = boardSize / rows;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center py-4 space-y-6 px-2">
      <div className="w-full flex items-center justify-between flex-wrap gap-3">
        <button onClick={() => setGameState('select-level')} className="flex items-center gap-2 bg-white dark:bg-[#0b1329] px-4 py-2.5 rounded-full font-bold shadow-sm border border-slate-200 dark:border-slate-800">
          <BackIcon className="w-5 h-5 text-amber-500" />
          <span>{isAr ? 'تغيير المستوى' : 'Levels'}</span>
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowPreview(!showPreview)} className="p-2.5 bg-sky-50 dark:bg-sky-950 text-sky-600 rounded-full border border-sky-200 dark:border-sky-800" title={isAr ? 'معاينة' : 'Preview'}>
            <ImageIcon className="w-5 h-5" />
          </button>
          <button onClick={() => startPuzzleRound(currentImageIndex, gridSize)} className="p-2.5 bg-amber-50 dark:bg-amber-950 text-amber-600 rounded-full border border-amber-200 dark:border-amber-800">
            <RotateCcw className="w-5 h-5" />
          </button>
          <div className="bg-amber-400 text-amber-950 px-4 py-2 rounded-full font-black text-sm">
            {pieces.filter(p => p.isPlaced).length} / {gridSize}
          </div>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* The Assembly Board */}
        <div className="flex flex-col items-center space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">{isAr ? 'لوحة التركيب' : 'Assembly Board'}</h3>
          <div 
            className="relative bg-slate-200 dark:bg-slate-800/50 rounded-3xl overflow-hidden shadow-inner border-4 border-white dark:border-slate-800"
            style={{ width: boardSize, height: boardSize }}
          >
            {/* Background Hint (Very faint) */}
            <div className="absolute inset-0 opacity-10 flex flex-col items-center justify-center p-8 select-none pointer-events-none">
              <span className="text-[120px]">{activePuzzleItem.emoji}</span>
            </div>

            {/* Preview Overlay */}
            {showPreview && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xs select-none pointer-events-none animate-in fade-in duration-300">
                <span className="text-[140px] drop-shadow-lg">{activePuzzleItem.emoji}</span>
              </div>
            )}

            {/* Grid Helper Lines */}
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: cols - 1 }).map((_, i) => (
                <div key={`v-${i}`} className="absolute top-0 bottom-0 border-r border-dashed border-slate-400/20" style={{ left: `${(i+1)*100/cols}%` }} />
              ))}
              {Array.from({ length: rows - 1 }).map((_, i) => (
                <div key={`h-${i}`} className="absolute left-0 right-0 border-b border-dashed border-slate-400/20" style={{ top: `${(i+1)*100/rows}%` }} />
              ))}
            </div>

            {/* Placed Pieces */}
            {pieces.map(p => p.isPlaced && (
              <div 
                key={`placed-${p.id}`}
                className="absolute z-10 transition-all duration-300"
                style={{
                  width: cellW + (boardSize * 0.1), // buffer for tabs
                  height: cellH + (boardSize * 0.1),
                  top: p.row * cellH - (boardSize * 0.05),
                  left: p.col * cellW - (boardSize * 0.05),
                }}
              >
                <img src={p.dataUrl} className="w-full h-full object-contain" alt="" />
              </div>
            ))}

            {/* Drop Slots (Transparent but functional) */}
            <div className="absolute inset-0 z-0 grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
              {Array.from({ length: gridSize }).map((_, idx) => (
                <div 
                  key={`slot-${idx}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const pid = parseInt(e.dataTransfer.getData('text'), 10);
                    handleSnapPiece(pid, idx);
                  }}
                  onClick={() => selectedPieceId !== null && handleSnapPiece(selectedPieceId, idx)}
                  className={`border-2 border-transparent hover:border-sky-400/30 transition-colors cursor-pointer ${selectedPieceId !== null ? 'bg-sky-400/5 animate-pulse' : ''}`}
                />
              ))}
            </div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 text-center">{isAr ? 'اسحب القطع هنا أو اختر قطعة ثم انقر على مكانها' : 'Drag pieces here or select then tap a slot'}</p>
        </div>

        {/* Pieces Tray */}
        <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">{isAr ? 'القطع المبعثرة' : 'Unassembled Pieces'}</h3>
          
          {trayPieceIds.length === 0 ? (
            <div className="py-20 text-emerald-500 font-black flex flex-col items-center gap-2">
              <Sparkles className="w-10 h-10 animate-bounce" />
              <span>{isAr ? 'لقد وضعت جميع القطع!' : 'All pieces placed!'}</span>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-4">
              {trayPieceIds.map(id => {
                const p = pieces.find(x => x.id === id);
                if (!p) return null;
                const isSelected = selectedPieceId === id;

                return (
                  <div
                    key={`tray-${id}`}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text', id.toString());
                      setSelectedPieceId(id);
                    }}
                    onClick={() => {
                      sound.playClick();
                      setSelectedPieceId(isSelected ? null : id);
                    }}
                    className={`relative w-24 h-24 sm:w-28 sm:h-28 cursor-grab active:cursor-grabbing transition-all transform hover:scale-110 ${isSelected ? 'ring-4 ring-sky-500 rounded-2xl shadow-xl z-30 scale-110' : 'opacity-90 hover:opacity-100 shadow-md'}`}
                  >
                    <img src={p.dataUrl} className="w-full h-full object-contain pointer-events-none" alt="" />
                    {isSelected && <div className="absolute inset-0 bg-sky-500/10 rounded-2xl pointer-events-none" />}
                  </div>
                );
              })}
            </div>
          )}

          {selectedPieceId !== null && (
            <div className="mt-8 px-6 py-2 bg-sky-500 text-white rounded-2xl font-black text-xs animate-bounce shadow-lg">
              {isAr ? 'اختر الآن مكان القطعة على اللوحة' : 'Now pick its spot on the assembly board'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

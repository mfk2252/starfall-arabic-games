import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  PALETTE_BLOCKS,
  ARABIC_LETTERS,
  ENGLISH_LETTERS,
  NUMBER_BLOCKS_LIST,
  MODEL_BLUEPRINTS,
  WORD_CHALLENGES,
  NUMBER_CHALLENGES,
  SHAPE_CHALLENGES,
  BlockItem,
  PlacedBlock,
  ModelBlueprint,
  WordChallenge,
  NumberChallenge,
  ShapeChallenge,
} from '../../data/myLittleWorldData';
import {
  Hammer,
  Box,
  Compass,
  Type,
  Binary,
  Shapes,
  RotateCw,
  Trash2,
  Copy,
  Undo2,
  RefreshCw,
  Sparkles,
  Grid,
  Volume2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Eye,
  Info,
} from 'lucide-react';
import { ButterflyIcon } from '../common/ButterflyIcon';

type ActivityMode = 'free' | 'build-model' | 'letters' | 'numbers' | 'shapes';

export const MyLittleWorldGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const { language } = useLanguage();

  // Mode Selection
  const [activeMode, setActiveMode] = useState<ActivityMode>('free');

  // Building Canvas State
  const [placedBlocks, setPlacedBlocks] = useState<PlacedBlock[]>([]);
  const [history, setHistory] = useState<PlacedBlock[][]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true);
  const [showGridLines, setShowGridLines] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [celebrateWin, setCelebrateWin] = useState<boolean>(false);
  const [winMessage, setWinMessage] = useState<string>('');

  // Selected Palette Filter
  const [paletteTab, setPaletteTab] = useState<'shapes' | 'letters' | 'numbers' | 'nature'>('shapes');
  const [lettersLang, setLettersLang] = useState<'ar' | 'en'>('ar');

  // Sub-Activity States
  const [currentModelIdx, setCurrentModelIdx] = useState<number>(0);
  const [currentWordIdx, setCurrentWordIdx] = useState<number>(0);
  const [currentNumIdx, setCurrentNumIdx] = useState<number>(0);
  const [currentShapeIdx, setCurrentShapeIdx] = useState<number>(0);

  // Dragging & Interaction State
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggedUid, setDraggedUid] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Persistence (local storage save/load for free building)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('taleen_my_little_world_save');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPlacedBlocks(parsed);
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Save changes locally whenever free build blocks change
  useEffect(() => {
    if (activeMode === 'free' && placedBlocks.length > 0) {
      try {
        localStorage.setItem('taleen_my_little_world_save', JSON.stringify(placedBlocks.slice(-30)));
      } catch {
        // Ignore quota errors
      }
    }
  }, [placedBlocks, activeMode]);

  // Push to history for Undo functionality
  const recordHistory = useCallback((current: PlacedBlock[]) => {
    setHistory((prev) => [...prev.slice(-15), current]);
  }, []);

  // -------------------------------------------------------------
  // BLOCK MANIPULATION ACTIONS
  // -------------------------------------------------------------
  const handleAddBlock = (block: BlockItem) => {
    sound.playPop();
    recordHistory(placedBlocks);

    const canvas = canvasRef.current;
    const canvasWidth = canvas ? canvas.clientWidth : 600;
    const canvasHeight = canvas ? canvas.clientHeight : 400;

    // Center placement with a subtle staggered random offset
    const randomOffset = (Math.random() - 0.5) * 60;
    let initialX = Math.max(20, canvasWidth / 2 - block.width / 2 + randomOffset);
    let initialY = Math.max(20, canvasHeight / 2 - block.height / 2 + randomOffset);

    if (snapToGrid) {
      const gridSize = 20;
      initialX = Math.round(initialX / gridSize) * gridSize;
      initialY = Math.round(initialY / gridSize) * gridSize;
    }

    const newPlacedBlock: PlacedBlock = {
      uid: `block-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      blockId: block.id,
      type: block.type,
      label: block.label,
      color: block.color,
      accentColor: block.accentColor,
      x: initialX,
      y: initialY,
      width: block.width,
      height: block.height,
      rotation: 0,
      zIndex: placedBlocks.length + 1,
      icon: block.icon,
    };

    setPlacedBlocks((prev) => [...prev, newPlacedBlock]);
    setSelectedBlockId(newPlacedBlock.uid);
    setScore((s) => s + 5);
  };

  const handleAddLetterBlock = (char: string) => {
    sound.playPop();
    sound.speakText(char, lettersLang);

    const letterBlock: BlockItem = {
      id: `letter-${char}-${Date.now()}`,
      nameAr: `حرف ${char}`,
      nameEn: `Letter ${char}`,
      category: 'letters',
      type: 'letter',
      label: char,
      color: lettersLang === 'ar' ? '#f43f5e' : '#3b82f6',
      accentColor: lettersLang === 'ar' ? '#be123c' : '#1d4ed8',
      width: 65,
      height: 65,
    };
    handleAddBlock(letterBlock);
  };

  const handleAddNumberBlock = (num: number) => {
    sound.playPop();
    sound.speakText(String(num), 'ar');

    const numberBlock: BlockItem = {
      id: `num-${num}-${Date.now()}`,
      nameAr: `رقم ${num}`,
      nameEn: `Number ${num}`,
      category: 'numbers',
      type: 'number',
      label: String(num),
      color: '#10b981',
      accentColor: '#047857',
      width: 65,
      height: 65,
    };
    handleAddBlock(numberBlock);
  };

  // Rotate selected block 90 degrees
  const handleRotateSelected = () => {
    if (!selectedBlockId) return;
    sound.playClick();
    recordHistory(placedBlocks);

    setPlacedBlocks((prev) =>
      prev.map((b) => (b.uid === selectedBlockId ? { ...b, rotation: (b.rotation + 90) % 360 } : b))
    );
  };

  // Duplicate / Clone selected block
  const handleDuplicateSelected = () => {
    if (!selectedBlockId) return;
    const target = placedBlocks.find((b) => b.uid === selectedBlockId);
    if (!target) return;

    sound.playSparkle();
    recordHistory(placedBlocks);

    const clone: PlacedBlock = {
      ...target,
      uid: `block-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      x: target.x + 30,
      y: target.y + 30,
      zIndex: placedBlocks.length + 1,
    };

    setPlacedBlocks((prev) => [...prev, clone]);
    setSelectedBlockId(clone.uid);
  };

  // Delete selected block
  const handleDeleteSelected = () => {
    if (!selectedBlockId) return;
    sound.playClick();
    recordHistory(placedBlocks);

    setPlacedBlocks((prev) => prev.filter((b) => b.uid !== selectedBlockId));
    setSelectedBlockId(null);
  };

  // Undo last action
  const handleUndo = () => {
    if (history.length === 0) return;
    sound.playClick();
    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setPlacedBlocks(previous);
    setSelectedBlockId(null);
  };

  // Clear all blocks on canvas
  const handleClearAll = () => {
    if (placedBlocks.length === 0) return;
    sound.playClick();
    recordHistory(placedBlocks);
    setPlacedBlocks([]);
    setSelectedBlockId(null);
  };

  // -------------------------------------------------------------
  // TOUCH & MOUSE DRAGGING SYSTEM (Fully Responsive)
  // -------------------------------------------------------------
  const handlePointerDown = (e: React.PointerEvent, uid: string) => {
    e.stopPropagation();
    sound.playPop();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const block = placedBlocks.find((b) => b.uid === uid);
    if (!block) return;

    setSelectedBlockId(uid);
    setDraggedUid(uid);

    // Bring clicked block to front
    const maxZ = Math.max(...placedBlocks.map((b) => b.zIndex), 1);
    setPlacedBlocks((prev) => prev.map((b) => (b.uid === uid ? { ...b, zIndex: maxZ + 1 } : b)));

    const canvasRect = canvas.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    const pointerCanvasX = (clientX - canvasRect.left) / zoomLevel;
    const pointerCanvasY = (clientY - canvasRect.top) / zoomLevel;

    setDragOffset({
      x: pointerCanvasX - block.x,
      y: pointerCanvasY - block.y,
    });

    // Capture pointer
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggedUid || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const pointerCanvasX = (e.clientX - canvasRect.left) / zoomLevel;
    const pointerCanvasY = (e.clientY - canvasRect.top) / zoomLevel;

    let nextX = pointerCanvasX - dragOffset.x;
    let nextY = pointerCanvasY - dragOffset.y;

    // Snap to grid
    if (snapToGrid) {
      const gridSize = 20;
      nextX = Math.round(nextX / gridSize) * gridSize;
      nextY = Math.round(nextY / gridSize) * gridSize;
    }

    // Boundary constraints
    const currentBlock = placedBlocks.find((b) => b.uid === draggedUid);
    const blockWidth = currentBlock?.width || 60;
    const blockHeight = currentBlock?.height || 60;
    const maxX = (canvasRect.width / zoomLevel) - blockWidth;
    const maxY = (canvasRect.height / zoomLevel) - blockHeight;

    nextX = Math.max(0, Math.min(nextX, maxX));
    nextY = Math.max(0, Math.min(nextY, maxY));

    setPlacedBlocks((prev) =>
      prev.map((b) => (b.uid === draggedUid ? { ...b, x: nextX, y: nextY } : b))
    );
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggedUid) {
      sound.playFlip();
      setDraggedUid(null);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Safe release
      }
    }
  };

  // -------------------------------------------------------------
  // CHALLENGE VALIDATION & PROGRESS EVALUATION
  // -------------------------------------------------------------
  // 1. Model Challenge check
  const activeBlueprint = MODEL_BLUEPRINTS[currentModelIdx];
  const modelProgress = useMemo(() => {
    if (activeMode !== 'build-model' || !activeBlueprint) return { met: false, count: 0 };
    const count = placedBlocks.length;
    return {
      met: count >= activeBlueprint.targetCount,
      count,
    };
  }, [placedBlocks, activeMode, activeBlueprint]);

  // 2. Word Challenge check
  const activeWord = WORD_CHALLENGES[currentWordIdx];
  const wordLettersBuilt = useMemo(() => {
    if (activeMode !== 'letters' || !activeWord) return { isCorrect: false, currentStr: '' };

    // Get letter blocks ordered by position (RTL for Arabic, LTR for English)
    const letterBlocks = placedBlocks.filter((b) => b.type === 'letter' && b.label);
    if (letterBlocks.length === 0) return { isCorrect: false, currentStr: '' };

    // Sort by X coordinate
    const sorted = [...letterBlocks].sort((a, b) => {
      return activeWord.language === 'ar' ? b.x - a.x : a.x - b.x;
    });

    const currentStr = sorted.map((b) => b.label).join('');
    const targetWord = activeWord.language === 'ar' ? activeWord.wordAr : activeWord.wordEn;

    return {
      isCorrect: currentStr === targetWord,
      currentStr,
    };
  }, [placedBlocks, activeMode, activeWord]);

  // 3. Number Challenge check
  const activeNumberChallenge = NUMBER_CHALLENGES[currentNumIdx];
  const numberProgress = useMemo(() => {
    if (activeMode !== 'numbers' || !activeNumberChallenge) return { isCorrect: false, count: 0 };
    const count = placedBlocks.length;
    return {
      isCorrect: count === activeNumberChallenge.targetNumber,
      count,
    };
  }, [placedBlocks, activeMode, activeNumberChallenge]);

  // 4. Shape Challenge check
  const activeShapeChallenge = SHAPE_CHALLENGES[currentShapeIdx];
  const shapeProgress = useMemo(() => {
    if (activeMode !== 'shapes' || !activeShapeChallenge) return { isCorrect: false };

    // Check if user placed all required shape types
    const metAll = activeShapeChallenge.requiredShapes.every((req) => {
      const matchCount = placedBlocks.filter((b) => b.type === req.shape).length;
      return matchCount >= req.count;
    });

    return { isCorrect: metAll };
  }, [placedBlocks, activeMode, activeShapeChallenge]);

  // Trigger win celebration when challenge completes
  const handleCheckChallenge = () => {
    let passed = false;
    let msg = '';

    if (activeMode === 'build-model') {
      if (modelProgress.met) {
        passed = true;
        msg = `🎉 برافو! أبدعت في بناء مجسم (${activeBlueprint.titleAr}) الرائع!`;
      }
    } else if (activeMode === 'letters') {
      if (wordLettersBuilt.isCorrect) {
        passed = true;
        msg = `✨ أحسنت! ركّبت كلمة (${activeWord.language === 'ar' ? activeWord.wordAr : activeWord.wordEn}) بنجاح!`;
      }
    } else if (activeMode === 'numbers') {
      if (numberProgress.isCorrect) {
        passed = true;
        msg = `🔢 عبقري! حققت العدد المطلوب (${activeNumberChallenge.targetNumber}) بدقة وبراعة!`;
      }
    } else if (activeMode === 'shapes') {
      if (shapeProgress.isCorrect) {
        passed = true;
        msg = `🔺 رائع! لقد استعملت جميع الأشكال الهندسية المطلوبة للتحدي!`;
      }
    }

    if (passed) {
      sound.playWin();
      setWinMessage(msg);
      setCelebrateWin(true);
      const newScore = score + 50;
      setScore(newScore);
      saveGameProgress('my-little-world', newScore, true);
    } else {
      sound.playWrong();
      sound.speakText('فكر جيداً وأكمل المطلوب يا بطل!', 'ar');
    }
  };

  // -------------------------------------------------------------
  // RENDER SHAPES & BLOCKS
  // -------------------------------------------------------------
  const renderBlockShape = (block: PlacedBlock | BlockItem, isIconOnly = false) => {
    const isPlaced = 'uid' in block;
    const type = block.type;
    const color = block.color;
    const accentColor = block.accentColor;
    const label = block.label;

    const baseClasses = `relative select-none flex items-center justify-center font-black transition-transform duration-100 ${
      isPlaced ? 'shadow-lg' : 'shadow-sm'
    }`;

    switch (type) {
      case 'cube':
        return (
          <div
            className={`${baseClasses} rounded-2xl border-b-4 border-r-4`}
            style={{
              backgroundColor: color,
              borderColor: accentColor,
              width: isIconOnly ? '100%' : `${block.width}px`,
              height: isIconOnly ? '100%' : `${block.height}px`,
            }}
          >
            {/* 3D Emboss Stud */}
            <div className="w-5 h-5 rounded-full bg-white/30 border border-white/50 shadow-inner" />
          </div>
        );

      case 'rect':
        return (
          <div
            className={`${baseClasses} rounded-2xl border-b-4 border-r-4`}
            style={{
              backgroundColor: color,
              borderColor: accentColor,
              width: isIconOnly ? '100%' : `${block.width}px`,
              height: isIconOnly ? '100%' : `${block.height}px`,
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-white/30 shadow-inner" />
              <div className="w-4 h-4 rounded-full bg-white/30 shadow-inner" />
            </div>
          </div>
        );

      case 'triangle':
        return (
          <div
            className="relative flex items-center justify-center select-none"
            style={{
              width: isIconOnly ? '100%' : `${block.width}px`,
              height: isIconOnly ? '100%' : `${block.height}px`,
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-md">
              <polygon points="50,5 95,95 5,95" fill={color} stroke={accentColor} strokeWidth="6" strokeLinejoin="round" />
            </svg>
          </div>
        );

      case 'circle':
        return (
          <div
            className={`${baseClasses} rounded-full border-b-4 border-r-4`}
            style={{
              backgroundColor: color,
              borderColor: accentColor,
              width: isIconOnly ? '100%' : `${block.width}px`,
              height: isIconOnly ? '100%' : `${block.height}px`,
            }}
          >
            <div className="w-6 h-6 rounded-full bg-white/40 shadow-inner border border-white/60" />
          </div>
        );

      case 'arch':
        return (
          <div
            className={`${baseClasses} rounded-t-full border-b-4 border-r-4 border-t-2`}
            style={{
              backgroundColor: color,
              borderColor: accentColor,
              width: isIconOnly ? '100%' : `${block.width}px`,
              height: isIconOnly ? '100%' : `${block.height}px`,
            }}
          >
            <div className="w-12 h-6 rounded-t-full bg-slate-900/20 mt-4" />
          </div>
        );

      case 'star':
        return (
          <div
            className="relative flex items-center justify-center select-none"
            style={{
              width: isIconOnly ? '100%' : `${block.width}px`,
              height: isIconOnly ? '100%' : `${block.height}px`,
            }}
          >
            <span className="text-4xl sm:text-5xl filter drop-shadow">⭐</span>
          </div>
        );

      case 'heart':
        return (
          <div
            className="relative flex items-center justify-center select-none"
            style={{
              width: isIconOnly ? '100%' : `${block.width}px`,
              height: isIconOnly ? '100%' : `${block.height}px`,
            }}
          >
            <span className="text-4xl sm:text-5xl filter drop-shadow">💖</span>
          </div>
        );

      case 'nature':
        return (
          <div
            className="relative flex items-center justify-center select-none"
            style={{
              width: isIconOnly ? '100%' : `${block.width}px`,
              height: isIconOnly ? '100%' : `${block.height}px`,
            }}
          >
            <span className="text-4xl sm:text-5xl filter drop-shadow">
              {block.icon || '🌳'}
            </span>
          </div>
        );

      case 'letter':
      case 'number':
        return (
          <div
            className={`${baseClasses} rounded-2xl border-b-4 border-r-4 text-white text-2xl sm:text-3xl`}
            style={{
              backgroundColor: color,
              borderColor: accentColor,
              width: isIconOnly ? '100%' : `${block.width}px`,
              height: isIconOnly ? '100%' : `${block.height}px`,
            }}
          >
            <span className="filter drop-shadow-md">{label}</span>
          </div>
        );

      default:
        return (
          <div
            className={`${baseClasses} rounded-xl`}
            style={{
              backgroundColor: color,
              width: `${block.width}px`,
              height: `${block.height}px`,
            }}
          />
        );
    }
  };

  return (
    <div
      className="flex flex-col items-center w-full px-2 sm:px-4 py-3 min-h-[90vh] animate-in fade-in duration-300"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <GameHeader
        title={language === 'ar' ? 'عالمي الصغير' : 'My Little World'}
        icon="🧱✨"
        score={score}
        onRestart={handleClearAll}
        onGoHome={onGoHome}
        accentGradient="from-[#f59e0b] via-[#ec4899] to-[#8b5cf6]"
        badgeText={language === 'ar' ? 'ابنِ، ركّب، واكتشف عالمك الخاص' : 'Build, create & discover your world'}
      />

      {/* Main Game Card */}
      <div className="bg-white dark:bg-[#20091b] rounded-3xl p-3 sm:p-6 shadow-xl border border-pink-200 dark:border-[#3d122f] text-slate-800 dark:text-pink-100 max-w-6xl w-full flex flex-col items-center space-y-4">
        
        {/* Navigation Activities Bar */}
        <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 bg-pink-50 dark:bg-[#1a0716] p-1.5 rounded-2xl border border-pink-200 dark:border-pink-900/40 w-full text-xs sm:text-sm font-bold">
          <button
            onClick={() => {
              sound.playClick();
              setActiveMode('free');
            }}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeMode === 'free'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md scale-105'
                : 'text-slate-700 dark:text-pink-200 hover:bg-pink-100 dark:hover:bg-pink-950/40'
            }`}
          >
            <Hammer className="w-4 h-4" />
            <span>{language === 'ar' ? '١. البناء الحر' : '1. Free Build'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveMode('build-model');
            }}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeMode === 'build-model'
                ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md scale-105'
                : 'text-slate-700 dark:text-pink-200 hover:bg-pink-100 dark:hover:bg-pink-950/40'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>{language === 'ar' ? '٢. ابنِ الشكل' : '2. Build Model'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveMode('letters');
            }}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeMode === 'letters'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md scale-105'
                : 'text-slate-700 dark:text-pink-200 hover:bg-pink-100 dark:hover:bg-pink-950/40'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>{language === 'ar' ? '٣. عالم الحروف' : '3. Letters World'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveMode('numbers');
            }}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeMode === 'numbers'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md scale-105'
                : 'text-slate-700 dark:text-pink-200 hover:bg-pink-100 dark:hover:bg-pink-950/40'
            }`}
          >
            <Binary className="w-4 h-4" />
            <span>{language === 'ar' ? '٤. عالم الأرقام' : '4. Numbers World'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveMode('shapes');
            }}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              activeMode === 'shapes'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md scale-105'
                : 'text-slate-700 dark:text-pink-200 hover:bg-pink-100 dark:hover:bg-pink-950/40'
            }`}
          >
            <Shapes className="w-4 h-4" />
            <span>{language === 'ar' ? '٥. عالم الأشكال' : '5. Shapes World'}</span>
          </button>
        </div>

        {/* -------------------------------------------------------------
            SUB-ACTIVITY HEADER BANNER (Instructions & Targets)
           ------------------------------------------------------------- */}
        {activeMode === 'build-model' && activeBlueprint && (
          <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 dark:from-[#2d0e26] dark:to-[#1a0716] border border-pink-200 dark:border-pink-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-5xl filter drop-shadow">{activeBlueprint.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-800 dark:text-pink-100">
                    {activeBlueprint.titleAr}
                  </h3>
                  <span className="text-xs font-bold text-pink-600 dark:text-pink-300 bg-pink-100 dark:bg-black/30 px-2 py-0.5 rounded-full">
                    المستوى: {activeBlueprint.difficulty === 'easy' ? 'سهل' : activeBlueprint.difficulty === 'medium' ? 'متوسط' : 'متقدم'}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-600 dark:text-pink-200/80">
                  {activeBlueprint.descriptionAr}
                </p>
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 block mt-0.5">
                  💡 تلميح تالين: {activeBlueprint.hintAr}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  setCurrentModelIdx((prev) => (prev > 0 ? prev - 1 : MODEL_BLUEPRINTS.length - 1));
                  handleClearAll();
                }}
                className="p-2 rounded-xl bg-white dark:bg-black/40 border border-pink-200 text-slate-700 dark:text-pink-200 hover:bg-pink-100 cursor-pointer"
                title="النموذج السابق"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleCheckChallenge}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>تحقق من البناء ({modelProgress.count}/{activeBlueprint.targetCount})</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setCurrentModelIdx((prev) => (prev + 1) % MODEL_BLUEPRINTS.length);
                  handleClearAll();
                }}
                className="p-2 rounded-xl bg-white dark:bg-black/40 border border-pink-200 text-slate-700 dark:text-pink-200 hover:bg-pink-100 cursor-pointer"
                title="النموذج التالي"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeMode === 'letters' && activeWord && (
          <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-[#2d0e26] dark:to-[#1a0716] border border-purple-200 dark:border-purple-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-5xl filter drop-shadow">{activeWord.imageIcon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-800 dark:text-pink-100">
                    تحدي الكلمة: ({activeWord.language === 'ar' ? activeWord.wordAr : activeWord.wordEn})
                  </h3>
                  <button
                    onClick={() => {
                      sound.playClick();
                      const nextLang = activeWord.language === 'ar' ? 'en' : 'ar';
                      setLettersLang(nextLang);
                      const targetIdx = WORD_CHALLENGES.findIndex((w) => w.language === nextLang);
                      if (targetIdx !== -1) setCurrentWordIdx(targetIdx);
                      handleClearAll();
                    }}
                    className="text-xs font-black bg-white dark:bg-black/40 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full border border-purple-200 cursor-pointer"
                  >
                    تبديل اللغة ({activeWord.language === 'ar' ? 'العربية' : 'English'})
                  </button>
                </div>
                <p className="text-xs font-medium text-slate-600 dark:text-pink-200/80">
                  {activeWord.hintAr}
                </p>
                <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 block mt-0.5">
                  رتب الحروف من {activeWord.language === 'ar' ? 'اليمين لليسار' : 'اليسار لليمين'}: [ {activeWord.letters.join(' - ')} ]
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => sound.speakText(activeWord.language === 'ar' ? activeWord.wordAr : activeWord.wordEn, activeWord.language)}
                className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 hover:bg-purple-200 cursor-pointer"
                title="استمع للكلمة"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              <button
                onClick={handleCheckChallenge}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-black text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>تحقق من الكلمة</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setCurrentWordIdx((prev) => (prev + 1) % WORD_CHALLENGES.length);
                  handleClearAll();
                }}
                className="p-2 rounded-xl bg-white dark:bg-black/40 border border-purple-200 text-slate-700 dark:text-pink-200 hover:bg-purple-100 cursor-pointer"
                title="الكلمة التالية"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeMode === 'numbers' && activeNumberChallenge && (
          <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-[#1a0716] dark:to-[#0f291e] border border-emerald-200 dark:border-emerald-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-black/30 p-2 rounded-2xl">
                {activeNumberChallenge.targetNumber}
              </span>
              <div>
                <h3 className="text-lg font-black text-slate-800 dark:text-pink-100">
                  {activeNumberChallenge.questionAr}
                </h3>
                {activeNumberChallenge.equation && (
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 block">
                    المعادلة: {activeNumberChallenge.equation}
                  </span>
                )}
                <span className="text-[11px] font-bold text-slate-600 dark:text-pink-200/80">
                  {activeNumberChallenge.hintAr}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCheckChallenge}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>تحقق من العدد ({numberProgress.count}/{activeNumberChallenge.targetNumber})</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setCurrentNumIdx((prev) => (prev + 1) % NUMBER_CHALLENGES.length);
                  handleClearAll();
                }}
                className="p-2 rounded-xl bg-white dark:bg-black/40 border border-emerald-200 text-slate-700 dark:text-pink-200 hover:bg-emerald-100 cursor-pointer"
                title="التحدي التالي"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeMode === 'shapes' && activeShapeChallenge && (
          <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-[#1a0716] dark:to-[#0c1f2e] border border-cyan-200 dark:border-cyan-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-5xl filter drop-shadow">{activeShapeChallenge.icon}</span>
              <div>
                <h3 className="text-lg font-black text-slate-800 dark:text-pink-100">
                  {activeShapeChallenge.titleAr}
                </h3>
                <p className="text-xs font-medium text-slate-600 dark:text-pink-200/80">
                  {activeShapeChallenge.instructionAr}
                </p>
                <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 block mt-0.5">
                  المطلوب: {activeShapeChallenge.requiredShapes.map((r) => `${r.count} ${r.nameAr}`).join(' + ')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCheckChallenge}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>تحقق من الأشكال</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setCurrentShapeIdx((prev) => (prev + 1) % SHAPE_CHALLENGES.length);
                  handleClearAll();
                }}
                className="p-2 rounded-xl bg-white dark:bg-black/40 border border-cyan-200 text-slate-700 dark:text-pink-200 hover:bg-cyan-100 cursor-pointer"
                title="التحدي التالي"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            INTERACTIVE BUILDING CANVAS & CONTROL TOOLBAR
           ------------------------------------------------------------- */}
        <div className="w-full flex flex-col space-y-2">
          
          {/* Top Canvas Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-50 dark:bg-[#1a0716] rounded-2xl border border-slate-200 dark:border-pink-900/40 text-xs font-bold">
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Undo Button */}
              <button
                onClick={handleUndo}
                disabled={history.length === 0}
                className="p-2 rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-pink-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer flex items-center gap-1"
                title="تراجع عن آخر حركة"
              >
                <Undo2 className="w-4 h-4" />
                <span className="hidden sm:inline">تراجع</span>
              </button>

              {/* Rotate Button */}
              <button
                onClick={handleRotateSelected}
                disabled={!selectedBlockId}
                className="p-2 rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-pink-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer flex items-center gap-1"
                title="تدوير القطعة 90 درجة"
              >
                <RotateCw className="w-4 h-4" />
                <span className="hidden sm:inline">تدوير</span>
              </button>

              {/* Duplicate Button */}
              <button
                onClick={handleDuplicateSelected}
                disabled={!selectedBlockId}
                className="p-2 rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-pink-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer flex items-center gap-1"
                title="نسخ القطعة المحددة"
              >
                <Copy className="w-4 h-4" />
                <span className="hidden sm:inline">نسخ</span>
              </button>

              {/* Delete Button */}
              <button
                onClick={handleDeleteSelected}
                disabled={!selectedBlockId}
                className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-300 hover:bg-rose-100 disabled:opacity-40 cursor-pointer flex items-center gap-1"
                title="حذف القطعة المحددة"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">حذف</span>
              </button>

              {/* Clear All Button */}
              <button
                onClick={handleClearAll}
                disabled={placedBlocks.length === 0}
                className="p-2 rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-pink-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer flex items-center gap-1"
                title="إعادة بناء الساحة من الصفر"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">مسح الكل</span>
              </button>
            </div>

            {/* View & Grid Controls */}
            <div className="flex items-center gap-1.5">
              {/* Snap to grid toggle */}
              <button
                onClick={() => {
                  sound.playClick();
                  setSnapToGrid(!snapToGrid);
                }}
                className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1 transition-colors cursor-pointer ${
                  snapToGrid
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border-amber-300'
                    : 'bg-white dark:bg-black/30 text-slate-600 dark:text-pink-200 border-slate-200'
                }`}
                title="مغناطيس المحاذاة التلقائية"
              >
                <Grid className="w-4 h-4" />
                <span>محاذاة {snapToGrid ? 'مفعّلة' : 'معطلة'}</span>
              </button>

              {/* Show grid lines toggle */}
              <button
                onClick={() => {
                  sound.playClick();
                  setShowGridLines(!showGridLines);
                }}
                className={`p-1.5 rounded-xl border cursor-pointer ${
                  showGridLines
                    ? 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-200 border-sky-300'
                    : 'bg-white dark:bg-black/30 text-slate-600 border-slate-200'
                }`}
                title="إظهار/إخفاء شبكة البناء"
              >
                <Eye className="w-4 h-4" />
              </button>

              {/* Zoom In/Out */}
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
                className="p-1.5 rounded-xl bg-white dark:bg-black/30 border border-slate-200 text-slate-600 dark:text-pink-200 hover:bg-slate-100 cursor-pointer"
                title="تصغير مساحة البناء"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
                className="p-1.5 rounded-xl bg-white dark:bg-black/30 border border-slate-200 text-slate-600 dark:text-pink-200 hover:bg-slate-100 cursor-pointer"
                title="تكبير مساحة البناء"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Responsive Canvas Stage */}
          <div
            ref={canvasRef}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onClick={() => setSelectedBlockId(null)}
            className={`w-full h-[400px] sm:h-[480px] rounded-3xl relative overflow-hidden select-none border-4 transition-all duration-300 ${
              selectedBlockId ? 'border-pink-300 dark:border-pink-800' : 'border-slate-200 dark:border-pink-900/40'
            }`}
            style={{
              backgroundColor: '#f8fafc',
              backgroundImage: showGridLines
                ? 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)'
                : 'none',
              backgroundSize: '20px 20px',
              touchAction: 'none', // Critical for smooth touch dragging on iPad/phones
            }}
          >
            {/* Ground Grass Line / Floor styling for aesthetic warmth */}
            <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-emerald-100 to-transparent pointer-events-none" />

            {/* Empty Canvas Friendly Helper Hint */}
            {placedBlocks.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-400 dark:text-pink-300/40 space-y-2 p-4 text-center">
                <Box className="w-12 h-12 stroke-1 animate-bounce" />
                <p className="text-sm font-bold">
                  {language === 'ar'
                    ? 'ساحة البناء جاهزة! اضغط أو اسحب أي قطعة من اللوحة السفلية لوضعها هنا 🧱'
                    : 'Your playground is ready! Tap or drag any block from the bottom panel 🧱'}
                </p>
                <span className="text-xs">
                  {language === 'ar' ? 'يمكنك تحريك القطع، تدويرها، وتركيبها فوق بعضها بحرية تامة' : 'Move, rotate, and stack blocks freely'}
                </span>
              </div>
            )}

            {/* Placed Interactive Blocks Canvas */}
            <div
              className="absolute inset-0 origin-top-left"
              style={{
                transform: `scale(${zoomLevel})`,
              }}
            >
              {placedBlocks.map((block) => {
                const isSelected = selectedBlockId === block.uid;

                return (
                  <div
                    key={block.uid}
                    onPointerDown={(e) => handlePointerDown(e, block.uid)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBlockId(block.uid);
                    }}
                    className={`absolute cursor-grab active:cursor-grabbing transition-shadow ${
                      isSelected ? 'ring-4 ring-pink-500 ring-offset-2 z-50' : ''
                    }`}
                    style={{
                      left: `${block.x}px`,
                      top: `${block.y}px`,
                      width: `${block.width}px`,
                      height: `${block.height}px`,
                      transform: `rotate(${block.rotation}deg)`,
                      zIndex: block.zIndex,
                    }}
                  >
                    {renderBlockShape(block)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------
            BOTTOM PALETTE & TOOLS DOCK
           ------------------------------------------------------------- */}
        <div className="w-full flex flex-col space-y-3 pt-2">
          
          {/* Palette Category Selector Tabs */}
          <div className="flex items-center justify-between border-b border-pink-100 dark:border-pink-900/40 pb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  setPaletteTab('shapes');
                }}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm cursor-pointer transition-colors ${
                  paletteTab === 'shapes'
                    ? 'bg-pink-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-pink-200 hover:bg-pink-50'
                }`}
              >
                <span>🧱 الأشكال والمكعبات</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setPaletteTab('letters');
                }}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm cursor-pointer transition-colors ${
                  paletteTab === 'letters'
                    ? 'bg-purple-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-pink-200 hover:bg-pink-50'
                }`}
              >
                <span>🔤 مكعبات الحروف</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setPaletteTab('numbers');
                }}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm cursor-pointer transition-colors ${
                  paletteTab === 'numbers'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-pink-200 hover:bg-pink-50'
                }`}
              >
                <span>🔢 مكعبات الأرقام</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setPaletteTab('nature');
                }}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm cursor-pointer transition-colors ${
                  paletteTab === 'nature'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-pink-200 hover:bg-pink-50'
                }`}
              >
                <span>🌳 الطبيعة والزينة</span>
              </button>
            </div>

            {/* Total placed blocks counter */}
            <span className="text-xs font-black text-pink-600 dark:text-pink-300 bg-pink-50 dark:bg-black/30 px-3 py-1 rounded-full border border-pink-200 dark:border-pink-900/40">
              عدد القطع: {placedBlocks.length}
            </span>
          </div>

          {/* PALETTE 1: SHAPES & CUBES */}
          {paletteTab === 'shapes' && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 px-1 scrollbar-thin">
              {PALETTE_BLOCKS.filter((b) => b.category === 'shapes').map((block) => (
                <div
                  key={block.id}
                  onClick={() => handleAddBlock(block)}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-50 dark:bg-[#1a0716] border-2 border-slate-200 dark:border-pink-900/40 hover:border-pink-400 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 group"
                  title={block.nameAr}
                >
                  <div className="w-14 h-14 flex items-center justify-center p-1">
                    {renderBlockShape(block, true)}
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 dark:text-pink-200 text-center max-w-[70px] truncate">
                    {block.nameAr}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* PALETTE 2: LETTERS (Arabic & English) */}
          {paletteTab === 'letters' && (
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLettersLang('ar')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black cursor-pointer ${
                    lettersLang === 'ar' ? 'bg-pink-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  حروف عربية (أ - ي)
                </button>
                <button
                  onClick={() => setLettersLang('en')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black cursor-pointer ${
                    lettersLang === 'en' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  English Letters (A - Z)
                </button>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-thin">
                {(lettersLang === 'ar' ? ARABIC_LETTERS : ENGLISH_LETTERS).map((char) => (
                  <button
                    key={char}
                    onClick={() => handleAddLetterBlock(char)}
                    className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-black text-xl shadow-md transition-transform hover:scale-110 active:scale-95 cursor-pointer shrink-0 flex items-center justify-center border-b-3 border-purple-800"
                  >
                    {char}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PALETTE 3: NUMBERS (0 - 20) */}
          {paletteTab === 'numbers' && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-thin">
              {NUMBER_BLOCKS_LIST.map((num) => (
                <button
                  key={num}
                  onClick={() => handleAddNumberBlock(num)}
                  className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xl shadow-md transition-transform hover:scale-110 active:scale-95 cursor-pointer shrink-0 flex items-center justify-center border-b-3 border-emerald-800"
                >
                  {num}
                </button>
              ))}
            </div>
          )}

          {/* PALETTE 4: NATURE & DECOR */}
          {paletteTab === 'nature' && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 px-1 scrollbar-thin">
              {PALETTE_BLOCKS.filter((b) => b.category === 'nature').map((block) => (
                <div
                  key={block.id}
                  onClick={() => handleAddBlock(block)}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-50 dark:bg-[#1a0716] border-2 border-slate-200 dark:border-pink-900/40 hover:border-amber-400 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
                  title={block.nameAr}
                >
                  <div className="w-14 h-14 flex items-center justify-center p-1">
                    {renderBlockShape(block, true)}
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 dark:text-pink-200 text-center max-w-[70px] truncate">
                    {block.nameAr}
                  </span>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Win Celebration Modal */}
      {celebrateWin && (
        <WinCelebration
          score={score}
          message={winMessage || '🎉 أبدعت يا بطل في عالمك الصغير! استمر في الابتكار والبناء!'}
          onRestart={() => {
            setCelebrateWin(false);
            handleClearAll();
          }}
          onGoHome={onGoHome}
          stars={score >= 100 ? 3 : score >= 50 ? 2 : 1}
        />
      )}
    </div>
  );
};

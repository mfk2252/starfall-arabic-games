import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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
  Grid,
  Volume2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Eye,
  Info,
  X,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import { BackButton } from '../common/BackButton';

type ActivityMode = 'free' | 'build-model' | 'letters' | 'numbers' | 'shapes';

export const MyLittleWorldGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  // Mode Selection (5 activities)
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
  const [paletteTab, setPaletteTab] = useState<'shapes' | 'letters' | 'numbers' | 'nature' | 'roads'>('shapes');
  const [lettersLang, setLettersLang] = useState<'ar' | 'en'>('ar');

  // Sub-Activity States
  const [currentModelIdx, setCurrentModelIdx] = useState<number>(0);
  const [currentWordIdx, setCurrentWordIdx] = useState<number>(0);
  const [currentNumIdx, setCurrentNumIdx] = useState<number>(0);
  const [currentShapeIdx, setCurrentShapeIdx] = useState<number>(0);

  // Sound state
  const [isMuted, setIsMuted] = useState(!sound.isEnabled());

  // Help & Info Modal
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

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

  const handleToggleSound = () => {
    const next = sound.toggleSound();
    setIsMuted(!next);
  };

  // -------------------------------------------------------------
  // BLOCK MANIPULATION ACTIONS
  // -------------------------------------------------------------
  const handleAddBlock = (block: BlockItem) => {
    sound.playPop();
    recordHistory(placedBlocks);

    const canvas = canvasRef.current;
    const canvasWidth = canvas ? canvas.clientWidth : 600;
    const canvasHeight = canvas ? canvas.clientHeight : 400;

    // Center placement with subtle staggered random offset
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
  };

  const handleAddLetterBlock = (char: string) => {
    sound.playPop();
    recordHistory(placedBlocks);

    const canvas = canvasRef.current;
    const canvasWidth = canvas ? canvas.clientWidth : 600;
    const canvasHeight = canvas ? canvas.clientHeight : 400;
    const randomOffset = (Math.random() - 0.5) * 50;

    let initialX = Math.max(20, canvasWidth / 2 - 30 + randomOffset);
    let initialY = Math.max(20, canvasHeight / 2 - 30 + randomOffset);

    if (snapToGrid) {
      const gridSize = 20;
      initialX = Math.round(initialX / gridSize) * gridSize;
      initialY = Math.round(initialY / gridSize) * gridSize;
    }

    const newLetterBlock: PlacedBlock = {
      uid: `letter-${char}-${Date.now()}`,
      blockId: `letter-${char}`,
      type: 'letter',
      label: char,
      color: '#8b5cf6',
      accentColor: '#6d28d9',
      x: initialX,
      y: initialY,
      width: 58,
      height: 58,
      rotation: 0,
      zIndex: placedBlocks.length + 1,
    };

    setPlacedBlocks((prev) => [...prev, newLetterBlock]);
    setSelectedBlockId(newLetterBlock.uid);
    sound.speakText(char, lettersLang);
  };

  const handleAddNumberBlock = (num: number) => {
    sound.playPop();
    recordHistory(placedBlocks);

    const canvas = canvasRef.current;
    const canvasWidth = canvas ? canvas.clientWidth : 600;
    const canvasHeight = canvas ? canvas.clientHeight : 400;
    const randomOffset = (Math.random() - 0.5) * 50;

    let initialX = Math.max(20, canvasWidth / 2 - 30 + randomOffset);
    let initialY = Math.max(20, canvasHeight / 2 - 30 + randomOffset);

    if (snapToGrid) {
      const gridSize = 20;
      initialX = Math.round(initialX / gridSize) * gridSize;
      initialY = Math.round(initialY / gridSize) * gridSize;
    }

    const newNumBlock: PlacedBlock = {
      uid: `num-${num}-${Date.now()}`,
      blockId: `num-${num}`,
      type: 'number',
      label: num.toString(),
      color: '#10b981',
      accentColor: '#047857',
      x: initialX,
      y: initialY,
      width: 58,
      height: 58,
      rotation: 0,
      zIndex: placedBlocks.length + 1,
    };

    setPlacedBlocks((prev) => [...prev, newNumBlock]);
    setSelectedBlockId(newNumBlock.uid);
    sound.speakText(num.toString(), 'ar');
  };

  const handleRotateSelected = () => {
    if (!selectedBlockId) return;
    sound.playFlip();
    recordHistory(placedBlocks);

    setPlacedBlocks((prev) =>
      prev.map((block) => {
        if (block.uid === selectedBlockId) {
          const nextRotation = (block.rotation + 90) % 360;
          return { ...block, rotation: nextRotation };
        }
        return block;
      })
    );
  };

  const handleDuplicateSelected = () => {
    if (!selectedBlockId) return;
    const target = placedBlocks.find((b) => b.uid === selectedBlockId);
    if (!target) return;

    sound.playPop();
    recordHistory(placedBlocks);

    const duplicated: PlacedBlock = {
      ...target,
      uid: `block-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      x: target.x + 25,
      y: target.y + 25,
      zIndex: placedBlocks.length + 1,
    };

    setPlacedBlocks((prev) => [...prev, duplicated]);
    setSelectedBlockId(duplicated.uid);
  };

  const handleDeleteSelected = () => {
    if (!selectedBlockId) return;
    sound.playClick();
    recordHistory(placedBlocks);

    setPlacedBlocks((prev) => prev.filter((b) => b.uid !== selectedBlockId));
    setSelectedBlockId(null);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    sound.playClick();

    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setPlacedBlocks(previous);
    setSelectedBlockId(null);
  };

  const handleClearAll = () => {
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

    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Safe capture
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggedUid || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const pointerCanvasX = (e.clientX - canvasRect.left) / zoomLevel;
    const pointerCanvasY = (e.clientY - canvasRect.top) / zoomLevel;

    let nextX = pointerCanvasX - dragOffset.x;
    let nextY = pointerCanvasY - dragOffset.y;

    if (snapToGrid) {
      const gridSize = 20;
      nextX = Math.round(nextX / gridSize) * gridSize;
      nextY = Math.round(nextY / gridSize) * gridSize;
    }

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

    const letterBlocks = placedBlocks.filter((b) => b.type === 'letter' && b.label);
    if (letterBlocks.length === 0) return { isCorrect: false, currentStr: '' };

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
      isPlaced ? 'shadow-lg' : 'shadow-xs'
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

  // -------------------------------------------------------------
  // FULL-SCREEN GAME WORKSPACE
  // -------------------------------------------------------------
  return (
    <div
      className="w-full max-w-7xl mx-auto flex flex-col h-[calc(100vh-20px)] sm:h-[calc(100vh-28px)] max-h-[940px] p-1.5 sm:p-2.5 overflow-hidden text-slate-800 dark:text-pink-100 select-none animate-in fade-in duration-200"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* 1. TOP COMPACT CONTROL BAR */}
      <div className="w-full flex items-center justify-between gap-1.5 sm:gap-2 pb-1.5 shrink-0">
        {/* Left: Back Button & Title Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <BackButton onClick={onGoHome} label={isAr ? 'الرجوع' : 'Back'} />
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 text-white shadow-xs">
            <span>🧱</span>
            <span>{isAr ? 'عالمي الصغير' : 'My Little World'}</span>
          </div>
        </div>

        {/* Center: 5 Activity Mode Pill Switchers */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 bg-white dark:bg-[#20091b] rounded-full border border-pink-200/80 dark:border-[#3d122f] shadow-xs text-xs font-bold scrollbar-thin">
          <button
            onClick={() => {
              sound.playClick();
              setActiveMode('free');
            }}
            className={`px-2.5 sm:px-3 py-1 rounded-full flex items-center gap-1 transition-all cursor-pointer shrink-0 ${
              activeMode === 'free'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs scale-102'
                : 'text-slate-700 dark:text-pink-200 hover:bg-pink-50 dark:hover:bg-pink-950/40'
            }`}
          >
            <Hammer className="w-3.5 h-3.5" />
            <span>{isAr ? '١. البناء الحر' : '1. Free Build'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveMode('build-model');
            }}
            className={`px-2.5 sm:px-3 py-1 rounded-full flex items-center gap-1 transition-all cursor-pointer shrink-0 ${
              activeMode === 'build-model'
                ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-xs scale-102'
                : 'text-slate-700 dark:text-pink-200 hover:bg-pink-50 dark:hover:bg-pink-950/40'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{isAr ? '٢. ابنِ الشكل' : '2. Build Model'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveMode('letters');
            }}
            className={`px-2.5 sm:px-3 py-1 rounded-full flex items-center gap-1 transition-all cursor-pointer shrink-0 ${
              activeMode === 'letters'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-xs scale-102'
                : 'text-slate-700 dark:text-pink-200 hover:bg-pink-50 dark:hover:bg-pink-950/40'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>{isAr ? '٣. عالم الحروف' : '3. Letters World'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveMode('numbers');
            }}
            className={`px-2.5 sm:px-3 py-1 rounded-full flex items-center gap-1 transition-all cursor-pointer shrink-0 ${
              activeMode === 'numbers'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xs scale-102'
                : 'text-slate-700 dark:text-pink-200 hover:bg-pink-50 dark:hover:bg-pink-950/40'
            }`}
          >
            <Binary className="w-3.5 h-3.5" />
            <span>{isAr ? '٤. عالم الأرقام' : '4. Numbers World'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveMode('shapes');
            }}
            className={`px-2.5 sm:px-3 py-1 rounded-full flex items-center gap-1 transition-all cursor-pointer shrink-0 ${
              activeMode === 'shapes'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xs scale-102'
                : 'text-slate-700 dark:text-pink-200 hover:bg-pink-50 dark:hover:bg-pink-950/40'
            }`}
          >
            <Shapes className="w-3.5 h-3.5" />
            <span>{isAr ? '٥. عالم الأشكال' : '5. Shapes World'}</span>
          </button>
        </div>

        {/* Right: Sound, Info/Help Modal, Score */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleToggleSound}
            className="p-1.5 rounded-full bg-white dark:bg-[#20091b] border border-pink-200 dark:border-[#3d122f] text-slate-700 dark:text-pink-100 hover:bg-pink-50 cursor-pointer shadow-xs"
            title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
          >
            <Volume2 className={`w-4 h-4 ${isMuted ? 'opacity-30' : 'text-amber-500'}`} />
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setShowHelpModal(true);
            }}
            className="p-1.5 rounded-full bg-white dark:bg-[#20091b] border border-amber-200 dark:border-[#3d122f] text-amber-600 dark:text-amber-300 hover:bg-amber-50 cursor-pointer shadow-xs"
            title={isAr ? 'إرشادات النشاط' : 'Instructions & Hints'}
          >
            <Lightbulb className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800 text-xs font-black">
            <span>⭐</span>
            <span>{score}</span>
          </div>
        </div>
      </div>

      {/* 2. COMPACT SUB-ACTIVITY BANNER (Only in challenge modes, single line ~36px) */}
      {activeMode === 'build-model' && activeBlueprint && (
        <div className="w-full px-2.5 py-1 mb-1 rounded-xl bg-pink-50/90 dark:bg-[#20091b] border border-pink-200/80 dark:border-pink-900/50 flex items-center justify-between gap-2 shrink-0 text-xs">
          <div className="flex items-center gap-2 truncate">
            <span className="text-xl filter drop-shadow">{activeBlueprint.icon}</span>
            <span className="font-black text-slate-800 dark:text-pink-100 truncate">
              {activeBlueprint.titleAr}
            </span>
            <span className="text-[10px] font-bold text-pink-600 dark:text-pink-300 bg-pink-100 dark:bg-black/30 px-2 py-0.5 rounded-full hidden sm:inline">
              المطلوب: {activeBlueprint.targetCount} قطع
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                sound.playClick();
                setCurrentModelIdx((prev) => (prev > 0 ? prev - 1 : MODEL_BLUEPRINTS.length - 1));
                handleClearAll();
              }}
              className="p-1 rounded-lg bg-white dark:bg-black/40 border border-pink-200 text-slate-700 dark:text-pink-200 hover:bg-pink-100 cursor-pointer"
              title="النموذج السابق"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleCheckChallenge}
              className="px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs shadow-xs hover:scale-102 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>تحقق ({modelProgress.count}/{activeBlueprint.targetCount})</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setCurrentModelIdx((prev) => (prev + 1) % MODEL_BLUEPRINTS.length);
                handleClearAll();
              }}
              className="p-1 rounded-lg bg-white dark:bg-black/40 border border-pink-200 text-slate-700 dark:text-pink-200 hover:bg-pink-100 cursor-pointer"
              title="النموذج التالي"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {activeMode === 'letters' && activeWord && (
        <div className="w-full px-2.5 py-1 mb-1 rounded-xl bg-purple-50/90 dark:bg-[#20091b] border border-purple-200/80 dark:border-purple-900/50 flex items-center justify-between gap-2 shrink-0 text-xs">
          <div className="flex items-center gap-2 truncate">
            <span className="text-xl filter drop-shadow">{activeWord.imageIcon}</span>
            <span className="font-black text-slate-800 dark:text-pink-100 truncate">
              تحدي الكلمة: ({activeWord.language === 'ar' ? activeWord.wordAr : activeWord.wordEn})
            </span>
            <button
              onClick={() => {
                sound.playClick();
                const nextLang = activeWord.language === 'ar' ? 'en' : 'ar';
                setLettersLang(nextLang);
                const targetIdx = WORD_CHALLENGES.findIndex((w) => w.language === nextLang);
                if (targetIdx !== -1) setCurrentWordIdx(targetIdx);
                handleClearAll();
              }}
              className="text-[10px] font-black bg-white dark:bg-black/40 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full border border-purple-200 cursor-pointer hidden sm:inline"
            >
              {activeWord.language === 'ar' ? 'العربية' : 'English'}
            </button>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => sound.speakText(activeWord.language === 'ar' ? activeWord.wordAr : activeWord.wordEn, activeWord.language)}
              className="p-1 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 hover:bg-purple-200 cursor-pointer"
              title="استمع للكلمة"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleCheckChallenge}
              className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-black text-xs shadow-xs hover:scale-102 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>تحقق</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setCurrentWordIdx((prev) => (prev + 1) % WORD_CHALLENGES.length);
                handleClearAll();
              }}
              className="p-1 rounded-lg bg-white dark:bg-black/40 border border-purple-200 text-slate-700 dark:text-pink-200 hover:bg-purple-100 cursor-pointer"
              title="الكلمة التالية"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {activeMode === 'numbers' && activeNumberChallenge && (
        <div className="w-full px-2.5 py-1 mb-1 rounded-xl bg-emerald-50/90 dark:bg-[#20091b] border border-emerald-200/80 dark:border-emerald-900/50 flex items-center justify-between gap-2 shrink-0 text-xs">
          <div className="flex items-center gap-2 truncate">
            <span className="font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-black/30 px-2 py-0.5 rounded-lg text-sm">
              {activeNumberChallenge.targetNumber}
            </span>
            <span className="font-black text-slate-800 dark:text-pink-100 truncate">
              {activeNumberChallenge.questionAr}
            </span>
            {activeNumberChallenge.equation && (
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hidden sm:inline">
                ({activeNumberChallenge.equation})
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleCheckChallenge}
              className="px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs shadow-xs hover:scale-102 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>تحقق ({numberProgress.count}/{activeNumberChallenge.targetNumber})</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setCurrentNumIdx((prev) => (prev + 1) % NUMBER_CHALLENGES.length);
                handleClearAll();
              }}
              className="p-1 rounded-lg bg-white dark:bg-black/40 border border-emerald-200 text-slate-700 dark:text-pink-200 hover:bg-emerald-100 cursor-pointer"
              title="التحدي التالي"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {activeMode === 'shapes' && activeShapeChallenge && (
        <div className="w-full px-2.5 py-1 mb-1 rounded-xl bg-cyan-50/90 dark:bg-[#20091b] border border-cyan-200/80 dark:border-cyan-900/50 flex items-center justify-between gap-2 shrink-0 text-xs">
          <div className="flex items-center gap-2 truncate">
            <span className="text-xl filter drop-shadow">{activeShapeChallenge.icon}</span>
            <span className="font-black text-slate-800 dark:text-pink-100 truncate">
              {activeShapeChallenge.titleAr}
            </span>
            <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 hidden sm:inline">
              [{activeShapeChallenge.requiredShapes.map((r) => `${r.count} ${r.nameAr}`).join(' + ')}]
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleCheckChallenge}
              className="px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs shadow-xs hover:scale-102 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>تحقق من الأشكال</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setCurrentShapeIdx((prev) => (prev + 1) % SHAPE_CHALLENGES.length);
                handleClearAll();
              }}
              className="p-1 rounded-lg bg-white dark:bg-black/40 border border-cyan-200 text-slate-700 dark:text-pink-200 hover:bg-cyan-100 cursor-pointer"
              title="التحدي التالي"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 3. CANVAS QUICK TOOLBAR (Clean, flat, high efficiency) */}
      <div className="w-full flex items-center justify-between gap-1.5 py-1 px-2 mb-1 bg-white/95 dark:bg-[#20091b] rounded-xl border border-pink-100 dark:border-pink-900/40 text-xs font-bold shrink-0 shadow-2xs">
        <div className="flex items-center gap-1 flex-wrap">
          <button
            onClick={handleUndo}
            disabled={history.length === 0}
            className="p-1.5 px-2 rounded-lg bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-pink-200 hover:bg-slate-100 disabled:opacity-30 cursor-pointer flex items-center gap-1"
            title="تراجع عن آخر حركة"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تراجع</span>
          </button>

          <button
            onClick={handleRotateSelected}
            disabled={!selectedBlockId}
            className="p-1.5 px-2 rounded-lg bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-pink-200 hover:bg-slate-100 disabled:opacity-30 cursor-pointer flex items-center gap-1"
            title="تدوير القطعة 90 درجة"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تدوير</span>
          </button>

          <button
            onClick={handleDuplicateSelected}
            disabled={!selectedBlockId}
            className="p-1.5 px-2 rounded-lg bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-pink-200 hover:bg-slate-100 disabled:opacity-30 cursor-pointer flex items-center gap-1"
            title="نسخ القطعة المحددة"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">نسخ</span>
          </button>

          <button
            onClick={handleDeleteSelected}
            disabled={!selectedBlockId}
            className="p-1.5 px-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-300 hover:bg-rose-100 disabled:opacity-30 cursor-pointer flex items-center gap-1"
            title="حذف القطعة المحددة"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">حذف</span>
          </button>

          <button
            onClick={handleClearAll}
            disabled={placedBlocks.length === 0}
            className="p-1.5 px-2 rounded-lg bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-pink-200 hover:bg-slate-100 disabled:opacity-30 cursor-pointer flex items-center gap-1"
            title="إعادة بناء الساحة من الصفر"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">مسح</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              sound.playClick();
              setSnapToGrid(!snapToGrid);
            }}
            className={`px-2 py-1 rounded-lg border flex items-center gap-1 transition-colors cursor-pointer ${
              snapToGrid
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border-amber-300'
                : 'bg-white dark:bg-black/30 text-slate-600 dark:text-pink-200 border-slate-200'
            }`}
            title="مغناطيس المحاذاة التلقائية"
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="hidden md:inline">محاذاة {snapToGrid ? 'مفعّلة' : 'معطلة'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setShowGridLines(!showGridLines);
            }}
            className={`p-1.5 rounded-lg border cursor-pointer ${
              showGridLines
                ? 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-200 border-sky-300'
                : 'bg-white dark:bg-black/30 text-slate-600 border-slate-200'
            }`}
            title="إظهار/إخفاء شبكة البناء"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
            className="p-1.5 rounded-lg bg-white dark:bg-black/30 border border-slate-200 text-slate-600 dark:text-pink-200 hover:bg-slate-100 cursor-pointer"
            title="تصغير مساحة البناء"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
            className="p-1.5 rounded-lg bg-white dark:bg-black/30 border border-slate-200 text-slate-600 dark:text-pink-200 hover:bg-slate-100 cursor-pointer"
            title="تكبير مساحة البناء"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <span className="text-[11px] font-black text-pink-600 dark:text-pink-300 bg-pink-50 dark:bg-black/30 px-2.5 py-0.5 rounded-full border border-pink-200 dark:border-pink-900/40 shrink-0">
            عدد القطع: {placedBlocks.length}
          </span>
        </div>
      </div>

      {/* 4. MAIN CENTRAL INTERACTIVE BUILDING CANVAS (DOMINATES VIEWPORT) */}
      <div
        ref={canvasRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={() => setSelectedBlockId(null)}
        className={`w-full flex-1 min-h-[260px] rounded-2xl relative overflow-hidden select-none border-2 sm:border-3 transition-all duration-300 shadow-inner ${
          selectedBlockId ? 'border-pink-400 dark:border-pink-600' : 'border-pink-200/90 dark:border-pink-900/40'
        }`}
        style={{
          backgroundColor: '#f8fafc',
          backgroundImage: showGridLines
            ? 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)'
            : 'none',
          backgroundSize: '20px 20px',
          touchAction: 'none',
        }}
      >
        {/* Subtle ground grass accent for aesthetic warmth */}
        <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-emerald-100/60 to-transparent pointer-events-none" />

        {/* Empty canvas hint */}
        {placedBlocks.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-400 dark:text-pink-300/40 space-y-1.5 p-4 text-center">
            <Box className="w-10 h-10 stroke-1 animate-bounce" />
            <p className="text-sm font-bold">
              {isAr
                ? 'ساحة البناء جاهزة! اضغط أو اسحب أي قطعة من اللوحة السفلية لوضعها هنا 🧱'
                : 'Your playground is ready! Tap or drag any block from the bottom panel 🧱'}
            </p>
            <span className="text-xs">
              {isAr ? 'يمكنك تحريك القطع، تدويرها، وتركيبها فوق بعضها بحرية تامة' : 'Move, rotate, and stack blocks freely'}
            </span>
          </div>
        )}

        {/* Placed Interactive Blocks */}
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

      {/* 5. BOTTOM PALETTE & TOOLS DOCK (Compact ribbon) */}
      <div className="w-full flex flex-col pt-1.5 shrink-0 space-y-1">
        {/* Category Tabs */}
        <div className="flex items-center justify-between border-b border-pink-100 dark:border-pink-900/40 pb-1">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
            <button
              onClick={() => {
                sound.playClick();
                setPaletteTab('shapes');
              }}
              className={`px-3 py-1 rounded-xl font-bold text-xs cursor-pointer transition-colors ${
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
              className={`px-3 py-1 rounded-xl font-bold text-xs cursor-pointer transition-colors ${
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
              className={`px-3 py-1 rounded-xl font-bold text-xs cursor-pointer transition-colors ${
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
              className={`px-3 py-1 rounded-xl font-bold text-xs cursor-pointer transition-colors ${
                paletteTab === 'nature'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-pink-200 hover:bg-pink-50'
              }`}
            >
              <span>🌳 الطبيعة والزينة</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setPaletteTab('roads');
              }}
              className={`px-3 py-1 rounded-xl font-bold text-xs cursor-pointer transition-colors ${
                paletteTab === 'roads'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-pink-200 hover:bg-pink-50'
              }`}
            >
              <span>🚦 الطرق والإشارات</span>
            </button>
          </div>

          {paletteTab === 'letters' && (
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setLettersLang('ar')}
                className={`px-2 py-0.5 rounded text-[11px] font-black cursor-pointer ${
                  lettersLang === 'ar' ? 'bg-pink-600 text-white' : 'bg-slate-100 dark:bg-black/30 text-slate-700 dark:text-pink-200'
                }`}
              >
                عربي
              </button>
              <button
                onClick={() => setLettersLang('en')}
                className={`px-2 py-0.5 rounded text-[11px] font-black cursor-pointer ${
                  lettersLang === 'en' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-black/30 text-slate-700 dark:text-pink-200'
                }`}
              >
                En
              </button>
            </div>
          )}
        </div>

        {/* Palette Items Ribbon */}
        <div className="flex items-center gap-2 overflow-x-auto p-1.5 bg-white dark:bg-[#20091b] rounded-2xl border border-pink-100 dark:border-pink-900/40 scrollbar-thin">
          {paletteTab === 'shapes' &&
            PALETTE_BLOCKS.filter((b) => b.category === 'shapes').map((block) => (
              <div
                key={block.id}
                onClick={() => handleAddBlock(block)}
                className="flex flex-col items-center gap-1 p-1.5 rounded-xl bg-slate-50 dark:bg-[#1a0716] border border-slate-200 dark:border-pink-900/40 hover:border-pink-400 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
                title={block.nameAr}
              >
                <div className="w-11 h-11 flex items-center justify-center p-0.5">
                  {renderBlockShape(block, true)}
                </div>
                <span className="text-[10px] font-bold text-slate-700 dark:text-pink-200 text-center max-w-[64px] truncate">
                  {block.nameAr}
                </span>
              </div>
            ))}

          {paletteTab === 'letters' &&
            (lettersLang === 'ar' ? ARABIC_LETTERS : ENGLISH_LETTERS).map((char) => (
              <button
                key={char}
                onClick={() => handleAddLetterBlock(char)}
                className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-black text-lg shadow-sm transition-transform hover:scale-110 active:scale-95 cursor-pointer shrink-0 flex items-center justify-center border-b-2 border-purple-800"
              >
                {char}
              </button>
            ))}

          {paletteTab === 'numbers' &&
            NUMBER_BLOCKS_LIST.map((num) => (
              <button
                key={num}
                onClick={() => handleAddNumberBlock(num)}
                className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-lg shadow-sm transition-transform hover:scale-110 active:scale-95 cursor-pointer shrink-0 flex items-center justify-center border-b-2 border-emerald-800"
              >
                {num}
              </button>
            ))}

          {paletteTab === 'nature' &&
            PALETTE_BLOCKS.filter((b) => b.category === 'nature').map((block) => (
              <div
                key={block.id}
                onClick={() => handleAddBlock(block)}
                className="flex flex-col items-center gap-1 p-1.5 rounded-xl bg-slate-50 dark:bg-[#1a0716] border border-slate-200 dark:border-pink-900/40 hover:border-amber-400 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
                title={block.nameAr}
              >
                <div className="w-11 h-11 flex items-center justify-center p-0.5">
                  {renderBlockShape(block, true)}
                </div>
                <span className="text-[10px] font-bold text-slate-700 dark:text-pink-200 text-center max-w-[64px] truncate">
                  {block.nameAr}
                </span>
              </div>
            ))}

          {paletteTab === 'roads' &&
            PALETTE_BLOCKS.filter((b) => b.category === 'roads').map((block) => (
              <div
                key={block.id}
                onClick={() => handleAddBlock(block)}
                className="flex flex-col items-center gap-1 p-1.5 rounded-xl bg-slate-50 dark:bg-[#1a0716] border border-slate-200 dark:border-pink-900/40 hover:border-blue-400 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
                title={block.nameAr}
              >
                <div className="w-11 h-11 flex items-center justify-center p-0.5 text-2xl">
                  {renderBlockShape(block, true)}
                </div>
                <span className="text-[10px] font-bold text-slate-700 dark:text-pink-200 text-center max-w-[64px] truncate">
                  {block.nameAr}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* 6. HELP & INSTRUCTIONS MODAL (ON-DEMAND) */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#20091b] rounded-3xl border border-pink-200 dark:border-[#3d122f] shadow-2xl max-w-lg w-full p-5 space-y-4 text-slate-800 dark:text-pink-100">
            <div className="flex items-center justify-between border-b border-pink-100 dark:border-pink-900/40 pb-3">
              <div className="flex items-center gap-2 font-black text-base sm:text-lg">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <span>{isAr ? 'إرشادات عالمي الصغير 🧱✨' : 'My Little World Guide'}</span>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-1 rounded-full bg-slate-100 dark:bg-black/30 hover:bg-rose-100 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm leading-relaxed max-h-[60vh] overflow-y-auto pe-1 scrollbar-thin">
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40">
                <h4 className="font-black text-amber-800 dark:text-amber-200 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>طريقة البناء والتشكيل:</span>
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-pink-200">
                  <li>اضغط على أي قطعة من الشريط السفلي لوضعها في ساحة البناء.</li>
                  <li>اسحب القطع وحرّكها بإصبعك أو بالفأرة لتشكيل مجسمات رائعة.</li>
                  <li>استخدم أزرار التدوير، النسخ، والتراجع للتحكم الإبداعي الكامل.</li>
                </ul>
              </div>

              {activeMode === 'build-model' && activeBlueprint && (
                <div className="p-3 rounded-2xl bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900/40 space-y-1">
                  <h4 className="font-black text-pink-700 dark:text-pink-300">
                    تحدي النموذج: {activeBlueprint.titleAr}
                  </h4>
                  <p className="text-slate-600 dark:text-pink-200/90">{activeBlueprint.descriptionAr}</p>
                  <p className="text-amber-700 dark:text-amber-300 font-bold">💡 تلميح: {activeBlueprint.hintAr}</p>
                </div>
              )}

              {activeMode === 'letters' && activeWord && (
                <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/40 space-y-1">
                  <h4 className="font-black text-purple-700 dark:text-purple-300">
                    تحدي الكلمة: {activeWord.language === 'ar' ? activeWord.wordAr : activeWord.wordEn}
                  </h4>
                  <p className="text-slate-600 dark:text-pink-200/90">{activeWord.hintAr}</p>
                  <p className="font-bold text-purple-800 dark:text-purple-200">الحروف المطلوبة: [ {activeWord.letters.join(' - ')} ]</p>
                </div>
              )}

              {activeMode === 'numbers' && activeNumberChallenge && (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 space-y-1">
                  <h4 className="font-black text-emerald-700 dark:text-emerald-300">
                    تحدي الأرقام: {activeNumberChallenge.questionAr}
                  </h4>
                  <p className="text-slate-600 dark:text-pink-200/90">{activeNumberChallenge.hintAr}</p>
                </div>
              )}

              {activeMode === 'shapes' && activeShapeChallenge && (
                <div className="p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-900/40 space-y-1">
                  <h4 className="font-black text-cyan-700 dark:text-cyan-300">
                    تحدي الأشكال: {activeShapeChallenge.titleAr}
                  </h4>
                  <p className="text-slate-600 dark:text-pink-200/90">{activeShapeChallenge.instructionAr}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-black text-sm shadow-md hover:scale-102 transition-transform cursor-pointer"
            >
              فهمت، لنتابع البناء! 🚀
            </button>
          </div>
        </div>
      )}

      {/* 7. WIN CELEBRATION MODAL */}
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

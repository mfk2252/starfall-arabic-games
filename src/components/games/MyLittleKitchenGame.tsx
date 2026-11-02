import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  INGREDIENTS_DATABASE,
  KITCHEN_TOOLS,
  GUIDED_RECIPES,
  FoodCategory,
  IngredientItem,
  CookingTool,
  PreparedItem,
  KitchenRecipe,
} from '../../data/myLittleKitchenData';
import {
  Utensils,
  ChefHat,
  RotateCcw,
  Sparkles,
  Volume2,
  Trash2,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Camera,
  X,
  Play,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { BackButton } from '../common/BackButton';

export const MyLittleKitchenGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const { language, t } = useLanguage();
  const isAr = language === 'ar';

  // Game Phase: 'welcome' (card intro with start button) or 'play' (actual kitchen worktop)
  const [gamePhase, setGamePhase] = useState<'welcome' | 'play'>('welcome');

  // Recipe Drawer: optional modal/drawer for guided recipes
  const [showRecipeModal, setShowRecipeModal] = useState<boolean>(false);
  const [activeRecipeId, setActiveRecipeId] = useState<string | null>(null);

  // Work surface container state
  const [activeContainer, setActiveContainer] = useState<'plate' | 'bowl' | 'cup' | 'tray'>('plate');
  const [placedItems, setPlacedItems] = useState<PreparedItem[]>([]);
  const [selectedItemUid, setSelectedItemUid] = useState<string | null>(null);

  // Active Category filter in pantry (7 explicit categories)
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('fruits_veg');

  // Active cooking tool selection and animation state
  const [activeToolId, setActiveToolId] = useState<CookingTool['id'] | null>(null);
  const [isToolActive, setIsToolActive] = useState<boolean>(false);
  const [toolAnimationType, setToolAnimationType] = useState<string | null>(null);

  // Sound mute state
  const [isMuted, setIsMuted] = useState(!sound.isEnabled());

  // Dish Completion & Presentation Modal
  const [isDishFinished, setIsDishFinished] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  // Dragging reference
  const workSurfaceRef = useRef<HTMLDivElement>(null);
  const [draggedUid, setDraggedUid] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // 7 explicit categories matching requirements
  const categoryTabs = [
    { id: 'fruits_veg' as FoodCategory, labelAr: 'الفواكه والخضروات 🍎🥕', labelEn: 'Fruits & Veggies 🍎🥕' },
    { id: 'staples' as FoodCategory, labelAr: 'الحبوب والألبان 🧀🍞', labelEn: 'Grains & Dairy 🧀🍞' },
    { id: 'proteins' as FoodCategory, labelAr: 'البروتينات 🍗🥩', labelEn: 'Proteins 🍗🥩' },
    { id: 'desserts' as FoodCategory, labelAr: 'الحلويات والمخبوزات 🍰🍩', labelEn: 'Desserts & Bakes 🍰🍩' },
    { id: 'drinks' as FoodCategory, labelAr: 'المشروبات والعصائر 🥤🧃', labelEn: 'Drinks & Juices 🥤🧃' },
    { id: 'dishes_world' as FoodCategory, labelAr: 'الأطباق العالمية 🍕🍔', labelEn: 'World Dishes 🍕🍔' },
    { id: 'dishes_arabic' as FoodCategory, labelAr: 'الأطباق العربية والشعبية 🍲🌯', labelEn: 'Arabic Dishes 🍲🌯' },
  ];

  const activeRecipe = useMemo(() => {
    return GUIDED_RECIPES.find((r) => r.id === activeRecipeId) || null;
  }, [activeRecipeId]);

  const handleSpeak = (text: string) => {
    sound.speakText(text, isAr ? 'ar' : 'en');
  };

  const handleToggleSound = () => {
    const enabled = sound.toggleSound();
    setIsMuted(!enabled);
    if (enabled) {
      sound.playClick();
    }
  };

  // -------------------------------------------------------------
  // ADD & PREPARE INGREDIENTS
  // -------------------------------------------------------------
  const handleAddIngredient = (ingredient: IngredientItem) => {
    sound.playPop();
    handleSpeak(isAr ? ingredient.nameAr : ingredient.nameEn);

    const surface = workSurfaceRef.current;
    const surfaceWidth = surface ? surface.clientWidth : 360;
    const surfaceHeight = surface ? surface.clientHeight : 300;

    // Place near center with subtle offset
    const randomX = Math.max(20, surfaceWidth / 2 - 30 + (Math.random() - 0.5) * 80);
    const randomY = Math.max(20, surfaceHeight / 2 - 30 + (Math.random() - 0.5) * 60);

    const newItem: PreparedItem = {
      uid: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ingredientId: ingredient.id,
      nameAr: ingredient.nameAr,
      nameEn: ingredient.nameEn,
      icon: ingredient.icon,
      color: ingredient.color,
      accentColor: ingredient.accentColor,
      x: randomX,
      y: randomY,
      rotation: Math.floor((Math.random() - 0.5) * 20),
    };

    setPlacedItems((prev) => [...prev, newItem]);
    setSelectedItemUid(newItem.uid);
    setScore((s) => s + 10);
  };

  // Remove a placed item
  const handleRemoveItem = (uid: string) => {
    sound.playClick();
    setPlacedItems((prev) => prev.filter((item) => item.uid !== uid));
    if (selectedItemUid === uid) setSelectedItemUid(null);
  };

  // Reset current dish
  const handleResetDish = () => {
    sound.playClick();
    setPlacedItems([]);
    setSelectedItemUid(null);
    setIsDishFinished(false);
  };

  // -------------------------------------------------------------
  // COOKING TOOLS INTERACTION
  // -------------------------------------------------------------
  const handleUseTool = (tool: CookingTool) => {
    sound.playSparkle();
    setActiveToolId(tool.id);
    setIsToolActive(true);
    setToolAnimationType(tool.id);

    if (tool.id === 'sink') {
      sound.playMatch();
      handleSpeak(isAr ? 'غسل وتنظيف المكونات بالماء النقي 💧' : 'Washing ingredients with fresh water 💧');
    } else if (tool.id === 'knife') {
      sound.playFlip();
      handleSpeak(isAr ? 'تقطيع لطيف وآمن بالسكين البلاستيكي 🔪' : 'Safe gentle slicing 🔪');
    } else if (tool.id === 'blender') {
      sound.playWin();
      handleSpeak(isAr ? 'خلط المكونات ليصبح المشروب ناعماً ولذيذاً 🌪️' : 'Blending smoothly into a delicious drink 🌪️');
    } else if (tool.id === 'oven') {
      sound.playSparkle();
      handleSpeak(isAr ? 'خبز ذهبي شهي في الفرن ♨️' : 'Baking to golden perfection ♨️');
    } else if (tool.id === 'juicer') {
      sound.playMatch();
      handleSpeak(isAr ? 'عصر البرتقال والليمون الطازج 🍹' : 'Fresh citrus squeezing 🍹');
    } else if (tool.id === 'spoon' || tool.id === 'fork') {
      sound.playClick();
      handleSpeak(isAr ? 'تحريك ومزج النكهات الشهية!' : 'Stirring and tasting delicious flavors!');
    } else {
      sound.playClick();
      handleSpeak(isAr ? tool.nameAr : tool.nameEn);
    }

    // Transform items according to tool action
    setTimeout(() => {
      setPlacedItems((prev) =>
        prev.map((item) => {
          const dbItem = INGREDIENTS_DATABASE.find((i) => i.id === item.ingredientId);
          const isMatch =
            (tool.id === 'knife' && dbItem?.prepAction === 'cut') ||
            (tool.id === 'sink' && dbItem?.prepAction === 'wash') ||
            (tool.id === 'blender' && dbItem?.prepAction === 'blend') ||
            (tool.id === 'juicer' && dbItem?.prepAction === 'squeeze') ||
            ((tool.id === 'pan' || tool.id === 'pot') && dbItem?.prepAction === 'cook') ||
            (tool.id === 'oven' && dbItem?.prepAction === 'bake');

          if (dbItem && isMatch && dbItem.preppedIcon) {
            return {
              ...item,
              icon: dbItem.preppedIcon,
              nameAr: dbItem.preppedNameAr || item.nameAr,
            };
          }
          return item;
        })
      );
      setIsToolActive(false);
      setActiveToolId(null);
    }, 1200);
  };

  // -------------------------------------------------------------
  // TOUCH & MOUSE DRAGGING FOR PLACED INGREDIENTS
  // -------------------------------------------------------------
  const handlePointerDown = (e: React.PointerEvent, uid: string) => {
    e.stopPropagation();
    sound.playPop();

    const surface = workSurfaceRef.current;
    if (!surface) return;

    const item = placedItems.find((i) => i.uid === uid);
    if (!item) return;

    setSelectedItemUid(uid);
    setDraggedUid(uid);

    const surfaceRect = surface.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - surfaceRect.left - item.x,
      y: e.clientY - surfaceRect.top - item.y,
    });

    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Safe capture
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggedUid || !workSurfaceRef.current) return;

    const surfaceRect = workSurfaceRef.current.getBoundingClientRect();
    const nextX = e.clientX - surfaceRect.left - dragOffset.x;
    const nextY = e.clientY - surfaceRect.top - dragOffset.y;

    const maxX = surfaceRect.width - 60;
    const maxY = surfaceRect.height - 60;

    const clampedX = Math.max(5, Math.min(nextX, maxX));
    const clampedY = Math.max(5, Math.min(nextY, maxY));

    setPlacedItems((prev) =>
      prev.map((item) => (item.uid === draggedUid ? { ...item, x: clampedX, y: clampedY } : item))
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
  // FINISH DISH & PRESENTATION
  // -------------------------------------------------------------
  const handleFinishDish = () => {
    if (placedItems.length === 0) {
      sound.playWrong();
      return;
    }

    const finalScore = score + 50;
    setScore(finalScore);
    saveGameProgress('my-little-kitchen', finalScore, true);
    setIsDishFinished(true);
  };

  // Recipe progress calculation when a recipe is active
  const recipeProgress = useMemo(() => {
    if (!activeRecipe) return { count: 0, total: 0, isComplete: false };
    const placedIds = placedItems.map((i) => i.ingredientId);
    const matchedCount = activeRecipe.requiredIngredientIds.filter((id) => placedIds.includes(id)).length;
    const isComplete = matchedCount === activeRecipe.requiredIngredientIds.length;
    return {
      count: matchedCount,
      total: activeRecipe.requiredIngredientIds.length,
      isComplete,
    };
  }, [activeRecipe, placedItems]);

  // =========================================================================
  // SCREEN 1: WELCOME INTRO CARD
  // =========================================================================
  if (gamePhase === 'welcome') {
    return (
      <div
        className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[80vh] px-3 py-6 animate-in fade-in duration-300 overflow-x-hidden"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        <div className="w-full flex items-center justify-between mb-6">
          <BackButton onClick={onGoHome} label={t('backToGames')} />
          <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-1.5 rounded-full font-black text-xs sm:text-sm shadow-xs">
            <span>🍳</span>
            <span>{isAr ? 'مطبخي الصغير' : 'My Little Kitchen'}</span>
          </div>
        </div>

        <div className="w-full bg-white dark:bg-[#20091b] rounded-3xl p-6 sm:p-10 shadow-xl border border-amber-100 dark:border-[#3d122f] text-center flex flex-col items-center space-y-6 max-w-xl">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-orange-400 via-amber-300 to-yellow-200 dark:from-orange-950 dark:to-amber-900 border-4 border-amber-200 dark:border-amber-700 flex items-center justify-center text-6xl sm:text-7xl shadow-inner select-none animate-bounce">
            🍳
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 px-3.5 py-1 rounded-full text-xs font-black border border-amber-200 dark:border-amber-800">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{isAr ? 'عالم الطبخ للأطفال' : 'Kids Kitchen World'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-pink-100">
              {isAr ? 'مطبخي الصغير | My Little Kitchen' : 'My Little Kitchen'}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-pink-200/90 font-medium leading-relaxed max-w-md mx-auto">
              {isAr
                ? 'اختر مكوناتك، حضّر وجباتك، واصنع أطباقك المفضلة!'
                : 'Pick your ingredients, cook meals, and create your favorite dishes!'}
            </p>
          </div>

          <div className="w-full pt-2">
            <button
              onClick={() => {
                sound.playClick();
                setGamePhase('play');
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-base sm:text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>{isAr ? 'ابدأ اللعب الآن' : 'Start Playing Now'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SCREEN 2: FULL-SCREEN KITCHEN WORKTOP (Direct Play, 100% Mobile Responsive)
  // =========================================================================
  return (
    <div
      className="w-full max-w-6xl mx-auto flex flex-col h-[calc(100vh-20px)] sm:h-[calc(100vh-32px)] max-h-[880px] p-1.5 sm:p-4 overflow-x-hidden text-slate-800 dark:text-pink-100 animate-in fade-in duration-300"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* -------------------------------------------------------------
          A. COMPACT TOP CONTROL BAR (100% Mobile Responsive, No Horizontal Scroll)
         ------------------------------------------------------------- */}
      <div className="w-full flex flex-wrap items-center justify-between gap-1 sm:gap-2 pb-1.5 shrink-0 overflow-x-hidden">
        {/* Left: Compact Back & Recipes */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <BackButton
            onClick={() => setGamePhase('welcome')}
            label={isAr ? 'الرجوع' : 'Back'}
            className="px-2.5 py-1.5 text-xs font-bold"
          />

          <button
            onClick={() => {
              sound.playClick();
              setShowRecipeModal(true);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-black bg-white dark:bg-[#20091b] border border-amber-200 dark:border-[#3d122f] text-slate-700 dark:text-pink-100 hover:bg-amber-50 dark:hover:bg-[#2d0e26] transition-colors cursor-pointer shadow-2xs shrink-0"
            title={isAr ? 'كتاب الوصفات الإرشادية' : 'Recipe Book'}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="hidden sm:inline">{isAr ? 'الوصفات' : 'Recipes'}</span>
            {activeRecipe && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            )}
          </button>
        </div>

        {/* Center: Container Switcher */}
        <div className="flex items-center gap-0.5 sm:gap-1 bg-white dark:bg-[#20091b] p-0.5 sm:p-1 rounded-full border border-amber-100 dark:border-[#3d122f] shadow-2xs text-xs font-black shrink-0">
          <button
            onClick={() => { sound.playClick(); setActiveContainer('plate'); }}
            className={`px-2 sm:px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
              activeContainer === 'plate' ? 'bg-orange-500 text-white' : 'text-slate-600 dark:text-pink-200 hover:bg-amber-50'
            }`}
          >
            🍽️ <span className="hidden md:inline">{isAr ? 'طبق' : 'Plate'}</span>
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveContainer('bowl'); }}
            className={`px-2 sm:px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
              activeContainer === 'bowl' ? 'bg-orange-500 text-white' : 'text-slate-600 dark:text-pink-200 hover:bg-amber-50'
            }`}
          >
            🥣 <span className="hidden md:inline">{isAr ? 'وعاء' : 'Bowl'}</span>
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveContainer('cup'); }}
            className={`px-2 sm:px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
              activeContainer === 'cup' ? 'bg-orange-500 text-white' : 'text-slate-600 dark:text-pink-200 hover:bg-amber-50'
            }`}
          >
            🥤 <span className="hidden md:inline">{isAr ? 'كوب' : 'Cup'}</span>
          </button>
        </div>

        {/* Right Controls: Sound, Reset & Serve Dish Button */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            onClick={handleToggleSound}
            className="p-1.5 sm:p-2 rounded-full bg-white dark:bg-[#20091b] border border-amber-200 dark:border-[#3d122f] text-slate-700 dark:text-pink-100 hover:bg-amber-50 cursor-pointer shadow-2xs"
            title={isMuted ? t('soundOn') : t('soundOff')}
          >
            <Volume2 className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isMuted ? 'opacity-40' : 'text-orange-500'}`} />
          </button>

          <button
            onClick={handleResetDish}
            disabled={placedItems.length === 0}
            className="p-1.5 sm:p-2 rounded-full bg-white dark:bg-[#20091b] border border-rose-200 text-rose-600 hover:bg-rose-50 disabled:opacity-30 cursor-pointer shadow-2xs"
            title={isAr ? 'إعادة ضبط الطبق' : 'Reset Plate'}
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <button
            onClick={handleFinishDish}
            disabled={placedItems.length === 0}
            className="px-2.5 sm:px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 disabled:opacity-40 shrink-0"
          >
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>{isAr ? 'قدّم الطبق! ✨' : 'Serve! ✨'}</span>
          </button>
        </div>
      </div>

      {/* Active Recipe Banner (if recipe chosen, very slim) */}
      {activeRecipe && (
        <div className="w-full py-1 px-2.5 mb-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-200 truncate">
            <span>{activeRecipe.icon}</span>
            <span className="font-black truncate">{isAr ? activeRecipe.titleAr : activeRecipe.titleEn}:</span>
            <span className="opacity-90 shrink-0">{recipeProgress.count} / {recipeProgress.total}</span>
          </div>
          <button
            onClick={() => setActiveRecipeId(null)}
            className="text-emerald-700 hover:text-emerald-900 font-black cursor-pointer px-1.5 py-0.5 rounded-md hover:bg-emerald-100 shrink-0"
          >
            {isAr ? 'إلغاء' : 'Clear'}
          </button>
        </div>
      )}

      {/* -------------------------------------------------------------
          B. SLIM KITCHEN TOOLS BAR (Horizontal scroll, low vertical space)
         ------------------------------------------------------------- */}
      <div className="w-full flex items-center gap-1.5 py-1.5 px-2 mb-1.5 bg-gradient-to-r from-orange-50/70 via-amber-50/70 to-yellow-50/70 dark:from-[#1a0716] dark:via-[#20091b] dark:to-[#160612] rounded-2xl border border-amber-200/80 dark:border-pink-900/40 overflow-x-auto scrollbar-thin shrink-0 max-w-full">
        <span className="text-[11px] font-black text-amber-800 dark:text-amber-300 shrink-0 flex items-center gap-1 ps-1">
          <Utensils className="w-3.5 h-3.5 text-orange-500" />
          <span className="hidden sm:inline">{isAr ? 'الأدوات:' : 'Tools:'}</span>
        </span>

        <div className="flex items-center gap-1.5">
          {KITCHEN_TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => handleUseTool(tool)}
              className={`px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-black flex items-center gap-1 sm:gap-1.5 transition-all transform hover:scale-105 active:scale-95 cursor-pointer shadow-2xs shrink-0 ${
                activeToolId === tool.id && isToolActive
                  ? 'bg-orange-500 text-white animate-bounce'
                  : 'bg-white dark:bg-black/30 border border-amber-200 dark:border-pink-900/40 text-slate-700 dark:text-pink-100 hover:bg-orange-50'
              }`}
              title={isAr ? `${tool.nameAr} - ${tool.actionTextAr}` : `${tool.nameEn} - ${tool.actionTextEn}`}
            >
              <span className="text-base sm:text-lg filter drop-shadow select-none">{tool.icon}</span>
              <span className="hidden lg:inline text-[11px]">{isAr ? tool.nameAr : tool.nameEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* -------------------------------------------------------------
          C. MAIN EXPANDED WORK SURFACE (Dominates viewport, mobile adaptive)
         ------------------------------------------------------------- */}
      <div
        ref={workSurfaceRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="w-full flex-1 rounded-3xl relative overflow-hidden select-none border-2 sm:border-4 border-amber-200 dark:border-pink-900/50 shadow-inner flex items-center justify-center min-h-[220px] sm:min-h-[260px]"
        style={{
          backgroundColor: '#fffbeb',
          backgroundImage: 'radial-gradient(#fde68a 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
          touchAction: 'none',
        }}
      >
        {/* Wooden Kitchen Table Top Layer */}
        <div className="absolute inset-x-0 bottom-0 h-16 sm:h-24 bg-gradient-to-t from-amber-200/50 dark:from-amber-950/30 to-transparent pointer-events-none" />

        {/* Central Platter Container Visual */}
        <div
          className={`transition-all duration-300 flex items-center justify-center relative shadow-xl ${
            activeContainer === 'cup'
              ? 'w-36 h-48 sm:w-48 sm:h-60 rounded-3xl bg-gradient-to-br from-cyan-100 to-blue-200 dark:from-cyan-950 dark:to-blue-900 border-4 sm:border-8 border-cyan-300 dark:border-cyan-700'
              : activeContainer === 'bowl'
              ? 'w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-gradient-to-br from-rose-100 to-pink-200 dark:from-rose-950 dark:to-pink-900 border-4 sm:border-8 border-pink-300 dark:border-pink-800'
              : 'w-60 h-60 sm:w-80 sm:h-80 md:w-[400px] md:h-[400px] rounded-full bg-gradient-to-br from-white via-slate-50 to-amber-50 dark:from-[#2a0d24] dark:to-[#1a0716] border-4 sm:border-8 border-amber-200 dark:border-pink-900'
          }`}
        >
          <div className="w-full h-full rounded-full border-2 border-dashed border-black/10 dark:border-white/10 flex items-center justify-center pointer-events-none">
            {placedItems.length === 0 && (
              <div className="flex flex-col items-center justify-center text-amber-900/40 dark:text-pink-300/40 text-center p-3">
                <ChefHat className="w-10 h-10 sm:w-12 sm:h-12 stroke-1 mb-1.5 animate-bounce" />
                <span className="text-xs sm:text-sm font-black">
                  {isAr ? 'ساحة إعداد الطعام جاهزة!' : 'Your plate is ready!'}
                </span>
                <span className="text-[11px] sm:text-xs">
                  {isAr ? 'اختر الأطعمة من الأسفل وضعها هنا للبدء' : 'Tap foods below to add them here'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Tool Active Sizzle / Water Splashes Overlay Animation */}
        {isToolActive && (
          <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-xs flex items-center justify-center z-40 pointer-events-none">
            <div className="p-3 sm:p-4 rounded-3xl bg-white dark:bg-black/90 shadow-2xl border-2 border-orange-400 flex items-center gap-2 sm:gap-3 animate-bounce">
              <span className="text-3xl sm:text-4xl">
                {toolAnimationType === 'sink'
                  ? '💧'
                  : toolAnimationType === 'blender'
                  ? '🌪️'
                  : toolAnimationType === 'oven'
                  ? '♨️'
                  : '🔪'}
              </span>
              <span className="text-xs sm:text-sm font-black text-orange-600 dark:text-orange-400">
                {toolAnimationType === 'sink'
                  ? (isAr ? 'جاري الغسل بالماء النقي...' : 'Washing...')
                  : toolAnimationType === 'blender'
                  ? (isAr ? 'جاري الخلط اللذيذ...' : 'Blending...')
                  : toolAnimationType === 'oven'
                  ? (isAr ? 'جاري الخبز في الفرن...' : 'Baking...')
                  : (isAr ? 'جاري التقطيع الآمن...' : 'Slicing...')}
              </span>
            </div>
          </div>
        )}

        {/* Placed Interactive Food Items */}
        {placedItems.map((item) => {
          const isSelected = selectedItemUid === item.uid;

          return (
            <div
              key={item.uid}
              onPointerDown={(e) => handlePointerDown(e, item.uid)}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedItemUid(item.uid);
                handleSpeak(isAr ? item.nameAr : item.nameEn);
              }}
              className={`absolute cursor-grab active:cursor-grabbing p-1 transition-transform select-none ${
                isSelected ? 'ring-4 ring-orange-500 rounded-2xl z-30 scale-110' : 'z-20 hover:scale-105'
              }`}
              style={{
                left: `${item.x}px`,
                top: `${item.y}px`,
                transform: `rotate(${item.rotation}deg)`,
              }}
            >
              <div className="flex flex-col items-center">
                <span className="text-4xl sm:text-6xl filter drop-shadow-md">{item.icon}</span>
                <span className="text-[10px] font-black bg-white/90 dark:bg-black/80 text-slate-800 dark:text-pink-100 px-2 py-0.5 rounded-full shadow-xs border border-black/10 mt-0.5">
                  {isAr ? item.nameAr : item.nameEn}
                </span>

                {/* Quick remove button if selected */}
                {isSelected && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveItem(item.uid);
                    }}
                    className="mt-1 p-1 rounded-full bg-rose-500 text-white shadow-md hover:bg-rose-600 cursor-pointer"
                    title={isAr ? 'إزالة' : 'Remove'}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* -------------------------------------------------------------
          D. BOTTOM INGREDIENTS DOCK (7 Categories + Scrollable items)
         ------------------------------------------------------------- */}
      <div className="w-full flex flex-col pt-1.5 shrink-0 space-y-1 overflow-x-hidden">
        {/* 7 Category Tabs */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin max-w-full">
          {categoryTabs.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playClick();
                setSelectedCategory(cat.id);
              }}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl font-black text-xs shrink-0 transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs scale-102'
                  : 'bg-white dark:bg-[#20091b] border border-amber-200/80 dark:border-[#3d122f] text-slate-700 dark:text-pink-200 hover:bg-amber-50'
              }`}
            >
              {isAr ? cat.labelAr : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Ingredients Ribbon */}
        <div className="flex items-center gap-2 overflow-x-auto p-1.5 bg-white dark:bg-[#20091b] rounded-2xl border border-amber-200/80 dark:border-pink-900/40 scrollbar-thin max-w-full">
          {INGREDIENTS_DATABASE.filter((i) => i.category === selectedCategory).map((ingredient) => (
            <button
              key={ingredient.id}
              onClick={() => handleAddIngredient(ingredient)}
              className="flex flex-col items-center gap-1 p-1.5 sm:p-2 rounded-2xl bg-amber-50/50 dark:bg-black/30 border border-amber-100 dark:border-pink-900/40 hover:border-orange-400 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 shadow-2xs group"
              title={isAr ? ingredient.nameAr : ingredient.nameEn}
            >
              <span className="text-2xl sm:text-4xl group-hover:scale-110 transition-transform filter drop-shadow select-none">
                {ingredient.icon}
              </span>
              <span className="text-[10px] sm:text-[11px] font-black text-slate-800 dark:text-pink-100 max-w-[64px] sm:max-w-[70px] truncate text-center">
                {isAr ? ingredient.nameAr : ingredient.nameEn}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* -------------------------------------------------------------
          OPTIONAL RECIPE BOOK MODAL (Non-intrusive)
         ------------------------------------------------------------- */}
      {showRecipeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#20091b] rounded-3xl border-2 border-amber-300 dark:border-pink-900 shadow-2xl max-w-2xl w-full p-4 sm:p-6 flex flex-col space-y-4 text-slate-800 dark:text-pink-100 max-h-[85vh] overflow-hidden">
            <div className="flex items-center justify-between border-b border-amber-100 dark:border-pink-900/40 pb-3">
              <div className="flex items-center gap-2 font-black text-base sm:text-lg">
                <BookOpen className="w-5 h-5 text-amber-500" />
                <span>{isAr ? 'كتاب الوصفات الإرشادية (١٥ وصفة)' : 'Guided Recipes (15 Recipes)'}</span>
              </div>
              <button
                onClick={() => setShowRecipeModal(false)}
                className="p-1.5 rounded-full bg-slate-100 dark:bg-black/40 text-slate-600 dark:text-pink-200 hover:bg-rose-100 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-2.5 pe-1 scrollbar-thin">
              {GUIDED_RECIPES.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => {
                    sound.playPop();
                    setActiveRecipeId(recipe.id);
                    setShowRecipeModal(false);
                    handleSpeak(isAr ? recipe.titleAr : recipe.titleEn);
                  }}
                  className={`p-3 sm:p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all cursor-pointer hover:border-amber-400 hover:scale-[1.01] ${
                    activeRecipeId === recipe.id
                      ? 'bg-amber-100/70 dark:bg-amber-950/60 border-amber-400'
                      : 'bg-slate-50 dark:bg-black/30 border-slate-200 dark:border-pink-900/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl sm:text-3xl">{recipe.icon}</span>
                    <div className="text-start">
                      <h4 className="font-black text-xs sm:text-sm">{isAr ? recipe.titleAr : recipe.titleEn}</h4>
                      <p className="text-[11px] sm:text-xs text-slate-500 dark:text-pink-300/80">{isAr ? recipe.descriptionAr : recipe.descriptionEn}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-white dark:bg-black/40 border border-amber-200 text-amber-700 dark:text-amber-300 shrink-0">
                    {isAr ? 'اختر' : 'Select'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          DISH PRESENTATION / WIN CELEBRATION (Standard in Taleen)
         ------------------------------------------------------------- */}
      {isDishFinished && (
        <WinCelebration
          score={score}
          message={
            activeRecipe
              ? (isAr
                  ? `أحسنت! أعددت ${activeRecipe.targetDishNameAr} بنجاح!`
                  : `Great job! You made ${activeRecipe.targetDishNameEn}!`)
              : (isAr
                  ? 'ما شاء الله! طبق رائع وشهي جداً يا شيف المستقبل الصغير! 🍽️✨'
                  : 'Amazing dish, little chef! It looks delicious! 🍽️✨')
          }
          stars={placedItems.length >= 3 ? 3 : 2}
          onRestart={() => {
            sound.playClick();
            handleResetDish();
            setIsDishFinished(false);
          }}
          onGoHome={onGoHome}
        />
      )}
    </div>
  );
};

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';
import {
  OPPOSITES_DATA,
  OPPOSITE_CATEGORIES,
  OppositePair,
  OppositeCategory,
  OppositeDifficulty,
} from '../../data/oppositesData';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  Sparkles,
  RotateCcw,
  Volume2,
  CheckCircle2,
  HelpCircle,
  Trophy,
  BookOpen,
  Layers,
  ArrowRight,
  ArrowLeft,
  Search,
  Filter,
} from 'lucide-react';

export type GameMode = 'choose' | 'match' | 'complete' | 'word' | 'review';

export const OppositesGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const { language, dir } = useLanguage();
  const isAr = language === 'ar';
  const BackIcon = dir === 'rtl' ? ArrowRight : ArrowLeft;

  // Configuration state
  const [mode, setMode] = useState<GameMode>('choose');
  const [difficulty, setDifficulty] = useState<OppositeDifficulty>('easy');
  const [selectedCategory, setSelectedCategory] = useState<OppositeCategory | 'all'>('all');

  // Game session state
  const [roundPairs, setRoundPairs] = useState<OppositePair[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [starsEarned, setStarsEarned] = useState<number>(1);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [wrongOptionIdx, setWrongOptionIdx] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // Mistake tracker for custom Review Round
  const [mistakePairIds, setMistakePairIds] = useState<string[]>([]);

  // Matching Mode State
  const [matchingLeftSelected, setMatchingLeftSelected] = useState<string | null>(null);
  const [matchingRightSelected, setMatchingRightSelected] = useState<string | null>(null);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [matchingLeftList, setMatchingLeftList] = useState<{ id: string; name: string; icon: string }[]>([]);
  const [matchingRightList, setMatchingRightList] = useState<{ id: string; name: string; icon: string }[]>([]);

  // Explorer / Flashcards search & filter
  const [explorerSearch, setExplorerSearch] = useState<string>('');
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  // Helper shuffle
  const shuffleArray = useCallback(<T,>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }, []);

  // Text-to-speech helper
  const speak = useCallback((text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && sound.isEnabled()) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = isAr ? 'ar-SA' : 'en-US';
        utterance.rate = 0.88;
        window.speechSynthesis.speak(utterance);
      } catch {
        // Fallback or unsupported
      }
    }
  }, [isAr]);

  // Filter pairs by category & difficulty
  const eligiblePairs = useMemo(() => {
    return OPPOSITES_DATA.filter((pair) => {
      const matchCat = selectedCategory === 'all' || pair.category === selectedCategory;
      if (!matchCat) return false;
      if (difficulty === 'easy') return pair.difficulty === 'easy';
      if (difficulty === 'medium') return pair.difficulty === 'easy' || pair.difficulty === 'medium';
      return true; // advanced includes all
    });
  }, [selectedCategory, difficulty]);

  // Start / Reset Round
  const startNewRound = useCallback((targetMode?: GameMode, isReviewMistakes = false) => {
    const activeMode = targetMode || mode;
    setMode(activeMode);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOptionIdx(null);
    setWrongOptionIdx(null);
    setFeedback('');
    setShowExplanation(false);
    setIsGameOver(false);
    setIsProcessing(false);
    setMatchingLeftSelected(null);
    setMatchingRightSelected(null);
    setMatchedPairIds([]);

    let pool: OppositePair[] = [];
    if (isReviewMistakes && mistakePairIds.length > 0) {
      pool = OPPOSITES_DATA.filter((p) => mistakePairIds.includes(p.id));
    } else {
      pool = eligiblePairs.length > 0 ? eligiblePairs : OPPOSITES_DATA;
    }

    const count = activeMode === 'match'
      ? (difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8)
      : (difficulty === 'easy' ? 6 : difficulty === 'medium' ? 8 : 10);

    const selected = shuffleArray(pool).slice(0, Math.min(count, pool.length));
    setRoundPairs(selected);

    // Setup matching mode lists
    if (activeMode === 'match') {
      const leftItems = selected.map((p) => ({
        id: p.id,
        name: isAr ? p.itemA.nameAr : p.itemA.nameEn,
        icon: p.itemA.icon,
      }));
      const rightItems = selected.map((p) => ({
        id: p.id,
        name: isAr ? p.itemB.nameAr : p.itemB.nameEn,
        icon: p.itemB.icon,
      }));
      setMatchingLeftList(shuffleArray(leftItems));
      setMatchingRightList(shuffleArray(rightItems));
    }
  }, [mode, eligiblePairs, difficulty, isAr, mistakePairIds, shuffleArray]);

  // Initialize on mount or difficulty/category change
  useEffect(() => {
    startNewRound();
  }, [difficulty, selectedCategory]);

  const currentPair = roundPairs[currentIndex] || roundPairs[0] || OPPOSITES_DATA[0];

  // Generate question options for choose / complete / word modes
  const currentOptions = useMemo(() => {
    if (!currentPair) return [];

    const correctAnswer = {
      pairId: currentPair.id,
      name: isAr ? currentPair.itemB.nameAr : currentPair.itemB.nameEn,
      icon: currentPair.itemB.icon,
      isCorrect: true,
    };

    // Grab distractors from other pairs in the dataset
    const otherPairs = OPPOSITES_DATA.filter((p) => p.id !== currentPair.id);
    const shuffledOthers = shuffleArray(otherPairs);

    const numOptions = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;
    const distractors = shuffledOthers.slice(0, numOptions - 1).map((p) => {
      // Pick randomly either side of the distractor
      const pickA = Math.random() > 0.5;
      const distractorItem = pickA ? p.itemA : p.itemB;
      return {
        pairId: p.id,
        name: isAr ? distractorItem.nameAr : distractorItem.nameEn,
        icon: distractorItem.icon,
        isCorrect: false,
      };
    });

    return shuffleArray([correctAnswer, ...distractors]);
  }, [currentPair, difficulty, isAr, shuffleArray]);

  // Handle Option Selection for Quiz-Style Modes
  const handleSelectOption = (idx: number, isCorrect: boolean) => {
    if (isProcessing || selectedOptionIdx !== null) return;

    if (isCorrect) {
      sound.playMatch();
      setSelectedOptionIdx(idx);
      setIsProcessing(true);
      setShowExplanation(true);
      const points = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20;
      const newScore = score + points;
      setScore(newScore);
      setFeedback(
        isAr
          ? `🎉 رائع جداً! عكس (${currentPair.itemA.nameAr}) هو (${currentPair.itemB.nameAr})`
          : `🎉 Excellent! The opposite of (${currentPair.itemA.nameEn}) is (${currentPair.itemB.nameEn})`
      );

      // Remove from mistakes if corrected
      if (mistakePairIds.includes(currentPair.id)) {
        setMistakePairIds((prev) => prev.filter((id) => id !== currentPair.id));
      }

      setTimeout(() => {
        if (currentIndex + 1 < roundPairs.length) {
          setCurrentIndex((prev) => prev + 1);
          setSelectedOptionIdx(null);
          setWrongOptionIdx(null);
          setFeedback('');
          setShowExplanation(false);
          setIsProcessing(false);
        } else {
          finishRound(newScore);
        }
      }, 1400);
    } else {
      sound.playWrong();
      setWrongOptionIdx(idx);
      setFeedback(
        isAr
          ? `💡 فكر مجدداً يا بطل في عكس (${currentPair.itemA.nameAr})!`
          : `💡 Think again! What is the opposite of (${currentPair.itemA.nameEn})?`
      );

      // Track as mistake for future review
      if (!mistakePairIds.includes(currentPair.id)) {
        setMistakePairIds((prev) => [...prev, currentPair.id]);
      }

      setTimeout(() => {
        setWrongOptionIdx(null);
      }, 650);
    }
  };

  // Handle Matching Mode Pair Selection
  const handleMatchSelect = (side: 'left' | 'right', id: string) => {
    if (isProcessing || matchedPairIds.includes(id)) return;
    sound.playClick();

    if (side === 'left') {
      const nextLeft = matchingLeftSelected === id ? null : id;
      setMatchingLeftSelected(nextLeft);

      if (nextLeft && matchingRightSelected) {
        checkMatchingPair(nextLeft, matchingRightSelected);
      }
    } else {
      const nextRight = matchingRightSelected === id ? null : id;
      setMatchingRightSelected(nextRight);

      if (matchingLeftSelected && nextRight) {
        checkMatchingPair(matchingLeftSelected, nextRight);
      }
    }
  };

  const checkMatchingPair = (leftId: string, rightId: string) => {
    setIsProcessing(true);

    if (leftId === rightId) {
      // Correct Match!
      sound.playMatch();
      const updatedMatched = [...matchedPairIds, leftId];
      setMatchedPairIds(updatedMatched);
      setMatchingLeftSelected(null);
      setMatchingRightSelected(null);
      const points = 15;
      const newScore = score + points;
      setScore(newScore);

      const matchedPair = OPPOSITES_DATA.find((p) => p.id === leftId);
      if (matchedPair) {
        setFeedback(
          isAr
            ? `✨ أحسنت! (${matchedPair.itemA.nameAr} ${matchedPair.itemA.icon}) ضد (${matchedPair.itemB.nameAr} ${matchedPair.itemB.icon})`
            : `✨ Great match! (${matchedPair.itemA.nameEn}) opposes (${matchedPair.itemB.nameEn})`
        );
      }

      setTimeout(() => {
        setFeedback('');
        setIsProcessing(false);
        if (updatedMatched.length === roundPairs.length) {
          finishRound(newScore);
        }
      }, 700);
    } else {
      // Wrong Match
      sound.playWrong();
      setFeedback(isAr ? '❌ هاتان البطاقتان ليستا متضادتين، حاول مرة أخرى!' : '❌ Not opposites! Try another card!');
      setTimeout(() => {
        setMatchingLeftSelected(null);
        setMatchingRightSelected(null);
        setFeedback('');
        setIsProcessing(false);
      }, 800);
    }
  };

  const finishRound = (finalScore: number) => {
    sound.playWin();
    const calculatedStars = finalScore >= 80 ? 3 : finalScore >= 45 ? 2 : 1;
    setStarsEarned(calculatedStars);
    setIsGameOver(true);
    setIsProcessing(false);
    saveGameProgress('opposites', finalScore, true);
  };

  return (
    <div className="flex flex-col items-center w-full px-2 sm:px-4 py-3 min-h-[85vh]">
      <GameHeader
        title={isAr ? 'المعكوسات والمفاهيم المتضادة' : 'Opposites & Antonyms'}
        icon="⬆️⬇️"
        score={score}
        onRestart={() => startNewRound()}
        onGoHome={onGoHome}
        accentGradient="from-emerald-500 via-teal-500 to-green-600"
        badgeText={
          mode === 'review'
            ? isAr ? 'استكشاف ومراجعة' : 'Explorer & Review'
            : mode === 'match'
            ? isAr ? `مطابقة ${matchedPairIds.length} من ${roundPairs.length}` : `Matched ${matchedPairIds.length}/${roundPairs.length}`
            : isAr ? `سؤال ${currentIndex + 1} من ${roundPairs.length}` : `Item ${currentIndex + 1}/${roundPairs.length}`
        }
      />

      {/* Mode Selector Navigation Tabs */}
      <div className="w-full max-w-4xl mb-4 bg-white/90 dark:bg-[#0b1329]/90 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-1 overflow-x-auto select-none">
        <button
          onClick={() => startNewRound('choose')}
          className={`flex-1 min-w-[100px] sm:min-w-0 py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mode === 'choose'
              ? 'bg-emerald-500 text-white shadow-sm'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{isAr ? 'اختيار الضد' : 'Choose Opposite'}</span>
        </button>

        <button
          onClick={() => startNewRound('match')}
          className={`flex-1 min-w-[100px] sm:min-w-0 py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mode === 'match'
              ? 'bg-emerald-500 text-white shadow-sm'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{isAr ? 'مطابقة الأزواج' : 'Pair Matching'}</span>
        </button>

        <button
          onClick={() => startNewRound('complete')}
          className={`flex-1 min-w-[100px] sm:min-w-0 py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mode === 'complete'
              ? 'bg-emerald-500 text-white shadow-sm'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{isAr ? 'إكمال السياق' : 'Complete Context'}</span>
        </button>

        <button
          onClick={() => startNewRound('word')}
          className={`flex-1 min-w-[100px] sm:min-w-0 py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mode === 'word'
              ? 'bg-emerald-500 text-white shadow-sm'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>{isAr ? 'تحدي الكلمات' : 'Word Challenge'}</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setMode('review');
          }}
          className={`flex-1 min-w-[100px] sm:min-w-0 py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mode === 'review'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>{isAr ? 'المراجعة والاستكشاف' : 'Review & Explore'}</span>
        </button>
      </div>

      {/* Difficulty and Category Filter Bar (Visible in playable modes) */}
      {mode !== 'review' && (
        <div className="w-full max-w-4xl mb-4 flex flex-wrap items-center justify-between gap-2.5 bg-white/70 dark:bg-[#0b1329]/70 backdrop-blur-xs p-3 rounded-2xl border border-slate-200 dark:border-slate-800/80">
          {/* Difficulty Chips */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ms-1">
              {isAr ? 'المستوى:' : 'Level:'}
            </span>
            {(['easy', 'medium', 'advanced'] as OppositeDifficulty[]).map((diff) => (
              <button
                key={diff}
                onClick={() => {
                  sound.playClick();
                  setDifficulty(diff);
                }}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  difficulty === diff
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {diff === 'easy'
                  ? isAr ? 'سهل (بصري)' : 'Easy'
                  : diff === 'medium'
                  ? isAr ? 'متوسط' : 'Medium'
                  : isAr ? 'متقدم (تحدي)' : 'Advanced'}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <select
              value={selectedCategory}
              onChange={(e) => {
                sound.playClick();
                setSelectedCategory(e.target.value as OppositeCategory | 'all');
              }}
              className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 focus:outline-emerald-500 cursor-pointer"
            >
              <option value="all">{isAr ? '🌟 جميع التصنيفات (125 زوجاً)' : '🌟 All Categories (125 Pairs)'}</option>
              {OPPOSITE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {isAr ? cat.nameAr : cat.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 1: CHOOSE THE OPPOSITE */}
      {/* ======================================================== */}
      {mode === 'choose' && currentPair && (
        <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-4 sm:p-6 shadow-xl border border-emerald-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 max-w-2xl w-full flex flex-col items-center animate-pop-in">
          {/* Target Concept Card */}
          <div className="w-full bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 dark:from-slate-900 dark:via-emerald-950/40 dark:to-slate-900 rounded-3xl p-6 mb-5 text-center border-2 border-emerald-200 dark:border-slate-700 relative overflow-hidden">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-2">
              {isAr ? 'ما هو عكس هذا المفهوم؟' : 'What is the opposite of this concept?'}
            </span>

            <div className="text-6xl sm:text-7xl my-2 filter drop-shadow transform hover:scale-105 transition-transform">
              {currentPair.itemA.icon}
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl font-black text-slate-900 dark:text-white my-1">
              {isAr ? currentPair.itemA.nameAr : currentPair.itemA.nameEn}
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-semibold mt-2 max-w-md mx-auto">
              {isAr ? currentPair.contextSentenceAr : currentPair.contextSentenceEn}
            </p>

            {/* Read aloud button */}
            <button
              onClick={() => speak(isAr ? currentPair.itemA.nameAr : currentPair.itemA.nameEn)}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 dark:bg-slate-800/80 rounded-full text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-slate-700 hover:bg-emerald-100 cursor-pointer shadow-xs"
              title={isAr ? 'استمع إلى النطق' : 'Listen to pronunciation'}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isAr ? 'استمع' : 'Listen'}</span>
            </button>
          </div>

          {/* Options Grid */}
          <div
            className={`grid gap-3.5 w-full mb-4 ${
              currentOptions.length === 2
                ? 'grid-cols-1 sm:grid-cols-2'
                : currentOptions.length === 3
                ? 'grid-cols-1 sm:grid-cols-3'
                : 'grid-cols-2 sm:grid-cols-4'
            }`}
          >
            {currentOptions.map((opt, idx) => {
              const isSelected = selectedOptionIdx === idx;
              const isWrong = wrongOptionIdx === idx;
              let btnStyle =
                'bg-slate-50 hover:bg-emerald-50 border-slate-200 text-slate-800 hover:border-emerald-400 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100';

              if (selectedOptionIdx !== null && opt.isCorrect) {
                btnStyle = 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200 shadow-lg scale-102';
              } else if (isWrong) {
                btnStyle = 'bg-rose-500 text-white border-rose-600 ring-4 ring-rose-200 animate-shake';
              } else if (isSelected) {
                btnStyle = 'bg-emerald-600 text-white border-emerald-700';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx, opt.isCorrect)}
                  disabled={isProcessing || selectedOptionIdx !== null}
                  className={`p-4 sm:p-5 rounded-3xl border-2 flex flex-col items-center justify-center gap-2 transition-all transform duration-150 cursor-pointer select-none ${
                    selectedOptionIdx === null && !isProcessing ? 'hover:scale-105 active:scale-95 shadow-sm hover:shadow-md' : ''
                  } ${btnStyle}`}
                >
                  <span className="text-4xl sm:text-5xl filter drop-shadow">{opt.icon}</span>
                  <span className="font-heading text-lg sm:text-xl font-bold tracking-tight">{opt.name}</span>
                </button>
              );
            })}
          </div>

          {/* Educational Explanation Box */}
          {showExplanation && (
            <div className="w-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-3 text-center animate-pop-in mb-2">
              <p className="text-xs sm:text-sm font-bold text-emerald-900 dark:text-emerald-200">
                {isAr ? currentPair.explanationAr : currentPair.explanationEn}
              </p>
            </div>
          )}

          {/* Feedback message */}
          {feedback && (
            <div
              className={`w-full text-center p-3 rounded-2xl font-bold text-xs sm:text-sm animate-pop-in ${
                selectedOptionIdx !== null
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700'
                  : 'bg-amber-100 dark:bg-amber-950/80 text-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
              }`}
            >
              {feedback}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 2: PAIR MATCHING */}
      {/* ======================================================== */}
      {mode === 'match' && (
        <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-4 sm:p-6 shadow-xl border border-emerald-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 max-w-4xl w-full flex flex-col items-center animate-pop-in">
          <div className="text-center mb-5">
            <h2 className="font-heading text-xl sm:text-2xl font-black text-slate-800 dark:text-white">
              {isAr ? 'اضغط على بطاقتين متضادتين للمطابقة' : 'Tap two opposite cards to match them!'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {isAr
                ? `طابق كل صفة أو كائن بما يضاده تماماً (${matchedPairIds.length} من ${roundPairs.length})`
                : `Connect each item with its opposite (${matchedPairIds.length}/${roundPairs.length})`}
            </p>
          </div>

          {/* Two-Column Tactile Matching Board */}
          <div className="grid grid-cols-2 gap-3 sm:gap-6 w-full max-w-3xl mb-4">
            {/* Left Column (Items A) */}
            <div className="flex flex-col gap-2.5 sm:gap-3">
              <span className="text-center text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
                {isAr ? 'المجموعة الأولى' : 'Group A'}
              </span>
              {matchingLeftList.map((item) => {
                const isMatched = matchedPairIds.includes(item.id);
                const isSelected = matchingLeftSelected === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleMatchSelect('left', item.id)}
                    disabled={isMatched || isProcessing}
                    className={`p-3 sm:p-4 rounded-2xl border-2 flex items-center justify-between gap-2.5 transition-all cursor-pointer select-none ${
                      isMatched
                        ? 'bg-emerald-100 dark:bg-emerald-950/40 border-emerald-400 text-emerald-800 dark:text-emerald-300 opacity-60 cursor-default'
                        : isSelected
                        ? 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200 dark:ring-emerald-800 shadow-md scale-102'
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:scale-102'
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-2xl sm:text-3xl filter drop-shadow">{item.icon}</span>
                      <span className="font-heading text-sm sm:text-base font-black">{item.name}</span>
                    </div>
                    {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Right Column (Items B) */}
            <div className="flex flex-col gap-2.5 sm:gap-3">
              <span className="text-center text-xs font-black text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-1">
                {isAr ? 'المجموعة المتضادة' : 'Opposite Group'}
              </span>
              {matchingRightList.map((item) => {
                const isMatched = matchedPairIds.includes(item.id);
                const isSelected = matchingRightSelected === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleMatchSelect('right', item.id)}
                    disabled={isMatched || isProcessing}
                    className={`p-3 sm:p-4 rounded-2xl border-2 flex items-center justify-between gap-2.5 transition-all cursor-pointer select-none ${
                      isMatched
                        ? 'bg-emerald-100 dark:bg-emerald-950/40 border-emerald-400 text-emerald-800 dark:text-emerald-300 opacity-60 cursor-default'
                        : isSelected
                        ? 'bg-teal-500 text-white border-teal-600 ring-4 ring-teal-200 dark:ring-teal-800 shadow-md scale-102'
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-600 hover:scale-102'
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-2xl sm:text-3xl filter drop-shadow">{item.icon}</span>
                      <span className="font-heading text-sm sm:text-base font-black">{item.name}</span>
                    </div>
                    {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className="w-full max-w-md text-center p-2.5 rounded-2xl font-bold text-xs sm:text-sm animate-pop-in bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
              {feedback}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 3: COMPLETE THE CONTEXT */}
      {/* ======================================================== */}
      {mode === 'complete' && currentPair && (
        <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-4 sm:p-6 shadow-xl border border-emerald-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 max-w-2xl w-full flex flex-col items-center animate-pop-in">
          {/* Context Sentence Card */}
          <div className="w-full bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-900 dark:to-amber-950/40 rounded-3xl p-6 mb-5 border-2 border-amber-200 dark:border-amber-900/60 text-center">
            <span className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider block mb-2">
              {isAr ? 'أكمل الزوج الناقص' : 'Complete the Missing Opposite'}
            </span>

            {/* Visual representation of both sides */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 my-3">
              <div className="flex flex-col items-center bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-xs border border-amber-200 dark:border-slate-700">
                <span className="text-4xl sm:text-5xl">{currentPair.itemA.icon}</span>
                <span className="font-heading text-sm sm:text-base font-bold mt-1">
                  {isAr ? currentPair.itemA.nameAr : currentPair.itemA.nameEn}
                </span>
              </div>

              <div className="text-2xl sm:text-3xl font-black text-amber-500 animate-pulse">
                ⇄
              </div>

              <div className="flex flex-col items-center bg-white/70 dark:bg-slate-800/70 p-3 rounded-2xl border-2 border-dashed border-amber-400 dark:border-amber-600 min-w-[80px] sm:min-w-[90px] min-h-[85px] justify-center">
                {selectedOptionIdx !== null ? (
                  <>
                    <span className="text-4xl sm:text-5xl animate-pop-in">{currentPair.itemB.icon}</span>
                    <span className="font-heading text-sm sm:text-base font-bold mt-1 text-emerald-600">
                      {isAr ? currentPair.itemB.nameAr : currentPair.itemB.nameEn}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl text-amber-500 font-black animate-pulse">❓</span>
                )}
              </div>
            </div>

            <p className="text-base sm:text-lg font-black text-slate-800 dark:text-white mt-3 leading-relaxed">
              {isAr ? currentPair.contextSentenceAr : currentPair.contextSentenceEn}
            </p>
          </div>

          {/* Options */}
          <div
            className={`grid gap-3.5 w-full mb-4 ${
              currentOptions.length === 2
                ? 'grid-cols-1 sm:grid-cols-2'
                : currentOptions.length === 3
                ? 'grid-cols-1 sm:grid-cols-3'
                : 'grid-cols-2 sm:grid-cols-4'
            }`}
          >
            {currentOptions.map((opt, idx) => {
              const isSelected = selectedOptionIdx === idx;
              const isWrong = wrongOptionIdx === idx;
              let btnStyle =
                'bg-slate-50 hover:bg-amber-50 border-slate-200 text-slate-800 hover:border-amber-400 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100';

              if (selectedOptionIdx !== null && opt.isCorrect) {
                btnStyle = 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200 shadow-md';
              } else if (isWrong) {
                btnStyle = 'bg-rose-500 text-white border-rose-600 ring-4 ring-rose-200 animate-shake';
              } else if (isSelected) {
                btnStyle = 'bg-emerald-600 text-white border-emerald-700';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx, opt.isCorrect)}
                  disabled={isProcessing || selectedOptionIdx !== null}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all transform duration-150 cursor-pointer select-none ${
                    selectedOptionIdx === null && !isProcessing ? 'hover:scale-105 active:scale-95' : ''
                  } ${btnStyle}`}
                >
                  <span className="text-4xl filter drop-shadow">{opt.icon}</span>
                  <span className="font-heading text-base font-bold">{opt.name}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {feedback && (
            <div className="w-full text-center p-3 rounded-2xl font-bold text-xs sm:text-sm animate-pop-in bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
              {feedback}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 4: WORD OPPOSITES CHALLENGE (LITERACY FOCUS) */}
      {/* ======================================================== */}
      {mode === 'word' && currentPair && (
        <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-4 sm:p-6 shadow-xl border border-indigo-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 max-w-2xl w-full flex flex-col items-center animate-pop-in">
          {/* Word prompt banner */}
          <div className="w-full bg-gradient-to-r from-indigo-50 to-sky-50 dark:from-slate-900 dark:to-indigo-950/40 rounded-3xl p-6 sm:p-8 mb-5 text-center border-2 border-indigo-200 dark:border-indigo-900/60">
            <span className="text-xs font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-wider block mb-2">
              {isAr ? 'تحدي الكلمات والقراءة' : 'Reading & Word Antonym'}
            </span>

            <div className="my-2">
              <span className="text-4xl filter drop-shadow inline-block mb-1">{currentPair.itemA.icon}</span>
              <h2 className="font-heading text-3xl sm:text-5xl font-black text-indigo-950 dark:text-indigo-100 tracking-wide">
                « {isAr ? currentPair.itemA.nameAr : currentPair.itemA.nameEn} »
              </h2>
            </div>

            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold mt-2">
              {isAr ? 'اختر الكلمة المقابلة في المعنى:' : 'Select the matching antonym word:'}
            </p>
          </div>

          {/* Word Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full mb-4">
            {currentOptions.map((opt, idx) => {
              const isSelected = selectedOptionIdx === idx;
              const isWrong = wrongOptionIdx === idx;
              let btnStyle =
                'bg-slate-50 hover:bg-indigo-50 border-slate-200 text-slate-800 hover:border-indigo-400 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100';

              if (selectedOptionIdx !== null && opt.isCorrect) {
                btnStyle = 'bg-indigo-600 text-white border-indigo-700 ring-4 ring-indigo-200 shadow-md';
              } else if (isWrong) {
                btnStyle = 'bg-rose-500 text-white border-rose-600 ring-4 ring-rose-200 animate-shake';
              } else if (isSelected) {
                btnStyle = 'bg-indigo-700 text-white border-indigo-800';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx, opt.isCorrect)}
                  disabled={isProcessing || selectedOptionIdx !== null}
                  className={`p-4 rounded-2xl border-2 flex items-center justify-between px-5 transition-all transform duration-150 cursor-pointer select-none ${
                    selectedOptionIdx === null && !isProcessing ? 'hover:scale-102 active:scale-95' : ''
                  } ${btnStyle}`}
                >
                  <span className="font-heading text-xl font-bold">{opt.name}</span>
                  <span className="text-3xl filter drop-shadow">{opt.icon}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {feedback && (
            <div className="w-full text-center p-3 rounded-2xl font-bold text-xs sm:text-sm animate-pop-in bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-950 dark:text-indigo-200">
              {feedback}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 5: EXPLORER & REVIEW FLASHCARDS (100+ PAIRS BROWSER) */}
      {/* ======================================================== */}
      {mode === 'review' && (
        <div className="w-full max-w-5xl flex flex-col items-center animate-pop-in">
          {/* Header & Stats Banner */}
          <div className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-3xl p-5 sm:p-6 mb-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl">📚</span>
                <h2 className="font-heading text-2xl sm:text-3xl font-black">
                  {isAr ? 'موسوعة واستكشاف المعكوسات' : 'Opposites Encyclopedia'}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-amber-100 mt-1">
                {isAr
                  ? 'استعرض أكثر من 120 زوجاً متضاداً مصنفاً بالصور والشرح التربوي والنطق الصوتي'
                  : 'Browse 120+ educational opposite pairs across 12 classifications with audio & explanations'}
              </p>
            </div>

            {/* Quick Practice Mistakes Button */}
            {mistakePairIds.length > 0 && (
              <button
                onClick={() => startNewRound('choose', true)}
                className="bg-white text-amber-950 hover:bg-amber-100 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm shadow-md flex items-center gap-2 shrink-0 cursor-pointer transform hover:scale-105 active:scale-95 transition-all"
              >
                <RotateCcw className="w-4 h-4 text-rose-500" />
                <span>{isAr ? `تدريب على الأخطاء (${mistakePairIds.length})` : `Practice Mistakes (${mistakePairIds.length})`}</span>
              </button>
            )}
          </div>

          {/* Search & Filter Toolbar */}
          <div className="w-full bg-white dark:bg-[#0b1329] p-4 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 mb-5 flex flex-wrap items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute top-3 start-3" />
              <input
                type="text"
                value={explorerSearch}
                onChange={(e) => setExplorerSearch(e.target.value)}
                placeholder={isAr ? 'ابحث عن أي مفهوم (مثل: كبير، بارد، سعيد)...' : 'Search concept...'}
                className="w-full ps-9 pe-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-emerald-500"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {isAr ? 'الكل (125)' : 'All (125)'}
              </button>
              {OPPOSITE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1 ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{isAr ? cat.nameAr : cat.nameEn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {OPPOSITES_DATA.filter((pair) => {
              const matchCat = selectedCategory === 'all' || pair.category === selectedCategory;
              if (!matchCat) return false;
              if (!explorerSearch.trim()) return true;
              const q = explorerSearch.toLowerCase();
              return (
                pair.itemA.nameAr.includes(q) ||
                pair.itemB.nameAr.includes(q) ||
                pair.itemA.nameEn.toLowerCase().includes(q) ||
                pair.itemB.nameEn.toLowerCase().includes(q) ||
                pair.explanationAr.includes(q)
              );
            }).map((pair) => {
              const isExpanded = activeCardId === pair.id;

              return (
                <div
                  key={pair.id}
                  className="bg-white dark:bg-[#0b1329] rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {/* Pair Visual Display */}
                  <div className="flex items-center justify-around gap-2 mb-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl">
                    {/* Item A */}
                    <div className="flex flex-col items-center text-center">
                      <span className="text-4xl filter drop-shadow mb-1">{pair.itemA.icon}</span>
                      <span className="font-heading font-black text-sm text-slate-800 dark:text-slate-100">
                        {isAr ? pair.itemA.nameAr : pair.itemA.nameEn}
                      </span>
                    </div>

                    <span className="text-xl font-black text-emerald-500">⇄</span>

                    {/* Item B */}
                    <div className="flex flex-col items-center text-center">
                      <span className="text-4xl filter drop-shadow mb-1">{pair.itemB.icon}</span>
                      <span className="font-heading font-black text-sm text-slate-800 dark:text-slate-100">
                        {isAr ? pair.itemB.nameAr : pair.itemB.nameEn}
                      </span>
                    </div>
                  </div>

                  {/* Context Sentence */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mb-2 leading-relaxed text-center">
                    {isAr ? pair.contextSentenceAr : pair.contextSentenceEn}
                  </p>

                  {/* Explanation Toggle */}
                  {isExpanded && (
                    <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl p-2.5 my-2 text-xs text-emerald-900 dark:text-emerald-200 animate-pop-in">
                      {isAr ? pair.explanationAr : pair.explanationEn}
                    </div>
                  )}

                  {/* Actions (Speak & Explain) */}
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-2.5 mt-1">
                    <button
                      onClick={() =>
                        speak(
                          isAr
                            ? `${pair.itemA.nameAr} عكسها ${pair.itemB.nameAr}`
                            : `${pair.itemA.nameEn} opposes ${pair.itemB.nameEn}`
                        )
                      }
                      className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isAr ? 'استمع' : 'Pronounce'}</span>
                    </button>

                    <button
                      onClick={() => setActiveCardId(isExpanded ? null : pair.id)}
                      className="text-xs text-slate-500 dark:text-slate-400 font-bold hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {isExpanded ? (isAr ? 'إخفاء الشرح' : 'Hide') : (isAr ? 'عرض الشرح' : 'Explain')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Win Celebration Modal */}
      {isGameOver && (
        <WinCelebration
          score={score}
          message={
            isAr
              ? '🎉 أحسنت صنعاً يا بطل! لقد أتقنت جولة المعكوسات والمفاهيم المتضادة ببراعة!'
              : '🎉 Splendid job! You mastered this round of opposites and antonyms!'
          }
          onRestart={() => startNewRound()}
          onGoHome={onGoHome}
          stars={starsEarned}
        />
      )}
    </div>
  );
};

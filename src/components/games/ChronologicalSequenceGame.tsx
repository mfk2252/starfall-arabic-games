import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { sound } from '../../utils/audio';
import { SEQUENCE_STORIES, SequenceStory, SequenceStep } from '../../data/sequenceData';
import {
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Trophy,
  Star,
  ChevronLeft,
  ChevronRight,
  Volume2,
} from 'lucide-react';

interface ChronologicalSequenceGameProps {
  onGoHome: () => void;
}

export const ChronologicalSequenceGame: React.FC<ChronologicalSequenceGameProps> = ({ onGoHome }) => {
  const { language } = useLanguage();
  const ArrowIcon = language === 'ar' ? ArrowRight : ArrowLeft;

  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'advanced' | 'all'>('easy');
  const [filteredStories, setFilteredStories] = useState<SequenceStory[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentStory, setCurrentStory] = useState<SequenceStory | null>(null);

  // Available cards bank (shuffled) and slotted cards placed by child
  const [availableCards, setAvailableCards] = useState<SequenceStep[]>([]);
  const [placedSlots, setPlacedSlots] = useState<(SequenceStep | null)[]>([]);

  // Selected card for tap-to-place mobile interaction
  const [selectedBankIndex, setSelectedBankIndex] = useState<number | null>(null);

  // Status flags
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);

  // Initialize stories by difficulty
  useEffect(() => {
    let stories = SEQUENCE_STORIES;
    if (selectedDifficulty !== 'all') {
      stories = SEQUENCE_STORIES.filter((s) => s.difficulty === selectedDifficulty);
    }
    // Shuffle stories order
    const shuffled = [...stories].sort(() => Math.random() - 0.5);
    setFilteredStories(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
  }, [selectedDifficulty]);

  // Load current story
  useEffect(() => {
    if (filteredStories.length === 0) return;
    const story = filteredStories[currentIndex % filteredStories.length];
    setCurrentStory(story);

    // Prepare slots equal to step count
    setPlacedSlots(new Array(story.steps.length).fill(null));

    // Shuffle step cards so they don't start in correct chronological order
    let shuffledSteps = [...story.steps].sort(() => Math.random() - 0.5);
    // Ensure it's not accidentally in exact 1..N order
    if (shuffledSteps.every((step, idx) => step.id === idx + 1) && shuffledSteps.length > 1) {
      shuffledSteps = [shuffledSteps[1], shuffledSteps[0], ...shuffledSteps.slice(2)];
    }
    setAvailableCards(shuffledSteps);

    setSelectedBankIndex(null);
    setIsChecked(false);
    setIsCorrect(null);
    setShowHint(false);
    setShowExplanation(false);
    setAttempts(0);
  }, [currentIndex, filteredStories]);

  if (!currentStory) {
    return null;
  }

  // Handle clicking a card in the available bank
  const handleSelectBankCard = (cardIndex: number) => {
    if (isChecked) return;
    sound.playClick();

    // Find first empty slot
    const emptySlotIndex = placedSlots.findIndex((s) => s === null);
    if (emptySlotIndex !== -1) {
      const cardToPlace = availableCards[cardIndex];
      const newSlots = [...placedSlots];
      newSlots[emptySlotIndex] = cardToPlace;
      setPlacedSlots(newSlots);

      const newBank = availableCards.filter((_, idx) => idx !== cardIndex);
      setAvailableCards(newBank);
      setSelectedBankIndex(null);
    } else {
      // Toggle select for manual swap
      setSelectedBankIndex(selectedBankIndex === cardIndex ? null : cardIndex);
    }
  };

  // Handle clicking a slot (either to place selected card or remove placed card)
  const handleSlotClick = (slotIndex: number) => {
    if (isChecked) return;
    sound.playClick();

    const existingInSlot = placedSlots[slotIndex];

    if (existingInSlot) {
      // Return card from slot back to available bank
      const newSlots = [...placedSlots];
      newSlots[slotIndex] = null;
      setPlacedSlots(newSlots);

      setAvailableCards([...availableCards, existingInSlot]);
      setSelectedBankIndex(null);
    } else if (selectedBankIndex !== null && availableCards[selectedBankIndex]) {
      // Place selected card into this empty slot
      const cardToPlace = availableCards[selectedBankIndex];
      const newSlots = [...placedSlots];
      newSlots[slotIndex] = cardToPlace;
      setPlacedSlots(newSlots);

      const newBank = availableCards.filter((_, idx) => idx !== selectedBankIndex);
      setAvailableCards(newBank);
      setSelectedBankIndex(null);
    }
  };

  // Check sequence answer
  const handleCheckAnswer = () => {
    if (placedSlots.some((s) => s === null)) return;

    sound.playClick();
    setIsChecked(true);

    const userCorrect = placedSlots.every((step, idx) => step !== null && step.id === idx + 1);

    if (userCorrect) {
      setIsCorrect(true);
      sound.playMatch();
      setScore((prev) => prev + (attempts === 0 ? 10 : 5));
      setStreak((prev) => prev + 1);
      setShowExplanation(true);
    } else {
      setIsCorrect(false);
      sound.playWrong();
      setStreak(0);
      setAttempts((prev) => prev + 1);
    }
  };

  // Reset current story attempt
  const handleResetAttempt = () => {
    sound.playClick();
    setPlacedSlots(new Array(currentStory.steps.length).fill(null));

    let shuffledSteps = [...currentStory.steps].sort(() => Math.random() - 0.5);
    setAvailableCards(shuffledSteps);

    setSelectedBankIndex(null);
    setIsChecked(false);
    setIsCorrect(null);
    setShowExplanation(false);
  };

  // Next story
  const handleNextStory = () => {
    sound.playClick();
    setCurrentIndex((prev) => prev + 1);
  };

  const isAllSlotsFilled = placedSlots.every((s) => s !== null);

  const slotOrdinalLabelsAr = ['أولاً', 'ثانياً', 'ثالثاً', 'رابعاً'];
  const slotOrdinalLabelsEn = ['1st', '2nd', '3rd', '4th'];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-4 py-2 sm:py-4 px-2 sm:px-4">
      {/* Top Header Controls Bar */}
      <div className="w-full flex items-center justify-between bg-white/90 dark:bg-[#180816]/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-sm border border-pink-100 dark:border-pink-900/60">
        <button
          onClick={() => {
            sound.playClick();
            onGoHome();
          }}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-pink-200 hover:text-pink-600 dark:hover:text-pink-300 bg-pink-50 dark:bg-pink-950/60 hover:bg-pink-100 px-3 py-2 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowIcon className="w-4 h-4" />
          <span>{language === 'ar' ? 'الرئيسية' : 'Back'}</span>
        </button>

        {/* Level Filter Tabs */}
        <div className="flex items-center gap-1 bg-pink-50 dark:bg-[#200b1e] p-1 rounded-xl border border-pink-100 dark:border-pink-900/50">
          {(['easy', 'medium', 'advanced', 'all'] as const).map((lvl) => {
            const labels = {
              easy: language === 'ar' ? 'سهل' : 'Easy',
              medium: language === 'ar' ? 'متوسط' : 'Med',
              advanced: language === 'ar' ? 'متقدم' : 'Adv',
              all: language === 'ar' ? 'الكل' : 'All',
            };
            const active = selectedDifficulty === lvl;
            return (
              <button
                key={lvl}
                onClick={() => {
                  sound.playClick();
                  setSelectedDifficulty(lvl);
                }}
                className={`text-xs sm:text-sm font-black px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all cursor-pointer ${
                  active
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-pink-200/80 hover:bg-pink-100 dark:hover:bg-pink-900/40'
                }`}
              >
                {labels[lvl]}
              </button>
            );
          })}
        </div>

        {/* Score Badge */}
        <div className="flex items-center gap-2 bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 text-xs sm:text-sm font-black px-3 py-1.5 rounded-xl border border-pink-200 dark:border-pink-900/60">
          <Trophy className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>{score}</span>
        </div>
      </div>

      {/* Main Game Card Container */}
      <div className="w-full bg-white dark:bg-[#200b1e] border-2 border-pink-100 dark:border-pink-900/60 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col gap-6">
        {/* Story Title & Instruction Banner */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950/80 text-pink-700 dark:text-pink-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>
              {language === 'ar' ? `القصة ${currentIndex + 1} من ${filteredStories.length}` : `Story ${currentIndex + 1} of ${filteredStories.length}`}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-pink-900 dark:text-pink-100">
            {language === 'ar' ? currentStory.title : currentStory.titleEn}
          </h2>

          <p className="text-sm sm:text-base font-bold text-slate-600 dark:text-pink-200/90 max-w-xl mx-auto">
            {language === 'ar'
              ? 'رتّب الصور لتكتشف ماذا حدث أولاً، ثم ماذا حدث بعد ذلك!'
              : 'Arrange the pictures to learn what happened first, then next!'}
          </p>
        </div>

        {/* Slotted Containers (Placement Area) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-black text-slate-500 dark:text-pink-300/80 px-2">
            <span>{language === 'ar' ? 'ترتيب الأحداث:' : 'Event Timeline:'}</span>
            <button
              onClick={() => {
                sound.playClick();
                setShowHint(!showHint);
              }}
              className="inline-flex items-center gap-1 text-pink-600 dark:text-pink-400 hover:underline cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'تلميح' : 'Hint'}</span>
            </button>
          </div>

          {/* Hint Dropdown Box */}
          {showHint && (
            <div className="bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-3 text-xs sm:text-sm font-bold text-amber-800 dark:text-amber-200 text-center animate-fadeIn">
              💡 {language === 'ar' ? currentStory.hint : currentStory.hintEn}
            </div>
          )}

          {/* Timeline Slots Grid */}
          <div className={`grid gap-3 sm:gap-4 ${currentStory.steps.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'}`}>
            {placedSlots.map((slotItem, slotIndex) => {
              const ordinalLabel = language === 'ar' ? slotOrdinalLabelsAr[slotIndex] : slotOrdinalLabelsEn[slotIndex];
              const isSlotCorrect = isChecked && slotItem?.id === slotIndex + 1;
              const isSlotWrong = isChecked && slotItem !== null && slotItem.id !== slotIndex + 1;

              return (
                <div
                  key={`slot-${slotIndex}`}
                  onClick={() => handleSlotClick(slotIndex)}
                  className={`relative flex flex-col items-center justify-between p-3 sm:p-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer min-h-[140px] sm:min-h-[170px] ${
                    slotItem
                      ? isChecked
                        ? isSlotCorrect
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
                          : 'border-rose-500 bg-rose-50 dark:bg-rose-950/40'
                        : 'border-pink-400 bg-gradient-to-b from-white to-pink-50/50 dark:from-[#2a0e28] dark:to-[#1f0a1d] shadow-md'
                      : 'border-pink-200 dark:border-pink-900/60 bg-pink-50/40 dark:bg-[#180816]/40 hover:border-pink-400'
                  }`}
                >
                  {/* Step Order Badge */}
                  <span className="text-xs font-black px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-900/60 text-pink-800 dark:text-pink-200">
                    {ordinalLabel}
                  </span>

                  {/* Slot Content */}
                  {slotItem ? (
                    <div className="flex flex-col items-center gap-2 my-auto text-center animate-scaleUp">
                      <span className="text-4xl sm:text-5xl drop-shadow-sm select-none">{slotItem.icon}</span>
                      <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-pink-100 leading-tight">
                        {language === 'ar' ? slotItem.label : slotItem.labelEn}
                      </span>
                    </div>
                  ) : (
                    <div className="my-auto flex flex-col items-center gap-1 text-slate-400 dark:text-pink-400/40">
                      <span className="text-2xl font-black">؟</span>
                      <span className="text-[11px] font-bold">{language === 'ar' ? 'ضع الصورة هنا' : 'Place card'}</span>
                    </div>
                  )}

                  {/* Correctness Icon Badge */}
                  {isChecked && slotItem && (
                    <div className="absolute top-2 left-2">
                      {isSlotCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-900" />
                      ) : (
                        <span className="text-xs font-black text-rose-500 bg-white dark:bg-rose-950 px-1.5 py-0.5 rounded-full border border-rose-300">
                          ❌
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Separator Divider */}
        <div className="w-full border-t border-pink-100 dark:border-pink-900/60 my-1" />

        {/* Cards Bank (Cards to choose from) */}
        <div className="space-y-2">
          <span className="text-xs font-black text-slate-500 dark:text-pink-300/80 px-2 block">
            {language === 'ar' ? 'انقر على الصور التالية لترتيبها:' : 'Tap cards below to order:'}
          </span>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 min-h-[110px]">
            {availableCards.length === 0 && !isChecked ? (
              <span className="text-xs font-bold text-pink-600 dark:text-pink-300 bg-pink-50 dark:bg-pink-950/60 px-4 py-2 rounded-full border border-pink-200 dark:border-pink-900/60">
                {language === 'ar' ? '✨ اكتمل وضع الصور! انقر على زر "تحقق من الإجابة"' : '✨ Cards placed! Click "Check Answer"'}
              </span>
            ) : (
              availableCards.map((card, bankIdx) => {
                const isSelected = selectedBankIndex === bankIdx;

                return (
                  <button
                    key={`bank-${card.id}-${bankIdx}`}
                    onClick={() => handleSelectBankCard(bankIdx)}
                    disabled={isChecked}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all transform active:scale-95 cursor-pointer w-28 sm:w-36 h-28 sm:h-32 shadow-sm ${
                      isSelected
                        ? 'border-pink-500 ring-4 ring-pink-300/50 bg-pink-100 dark:bg-pink-950 scale-105'
                        : 'border-pink-200 dark:border-pink-900/80 bg-white dark:bg-[#180816] hover:border-pink-400 hover:scale-102'
                    }`}
                  >
                    <span className="text-3xl sm:text-4xl mb-1 select-none">{card.icon}</span>
                    <span className="text-xs font-black text-slate-800 dark:text-pink-100 text-center leading-tight">
                      {language === 'ar' ? card.label : card.labelEn}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Feedback & Explanation Box upon Check */}
        {isChecked && isCorrect !== null && (
          <div
            className={`p-4 rounded-2xl border text-center space-y-2 animate-fadeIn ${
              isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                : 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-100'
            }`}
          >
            <div className="flex items-center justify-center gap-2 text-base sm:text-lg font-black">
              <span>{isCorrect ? '🎉 ممتاز يابطل!' : '🤔 حاول مجدداً بتركيز!'}</span>
            </div>
            <p className="text-xs sm:text-sm font-bold">
              {isCorrect
                ? language === 'ar'
                  ? currentStory.explanation
                  : currentStory.explanationEn
                : language === 'ar'
                ? 'تأكد من تسلسل الأحداث منطقياً، ثم اضغط على زر إعادة المحاولة.'
                : 'Check the logical order and try placing the cards again.'}
            </p>
          </div>
        )}

        {/* Action Buttons Bar */}
        <div className="flex items-center justify-between gap-3 pt-2">
          {/* Try Again / Reset button */}
          <button
            onClick={handleResetAttempt}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-pink-100 dark:bg-pink-950/80 text-pink-700 dark:text-pink-300 font-bold text-xs sm:text-sm hover:bg-pink-200 dark:hover:bg-pink-900/60 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{language === 'ar' ? 'إعادة الخانات' : 'Reset Slots'}</span>
          </button>

          {/* Main Action: Check Answer OR Next Story */}
          {!isChecked ? (
            <button
              onClick={handleCheckAnswer}
              disabled={!isAllSlotsFilled}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black text-sm sm:text-base shadow-md transition-all cursor-pointer ${
                isAllSlotsFilled
                  ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 text-white hover:opacity-95 hover:scale-102'
                  : 'bg-slate-200 dark:bg-pink-950/40 text-slate-400 dark:text-pink-500/40 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{language === 'ar' ? 'تحقّق من الترتيب' : 'Check Order'}</span>
            </button>
          ) : (
            <button
              onClick={handleNextStory}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black text-sm sm:text-base bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all cursor-pointer animate-pulse"
            >
              <span>{language === 'ar' ? 'القصة التالية ➔' : 'Next Story ➔'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

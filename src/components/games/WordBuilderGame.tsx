import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';
import { useLanguage } from '../../i18n/LanguageContext';
import { Sparkles, RotateCcw, ArrowRight, ArrowLeft, Lightbulb, HelpCircle, CheckCircle2 } from 'lucide-react';

interface WordItem {
  word: string; // The word in Arabic
  id: string;
  image: string; // Icon or Image path
  titleEn: string;
  category: 'animals' | 'objects' | 'nature' | 'people';
}

const WORD_DATABASE: WordItem[] = [
  // 2 letters
  { id: 'ab', word: 'أب', image: '👨', titleEn: 'Father', category: 'people' },
  { id: 'um', word: 'أم', image: '👩', titleEn: 'Mother', category: 'people' },
  { id: 'yad', word: 'يد', image: '✋', titleEn: 'Hand', category: 'people' },
  { id: 'fam', word: 'فم', image: '👄', titleEn: 'Mouth', category: 'people' },
  { id: 'dub', word: 'دب', image: '🐻', titleEn: 'Bear', category: 'animals' },
  
  // 3 letters
  { id: 'asad', word: 'أسد', image: '🦁', titleEn: 'Lion', category: 'animals' },
  { id: 'qamar', word: 'قمر', image: '🌙', titleEn: 'Moon', category: 'nature' },
  { id: 'qalam', word: 'قلم', image: '✏️', titleEn: 'Pen', category: 'objects' },
  { id: 'bab', word: 'باب', image: '🚪', titleEn: 'Door', category: 'objects' },
  { id: 'shams', word: 'شمس', image: '☀️', titleEn: 'Sun', category: 'nature' },
  { id: 'jamal', word: 'جمل', image: '🐪', titleEn: 'Camel', category: 'animals' },
  { id: 'fil', word: 'فيل', image: '🐘', titleEn: 'Elephant', category: 'animals' },
  { id: 'ein', word: 'عين', image: '👁️', titleEn: 'Eye', category: 'people' },
  
  // 4 letters
  { id: 'warda', word: 'وردة', image: '🌹', titleEn: 'Flower', category: 'nature' },
  { id: 'samaka', word: 'سمكة', image: '🐟', titleEn: 'Fish', category: 'animals' },
  { id: 'kitab', word: 'كتاب', image: '📖', titleEn: 'Book', category: 'objects' },
  { id: 'hisan', word: 'حصان', image: '🐎', titleEn: 'Horse', category: 'animals' },
  { id: 'nujoom', word: 'نجوم', image: '⭐', titleEn: 'Stars', category: 'nature' },
  { id: 'hilal', word: 'هلال', image: '🌙', titleEn: 'Crescent', category: 'nature' },
  { id: 'arnab', word: 'أرنب', image: '🐰', titleEn: 'Rabbit', category: 'animals' },
  
  // 5 letters
  { id: 'farasha', word: 'فراشة', image: '🦋', titleEn: 'Butterfly', category: 'animals' },
  { id: 'madrasa', word: 'مدرسة', image: '🏫', titleEn: 'School', category: 'objects' },
  { id: 'hadiqa', word: 'حديقة', image: '🌳', titleEn: 'Garden', category: 'nature' },
  { id: 'tufaha', word: 'تفاحة', image: '🍎', titleEn: 'Apple', category: 'objects' },
  { id: 'miftah', word: 'مفتاح', image: '🔑', titleEn: 'Key', category: 'objects' },
  { id: 'sayara', word: 'سيارة', image: '🚗', titleEn: 'Car', category: 'objects' },
  { id: 'daraja', word: 'دراجة', image: '🚲', titleEn: 'Bicycle', category: 'objects' },
  
  // 6+ letters
  { id: 'asfura', word: 'عصفورة', image: '🐦', titleEn: 'Small Bird', category: 'animals' },
  { id: 'burtuqal', word: 'برتقال', image: '🍊', titleEn: 'Orange', category: 'objects' },
  { id: 'akhtabut', word: 'أخطبوط', image: '🐙', titleEn: 'Octopus', category: 'animals' },
  { id: 'zuhufa', word: 'سلحفاة', image: '🐢', titleEn: 'Turtle', category: 'animals' },
  { id: 'timsah', word: 'تمساح', image: '🐊', titleEn: 'Crocodile', category: 'animals' },
];

export const WordBuilderGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  const [gameState, setGameState] = useState<'menu' | 'play' | 'win'>('menu');
  const [selectedLetterCount, setSelectedLetterCount] = useState<number | 'all'>(3);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [activeWords, setActiveWords] = useState<WordItem[]>([]);
  const [userLetters, setUserLetters] = useState<(string | null)[]>([]); // Letters placed in slots
  const [availableLetters, setAvailableLetters] = useState<{char: string, id: number, isUsed: boolean}[]>([]); // Scrambled letters
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [wrongAttempt, setWrongAttempt] = useState(false);

  // Shuffle array utility
  const shuffle = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const startLevel = (count: number | 'all') => {
    sound.playClick();
    setSelectedLetterCount(count);
    
    let filtered = count === 'all' 
      ? WORD_DATABASE 
      : WORD_DATABASE.filter(w => w.word.length === count || (count === 6 && w.word.length >= 6));
    
    if (filtered.length === 0) filtered = WORD_DATABASE; // Fallback

    const shuffledWords = shuffle(filtered).slice(0, 5); // 5 words per round
    setActiveWords(shuffledWords);
    setCurrentWordIndex(0);
    setScore(0);
    initWord(shuffledWords[0]);
    setGameState('play');
  };

  const initWord = (wordItem: WordItem) => {
    const letters = wordItem.word.split('');
    setUserLetters(new Array(letters.length).fill(null));
    
    // Scramble letters with unique IDs to handle duplicates correctly
    const scrambled = shuffle(letters.map((char, index) => ({
      char,
      id: index,
      isUsed: false
    })));
    
    setAvailableLetters(scrambled);
    setShowHint(false);
    setWrongAttempt(false);
  };

  const handleLetterClick = (letterObj: {char: string, id: number, isUsed: boolean}) => {
    if (letterObj.isUsed || wrongAttempt) return;
    
    sound.playClick();
    
    // Find first empty slot
    const emptySlotIdx = userLetters.indexOf(null);
    if (emptySlotIdx === -1) return;

    const newUserLetters = [...userLetters];
    newUserLetters[emptySlotIdx] = letterObj.char;
    setUserLetters(newUserLetters);

    const newAvailable = availableLetters.map(l => 
      l.id === letterObj.id ? { ...l, isUsed: true } : l
    );
    setAvailableLetters(newAvailable);

    // Check if word is complete
    if (newUserLetters.every(l => l !== null)) {
      const builtWord = newUserLetters.join('');
      if (builtWord === activeWords[currentWordIndex].word) {
        // Success!
        sound.playMatch();
        setScore(s => s + 20);
        
        setTimeout(() => {
          if (currentWordIndex + 1 < activeWords.length) {
            const nextIdx = currentWordIndex + 1;
            setCurrentWordIndex(nextIdx);
            initWord(activeWords[nextIdx]);
          } else {
            sound.playWin();
            setGameState('win');
            saveGameProgress('word-builder', score + 20, true);
          }
        }, 1500);
      } else {
        // Fail
        setWrongAttempt(true);
        sound.playClick(); // Or a fail sound if available
        setTimeout(() => {
          // Reset word but keep available letters
          setUserLetters(new Array(activeWords[currentWordIndex].word.length).fill(null));
          setAvailableLetters(availableLetters.map(l => ({ ...l, isUsed: false })));
          setWrongAttempt(false);
        }, 1000);
      }
    }
  };

  const handleSlotClick = (idx: number) => {
    // If a letter is clicked in a slot, we could return it to available.
    // But simplicity is often better for kids.
    // Let's allow clearing if it's the last filled one or just reset?
    // For now, let's just let them finish or auto-reset on error.
  };

  // Menu Screen
  if (gameState === 'menu') {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center space-y-8 py-4 px-2">
        <div className="w-full flex items-center justify-between">
          <button
            onClick={() => { sound.playClick(); onGoHome(); }}
            className="flex items-center gap-2 bg-white dark:bg-[#0b1329] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-100 px-4 py-2.5 rounded-full font-bold shadow-sm border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
          >
            <BackIcon className="w-5 h-5 text-emerald-500" />
            <span>{isAr ? 'الرجوع للقائمة' : 'Back to Games'}</span>
          </button>
          <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-full font-black text-sm shadow-sm">
            <span>📝</span>
            <span>{isAr ? 'تكوين الكلمات' : 'Word Builder'}</span>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white">
            {isAr ? 'اختر مستوى الكلمات' : 'Select Word Level'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            {isAr ? 'رتب الحروف لتكوين الكلمات الصحيحة' : 'Arrange letters to form correct words'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-3xl">
          {[
            { id: 2, titleAr: 'كلمات من حرفين', titleEn: '2-Letter Words', descAr: 'مثل: أب، أم، يد', icon: '👶', gradient: 'from-blue-400 to-indigo-500' },
            { id: 3, titleAr: 'كلمات من 3 حروف', titleEn: '3-Letter Words', descAr: 'مثل: أسد، قمر، باب', icon: '🦁', gradient: 'from-emerald-400 to-teal-500' },
            { id: 4, titleAr: 'كلمات من 4 حروف', titleEn: '4-Letter Words', descAr: 'مثل: وردة، كتاب، شمس', icon: '🌹', gradient: 'from-amber-400 to-orange-500' },
            { id: 5, titleAr: 'كلمات من 5 حروف', titleEn: '5-Letter Words', descAr: 'مثل: فراشة، حديقة', icon: '🦋', gradient: 'from-pink-400 to-rose-500' },
            { id: 6, titleAr: 'كلمات طويلة (6+)', titleEn: 'Long Words (6+)', descAr: 'تحدي الكلمات الطويلة', icon: '🏫', gradient: 'from-purple-500 to-violet-600' },
            { id: 'all', titleAr: 'تحدي جميع الكلمات', titleEn: 'All Words Challenge', descAr: 'مزيج من كل المستويات', icon: '🌟', gradient: 'from-cyan-500 to-sky-600' },
          ].map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => startLevel(lvl.id as any)}
              className={`p-6 rounded-3xl bg-gradient-to-r ${lvl.gradient} text-white shadow-md hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 flex flex-col items-center text-center gap-3 cursor-pointer`}
            >
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner">
                {lvl.icon}
              </div>
              <div>
                <h3 className="text-lg font-black">{isAr ? lvl.titleAr : lvl.titleEn}</h3>
                <p className="text-xs text-white/90 font-medium mt-1">{lvl.descAr}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Win Screen
  if (gameState === 'win') {
    return (
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center py-10 px-4 text-center space-y-6">
        <WinCelebration
          score={score}
          onRestart={() => startLevel(selectedLetterCount)}
          onGoHome={() => setGameState('menu')}
        />
        <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800 w-full space-y-6">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-400 to-teal-600 flex items-center justify-center text-6xl shadow-md animate-bounce">
            🌟
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">
              {isAr ? 'أنت بطل الكلمات!' : 'You are a Word Hero!'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              {isAr ? `لقد كونت جميع الكلمات وحصلت على ${score} نقطة!` : `You built all words and earned ${score} points!`}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => startLevel(selectedLetterCount)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-md transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isAr ? 'لعب جولة أخرى' : 'Play Again'}</span>
            </button>
            <button
              onClick={() => setGameState('menu')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-2xl font-black text-sm transition-all cursor-pointer"
            >
              <BackIcon className="w-4 h-4" />
              <span>{isAr ? 'تغيير المستوى' : 'Change Level'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Gameplay Screen
  const currentWord = activeWords[currentWordIndex];
  const progressPercent = Math.round((currentWordIndex / activeWords.length) * 100);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center py-4 space-y-6 px-2" dir="rtl">
      {/* Top Bar */}
      <div className="w-full flex items-center justify-between gap-3 flex-wrap" dir={isAr ? 'rtl' : 'ltr'}>
        <button
          onClick={() => { sound.playClick(); setGameState('menu'); }}
          className="flex items-center gap-2 bg-white dark:bg-[#0b1329] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-100 px-4 py-2.5 rounded-full font-bold shadow-sm border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
        >
          <BackIcon className="w-5 h-5 text-emerald-500" />
          <span>{isAr ? 'المستويات' : 'Levels'}</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full font-black text-sm border border-emerald-200">
            <span>⭐</span>
            <span>{score}</span>
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-full font-black text-sm shadow-sm">
            <span>{currentWordIndex + 1} / {activeWords.length}</span>
          </div>
        </div>
      </div>

      {/* Word Progress Area */}
      <div className="w-full bg-white dark:bg-[#0b1329] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col items-center space-y-8">
        
        {/* The Image */}
        <div className="relative group">
          <div className="w-40 h-40 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-emerald-100 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/20 flex items-center justify-center text-7xl sm:text-8xl shadow-inner border-4 border-white dark:border-slate-800 transition-transform group-hover:scale-110">
            {currentWord.image}
          </div>
          <button 
            onClick={() => setShowHint(!showHint)}
            className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-amber-400 text-white flex items-center justify-center shadow-md hover:bg-amber-500 transition-colors"
          >
            <Lightbulb className="w-5 h-5" />
          </button>
        </div>

        {/* The Slots */}
        <div className="flex flex-row-reverse items-center justify-center gap-3 sm:gap-4 flex-wrap">
          {userLetters.map((letter, idx) => (
            <div
              key={idx}
              className={`w-14 h-14 sm:w-20 sm:h-20 rounded-2xl border-4 flex items-center justify-center text-3xl sm:text-4xl font-black transition-all ${
                letter 
                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-md' 
                  : wrongAttempt 
                    ? 'bg-rose-50 border-rose-300 dark:bg-rose-900/20 animate-shake'
                    : 'bg-slate-50 dark:bg-slate-800 border-dashed border-slate-300 dark:border-slate-700'
              }`}
            >
              {letter}
            </div>
          ))}
        </div>

        {/* Hint Text */}
        {showHint && (
          <div className="text-center animate-fade-in">
            <p className="text-emerald-600 dark:text-emerald-400 font-black text-xl mb-1">
              {currentWord.word}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {currentWord.titleEn}
            </p>
          </div>
        )}

        {/* Available Letters */}
        <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
            {isAr ? 'رتب الحروف هنا' : 'Arrange Letters Here'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
            {availableLetters.map((l) => (
              <button
                key={l.id}
                disabled={l.isUsed || wrongAttempt}
                onClick={() => handleLetterClick(l)}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl font-black text-2xl sm:text-3xl border-2 transition-all transform active:scale-90 shadow-sm cursor-pointer flex items-center justify-center ${
                  l.isUsed
                    ? 'opacity-0 scale-50 pointer-events-none'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-400 hover:text-emerald-500'
                }`}
              >
                {l.char}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Simple Instruction */}
      <div className="text-center p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-medium flex items-center justify-center gap-2">
        <HelpCircle className="w-4 h-4" />
        <span>{isAr ? 'انقر على الحروف بالترتيب الصحيح لتكوين الكلمة' : 'Click the letters in the correct order to build the word'}</span>
      </div>
    </div>
  );
};

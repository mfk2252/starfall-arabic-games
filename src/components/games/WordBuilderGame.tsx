import React, { useState, useEffect, useCallback } from 'react';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';
import { useLanguage } from '../../i18n/LanguageContext';
import { RotateCcw, ArrowRight, ArrowLeft, Lightbulb, HelpCircle, Globe, CheckCircle2 } from 'lucide-react';

export interface WordItem {
  id: string;
  word: string;
  image: string;
  translation: string;
  lang: 'ar' | 'en';
  category?: 'animals' | 'objects' | 'nature' | 'people' | 'countries';
}

export const ARABIC_WORD_DATABASE: WordItem[] = [
  // 2 letters
  { id: 'ar_ab', word: 'أب', image: '👨', translation: 'Father', lang: 'ar', category: 'people' },
  { id: 'ar_um', word: 'أم', image: '👩', translation: 'Mother', lang: 'ar', category: 'people' },
  { id: 'ar_yad', word: 'يد', image: '✋', translation: 'Hand', lang: 'ar', category: 'people' },
  { id: 'ar_fam', word: 'فم', image: '👄', translation: 'Mouth', lang: 'ar', category: 'people' },
  { id: 'ar_dub', word: 'دب', image: '🐻', translation: 'Bear', lang: 'ar', category: 'animals' },
  { id: 'ar_akh', word: 'أخ', image: '👦', translation: 'Brother', lang: 'ar', category: 'people' },
  { id: 'ar_bat', word: 'بط', image: '🦆', translation: 'Duck', lang: 'ar', category: 'animals' },
  { id: 'ar_qit', word: 'قط', image: '🐱', translation: 'Cat', lang: 'ar', category: 'animals' },
  { id: 'ar_zir', word: 'زر', image: '🔘', translation: 'Button', lang: 'ar', category: 'objects' },

  // 3 letters
  { id: 'ar_misr', word: 'مصر', image: '🇪🇬', translation: 'Egypt', lang: 'ar', category: 'countries' },
  { id: 'ar_alam', word: 'علم', image: '🏁', translation: 'Flag', lang: 'ar', category: 'objects' },
  { id: 'ar_asad', word: 'أسد', image: '🦁', translation: 'Lion', lang: 'ar', category: 'animals' },
  { id: 'ar_qamar', word: 'قمر', image: '🌙', translation: 'Moon', lang: 'ar', category: 'nature' },
  { id: 'ar_qalam', word: 'قلم', image: '✏️', translation: 'Pen', lang: 'ar', category: 'objects' },
  { id: 'ar_bab', word: 'باب', image: '🚪', translation: 'Door', lang: 'ar', category: 'objects' },
  { id: 'ar_shams', word: 'شمس', image: '☀️', translation: 'Sun', lang: 'ar', category: 'nature' },
  { id: 'ar_jamal', word: 'جمل', image: '🐪', translation: 'Camel', lang: 'ar', category: 'animals' },
  { id: 'ar_fil', word: 'فيل', image: '🐘', translation: 'Elephant', lang: 'ar', category: 'animals' },
  { id: 'ar_ein', word: 'عين', image: '👁️', translation: 'Eye', lang: 'ar', category: 'people' },
  { id: 'ar_tamar', word: 'تمر', image: '🌴', translation: 'Dates', lang: 'ar', category: 'objects' },
  { id: 'ar_nahr', word: 'نهر', image: '🌊', translation: 'River', lang: 'ar', category: 'nature' },
  { id: 'ar_inab', word: 'عنب', image: '🍇', translation: 'Grapes', lang: 'ar', category: 'objects' },

  // 4 letters
  { id: 'ar_ahram', word: 'أهرام', image: '🔺', translation: 'Pyramids', lang: 'ar', category: 'countries' },
  { id: 'ar_warda', word: 'وردة', image: '🌹', translation: 'Flower', lang: 'ar', category: 'nature' },
  { id: 'ar_samaka', word: 'سمكة', image: '🐟', translation: 'Fish', lang: 'ar', category: 'animals' },
  { id: 'ar_kitab', word: 'كتاب', image: '📖', translation: 'Book', lang: 'ar', category: 'objects' },
  { id: 'ar_hisan', word: 'حصان', image: '🐎', translation: 'Horse', lang: 'ar', category: 'animals' },
  { id: 'ar_nujoom', word: 'نجوم', image: '⭐', translation: 'Stars', lang: 'ar', category: 'nature' },
  { id: 'ar_hilal', word: 'هلال', image: '🌙', translation: 'Crescent', lang: 'ar', category: 'nature' },
  { id: 'ar_arnab', word: 'أرنب', image: '🐰', translation: 'Rabbit', lang: 'ar', category: 'animals' },
  { id: 'ar_zarafa', word: 'زرافة', image: '🦒', translation: 'Giraffe', lang: 'ar', category: 'animals' },
  { id: 'ar_taira', word: 'طائرة', image: '✈️', translation: 'Airplane', lang: 'ar', category: 'objects' },
  { id: 'ar_saa', word: 'ساعة', image: '⏰', translation: 'Clock', lang: 'ar', category: 'objects' },

  // 5 letters
  { id: 'ar_farasha', word: 'فراشة', image: '🦋', translation: 'Butterfly', lang: 'ar', category: 'animals' },
  { id: 'ar_madrasa', word: 'مدرسة', image: '🏫', translation: 'School', lang: 'ar', category: 'objects' },
  { id: 'ar_hadiqa', word: 'حديقة', image: '🌳', translation: 'Garden', lang: 'ar', category: 'nature' },
  { id: 'ar_tufaha', word: 'تفاحة', image: '🍎', translation: 'Apple', lang: 'ar', category: 'objects' },
  { id: 'ar_miftah', word: 'مفتاح', image: '🔑', translation: 'Key', lang: 'ar', category: 'objects' },
  { id: 'ar_sayara', word: 'سيارة', image: '🚗', translation: 'Car', lang: 'ar', category: 'objects' },
  { id: 'ar_daraja', word: 'دراجة', image: '🚲', translation: 'Bicycle', lang: 'ar', category: 'objects' },
  { id: 'ar_tawila', word: 'طاولة', image: '🪑', translation: 'Table', lang: 'ar', category: 'objects' },

  // 6+ letters
  { id: 'ar_asfura', word: 'عصفورة', image: '🐦', translation: 'Small Bird', lang: 'ar', category: 'animals' },
  { id: 'ar_burtuqal', word: 'برتقال', image: '🍊', translation: 'Orange', lang: 'ar', category: 'objects' },
  { id: 'ar_akhtabut', word: 'أخطبوط', image: '🐙', translation: 'Octopus', lang: 'ar', category: 'animals' },
  { id: 'ar_zuhufa', word: 'سلحفاة', image: '🐢', translation: 'Turtle', lang: 'ar', category: 'animals' },
  { id: 'ar_timsah', word: 'تمساح', image: '🐊', translation: 'Crocodile', lang: 'ar', category: 'animals' },
  { id: 'ar_computer', word: 'كمبيوتر', image: '💻', translation: 'Computer', lang: 'ar', category: 'objects' },
  { id: 'ar_flamingo', word: 'فلامينجو', image: '🦩', translation: 'Flamingo', lang: 'ar', category: 'animals' },
];

export const ENGLISH_WORD_DATABASE: WordItem[] = [
  // 2 letters
  { id: 'en_on', word: 'ON', image: '🔛', translation: 'تشغيل / على', lang: 'en', category: 'objects' },
  { id: 'en_go', word: 'GO', image: '🚦', translation: 'انطلق', lang: 'en', category: 'objects' },
  { id: 'en_up', word: 'UP', image: '⬆️', translation: 'أعلى', lang: 'en', category: 'objects' },
  { id: 'en_at', word: 'AT', image: '📍', translation: 'عند / في', lang: 'en', category: 'objects' },
  { id: 'en_no', word: 'NO', image: '🚫', translation: 'لا', lang: 'en', category: 'objects' },
  { id: 'en_my', word: 'MY', image: '🙋‍♂️', translation: 'لي / خاصتي', lang: 'en', category: 'people' },
  { id: 'en_in', word: 'IN', image: '📥', translation: 'داخل / في', lang: 'en', category: 'objects' },
  { id: 'en_it', word: 'IT', image: '👈', translation: 'هو / هي', lang: 'en', category: 'objects' },
  { id: 'en_do', word: 'DO', image: '✅', translation: 'افعل', lang: 'en', category: 'objects' },
  { id: 'en_he', word: 'HE', image: '👦', translation: 'هو', lang: 'en', category: 'people' },

  // 3 letters
  { id: 'en_cat', word: 'CAT', image: '🐱', translation: 'قطة', lang: 'en', category: 'animals' },
  { id: 'en_dog', word: 'DOG', image: '🐶', translation: 'كلب', lang: 'en', category: 'animals' },
  { id: 'en_sun', word: 'SUN', image: '☀️', translation: 'شمس', lang: 'en', category: 'nature' },
  { id: 'en_pen', word: 'PEN', image: '✏️', translation: 'قلم', lang: 'en', category: 'objects' },
  { id: 'en_boy', word: 'BOY', image: '👦', translation: 'ولد', lang: 'en', category: 'people' },
  { id: 'en_box', word: 'BOX', image: '📦', translation: 'صندوق', lang: 'en', category: 'objects' },
  { id: 'en_bed', word: 'BED', image: '🛏️', translation: 'سرير', lang: 'en', category: 'objects' },
  { id: 'en_cup', word: 'CUP', image: '☕', translation: 'كوب', lang: 'en', category: 'objects' },
  { id: 'en_hat', word: 'HAT', image: '🎩', translation: 'قبعة', lang: 'en', category: 'objects' },
  { id: 'en_map', word: 'MAP', image: '🗺️', translation: 'خريطة', lang: 'en', category: 'objects' },
  { id: 'en_bus', word: 'BUS', image: '🚌', translation: 'حافلة', lang: 'en', category: 'objects' },
  { id: 'en_car', word: 'CAR', image: '🚗', translation: 'سيارة', lang: 'en', category: 'objects' },
  { id: 'en_owl', word: 'OWL', image: '🦉', translation: 'بومة', lang: 'en', category: 'animals' },
  { id: 'en_ant', word: 'ANT', image: '🐜', translation: 'نملة', lang: 'en', category: 'animals' },

  // 4 letters
  { id: 'en_book', word: 'BOOK', image: '📖', translation: 'كتاب', lang: 'en', category: 'objects' },
  { id: 'en_fish', word: 'FISH', image: '🐟', translation: 'سمكة', lang: 'en', category: 'animals' },
  { id: 'en_lion', word: 'LION', image: '🦁', translation: 'أسد', lang: 'en', category: 'animals' },
  { id: 'en_star', word: 'STAR', image: '⭐', translation: 'نجمة', lang: 'en', category: 'nature' },
  { id: 'en_bear', word: 'BEAR', image: '🐻', translation: 'دب', lang: 'en', category: 'animals' },
  { id: 'en_duck', word: 'DUCK', image: '🦆', translation: 'بطة', lang: 'en', category: 'animals' },
  { id: 'en_frog', word: 'FROG', image: '🐸', translation: 'ضفدع', lang: 'en', category: 'animals' },
  { id: 'en_moon', word: 'MOON', image: '🌙', translation: 'قمر', lang: 'en', category: 'nature' },
  { id: 'en_bird', word: 'BIRD', image: '🐦', translation: 'طائر', lang: 'en', category: 'animals' },
  { id: 'en_door', word: 'DOOR', image: '🚪', translation: 'باب', lang: 'en', category: 'objects' },
  { id: 'en_tree', word: 'TREE', image: '🌳', translation: 'شجرة', lang: 'en', category: 'nature' },
  { id: 'en_ship', word: 'SHIP', image: '🚢', translation: 'سفينة', lang: 'en', category: 'objects' },
  { id: 'en_milk', word: 'MILK', image: '🥛', translation: 'حليب', lang: 'en', category: 'objects' },

  // 5 letters
  { id: 'en_apple', word: 'APPLE', image: '🍎', translation: 'تفاحة', lang: 'en', category: 'objects' },
  { id: 'en_house', word: 'HOUSE', image: '🏠', translation: 'منزل', lang: 'en', category: 'objects' },
  { id: 'en_train', word: 'TRAIN', image: '🚂', translation: 'قطار', lang: 'en', category: 'objects' },
  { id: 'en_panda', word: 'PANDA', image: '🐼', translation: 'باندا', lang: 'en', category: 'animals' },
  { id: 'en_clock', word: 'CLOCK', image: '⏰', translation: 'ساعة', lang: 'en', category: 'objects' },
  { id: 'en_horse', word: 'HORSE', image: '🐎', translation: 'حصان', lang: 'en', category: 'animals' },
  { id: 'en_tiger', word: 'TIGER', image: '🐯', translation: 'نمر', lang: 'en', category: 'animals' },
  { id: 'en_mouse', word: 'MOUSE', image: '🐭', translation: 'فأر', lang: 'en', category: 'animals' },
  { id: 'en_water', word: 'WATER', image: '💧', translation: 'ماء', lang: 'en', category: 'nature' },
  { id: 'en_plant', word: 'PLANT', image: '🪴', translation: 'نبات', lang: 'en', category: 'nature' },
  { id: 'en_plane', word: 'PLANE', image: '✈️', translation: 'طائرة', lang: 'en', category: 'objects' },

  // 6+ letters
  { id: 'en_monkey', word: 'MONKEY', image: '🐒', translation: 'قرد', lang: 'en', category: 'animals' },
  { id: 'en_rabbit', word: 'RABBIT', image: '🐰', translation: 'أرنب', lang: 'en', category: 'animals' },
  { id: 'en_flower', word: 'FLOWER', image: '🌹', translation: 'وردة', lang: 'en', category: 'nature' },
  { id: 'en_banana', word: 'BANANA', image: '🍌', translation: 'موزة', lang: 'en', category: 'objects' },
  { id: 'en_spider', word: 'SPIDER', image: '🕷️', translation: 'عنكبوت', lang: 'en', category: 'animals' },
  { id: 'en_turtle', word: 'TURTLE', image: '🐢', translation: 'سلحفاة', lang: 'en', category: 'animals' },
  { id: 'en_orange', word: 'ORANGE', image: '🍊', translation: 'برتقالة', lang: 'en', category: 'objects' },
  { id: 'en_rocket', word: 'ROCKET', image: '🚀', translation: 'صاروخ', lang: 'en', category: 'objects' },
  { id: 'en_dolphin', word: 'DOLPHIN', image: '🐬', translation: 'دلفين', lang: 'en', category: 'animals' },
  { id: 'en_penguin', word: 'PENGUIN', image: '🐧', translation: 'بطريق', lang: 'en', category: 'animals' },
];

export const WordBuilderGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  const [selectedLang, setSelectedLang] = useState<'ar' | 'en'>('ar');
  const [gameState, setGameState] = useState<'menu' | 'play' | 'win'>('menu');
  const [selectedLetterCount, setSelectedLetterCount] = useState<number | 'all'>(3);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [activeWords, setActiveWords] = useState<WordItem[]>([]);
  const [userLetters, setUserLetters] = useState<(string | null)[]>([]);
  const [availableLetters, setAvailableLetters] = useState<{ char: string; id: number; isUsed: boolean }[]>([]);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [wrongAttempt, setWrongAttempt] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Shuffle array utility
  const shuffle = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const currentDatabase = selectedLang === 'ar' ? ARABIC_WORD_DATABASE : ENGLISH_WORD_DATABASE;

  const startLevel = (count: number | 'all') => {
    sound.playClick();
    setSelectedLetterCount(count);

    let filtered =
      count === 'all'
        ? currentDatabase
        : currentDatabase.filter((w) => w.word.length === count || (count === 6 && w.word.length >= 6));

    if (filtered.length === 0) filtered = currentDatabase;

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

    const scrambled = shuffle(
      letters.map((char, index) => ({
        char,
        id: index,
        isUsed: false,
      }))
    );

    setAvailableLetters(scrambled);
    setShowHint(false);
    setWrongAttempt(false);
    setIsCorrect(false);
  };

  const handleLetterClick = (letterObj: { char: string; id: number; isUsed: boolean }) => {
    if (letterObj.isUsed || wrongAttempt) return;

    sound.playClick();

    const emptySlotIdx = userLetters.indexOf(null);
    if (emptySlotIdx === -1) return;

    const newUserLetters = [...userLetters];
    newUserLetters[emptySlotIdx] = letterObj.char;
    setUserLetters(newUserLetters);

    const newAvailable = availableLetters.map((l) => (l.id === letterObj.id ? { ...l, isUsed: true } : l));
    setAvailableLetters(newAvailable);

    if (newUserLetters.every((l) => l !== null)) {
      const builtWord = newUserLetters.join('');
      if (builtWord === activeWords[currentWordIndex].word) {
        sound.playMatch();
        setIsCorrect(true);
        setScore((s) => s + 20);

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
        setWrongAttempt(true);
        sound.playWrong();
        setTimeout(() => {
          setUserLetters(new Array(activeWords[currentWordIndex].word.length).fill(null));
          setAvailableLetters(availableLetters.map((l) => ({ ...l, isUsed: false })));
          setWrongAttempt(false);
        }, 1000);
      }
    }
  };

  // Menu Screen
  if (gameState === 'menu') {
    const arLevels = [
      { id: 2, titleAr: 'كلمات من حرفين', titleEn: '2-Letter Words', descAr: 'مثل: أب، أم، يد، دب، بط', icon: '👶', gradient: 'from-blue-500 to-indigo-600' },
      { id: 3, titleAr: 'كلمات من 3 حروف', titleEn: '3-Letter Words', descAr: 'مثل: مصر 🇪🇬، أسد، قمر، قلم', icon: '🦁', gradient: 'from-emerald-500 to-teal-600' },
      { id: 4, titleAr: 'كلمات من 4 حروف', titleEn: '4-Letter Words', descAr: 'مثل: أهرام 🔺، وردة، كتاب، حصان', icon: '🌹', gradient: 'from-amber-500 to-orange-600' },
      { id: 5, titleAr: 'كلمات من 5 حروف', titleEn: '5-Letter Words', descAr: 'مثل: فراشة، مدرسة، حديقة، سيارة', icon: '🦋', gradient: 'from-pink-500 to-rose-600' },
      { id: 6, titleAr: 'كلمات طويلة (6+)', titleEn: 'Long Words (6+)', descAr: 'مثل: عصفورة، برتقال، أخطبوط', icon: '🏫', gradient: 'from-purple-500 to-violet-600' },
      { id: 'all', titleAr: 'تحدي جميع الكلمات', titleEn: 'All Words Challenge', descAr: 'مزيج شامـل من كل المستويات', icon: '🌟', gradient: 'from-cyan-500 to-sky-600' },
    ];

    const enLevels = [
      { id: 2, titleAr: '2-Letter Words', titleEn: '2-Letter Words', descAr: 'e.g. GO, ON, UP, NO, MY', icon: '👶', gradient: 'from-blue-500 to-indigo-600' },
      { id: 3, titleAr: '3-Letter Words', titleEn: '3-Letter Words', descAr: 'e.g. CAT, DOG, SUN, PEN', icon: '🐱', gradient: 'from-emerald-500 to-teal-600' },
      { id: 4, titleAr: '4-Letter Words', titleEn: '4-Letter Words', descAr: 'e.g. BOOK, FISH, LION, STAR', icon: '📖', gradient: 'from-amber-500 to-orange-600' },
      { id: 5, titleAr: '5-Letter Words', titleEn: '5-Letter Words', descAr: 'e.g. APPLE, HOUSE, TRAIN, PANDA', icon: '🍎', gradient: 'from-pink-500 to-rose-600' },
      { id: 6, titleAr: 'Long Words (6+)', titleEn: 'Long Words (6+)', descAr: 'e.g. MONKEY, RABBIT, FLOWER', icon: '🐒', gradient: 'from-purple-500 to-violet-600' },
      { id: 'all', titleAr: 'All English Words', titleEn: 'All English Words', descAr: 'Full English Word Mix', icon: '🌟', gradient: 'from-cyan-500 to-sky-600' },
    ];

    const levelsToDisplay = selectedLang === 'ar' ? arLevels : enLevels;

    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center space-y-8 py-4 px-2" dir={isAr ? 'rtl' : 'ltr'}>
        {/* Navigation Bar */}
        <div className="w-full flex items-center justify-between">
          <button
            onClick={() => {
              sound.playClick();
              onGoHome();
            }}
            className="flex items-center gap-2 bg-white dark:bg-[#20091b] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-100 px-4 py-2.5 rounded-full font-bold shadow-sm border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
          >
            <BackIcon className="w-5 h-5 text-emerald-500" />
            <span>{isAr ? 'الرجوع للقائمة' : 'Back to Games'}</span>
          </button>
          <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-full font-black text-sm shadow-sm">
            <span>📝</span>
            <span>{isAr ? 'تكوين الكلمات' : 'Word Builder'}</span>
          </div>
        </div>

        {/* Game Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white">
            {isAr ? 'اختر لغة ومستوى الكلمات' : 'Select Language & Word Level'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            {isAr ? 'رتب الحروف لتكوين الكلمات العربية والإنجليزي' : 'Arrange letters to build correct Arabic & English words'}
          </p>
        </div>

        {/* Language Selection Bar (Saudi Arabia Flag / Egypt Flag & UK Flag) */}
        <div className="flex items-center justify-center gap-3 w-full max-w-md bg-slate-100 dark:bg-slate-900/60 p-2 rounded-3xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => {
              sound.playClick();
              setSelectedLang('ar');
            }}
            className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl font-black text-sm transition-all transform cursor-pointer ${
              selectedLang === 'ar'
                ? 'bg-emerald-600 text-white shadow-md scale-102'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <span className="text-xl">🇸🇦🇪🇬</span>
            <span>{isAr ? 'الكلمات العربية' : 'Arabic Words'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setSelectedLang('en');
            }}
            className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl font-black text-sm transition-all transform cursor-pointer ${
              selectedLang === 'en'
                ? 'bg-indigo-600 text-white shadow-md scale-102'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <span className="text-xl">🇬🇧</span>
            <span>{isAr ? 'الكلمات الإنجليزية' : 'English Words'}</span>
          </button>
        </div>

        {/* Container Levels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-3xl">
          {levelsToDisplay.map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => startLevel(lvl.id as any)}
              className={`p-6 rounded-3xl bg-gradient-to-r ${lvl.gradient} text-white shadow-md hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 flex flex-col items-center text-center gap-3 cursor-pointer relative overflow-hidden`}
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
        <div className="bg-white dark:bg-[#20091b] rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800 w-full space-y-6">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-400 to-teal-600 flex items-center justify-center text-6xl shadow-md animate-bounce">
            🌟
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">
              {isAr ? 'أنت بطل الكلمات!' : 'You are a Word Hero!'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              {isAr
                ? `لقد كونت جميع الكلمات وحصلت على ${score} نقطة!`
                : `You built all words and earned ${score} points!`}
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

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center py-4 space-y-6 px-2" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Bar */}
      <div className="w-full flex items-center justify-between gap-3 flex-wrap">
        <button
          onClick={() => {
            sound.playClick();
            setGameState('menu');
          }}
          className="flex items-center gap-2 bg-white dark:bg-[#20091b] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-100 px-4 py-2.5 rounded-full font-bold shadow-sm border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
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
            <span>
              {currentWordIndex + 1} / {activeWords.length}
            </span>
          </div>
        </div>
      </div>

      {/* Word Progress Area */}
      <div className="w-full bg-white dark:bg-[#20091b] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col items-center space-y-8">
        {/* The Image & Word Display */}
        <div className="relative group flex flex-col items-center">
          <div className="w-40 h-40 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-emerald-100 via-teal-50 to-indigo-50 dark:from-emerald-900/30 dark:via-teal-900/20 dark:to-indigo-900/20 flex items-center justify-center text-7xl sm:text-8xl shadow-inner border-4 border-white dark:border-slate-800 transition-transform group-hover:scale-105 relative">
            {currentWord.image}
          </div>

          {/* Live Built Word Container */}
          <div className="mt-6 min-h-[50px] flex flex-col items-center justify-center">
            <div className="px-8 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-100 dark:border-emerald-800/50 shadow-sm flex items-center gap-2">
              <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-wider">
                {userLetters.filter((l) => l !== null).join('') || '...'}
              </span>
            </div>
            {(isCorrect || showHint) && (
              <div className="mt-2 text-sm font-bold text-slate-500 dark:text-slate-300 flex items-center gap-1.5 animate-fade-in">
                <span>{selectedLang === 'ar' ? 'الترجمة:' : 'Translation:'}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-black">{currentWord.translation}</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowHint(!showHint)}
            className="absolute top-0 end-0 w-10 h-10 rounded-full bg-amber-400 text-white flex items-center justify-center shadow-md hover:bg-amber-500 transition-colors"
            title={isAr ? 'تلميح' : 'Hint'}
          >
            <Lightbulb className="w-5 h-5" />
          </button>
        </div>

        {/* The Letter Slots */}
        <div className="flex flex-row items-center justify-center gap-2.5 sm:gap-4 flex-wrap">
          {userLetters.map((letter, idx) => (
            <div
              key={idx}
              className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl border-4 flex items-center justify-center text-2xl sm:text-3xl font-black transition-all ${
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

        {/* Available Scrambled Letters */}
        <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
            {isAr ? 'رتب الحروف هنا' : 'Arrange Letters Here'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4">
            {availableLetters.map((l) => (
              <button
                key={l.id}
                disabled={l.isUsed || wrongAttempt}
                onClick={() => handleLetterClick(l)}
                className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl font-black text-xl sm:text-2xl border-2 transition-all transform active:scale-90 shadow-sm cursor-pointer flex items-center justify-center ${
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
        <span>
          {isAr
            ? 'انقر على الحروف بالترتيب الصحيح لتكوين الكلمة'
            : 'Click the letters in the correct order to build the word'}
        </span>
      </div>
    </div>
  );
};

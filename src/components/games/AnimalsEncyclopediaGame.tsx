import React, { useState, useMemo } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';
import { ANIMALS_DATA, Animal } from '../../data/animalsData';
import { 
  Search, 
  Volume2, 
  Sparkles, 
  X, 
  Home, 
  Utensils, 
  Music, 
  Baby, 
  Lightbulb, 
  CheckCircle2, 
  Trophy, 
  HelpCircle,
  BookOpen,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { ButterflyIcon } from '../common/ButterflyIcon';

type CategoryFilter = 'all' | 'wild' | 'farm' | 'birds' | 'marine' | 'insects';

export const AnimalsEncyclopediaGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [activeTab, setActiveTab] = useState<'passport' | 'quiz'>('passport');

  // Quiz state inside animal modal
  const [quizStep, setQuizStep] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [quizMessage, setQuizMessage] = useState<string>('اختر الإجابة الصحيحة للحيوان!');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'الكل (٥٠ حيوان)', icon: '🌟' },
    { id: 'wild', label: 'الغابة والبرية', icon: '🦁' },
    { id: 'farm', label: 'المزرعة والمنزل', icon: '🐮' },
    { id: 'birds', label: 'عالم الطيور', icon: '🦅' },
    { id: 'marine', label: 'البحر والمحيط', icon: '🐬' },
    { id: 'insects', label: 'الحشرات الصغيرة', icon: '🐝' },
  ];

  // Filter animals based on category and search
  const filteredAnimals = useMemo(() => {
    return ANIMALS_DATA.filter((a) => {
      if (activeCategory !== 'all' && a.category !== activeCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchName = a.nameAr.toLowerCase().includes(q) || a.nameEn.toLowerCase().includes(q);
        const matchFood = a.foodAr.toLowerCase().includes(q);
        const matchHabitat = a.habitatAr.toLowerCase().includes(q);
        return matchName || matchFood || matchHabitat;
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  const handleSpeak = (text: string) => {
    sound.speakText(text, 'ar');
  };

  // Open animal passport modal
  const handleOpenAnimal = (animal: Animal) => {
    sound.playPop();
    sound.speakText(`حيوان ${animal.nameAr}`, 'ar');
    setSelectedAnimal(animal);
    setActiveTab('passport');
    setQuizStep(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setQuizMessage('اختر الإجابة الصحيحة للتعرف أكثر عليه!');
  };

  // Close modal
  const handleCloseModal = () => {
    sound.playClick();
    setSelectedAnimal(null);
  };

  // Generate 3 dynamic quiz questions for the selected animal
  const animalQuestions = useMemo(() => {
    if (!selectedAnimal) return [];

    // Distractors from other animals
    const otherAnimals = ANIMALS_DATA.filter((a) => a.id !== selectedAnimal.id);
    const shuffledOthers = [...otherAnimals].sort(() => Math.random() - 0.5);

    // Q1: Habitat
    const habitatQ = {
      id: 1,
      title: `أين يعيش ${selectedAnimal.nameAr}؟ 🏠`,
      correct: selectedAnimal.habitatAr,
      options: [
        selectedAnimal.habitatAr,
        shuffledOthers[0]?.habitatAr || 'البحيرات الاستوائية',
        shuffledOthers[1]?.habitatAr || 'قمم الجبال العالية',
      ].sort(() => Math.random() - 0.5),
    };

    // Q2: Food
    const foodQ = {
      id: 2,
      title: `ماذا يأكل ${selectedAnimal.nameAr} في غذائه المفضل؟ 🥗`,
      correct: selectedAnimal.foodAr,
      options: [
        selectedAnimal.foodAr,
        shuffledOthers[2]?.foodAr || 'رحيق الأزهار العذب',
        shuffledOthers[3]?.foodAr || 'الأسماك والجمبري',
      ].sort(() => Math.random() - 0.5),
    };

    // Q3: Sound Name
    const soundQ = {
      id: 3,
      title: `ما اسم صوت ${selectedAnimal.nameAr} في اللغة العربية؟ 🔊`,
      correct: selectedAnimal.soundNameAr,
      options: [
        selectedAnimal.soundNameAr,
        shuffledOthers[4]?.soundNameAr || 'زَقْزَقَة',
        shuffledOthers[5]?.soundNameAr || 'ثُغَاء',
      ].sort(() => Math.random() - 0.5),
    };

    return [habitatQ, foodQ, soundQ];
  }, [selectedAnimal]);

  const currentQ = animalQuestions[quizStep];

  const handleQuizAnswer = (option: string) => {
    if (isAnswered || !currentQ || !selectedAnimal) return;

    setSelectedOption(option);
    setIsAnswered(true);

    if (option === currentQ.correct) {
      sound.playMatch();
      sound.speakText('إجابة صحيحة! أحسنت يا بطل!', 'ar');
      const newScore = totalScore + 10;
      setTotalScore(newScore);
      setQuizScore((prev) => prev + 10);
      setQuizMessage('✅ إجابة صحيحة وممتازة!');

      setTimeout(() => {
        if (quizStep + 1 < animalQuestions.length) {
          setQuizStep((prev) => prev + 1);
          setSelectedOption(null);
          setIsAnswered(false);
          setQuizMessage('اختر الإجابة الصحيحة للحيوان!');
        } else {
          sound.playSparkle();
          saveGameProgress('animals-encyclopedia', newScore, true);
          setQuizMessage('🎉 رائع! لقد أكملت جميع أسئلة هذا الحيوان بنجاح!');
        }
      }, 1300);
    } else {
      sound.playWrong();
      setQuizMessage(`❌ حاول مجدداً! الإجابة الصحيحة هي: (${currentQ.correct})`);
      setTimeout(() => {
        setSelectedOption(null);
        setIsAnswered(false);
      }, 1200);
    }
  };

  return (
    <div className="flex flex-col items-center w-full px-2 sm:px-4 py-4 min-h-[85vh] animate-in fade-in duration-300">
      <GameHeader
        title="موسوعة ومعرض الحيوانات الـ ٥٠"
        icon="🦁🐘🐬🦅"
        score={totalScore}
        onRestart={() => setTotalScore(0)}
        onGoHome={onGoHome}
        accentGradient="from-[#059669] via-[#10b981] to-[#047857]"
        badgeText={`مستكشف المعرفة: ${ANIMALS_DATA.length} حيوان`}
      />

      {/* Main Container Card */}
      <div className="bg-white dark:bg-[#20091b] rounded-3xl p-4 sm:p-7 shadow-xl border border-emerald-100 dark:border-[#3d122f] text-slate-800 dark:text-pink-100 max-w-6xl w-full flex flex-col items-center space-y-6">
        
        {/* Search Bar & Category Tabs */}
        <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-emerald-500 absolute start-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن أي حيوان (مثال: أسد، دلفين، نحلة)..."
              className="w-full ps-10 pe-9 py-2.5 bg-emerald-50/60 dark:bg-[#1a0716] border border-emerald-200 dark:border-pink-900/40 rounded-2xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-pink-100 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Badge count */}
          <div className="flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 px-4 py-2 rounded-full font-black text-xs sm:text-sm border border-emerald-300 dark:border-emerald-800">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>الحيوانات المعروضة: {filteredAnimals.length} من ٥٠</span>
          </div>
        </div>

        {/* Category Tabs Filter */}
        <div className="flex flex-wrap justify-center items-center gap-2 bg-emerald-50/80 dark:bg-[#1a0716] p-2 rounded-2xl border border-emerald-200 dark:border-pink-900/40 w-full">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playClick();
                setActiveCategory(cat.id as CategoryFilter);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md scale-105'
                  : 'text-slate-700 dark:text-pink-200 hover:bg-emerald-100 dark:hover:bg-emerald-950/40'
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* 50 Animals Interactive Grid Showcase */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 w-full">
          {filteredAnimals.map((animal) => (
            <div
              key={animal.id}
              onClick={() => handleOpenAnimal(animal)}
              className="p-4 rounded-3xl bg-gradient-to-b from-emerald-50/60 via-white to-teal-50/40 dark:from-[#1a0716] dark:via-[#20091b] dark:to-[#160612] border-2 border-emerald-100 dark:border-pink-900/40 hover:border-emerald-400 dark:hover:border-emerald-500 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col items-center text-center relative group"
            >
              {/* Speaker sound button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playPop();
                  sound.speakText(`${animal.nameAr}. صوته ${animal.soundNameAr}`, 'ar');
                }}
                className="absolute top-2.5 end-2.5 p-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 transition-colors cursor-pointer opacity-80 group-hover:opacity-100"
                title="نطق الاسم والصوت"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>

              {/* Large Emoji Icon */}
              <div className="text-5xl sm:text-6xl my-2 filter drop-shadow group-hover:scale-110 transition-transform select-none">
                {animal.icon}
              </div>

              {/* Animal Name */}
              <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-pink-100 mb-0.5">
                {animal.nameAr}
              </h3>

              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                {animal.categoryAr}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* -------------------------------------------------------------
          RICH ANIMAL PASSPORT & QUIZ MODAL
         ------------------------------------------------------------- */}
      {selectedAnimal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#20091b] rounded-3xl border-2 border-emerald-300 dark:border-pink-900/60 shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 flex flex-col space-y-5 relative text-slate-800 dark:text-pink-100">
            
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 end-4 p-2 rounded-full bg-slate-100 dark:bg-black/40 text-slate-600 dark:text-pink-200 hover:bg-rose-100 hover:text-rose-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 border-b border-emerald-100 dark:border-pink-900/40 pb-4 pe-10">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-emerald-100 to-teal-200 dark:from-emerald-950 dark:to-teal-900 border-2 border-emerald-300 flex items-center justify-center text-5xl sm:text-6xl shrink-0 shadow-inner select-none">
                {selectedAnimal.icon}
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-3 py-0.5 rounded-full text-xs font-black mb-1">
                  <ButterflyIcon className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{selectedAnimal.categoryAr}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black">{selectedAnimal.nameAr}</h2>
                <p className="text-xs font-bold text-slate-500 dark:text-pink-300">{selectedAnimal.nameEn}</p>
              </div>
            </div>

            {/* Modal Sub-Tabs: Passport vs Quiz */}
            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-[#1a0716] p-1.5 rounded-full border border-emerald-200 dark:border-pink-900/40 text-xs sm:text-sm font-bold">
              <button
                onClick={() => { sound.playClick(); setActiveTab('passport'); }}
                className={`flex-1 py-2 rounded-full transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeTab === 'passport'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-pink-200 hover:text-emerald-600'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>بطاقة المعلومات الشاملة</span>
              </button>

              <button
                onClick={() => { sound.playClick(); setActiveTab('quiz'); setQuizStep(0); setIsAnswered(false); }}
                className={`flex-1 py-2 rounded-full transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeTab === 'quiz'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-pink-200 hover:text-amber-600'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>اختبار وتحدي المعرفة</span>
              </button>
            </div>

            {/* TAB 1: COMPREHENSIVE ANIMAL PASSPORT */}
            {activeTab === 'passport' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Voice Pronunciation Banner */}
                <button
                  onClick={() => handleSpeak(`${selectedAnimal.nameAr}. يعيش في ${selectedAnimal.habitatAr}. يأكل ${selectedAnimal.foodAr}. صوته هو ${selectedAnimal.soundNameAr}. وصغيره هو ${selectedAnimal.babyNameAr}`)}
                  className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-100 dark:from-emerald-950/60 dark:to-teal-950/60 border border-emerald-300 text-emerald-950 dark:text-emerald-100 font-black text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors cursor-pointer shadow-xs"
                >
                  <Volume2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>استمع للبطاقة الصوتية الشاملة لـ {selectedAnimal.nameAr}</span>
                </button>

                {/* Facts Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Habitat */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1a0716] border border-slate-200 dark:border-pink-900/40 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-sky-100 text-sky-700 shrink-0">
                      <Home className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-500 dark:text-pink-300 block">أين يعيش؟ (الموطن)</span>
                      <span className="text-sm font-black text-slate-800 dark:text-pink-100">{selectedAnimal.habitatAr}</span>
                    </div>
                  </div>

                  {/* Food */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1a0716] border border-slate-200 dark:border-pink-900/40 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0">
                      <Utensils className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-500 dark:text-pink-300 block">ماذا يأكل؟ (الغذاء)</span>
                      <span className="text-sm font-black text-slate-800 dark:text-pink-100">{selectedAnimal.foodAr}</span>
                    </div>
                  </div>

                  {/* Sound Name */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1a0716] border border-slate-200 dark:border-pink-900/40 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-purple-100 text-purple-700 shrink-0">
                      <Music className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-500 dark:text-pink-300 block">اسم صوته في العربية</span>
                      <span className="text-sm font-black text-slate-800 dark:text-pink-100">{selectedAnimal.soundNameAr}</span>
                    </div>
                  </div>

                  {/* Baby Name */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1a0716] border border-slate-200 dark:border-pink-900/40 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-rose-100 text-rose-700 shrink-0">
                      <Baby className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-500 dark:text-pink-300 block">اسم صغاره</span>
                      <span className="text-sm font-black text-slate-800 dark:text-pink-100">{selectedAnimal.babyNameAr}</span>
                    </div>
                  </div>
                </div>

                {/* Fun Fact Box */}
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-amber-400 text-amber-950 shrink-0">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-amber-900 dark:text-amber-300 block mb-0.5">حقيقة مدهشة ومشوقة! 💡</span>
                    <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-amber-100 leading-relaxed">
                      {selectedAnimal.funFactAr}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: QUIZ & KNOWLEDGE CHALLENGE FOR THIS ANIMAL */}
            {activeTab === 'quiz' && currentQ && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-[#1a0716] border border-amber-200 dark:border-pink-900/40 text-center">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-300 block mb-1">
                    السؤال {quizStep + 1} من 3
                  </span>
                  <h3 className="text-lg font-black text-slate-800 dark:text-pink-100 leading-relaxed">
                    {currentQ.title}
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedOption === opt;
                    const isCorrect = isAnswered && opt === currentQ.correct;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleQuizAnswer(opt)}
                        disabled={isAnswered}
                        className={`p-3.5 rounded-2xl border-2 font-black text-sm text-start transition-all cursor-pointer ${
                          isCorrect
                            ? 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200'
                            : isSelected
                            ? 'bg-rose-500 text-white border-rose-600'
                            : 'bg-slate-50 dark:bg-[#1a0716] text-slate-800 dark:text-pink-100 border-slate-200 dark:border-pink-900/40 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                        }`}
                      >
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="p-3 rounded-xl bg-slate-100 dark:bg-[#1a0716] text-center font-bold text-xs text-slate-700 dark:text-pink-200">
                  {quizMessage}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

import React, { Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GameId } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { sound } from '../utils/audio';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { NavigationProgressBar } from '../components/common/NavigationProgressBar';
import { ButterflyIcon } from '../components/common/ButterflyIcon';

// Lazy-loaded game bundles to keep initial app load fast
const NumbersGame = lazy(() =>
  import('../components/games/NumbersGame').then((m) => ({ default: m.NumbersGame }))
);
const ArabicLettersGame = lazy(() =>
  import('../components/games/ArabicLettersGame').then((m) => ({ default: m.ArabicLettersGame }))
);
const EnglishLettersGame = lazy(() =>
  import('../components/games/EnglishLettersGame').then((m) => ({ default: m.EnglishLettersGame }))
);
const ArabicWordsGame = lazy(() =>
  import('../components/games/ArabicWordsGame').then((m) => ({ default: m.ArabicWordsGame }))
);
const EnglishWordsGame = lazy(() =>
  import('../components/games/EnglishWordsGame').then((m) => ({ default: m.EnglishWordsGame }))
);
const ImagesGame = lazy(() =>
  import('../components/games/ImagesGame').then((m) => ({ default: m.ImagesGame }))
);
const RelationsGame = lazy(() =>
  import('../components/games/RelationsGame').then((m) => ({ default: m.RelationsGame }))
);
const OppositesGame = lazy(() =>
  import('../components/games/OppositesGame').then((m) => ({ default: m.OppositesGame }))
);
const SeasonsGame = lazy(() =>
  import('../components/games/SeasonsGame').then((m) => ({ default: m.SeasonsGame }))
);
const DayNightGame = lazy(() =>
  import('../components/games/DayNightGame').then((m) => ({ default: m.DayNightGame }))
);
const PatternGame = lazy(() =>
  import('../components/games/PatternGame').then((m) => ({ default: m.PatternGame }))
);
const OddOneOutGame = lazy(() =>
  import('../components/games/OddOneOutGame').then((m) => ({ default: m.OddOneOutGame }))
);
const AnimalHabitatsGame = lazy(() =>
  import('../components/games/AnimalHabitatsGame').then((m) => ({ default: m.AnimalHabitatsGame }))
);
const CountingCompareGame = lazy(() =>
  import('../components/games/CountingCompareGame').then((m) => ({ default: m.CountingCompareGame }))
);
const ColorShapeSorterGame = lazy(() =>
  import('../components/games/ColorShapeSorterGame').then((m) => ({ default: m.ColorShapeSorterGame }))
);
const EmotionsKidsGame = lazy(() =>
  import('../components/games/EmotionsKidsGame').then((m) => ({ default: m.EmotionsKidsGame }))
);
const MathGame = lazy(() =>
  import('../components/games/MathGame').then((m) => ({ default: m.MathGame }))
);
const WordBuilderGame = lazy(() =>
  import('../components/games/WordBuilderGame').then((m) => ({ default: m.WordBuilderGame }))
);
const XOGame = lazy(() =>
  import('../components/games/XOGame').then((m) => ({ default: m.XOGame }))
);
const ShadowGame = lazy(() =>
  import('../components/games/ShadowGame').then((m) => ({ default: m.ShadowGame }))
);
const LearningClockGame = lazy(() =>
  import('../components/games/LearningClockGame').then((m) => ({ default: m.LearningClockGame }))
);
const FlamingoGame = lazy(() =>
  import('../components/games/FlamingoGame').then((m) => ({ default: m.FlamingoGame }))
);
const AnimalsEncyclopediaGame = lazy(() =>
  import('../components/games/AnimalsEncyclopediaGame').then((m) => ({ default: m.AnimalsEncyclopediaGame }))
);
const MyLittleWorldGame = lazy(() =>
  import('../components/games/MyLittleWorldGame').then((m) => ({ default: m.MyLittleWorldGame }))
);
const MyLittleKitchenGame = lazy(() =>
  import('../components/games/MyLittleKitchenGame').then((m) => ({ default: m.MyLittleKitchenGame }))
);
const NumberSortingGame = lazy(() =>
  import('../components/games/NumberSortingGame').then((m) => ({ default: m.NumberSortingGame }))
);

export const GamePlayPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const ArrowIcon = language === 'ar' ? ArrowRight : ArrowLeft;

  const handleGoHome = () => {
    if (window.history.state && typeof window.history.state.idx === 'number' && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/games', { replace: true });
    }
  };

  const renderGame = () => {
    switch (gameId as GameId) {
      case 'numbers':
        return <NumbersGame onGoHome={handleGoHome} />;
      case 'arabic-letters':
        return <ArabicLettersGame onGoHome={handleGoHome} />;
      case 'english-letters':
        return <EnglishLettersGame onGoHome={handleGoHome} />;
      case 'arabic-words':
        return <ArabicWordsGame onGoHome={handleGoHome} />;
      case 'english-words':
        return <EnglishWordsGame onGoHome={handleGoHome} />;
      case 'images':
        return <ImagesGame onGoHome={handleGoHome} />;
      case 'relations':
        return <RelationsGame onGoHome={handleGoHome} />;
      case 'opposites':
        return <OppositesGame onGoHome={handleGoHome} />;
      case 'seasons':
        return <SeasonsGame onGoHome={handleGoHome} />;
      case 'day-night':
        return <DayNightGame onGoHome={handleGoHome} />;
      case 'pattern-complete':
        return <PatternGame onGoHome={handleGoHome} />;
      case 'odd-one-out':
        return <OddOneOutGame onGoHome={handleGoHome} />;
      case 'animal-habitats':
        return <AnimalHabitatsGame onGoHome={handleGoHome} />;
      case 'counting-compare':
        return <CountingCompareGame onGoHome={handleGoHome} />;
      case 'color-shape-sorter':
        return <ColorShapeSorterGame onGoHome={handleGoHome} />;
      case 'emotions-kids':
        return <EmotionsKidsGame onGoHome={handleGoHome} />;
      case 'math-game':
        return <MathGame onGoHome={handleGoHome} />;
      case 'word-builder':
        return <WordBuilderGame onGoHome={handleGoHome} />;
      case 'xo-game':
        return <XOGame onGoHome={handleGoHome} />;
      case 'shadow-game':
        return <ShadowGame onGoHome={handleGoHome} />;
      case 'learning-clock':
        return <LearningClockGame onGoHome={handleGoHome} />;
      case 'flamingo-game':
        return <FlamingoGame onGoHome={handleGoHome} />;
      case 'animals-encyclopedia':
        return <AnimalsEncyclopediaGame onGoHome={handleGoHome} />;
      case 'my-little-world':
        return <MyLittleWorldGame onGoHome={handleGoHome} />;
      case 'my-little-kitchen':
        return <MyLittleKitchenGame onGoHome={handleGoHome} />;
      case 'number-sorting':
        return <NumberSortingGame onGoHome={handleGoHome} />;
      default:
        return (
          <div className="max-w-md mx-auto my-16 bg-white dark:bg-[#20091b] rounded-3xl p-8 text-center shadow-lg border border-pink-100 dark:border-[#3d122f]">
            <div className="text-6xl mb-4">🎮</div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-pink-100 mb-2">
              {language === 'ar' ? 'اللعبة غير متوفرة' : 'Game Not Found'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-pink-200/80 mb-6 font-medium">
              {language === 'ar'
                ? 'عذراً، لم يتم العثور على اللعبة المطلوبة. يمكنك اختيار إحدى الألعاب الممتعة الأخرى!'
                : 'Sorry, the requested game could not be found. Please choose from our available games!'}
            </p>
            <button
              onClick={() => {
                sound.playClick();
                handleGoHome();
              }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:opacity-95 transition-all cursor-pointer"
            >
              <ArrowIcon className="w-4 h-4" />
              <span>{language === 'ar' ? 'الرجوع إلى قائمة الألعاب' : 'Back to Games List'}</span>
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-dvh w-full max-w-full overflow-x-clip flex flex-col items-center justify-start bg-gradient-to-br from-[#fff1f5] via-[#fdf2f8] to-[#fce7f3] dark:from-[#160612] dark:via-[#1e0819] dark:to-[#12040f] text-slate-800 dark:text-pink-50 transition-colors duration-200 py-2.5 sm:py-6 px-2.5 sm:px-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <NavigationProgressBar />
      <div key={gameId} className="w-full min-w-0 flex flex-col items-center animate-page-enter">
        <Suspense
          fallback={
            <div className="max-w-sm w-full mx-auto my-20 bg-white/95 dark:bg-[#20091b]/95 rounded-3xl p-8 text-center shadow-lg border border-pink-100 dark:border-[#3d122f] flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-pink-50 dark:bg-pink-950/60 flex items-center justify-center animate-bounce">
                <ButterflyIcon className="w-11 h-11" />
              </div>
              <p className="text-base font-black text-slate-800 dark:text-pink-100">
                {language === 'ar' ? 'جارٍ تحضير اللعبة الممتعة...' : 'Loading your fun game...'}
              </p>
            </div>
          }
        >
          {renderGame()}
        </Suspense>
      </div>
    </div>
  );
};

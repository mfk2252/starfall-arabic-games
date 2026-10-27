import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { GameId } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { sound } from '../utils/audio';
import { ArrowRight, ArrowLeft } from 'lucide-react';

// 12 Original Ported Games
import { NumbersGame } from '../components/games/NumbersGame';
import { ArabicLettersGame } from '../components/games/ArabicLettersGame';
import { EnglishLettersGame } from '../components/games/EnglishLettersGame';
import { ArabicWordsGame } from '../components/games/ArabicWordsGame';
import { EnglishWordsGame } from '../components/games/EnglishWordsGame';
import { ImagesGame } from '../components/games/ImagesGame';
import { RelationsGame } from '../components/games/RelationsGame';
import { OppositesGame } from '../components/games/OppositesGame';
import { SeasonsGame } from '../components/games/SeasonsGame';
import { DayNightGame } from '../components/games/DayNightGame';

// 6 New Educational Games
import { PatternGame } from '../components/games/PatternGame';
import { OddOneOutGame } from '../components/games/OddOneOutGame';
import { AnimalHabitatsGame } from '../components/games/AnimalHabitatsGame';
import { CountingCompareGame } from '../components/games/CountingCompareGame';
import { ColorShapeSorterGame } from '../components/games/ColorShapeSorterGame';
import { EmotionsKidsGame } from '../components/games/EmotionsKidsGame';
import { MathGame } from '../components/games/MathGame';
import { WordBuilderGame } from '../components/games/WordBuilderGame';
import { XOGame } from '../components/games/XOGame';
import { ShadowGame } from '../components/games/ShadowGame';
import { LearningClockGame } from '../components/games/LearningClockGame';
import { FlamingoGame } from '../components/games/FlamingoGame';
import { AnimalsEncyclopediaGame } from '../components/games/AnimalsEncyclopediaGame';

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
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-gradient-to-br from-[#fff1f5] via-[#fdf2f8] to-[#fce7f3] dark:from-[#160612] dark:via-[#1e0819] dark:to-[#12040f] text-slate-800 dark:text-pink-50 transition-colors duration-200 py-3 sm:py-6 px-3 sm:px-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {renderGame()}
    </div>
  );
};

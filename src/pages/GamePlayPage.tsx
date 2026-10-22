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
import { Puzzle2Game } from '../components/games/Puzzle2Game';
import { Puzzle4Game } from '../components/games/Puzzle4Game';
import { SeasonsGame } from '../components/games/SeasonsGame';
import { DayNightGame } from '../components/games/DayNightGame';

// 6 New Educational Games
import { PatternGame } from '../components/games/PatternGame';
import { OddOneOutGame } from '../components/games/OddOneOutGame';
import { AnimalHabitatsGame } from '../components/games/AnimalHabitatsGame';
import { CountingCompareGame } from '../components/games/CountingCompareGame';
import { ColorShapeSorterGame } from '../components/games/ColorShapeSorterGame';
import { EmotionsKidsGame } from '../components/games/EmotionsKidsGame';

export const GamePlayPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const ArrowIcon = language === 'ar' ? ArrowRight : ArrowLeft;

  const handleGoHome = () => {
    navigate('/games');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
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
      case 'puzzle-2':
        return <Puzzle2Game onGoHome={handleGoHome} />;
      case 'puzzle-4':
        return <Puzzle4Game onGoHome={handleGoHome} />;
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
      default:
        return (
          <div className="max-w-md mx-auto my-16 bg-white rounded-3xl p-8 text-center shadow-lg border border-slate-100">
            <div className="text-6xl mb-4">🎮</div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">
              {language === 'ar' ? 'اللعبة غير متوفرة' : 'Game Not Found'}
            </h2>
            <p className="text-sm text-slate-600 mb-6 font-medium">
              {language === 'ar'
                ? 'عذراً، لم يتم العثور على اللعبة المطلوبة. يمكنك اختيار إحدى الألعاب الممتعة الأخرى!'
                : 'Sorry, the requested game could not be found. Please choose from our available games!'}
            </p>
            <Link
              to="/games"
              onClick={() => sound.playClick()}
              className="inline-flex items-center gap-2 bg-sky-600 text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:bg-sky-700 transition-colors"
            >
              <ArrowIcon className="w-4 h-4" />
              <span>{language === 'ar' ? 'الرجوع إلى قائمة الألعاب' : 'Back to Games List'}</span>
            </Link>
          </div>
        );
    }
  };

  return (
    <div className="w-full py-4 flex flex-col items-center flex-1">
      {renderGame()}
    </div>
  );
};

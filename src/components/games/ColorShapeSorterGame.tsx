import React, { useState, useEffect, useCallback } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';
import { useLanguage } from '../../i18n/LanguageContext';

interface ShapeItem {
  id: number;
  name: string;
  nameEn: string;
  icon: string;
  shapeType: 'circle' | 'square' | 'triangle';
  colorType: 'red' | 'blue' | 'yellow';
}

const SHAPES_LIST: ShapeItem[] = [
  { id: 1, name: 'دائرة حمراء', nameEn: 'Red Circle', icon: '🔴', shapeType: 'circle', colorType: 'red' },
  { id: 2, name: 'مربع أزرق', nameEn: 'Blue Square', icon: '🟦', shapeType: 'square', colorType: 'blue' },
  { id: 3, name: 'مثلث أحمر', nameEn: 'Red Triangle', icon: '🔺', shapeType: 'triangle', colorType: 'red' },
  { id: 4, name: 'دائرة صفراء', nameEn: 'Yellow Circle', icon: '🟡', shapeType: 'circle', colorType: 'yellow' },
  { id: 5, name: 'مربع أحمر', nameEn: 'Red Square', icon: '🟥', shapeType: 'square', colorType: 'red' },
  { id: 6, name: 'دائرة زرقاء', nameEn: 'Blue Circle', icon: '🔵', shapeType: 'circle', colorType: 'blue' },
];

export const ColorShapeSorterGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const { language } = useLanguage();
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');
  const [sortMode, setSortMode] = useState<'shape' | 'color'>('shape');

  const currentItem = SHAPES_LIST[currentIdx];

  const initGame = useCallback(() => {
    setCurrentIdx(0);
    setScore(0);
    setFeedback('');
    setIsGameOver(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleBasketClick = (basketKey: string) => {
    if (!currentItem) return;

    const isMatch =
      sortMode === 'shape'
        ? basketKey === currentItem.shapeType
        : basketKey === currentItem.colorType;

    if (isMatch) {
      sound.playMatch();
      const newScore = score + 15;
      setScore(newScore);
      setFeedback(`🎉 ${language === 'ar' ? 'ممتاز! وضعت' : 'Awesome! You sorted'} (${language === 'ar' ? currentItem.name : currentItem.nameEn}) ${language === 'ar' ? 'في السلة المناسبة!' : 'into the right basket!'}`);

      setTimeout(() => {
        if (currentIdx + 1 < SHAPES_LIST.length) {
          setCurrentIdx((prev) => prev + 1);
          setFeedback('');
        } else {
          saveGameProgress('color-shape-sorter', newScore, true);
          setIsGameOver(true);
        }
      }, 700);
    } else {
      sound.playWrong();
      setFeedback(`❌ ${language === 'ar' ? 'هذه ليست السلة الصحيحة، حاول مجدداً!' : 'This is not the correct basket, try again!'}`);
      setScore((prev) => Math.max(0, prev - 2));
    }
  };

  return (
    <div className="flex flex-col items-center w-full px-4 py-4 min-h-[85vh]">
      <GameHeader
        title={language === 'ar' ? 'فرز الأشكال والألوان' : 'Shape & Color Sorter'}
        icon="🔺🔵"
        score={score}
        onRestart={initGame}
        onGoHome={onGoHome}
        accentGradient="from-[#f72585] to-[#7209b7]"
        badgeText={language === 'ar' ? `قطعة ${currentIdx + 1} من ${SHAPES_LIST.length}` : `Piece ${currentIdx + 1} of ${SHAPES_LIST.length}`}
      />

      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl border border-pink-100 max-w-2xl w-full flex flex-col items-center">
        {/* Sorter Mode Toggle */}
        <div className="flex items-center justify-between w-full mb-6 gap-2">
          <span className="text-xs font-bold text-slate-500">
            {language === 'ar' ? 'طريقة الفرز الحالية:' : 'Current Sorting Mode:'}
          </span>
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-full border border-slate-200">
            <button
              onClick={() => {
                sound.playClick();
                setSortMode('shape');
                setFeedback('');
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                sortMode === 'shape'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-purple-600'
              }`}
            >
              {language === 'ar' ? 'فرز بالأشكال (دائرة/مربع/مثلث)' : 'By Shape'}
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setSortMode('color');
                setFeedback('');
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                sortMode === 'color'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-purple-600'
              }`}
            >
              {language === 'ar' ? 'فرز بالألوان (أحمر/أزرق/أصفر)' : 'By Color'}
            </button>
          </div>
        </div>

        {/* Current Piece Stage */}
        <div className="w-full bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 border-2 border-purple-200 rounded-3xl p-6 text-center mb-8 shadow-inner">
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block mb-1">
            {language === 'ar' ? 'ضع هذا الشكل في سلته المناسبة:' : 'Sort this shape into its basket:'}
          </span>
          <div className="text-7xl sm:text-8xl my-2 filter drop-shadow animate-pulse">
            {currentItem?.icon}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800">
            {language === 'ar' ? currentItem?.name : currentItem?.nameEn}
          </h2>
        </div>

        {/* Target Baskets */}
        <div className="w-full mb-6">
          <h3 className="text-xs sm:text-sm font-bold text-slate-500 mb-3 text-center">
            {language === 'ar' ? 'اضغط على السلة المناسبة:' : 'Click the matching basket:'}
          </h3>

          {sortMode === 'shape' ? (
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'circle', name: language === 'ar' ? 'سلة الدوائر' : 'Circles', icon: '⭕', bg: 'bg-rose-50 border-rose-300 hover:bg-rose-100 text-rose-900' },
                { id: 'square', name: language === 'ar' ? 'سلة المربعات' : 'Squares', icon: '⏹️', bg: 'bg-blue-50 border-blue-300 hover:bg-blue-100 text-blue-900' },
                { id: 'triangle', name: language === 'ar' ? 'سلة المثلثات' : 'Triangles', icon: '🔺', bg: 'bg-amber-50 border-amber-300 hover:bg-amber-100 text-amber-900' },
              ].map((basket) => (
                <button
                  key={basket.id}
                  onClick={() => handleBasketClick(basket.id)}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all transform hover:scale-105 active:scale-95 shadow-sm cursor-pointer select-none ${basket.bg}`}
                >
                  <span className="text-4xl filter drop-shadow">{basket.icon}</span>
                  <span className="text-xs sm:text-sm font-black">{basket.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'red', name: language === 'ar' ? 'سلة الأحمر' : 'Red Basket', icon: '🔴', bg: 'bg-rose-50 border-rose-300 hover:bg-rose-100 text-rose-900' },
                { id: 'blue', name: language === 'ar' ? 'سلة الأزرق' : 'Blue Basket', icon: '🔵', bg: 'bg-blue-50 border-blue-300 hover:bg-blue-100 text-blue-900' },
                { id: 'yellow', name: language === 'ar' ? 'سلة الأصفر' : 'Yellow Basket', icon: '🟡', bg: 'bg-amber-50 border-amber-300 hover:bg-amber-100 text-amber-900' },
              ].map((basket) => (
                <button
                  key={basket.id}
                  onClick={() => handleBasketClick(basket.id)}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all transform hover:scale-105 active:scale-95 shadow-sm cursor-pointer select-none ${basket.bg}`}
                >
                  <span className="text-4xl filter drop-shadow">{basket.icon}</span>
                  <span className="text-xs sm:text-sm font-black">{basket.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className="w-full text-center p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 font-bold mb-3 animate-pop-in text-sm sm:text-base">
            {feedback}
          </div>
        )}
      </div>

      {isGameOver && (
        <WinCelebration
          score={score}
          message={language === 'ar' ? '🎉 رائع جداً! لقد فرزت جميع الأشكال والألوان بدقة وبراعة فائقة!' : '🎉 Splendid! You sorted all shapes and colors with precision!'}
          onRestart={initGame}
          onGoHome={onGoHome}
          stars={score >= 70 ? 3 : score >= 50 ? 2 : 1}
        />
      )}
    </div>
  );
};

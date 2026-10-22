import React, { useState, useEffect, useCallback } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';

interface OppositeQuestion {
  id: number;
  word: string;
  icon: string;
  oppositeWord: string;
  oppositeIcon: string;
  options: { word: string; icon: string; isCorrect: boolean }[];
  contextSentence: string;
}

const OPPOSITES_DATA: OppositeQuestion[] = [
  {
    id: 1,
    word: 'فوق',
    icon: '⬆️',
    oppositeWord: 'تحت',
    oppositeIcon: '⬇️',
    contextSentence: 'عكس كلمة (فوق السحاب) هو...',
    options: [
      { word: 'تحت', icon: '⬇️', isCorrect: true },
      { word: 'يمين', icon: '➡️', isCorrect: false },
      { word: 'يسار', icon: '⬅️', isCorrect: false },
    ],
  },
  {
    id: 2,
    word: 'كبير',
    icon: '🐘',
    oppositeWord: 'صغير',
    oppositeIcon: '🐜',
    contextSentence: 'الفيل ضخم وكبير، لكن النملة...',
    options: [
      { word: 'طويلة', icon: '🦒', isCorrect: false },
      { word: 'صغيرة', icon: '🐜', isCorrect: true },
      { word: 'ثقيلة', icon: '🪨', isCorrect: false },
    ],
  },
  {
    id: 3,
    word: 'حار',
    icon: '☀️',
    oppositeWord: 'بارد',
    oppositeIcon: '⛄',
    contextSentence: 'شاي الصباح ساخن وحار، لكن الآيس كريم...',
    options: [
      { word: 'مالح', icon: '🧂', isCorrect: false },
      { word: 'حلو', icon: '🍬', isCorrect: false },
      { word: 'بارد', icon: '⛄', isCorrect: true },
    ],
  },
  {
    id: 4,
    word: 'سريع',
    icon: '🐆',
    oppositeWord: 'بطيء',
    oppositeIcon: '🐢',
    contextSentence: 'الفهد سريع جداً، بينما السلحفاة...',
    options: [
      { word: 'بطيئة', icon: '🐢', isCorrect: true },
      { word: 'نائمة', icon: '😴', isCorrect: false },
      { word: 'طائرة', icon: '🦅', isCorrect: false },
    ],
  },
  {
    id: 5,
    word: 'سعيد',
    icon: '😊',
    oppositeWord: 'حزين',
    oppositeIcon: '😢',
    contextSentence: 'عكس الابتسامة والسعادة هو أن يكون...',
    options: [
      { word: 'غضبان', icon: '😡', isCorrect: false },
      { word: 'حزين', icon: '😢', isCorrect: true },
      { word: 'متحمس', icon: '🤩', isCorrect: false },
    ],
  },
  {
    id: 6,
    word: 'طويل',
    icon: '🦒',
    oppositeWord: 'قصير',
    oppositeIcon: '🐧',
    contextSentence: 'الزرافة رقبتها طويلة، وعكس الطويل هو...',
    options: [
      { word: 'قصير', icon: '🐧', isCorrect: true },
      { word: 'نحيف', icon: '🥖', isCorrect: false },
      { word: 'عريض', icon: '🚪', isCorrect: false },
    ],
  },
];

export const OppositesGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');

  const initGame = useCallback(() => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsGameOver(false);
    setFeedback('');
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const currentQ = OPPOSITES_DATA[currentIndex];

  const handleSelectOption = (idx: number, isCorrect: boolean) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (isCorrect) {
      sound.playMatch();
      const newScore = score + 15;
      setScore(newScore);
      setFeedback(`🎉 صحيح! عكس (${currentQ.word}) هو (${currentQ.oppositeWord} ${currentQ.oppositeIcon})`);
    } else {
      sound.playWrong();
      setFeedback(`❌ ليس تماماً! عكس (${currentQ.word}) هو (${currentQ.oppositeWord} ${currentQ.oppositeIcon})`);
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (currentIndex + 1 < OPPOSITES_DATA.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setFeedback('');
    } else {
      saveGameProgress('opposites', score, true);
      setIsGameOver(true);
    }
  };

  return (
    <div className="flex flex-col items-center w-full px-4 py-4 min-h-[85vh]">
      <GameHeader
        title="المعكوسات والمفاهيم المتضادة"
        icon="⬆️⬇️"
        score={score}
        onRestart={initGame}
        onGoHome={onGoHome}
        accentGradient="from-[#81c784] to-[#2e7d32]"
        badgeText={`سؤال ${currentIndex + 1} من ${OPPOSITES_DATA.length}`}
      />

      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl border border-emerald-100 max-w-2xl w-full flex flex-col items-center">
        {/* The Prompt Word */}
        <div className="w-full bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 rounded-2xl p-6 mb-6 text-center border-2 border-emerald-200">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
            ما هو عكس هذه الكلمة؟
          </span>
          <div className="text-5xl sm:text-6xl my-2 filter drop-shadow">{currentQ.icon}</div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-800 my-1">{currentQ.word}</h2>
          <p className="text-slate-600 text-sm sm:text-base font-semibold mt-2">
            {currentQ.contextSentence}
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full mb-6">
          {currentQ.options.map((opt, idx) => {
            let btnStyle = 'bg-slate-50 hover:bg-emerald-50 border-slate-200 text-slate-800 hover:border-emerald-300';
            if (isAnswered) {
              if (opt.isCorrect) {
                btnStyle = 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200 shadow-md';
              } else if (selectedOption === idx) {
                btnStyle = 'bg-rose-500 text-white border-rose-600 ring-2 ring-rose-200';
              } else {
                btnStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx, opt.isCorrect)}
                disabled={isAnswered}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all transform duration-200 cursor-pointer ${
                  !isAnswered ? 'hover:scale-105 active:scale-95' : ''
                } ${btnStyle}`}
              >
                <span className="text-4xl filter drop-shadow">{opt.icon}</span>
                <span className="text-xl font-black">{opt.word}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback message */}
        {feedback && (
          <div className="w-full text-center p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold mb-5 animate-pop-in text-sm sm:text-base">
            {feedback}
          </div>
        )}

        {/* Next Question Button */}
        {isAnswered && (
          <button
            onClick={handleNext}
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all"
          >
            {currentIndex + 1 < OPPOSITES_DATA.length ? 'السؤال التالي ⬅️' : 'عرض النتيجة النهائية 🏆'}
          </button>
        )}
      </div>

      {isGameOver && (
        <WinCelebration
          score={score}
          message="🎉 أحسنت صنعاً! لقد أتقنت جميع المعكوسات والمفاهيم المتضادة!"
          onRestart={initGame}
          onGoHome={onGoHome}
          stars={score >= 75 ? 3 : score >= 50 ? 2 : 1}
        />
      )}
    </div>
  );
};

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
  const [wrongOption, setWrongOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');

  const initGame = useCallback(() => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setWrongOption(null);
    setIsAnswered(false);
    setIsProcessing(false);
    setIsGameOver(false);
    setFeedback('');
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const currentQ = OPPOSITES_DATA[currentIndex];

  const handleSelectOption = (idx: number, isCorrect: boolean) => {
    if (isProcessing || isAnswered) return;

    if (isCorrect) {
      setSelectedOption(idx);
      setIsAnswered(true);
      setIsProcessing(true);
      sound.playMatch();
      const newScore = score + 15;
      setScore(newScore);
      setFeedback(`🎉 صحيح! عكس (${currentQ.word}) هو (${currentQ.oppositeWord} ${currentQ.oppositeIcon})`);

      setTimeout(() => {
        if (currentIndex + 1 < OPPOSITES_DATA.length) {
          setCurrentIndex((prev) => prev + 1);
          setSelectedOption(null);
          setWrongOption(null);
          setIsAnswered(false);
          setIsProcessing(false);
          setFeedback('');
        } else {
          saveGameProgress('opposites', newScore, true);
          setIsGameOver(true);
        }
      }, 1100);
    } else {
      sound.playWrong();
      setWrongOption(idx);
      setFeedback(`❌ ليس تماماً! فكر مجدداً في عكس (${currentQ.word})`);
      setScore((prev) => Math.max(0, prev - 2));

      setTimeout(() => {
        setWrongOption(null);
      }, 700);
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

      <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-4 sm:p-6 shadow-xl border border-emerald-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 max-w-2xl w-full flex flex-col items-center">
        {/* The Prompt Word */}
        <div className="w-full bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 dark:from-slate-900 dark:via-emerald-950/40 dark:to-slate-900 rounded-2xl p-5 mb-4 text-center border-2 border-emerald-200 dark:border-slate-700">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-1">
            ما هو عكس هذه الكلمة؟
          </span>
          <div className="text-4xl sm:text-5xl my-1 filter drop-shadow">{currentQ.icon}</div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 my-1">{currentQ.word}</h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-semibold mt-1">
            {currentQ.contextSentence}
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mb-4">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isWrong = wrongOption === idx;
            let btnStyle = 'bg-slate-50 hover:bg-emerald-50 border-slate-200 text-slate-800 hover:border-emerald-300 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-100';

            if (isAnswered && opt.isCorrect) {
              btnStyle = 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200 shadow-md scale-102';
            } else if (isWrong) {
              btnStyle = 'bg-rose-500 text-white border-rose-600 ring-2 ring-rose-200 animate-shake';
            } else if (isSelected) {
              btnStyle = 'bg-emerald-600 text-white border-emerald-700';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx, opt.isCorrect)}
                disabled={isProcessing || isAnswered}
                className={`p-3.5 sm:p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all transform duration-150 cursor-pointer select-none ${
                  !isAnswered && !isProcessing ? 'hover:scale-105 active:scale-95' : ''
                } ${btnStyle}`}
              >
                <span className="text-3xl sm:text-4xl filter drop-shadow">{opt.icon}</span>
                <span className="text-lg font-black">{opt.word}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback message */}
        {feedback && (
          <div className={`w-full text-center p-2.5 rounded-xl font-bold text-xs sm:text-sm animate-pop-in ${
            isAnswered
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
          }`}>
            {feedback}
          </div>
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

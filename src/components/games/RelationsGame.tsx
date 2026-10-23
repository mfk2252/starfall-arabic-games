import React, { useState, useEffect, useCallback } from 'react';
import { GameHeader } from '../common/GameHeader';
import { WinCelebration } from '../common/WinCelebration';
import { sound } from '../../utils/audio';
import { saveGameProgress } from '../../utils/storage';
import { CheckCircle2 } from 'lucide-react';

interface RelationPair {
  id: string;
  itemA: { name: string; icon: string };
  itemB: { name: string; icon: string };
  explanation: string;
}

const ALL_RELATIONS: RelationPair[] = [
  {
    id: 'racket_ball',
    itemA: { name: 'مضرب التنس', icon: '🎾' },
    itemB: { name: 'كرة التنس', icon: '🥎' },
    explanation: 'نستخدم المضرب لضرب الكرة!',
  },
  {
    id: 'brush_palette',
    itemA: { name: 'فرشاة الرسم', icon: '🖌️' },
    itemB: { name: 'لوحة الألوان', icon: '🎨' },
    explanation: 'نستخدم الفرشاة والألوان للرسم الجميل!',
  },
  {
    id: 'lock_key',
    itemA: { name: 'القفل', icon: '🔒' },
    itemB: { name: 'المفتاح', icon: '🔑' },
    explanation: 'المفتاح المناسب يفتح القفل!',
  },
  {
    id: 'brush_paste',
    itemA: { name: 'فرشاة الأسنان', icon: '🪥' },
    itemB: { name: 'معجون الأسنان', icon: '🧴' },
    explanation: 'الفرشاة والمعجون يحميان أسناننا من التسوس!',
  },
  {
    id: 'umbrella_rain',
    itemA: { name: 'المظلة', icon: '☂️' },
    itemB: { name: 'المطر', icon: '🌧️' },
    explanation: 'نحمل المظلة لتحمينا من ماء المطر!',
  },
  {
    id: 'bee_flower',
    itemA: { name: 'النحلة النشيطة', icon: '🐝' },
    itemB: { name: 'الزهرة الجميلة', icon: '🌸' },
    explanation: 'النحلة تمتص رحيق الزهرة لتصنع العسل!',
  },
];

export const RelationsGame: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [message, setMessage] = useState<string>('اختر عنصراً من اليمين وما يناسبه من اليسار!');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [rightItems, setRightItems] = useState<{ id: string; name: string; icon: string }[]>([]);

  const initGame = useCallback(() => {
    // Shuffle right items so they are not in the same order
    const shuffled = ALL_RELATIONS.map((r) => ({
      id: r.id,
      name: r.itemB.name,
      icon: r.itemB.icon,
    }));

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setRightItems(shuffled);
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedIds([]);
    setScore(0);
    setIsGameOver(false);
    setMessage('اختر عنصراً من اليمين وما يناسبه من اليسار!');
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleSelectLeft = (id: string) => {
    if (matchedIds.includes(id)) return;
    sound.playClick();
    setSelectedLeft(id);

    if (selectedRight) {
      evaluateMatch(id, selectedRight);
    }
  };

  const handleSelectRight = (id: string) => {
    if (matchedIds.includes(id)) return;
    sound.playClick();
    setSelectedRight(id);

    if (selectedLeft) {
      evaluateMatch(selectedLeft, id);
    }
  };

  const evaluateMatch = (leftId: string, rightId: string) => {
    if (leftId === rightId) {
      sound.playMatch();
      const updated = [...matchedIds, leftId];
      setMatchedIds(updated);
      setSelectedLeft(null);
      setSelectedRight(null);
      const newScore = score + 15;
      setScore(newScore);

      const rel = ALL_RELATIONS.find((r) => r.id === leftId);
      setMessage(`✅ رائع! ${rel?.explanation}`);

      if (updated.length === ALL_RELATIONS.length) {
        saveGameProgress('relations', newScore, true);
        setIsGameOver(true);
      }
    } else {
      sound.playWrong();
      setMessage('❌ هذان الشيئان غير مترابطين، حاول مرة أخرى!');
      setScore((prev) => Math.max(0, prev - 2));
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 700);
    }
  };

  return (
    <div className="flex flex-col items-center w-full px-4 py-4 min-h-[85vh]">
      <GameHeader
        title="التعرف على العلاقات"
        icon="🔗"
        score={score}
        onRestart={initGame}
        onGoHome={onGoHome}
        accentGradient="from-[#4fc3f7] to-[#0288d1]"
        badgeText="ربط الأشياء المترابطة في حياتنا"
      />

      <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-5 sm:p-8 shadow-xl border border-sky-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 max-w-3xl w-full flex flex-col items-center">
        <div className="w-full text-center mb-6">
          <div className="inline-block bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-300 font-bold px-4 py-2 rounded-2xl text-sm sm:text-base">
            {message}
          </div>
        </div>

        {/* Two Matching Columns */}
        <div className="grid grid-cols-2 gap-4 sm:gap-8 w-full">
          {/* Left Column (Items A) */}
          <div className="flex flex-col gap-3">
            <h3 className="text-center font-bold text-slate-600 text-sm mb-1">الشيء الأساسي</h3>
            {ALL_RELATIONS.map((rel) => {
              const isMatched = matchedIds.includes(rel.id);
              const isSelected = selectedLeft === rel.id;
              return (
                <button
                  key={`left-${rel.id}`}
                  onClick={() => handleSelectLeft(rel.id)}
                  disabled={isMatched}
                  className={`p-3 sm:p-4 rounded-2xl flex items-center gap-3 transition-all transform duration-200 text-right select-none ${
                    isMatched
                      ? 'bg-emerald-50 border-2 border-emerald-400 text-emerald-800 opacity-80 cursor-default'
                      : isSelected
                      ? 'bg-amber-100 border-2 border-amber-400 shadow-md scale-102 text-amber-900 ring-2 ring-amber-300'
                      : 'bg-slate-50 hover:bg-sky-50 border-2 border-slate-200 hover:border-sky-300 text-slate-800 shadow-xs cursor-pointer'
                  }`}
                >
                  <span className="text-3xl filter drop-shadow">{rel.itemA.icon}</span>
                  <div className="flex-1 font-extrabold text-sm sm:text-base">
                    {rel.itemA.name}
                  </div>
                  {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                </button>
              );
            })}
          </div>

          {/* Right Column (Items B - Shuffled) */}
          <div className="flex flex-col gap-3">
            <h3 className="text-center font-bold text-slate-600 text-sm mb-1">ما يرتبط به</h3>
            {rightItems.map((item) => {
              const isMatched = matchedIds.includes(item.id);
              const isSelected = selectedRight === item.id;
              return (
                <button
                  key={`right-${item.id}`}
                  onClick={() => handleSelectRight(item.id)}
                  disabled={isMatched}
                  className={`p-3 sm:p-4 rounded-2xl flex items-center gap-3 transition-all transform duration-200 text-right select-none ${
                    isMatched
                      ? 'bg-emerald-50 border-2 border-emerald-400 text-emerald-800 opacity-80 cursor-default'
                      : isSelected
                      ? 'bg-amber-100 border-2 border-amber-400 shadow-md scale-102 text-amber-900 ring-2 ring-amber-300'
                      : 'bg-slate-50 hover:bg-sky-50 border-2 border-slate-200 hover:border-sky-300 text-slate-800 shadow-xs cursor-pointer'
                  }`}
                >
                  <span className="text-3xl filter drop-shadow">{item.icon}</span>
                  <div className="flex-1 font-extrabold text-sm sm:text-base">
                    {item.name}
                  </div>
                  {isMatched && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 text-center text-xs sm:text-sm text-slate-500 font-semibold">
          تم إكمال: {matchedIds.length} من {ALL_RELATIONS.length} علاقات
        </div>
      </div>

      {isGameOver && (
        <WinCelebration
          score={score}
          message="🎉 عبقري! لقد اكتشفت وفهمت جميع العلاقات المنطقية بنجاح!"
          onRestart={initGame}
          onGoHome={onGoHome}
          stars={3}
        />
      )}
    </div>
  );
};

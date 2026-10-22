import React, { useState } from 'react';
import { GameId, GameInfo } from '../types';
import { GAMES_LIST } from '../data/games';
import { getAllProgress } from '../utils/storage';
import { sound } from '../utils/audio';
import { Volume2, VolumeX, Star, Play, Sparkles } from 'lucide-react';

interface HomeProps {
  onSelectGame: (gameId: GameId) => void;
}

export const Home: React.FC<HomeProps> = ({ onSelectGame }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isMuted, setIsMuted] = useState(!sound.isEnabled());
  const progress = getAllProgress();

  const handleToggleSound = () => {
    const enabled = sound.toggleSound();
    setIsMuted(!enabled);
    if (enabled) {
      sound.playClick();
    }
  };

  const categories = [
    { id: 'all', label: 'جميع الألعاب ⭐' },
    { id: 'numbers', label: 'الأرقام والحساب 🔢' },
    { id: 'letters', label: 'الحروف واللغة 🔤' },
    { id: 'words', label: 'الكلمات والقراءة 📝' },
    { id: 'visual', label: 'الذاكرة والبازل 🧩' },
    { id: 'logic', label: 'العلاقات والمعكوسات 🔗' },
    { id: 'science', label: 'العلوم والطبيعة 🌸' },
  ];

  const filteredGames = selectedCategory === 'all'
    ? GAMES_LIST
    : GAMES_LIST.filter((g) => {
        if (selectedCategory === 'visual') {
          return g.category === 'visual';
        }
        return g.category === selectedCategory;
      });

  // Calculate total stars collected
  const totalStars = Object.values(progress).reduce(
    (acc, curr) => acc + (curr.stars || 0),
    0
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Banner & Header matching original colors & style */}
      <header className="bg-gradient-to-r from-[#4fc3f7] via-[#29b6f6] to-[#0288d1] text-white py-8 sm:py-12 px-4 shadow-xl relative overflow-hidden">
        {/* Twinkling ambient decorative stars */}
        <div className="absolute top-4 right-10 text-3xl animate-twinkle opacity-75">⭐</div>
        <div className="absolute bottom-4 left-10 text-3xl animate-twinkle opacity-75" style={{ animationDelay: '1s' }}>⭐</div>
        <div className="absolute top-8 left-1/4 text-2xl animate-twinkle opacity-50" style={{ animationDelay: '0.5s' }}>✨</div>

        <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
          {/* Audio toggle & stars pill */}
          <div className="flex items-center justify-between w-full max-w-4xl mb-4 px-2">
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold border border-white/30 text-white shadow-xs">
              <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>النجوم المكتسبة:</span>
              <span className="text-amber-200 text-base">{totalStars}</span>
            </div>

            <button
              onClick={handleToggleSound}
              className={`p-2.5 rounded-full border shadow-sm transition-all ${
                isMuted
                  ? 'bg-rose-500/80 text-white border-rose-300'
                  : 'bg-white/25 hover:bg-white/40 text-white border-white/40'
              }`}
              title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black mb-3 tracking-tight flex items-center justify-center gap-3 drop-shadow-md">
            <span className="animate-twinkle inline-block text-amber-300 text-4xl sm:text-5xl">⭐</span>
            <span>ستار فل بالعربي</span>
            <span className="animate-twinkle inline-block text-amber-300 text-4xl sm:text-5xl" style={{ animationDelay: '0.8s' }}>⭐</span>
          </h1>
          <p className="text-base sm:text-xl font-semibold opacity-95 text-sky-50 max-w-xl leading-relaxed">
            ألعاب تعليمية ممتعة وتفاعلية للأطفال من عمر ١ إلى ٧ سنوات
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:py-12">
        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-8 sm:mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playClick();
                setSelectedCategory(cat.id);
              }}
              className={`px-4 py-2 rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md scale-105'
                  : 'bg-white/80 hover:bg-white text-slate-700 hover:text-sky-600 border border-slate-200 shadow-xs'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 12 Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredGames.map((game: GameInfo) => {
            const gameData = progress[game.id];
            const starsEarned = gameData?.stars || 0;

            return (
              <div
                key={game.id}
                onClick={() => {
                  sound.playClick();
                  onSelectGame(game.id);
                }}
                className="game-card bg-white rounded-3xl p-6 sm:p-7 text-center shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer relative overflow-hidden group border border-slate-100 flex flex-col justify-between"
              >
                {/* Rainbow strip on top matching original css */}
                <div className="absolute top-0 left-0 right-0 h-1.5 card-rainbow-strip" />

                {/* Stars earned badge */}
                <div className="flex items-center justify-between w-full mb-3">
                  <span className="text-[11px] font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                    {game.ageRange}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3].map((starIdx) => (
                      <Star
                        key={starIdx}
                        className={`w-4 h-4 ${
                          starIdx <= starsEarned
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-slate-100 text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Game Icon */}
                <div className="my-2 transform group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-300 flex items-center justify-center">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${game.gradient} text-white flex items-center justify-center text-4xl shadow-md group-hover:shadow-lg`}>
                    {game.icon}
                  </div>
                </div>

                {/* Title & Description */}
                <div className="my-3">
                  <h3 className="text-xl font-black text-slate-800 mb-1.5 group-hover:text-sky-600 transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    {game.description}
                  </p>
                </div>

                {/* Play Button */}
                <div className="mt-4 pt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playClick();
                      onSelectGame(game.id);
                    }}
                    className={`w-full py-3 px-6 rounded-full font-bold text-white shadow-md group-hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r ${game.gradient} group-hover:opacity-95`}
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>العب الآن</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Safe learning note for kids and families */}
        <div className="mt-14 bg-white/70 backdrop-blur-xs rounded-2xl p-6 border border-sky-100 text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-sky-800 font-extrabold text-base mb-1">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>بيئة تعليمية آمنة وممتعة بنسبة 100%</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            تساعد الألعاب في تنمية الملاحظة، الذاكرة، مهارات الحساب الأولية، وحفظ الحروف العربية والإنجليزية بدون إعلانات مزعجة.
          </p>
        </div>
      </main>

      {/* Footer matching original */}
      <footer className="bg-slate-900 text-slate-300 text-center py-6 px-4 mt-auto border-t border-slate-800 text-xs sm:text-sm font-medium">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>&copy; 2025 ستار فل بالعربي - جميع الحقوق محفوظة</p>
          <p className="text-slate-400">منصة تعليمية تفاعلية مبسطة للأطفال الصغار</p>
        </div>
      </footer>
    </div>
  );
};

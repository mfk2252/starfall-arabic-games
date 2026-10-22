import React from 'react';
import { Link } from 'react-router-dom';
import { GAMES_LIST } from '../data/games';
import { GameCard } from '../components/ui/GameCard';
import { useLanguage } from '../i18n/LanguageContext';
import { sound } from '../utils/audio';
import { Sparkles, ArrowRight, ArrowLeft, Trophy, ShieldCheck, Heart, Compass } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { t, language } = useLanguage();
  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  const featuredGames = GAMES_LIST.filter((g) => g.featured);
  const newGames = GAMES_LIST.filter((g) => g.isNew);

  const categories = [
    { id: 'numbers', title: t('categoryNames.numbers'), desc: t('categoryDescriptions.numbers'), icon: '🔢', color: 'from-[#4fc3f7] to-[#0288d1]' },
    { id: 'letters', title: t('categoryNames.letters'), desc: t('categoryDescriptions.letters'), icon: '🔤', color: 'from-[#81c784] to-[#2e7d32]' },
    { id: 'words', title: t('categoryNames.words'), desc: t('categoryDescriptions.words'), icon: '📝', color: 'from-[#ff8a65] to-[#d84315]' },
    { id: 'visual', title: t('categoryNames.visual'), desc: t('categoryDescriptions.visual'), icon: '🧩', color: 'from-[#ce93d8] to-[#8e24aa]' },
    { id: 'logic', title: t('categoryNames.logic'), desc: t('categoryDescriptions.logic'), icon: '🔄', color: 'from-[#00b4d8] to-[#0077b6]' },
    { id: 'science', title: t('categoryNames.science'), desc: t('categoryDescriptions.science'), icon: '🌸', color: 'from-[#f48fb1] to-[#ab47bc]' },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#4fc3f7] via-[#29b6f6] to-[#0288d1] text-white py-12 sm:py-16 px-4 shadow-xl relative overflow-hidden">
        {/* Twinkling ambient stars */}
        <div className="absolute top-6 right-12 text-3xl sm:text-4xl animate-twinkle opacity-80">⭐</div>
        <div className="absolute bottom-6 left-12 text-3xl sm:text-4xl animate-twinkle opacity-80" style={{ animationDelay: '1s' }}>⭐</div>
        <div className="absolute top-1/2 left-1/4 text-2xl animate-twinkle opacity-40" style={{ animationDelay: '0.6s' }}>✨</div>

        <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold border border-white/30 text-white shadow-xs mb-4">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{language === 'ar' ? '١٨ لعبة تفاعلية للأطفال الصغار' : '18 Engaging Educational Games'}</span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-black mb-4 tracking-tight flex items-center justify-center gap-3 drop-shadow-md">
            <span className="animate-twinkle inline-block text-amber-300">⭐</span>
            <span>{t('appName')}</span>
            <span className="animate-twinkle inline-block text-amber-300" style={{ animationDelay: '0.8s' }}>⭐</span>
          </h1>

          <p className="text-base sm:text-2xl font-bold opacity-95 text-sky-50 max-w-2xl leading-relaxed mb-8">
            {t('heroTagline')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/games"
              onClick={() => sound.playClick()}
              className="bg-amber-400 hover:bg-amber-300 text-amber-950 px-8 py-4 rounded-full font-black text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 border-2 border-amber-300"
            >
              <span>{t('startLearning')}</span>
              <ArrowIcon className="w-5 h-5" />
            </Link>

            <Link
              to="/categories"
              onClick={() => sound.playClick()}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-4 rounded-full font-bold text-base shadow-md backdrop-blur-md transition-all border border-white/40 flex items-center gap-2"
            >
              <Compass className="w-5 h-5" />
              <span>{t('categories')}</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-16">
        {/* Learning Categories Grid */}
        <section id="categories">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center gap-2.5">
                <span className="text-3xl">📚</span>
                <span>{t('categories')}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
                {language === 'ar' ? 'اختر مجال التعلم الذي يفضله طفلك اليوم' : 'Choose a learning domain for your child today'}
              </p>
            </div>
            <Link
              to="/categories"
              onClick={() => sound.playClick()}
              className="text-xs sm:text-sm font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              <span>{language === 'ar' ? 'عرض الكل' : 'View All'}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/categories/${cat.id}`}
                onClick={() => sound.playClick()}
                className="bg-white rounded-3xl p-4 text-center border border-slate-100 shadow-sm hover:shadow-xl transition-all transform hover:-translate-y-1 group flex flex-col items-center justify-between"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} text-white flex items-center justify-center text-3xl shadow-md group-hover:scale-110 transition-transform mb-2`}>
                  {cat.icon}
                </div>
                <h3 className="font-black text-sm text-slate-800 group-hover:text-sky-600 transition-colors mb-1">
                  {cat.title}
                </h3>
                <span className="text-[11px] text-slate-500 line-clamp-1">
                  {cat.desc}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Games Section */}
        <section id="featured-games">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center gap-2.5">
                <span className="text-3xl">⭐</span>
                <span>{t('featuredGames')}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
                {language === 'ar' ? 'ألعاب محبوبة وموصى بها للمبتدئين' : 'Beloved games recommended for young learners'}
              </p>
            </div>
            <Link
              to="/games"
              onClick={() => sound.playClick()}
              className="text-xs sm:text-sm font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              <span>{language === 'ar' ? 'جميع الألعاب (18)' : 'All Games (18)'}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        {/* New Educational Activities Section */}
        <section id="new-activities">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-0.5 rounded-full mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'أنشطة جديدة ومبتكرة' : 'New Activities Added'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
                {language === 'ar' ? 'ألعاب التفكير والأنماط والمشاعر' : 'Logic, Patterns & Emotional Learning'}
              </h2>
            </div>
            <Link
              to="/games"
              onClick={() => sound.playClick()}
              className="text-xs sm:text-sm font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              <span>{language === 'ar' ? 'تصفح الكل' : 'Browse All'}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        {/* Achievement Banner */}
        <section className="bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 rounded-3xl p-6 sm:p-8 text-amber-950 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border-4 border-amber-300">
          <div className="flex items-center gap-4 text-center sm:text-start">
            <div className="w-18 h-18 rounded-2xl bg-white/30 backdrop-blur-md flex items-center justify-center text-4xl shadow-md shrink-0">
              <Trophy className="w-10 h-10 text-amber-950" />
            </div>
            <div>
              <h3 className="text-2xl font-black mb-1">
                {language === 'ar' ? 'اجمع النجوم واحتفل بإنجازاتك!' : 'Collect Stars & Celebrate Achievements!'}
              </h3>
              <p className="text-sm font-bold text-amber-900 max-w-lg leading-relaxed">
                {language === 'ar'
                  ? 'كل لعبة تكملها تمنحك حتى 3 نجوم ذهبية في سجل إنجازاتك الشخصي!'
                  : 'Every completed game awards you up to 3 golden stars in your personal badge board!'}
              </p>
            </div>
          </div>
          <Link
            to="/progress"
            onClick={() => sound.playClick()}
            className="bg-white hover:bg-amber-50 text-amber-950 px-6 py-3 rounded-full font-black text-base shadow-md transition-all transform hover:scale-105 shrink-0"
          >
            {t('myProgress')}
          </Link>
        </section>

        {/* Child Safety and Pedagogy Banner */}
        <section className="bg-white rounded-3xl p-8 border border-sky-100 shadow-md text-center max-w-3xl mx-auto">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">
            {t('safeChildEnvironment')}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium mb-4">
            {t('safeChildDesc')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-500">
            <span className="flex items-center gap-1">✨ {language === 'ar' ? 'بدون إعلانات' : 'Zero Ads'}</span>
            <span className="flex items-center gap-1">🔒 {language === 'ar' ? 'بدون جمع بيانات' : 'Zero Tracking'}</span>
            <span className="flex items-center gap-1">🎵 {language === 'ar' ? 'مؤثرات صوتية هادئة' : 'Safe Audio'}</span>
            <span className="flex items-center gap-1">❤️ {language === 'ar' ? 'تشجيع مستمر' : 'Encouraging'}</span>
          </div>
        </section>
      </div>
    </div>
  );
};

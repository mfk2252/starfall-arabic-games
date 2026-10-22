import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import { ShieldCheck, Heart, Sparkles, BookOpen } from 'lucide-react';
import { sound } from '../../utils/audio';

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 px-4 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
          {/* Brand Col */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">⭐</span>
              <span className="text-xl font-black text-white">{t('appName')}</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed font-normal mb-4 max-w-sm">
              {t('appSubtitle')}. {t('footerSubtitle')}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800/40 w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>{language === 'ar' ? 'خالٍ تماماً من الإعلانات ومن التتبع' : 'Zero Ads, Zero Tracking'}</span>
            </div>
          </div>

          {/* Quick Links Col */}
          <div>
            <h4 className="text-white font-extrabold text-base mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{language === 'ar' ? 'روابط سريعة' : 'Quick Navigation'}</span>
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/games"
                  onClick={() => sound.playClick()}
                  className="hover:text-sky-400 transition-colors"
                >
                  {t('allGames')} (18)
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  onClick={() => sound.playClick()}
                  className="hover:text-sky-400 transition-colors"
                >
                  {t('categories')} (6)
                </Link>
              </li>
              <li>
                <Link
                  to="/progress"
                  onClick={() => sound.playClick()}
                  className="hover:text-sky-400 transition-colors"
                >
                  {t('myProgress')}
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  onClick={() => sound.playClick()}
                  className="hover:text-sky-400 transition-colors"
                >
                  {t('about')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Pedagogical Note */}
          <div>
            <h4 className="text-white font-extrabold text-base mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>{language === 'ar' ? 'رؤيتنا التعليمية' : 'Our Educational Vision'}</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-normal mb-3">
              {language === 'ar'
                ? 'تهدف المنصة إلى تمكين الأطفال في مرحلة الطفولة المبكرة من اكتساب المهارات الذهنية واللغوية والحسابية عن طريق اللعب والاستكشاف البصري الإيجابي دون ضغوط.'
                : 'Empowering young children to build cognitive, language, and math skills through safe, joyful, play-based exploration without stress.'}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>{language === 'ar' ? 'صُنعت بحب لأجل براعمنا الصغار' : 'Crafted with love for young learners'}</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 text-center sm:text-start">
          <p>&copy; 2026 {t('footerRights')}</p>
          <p>{language === 'ar' ? 'نسخة تفاعلية احترافية مبنية بـ React & TypeScript' : 'Professional interactive suite built with React & TypeScript'}</p>
        </div>
      </div>
    </footer>
  );
};

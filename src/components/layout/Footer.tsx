import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import { ShieldCheck, Heart, Sparkles, BookOpen, ExternalLink, Stethoscope, Award } from 'lucide-react';
import { sound } from '../../utils/audio';

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();
  const officialPortfolioUrl = 'https://mfekry.vercel.app/';

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 px-4 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          {/* Brand Col */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">⭐</span>
              <span className="text-xl font-black text-white">{t('appName')}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal mb-4">
              {t('appSubtitle')}. {t('footerSubtitle')}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800/40 w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>{language === 'ar' ? 'بيئة آمنة: خالية من الإعلانات والتتبع' : 'Zero Ads, Zero Tracking'}</span>
            </div>
          </div>

          {/* Quick Links Col */}
          <div>
            <h4 className="text-white font-extrabold text-sm sm:text-base mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{language === 'ar' ? 'أقسام المنصة' : 'Sections'}</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
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
                  to="/stories"
                  onClick={() => sound.playClick()}
                  className="hover:text-sky-400 transition-colors"
                >
                  {t('stories')}
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

          {/* Consultation Col */}
          <div>
            <h4 className="text-white font-extrabold text-sm sm:text-base mb-4 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-sky-400" />
              <span>{t('consultation')}</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-normal mb-3">
              {language === 'ar'
                ? 'استشارات متخصصة في تقييم النطق والتخاطب وتأخر اللغة والتربية الخاصة للأطفال.'
                : 'Specialized consultations in speech evaluation, early intervention, and special education.'}
            </p>
            <Link
              to="/consultation"
              onClick={() => sound.playClick()}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-800/40"
            >
              <span>{t('bookConsultation')}</span>
              <span className="text-sm">←</span>
            </Link>
          </div>

          {/* Founder Tribute Col */}
          <div>
            <h4 className="text-white font-extrabold text-sm sm:text-base mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>{language === 'ar' ? 'المؤسس والإشراف العلمي' : 'Founder & Leadership'}</span>
            </h4>
            <p className="text-xs text-slate-300 font-bold mb-1">
              {language === 'ar' ? 'محمد فكري الكفافي' : 'Mohamed Fekry El-Kafafi'}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed font-normal mb-3">
              {language === 'ar'
                ? 'أخصائي التربية الخاصة والتخاطب وتطوير الحلول التعليمية للأطفال (خبرة +9 سنوات).'
                : 'Special Education & Speech Therapist and EdTech Developer (9+ years exp).'}
            </p>
            <a
              href={officialPortfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
            >
              <span>{language === 'ar' ? 'زيارة الموقع الرسمي للأخصائي' : 'Visit Official Website'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 text-center sm:text-start">
          <p>&copy; 2026 {t('footerRights')}</p>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>{language === 'ar' ? 'صُممت بعناية ومحبة لأجل كل طفل عربي' : 'Crafted with care and love for every child'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

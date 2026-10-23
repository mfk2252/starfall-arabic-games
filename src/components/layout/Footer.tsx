import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Globe, ExternalLink, Shield, FileText, Sparkles, MessageCircleHeart } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { sound } from '../../utils/audio';

export const Footer: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();
  const year = new Date().getFullYear();

  const brandName = language === 'ar' ? 'منصة تالين' : 'TALEEN Platform';

  return (
    <footer className="bg-white/80 dark:bg-[#180816]/90 border-t border-pink-100 dark:border-pink-950/60 mt-auto transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-heading text-2xl font-black text-pink-600 dark:text-pink-300">
                {brandName}
              </span>
              <span className="bg-pink-100 dark:bg-pink-950/80 text-pink-700 dark:text-pink-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
                {language === 'ar' ? 'ألعاب تعليمية للأطفال' : 'Arabic Kids Learning'}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-pink-200/80 leading-relaxed max-w-md">
              {language === 'ar'
                ? 'منصة تعليمية عربية تفاعلية مصممة خصيصاً للأطفال لتنمية مهارات التفكير، الحساب، اللغة، والذكاء بطرق ممتعة وآمنة.'
                : 'Interactive Arabic educational platform designed for children to develop logic, math, language, and intelligence skills safely.'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-heading font-black text-sm text-pink-900 dark:text-pink-200 uppercase tracking-wider">
              {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/games"
                  onClick={() => sound.playClick()}
                  className="text-slate-600 dark:text-pink-200/80 hover:text-pink-600 dark:hover:text-pink-300 transition-colors"
                >
                  {language === 'ar' ? 'جميع الألعاب' : 'All Games'}
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  onClick={() => sound.playClick()}
                  className="text-slate-600 dark:text-pink-200/80 hover:text-pink-600 dark:hover:text-pink-300 transition-colors"
                >
                  {language === 'ar' ? 'الأقسام التعليمية' : 'Categories'}
                </Link>
              </li>
              <li>
                <Link
                  to="/stories"
                  onClick={() => sound.playClick()}
                  className="text-slate-600 dark:text-pink-200/80 hover:text-pink-600 dark:hover:text-pink-300 transition-colors"
                >
                  {language === 'ar' ? 'القصص والأنشطة' : 'Stories & Activities'}
                </Link>
              </li>
              <li>
                <Link
                  to="/methodology"
                  onClick={() => sound.playClick()}
                  className="text-slate-600 dark:text-pink-200/80 hover:text-pink-600 dark:hover:text-pink-300 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                  <span>{language === 'ar' ? 'المنهجية التعليمية' : 'Educational Methodology'}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/consultation"
                  onClick={() => sound.playClick()}
                  className="text-slate-600 dark:text-pink-200/80 hover:text-pink-600 dark:hover:text-pink-300 transition-colors flex items-center gap-1.5"
                >
                  <MessageCircleHeart className="w-3.5 h-3.5 text-rose-500" />
                  <span>{language === 'ar' ? 'استشارة الوالدين' : 'Parent Consultation'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Language */}
          <div className="space-y-3">
            <h4 className="font-heading font-black text-sm text-pink-900 dark:text-pink-200 uppercase tracking-wider">
              {language === 'ar' ? 'الأمان والخصوصية' : 'Safety & Legal'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/privacy"
                  onClick={() => sound.playClick()}
                  className="text-slate-600 dark:text-pink-200/80 hover:text-pink-600 dark:hover:text-pink-300 transition-colors flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-pink-500" />
                  <span>{language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  onClick={() => sound.playClick()}
                  className="text-slate-600 dark:text-pink-200/80 hover:text-pink-600 dark:hover:text-pink-300 transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-pink-500" />
                  <span>{language === 'ar' ? 'الشروط والأحكام' : 'Terms of Service'}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  onClick={() => sound.playClick()}
                  className="text-slate-600 dark:text-pink-200/80 hover:text-pink-600 dark:hover:text-pink-300 transition-colors"
                >
                  {language === 'ar' ? 'عن المنصة' : 'About Platform'}
                </Link>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={() => {
                  sound.playClick();
                  toggleLanguage();
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-pink-200 dark:border-pink-900/60 text-xs font-bold text-slate-700 dark:text-pink-200 hover:bg-pink-50 dark:hover:bg-pink-950/60 transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-pink-600 dark:text-pink-300" />
                <span>{language === 'ar' ? 'English' : 'العربية'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-pink-100 dark:border-pink-950/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-pink-300/70">
          <div className="flex items-center gap-1">
            <span>© {year} {brandName}.</span>
            <span>{language === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{language === 'ar' ? 'صنع بحب للطفلة تالين' : 'Made with love for Taleen'}</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
};

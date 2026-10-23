import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { sound } from '../utils/audio';
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Smile,
  Zap,
  Volume2,
  ArrowRight,
  ArrowLeft,
  Gamepad2,
  Ban
} from 'lucide-react';
import { ButterflyIcon } from '../components/common/ButterflyIcon';

export const SelfLearningPage: React.FC = () => {
  const { language } = useLanguage();
  const brandName = language === 'ar' ? 'تالين' : 'TALEEN';
  const BackIcon = language === 'ar' ? ArrowRight : ArrowLeft;

  const features = [
    {
      icon: Ban,
      title: language === 'ar' ? 'خالٍ تماماً من الإعلانات' : '100% Ad-Free Environment',
      desc: language === 'ar'
        ? 'لا توجد أي إعلانات مزعجة أو نصوص برمجية لتتبع سلوك الطفل، مما يمنحه تركيزاً كاملاً أثناء التعلم.'
        : 'Zero pop-ups, ads, or tracking scripts, ensuring complete focus and distraction-free learning.',
      color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900',
    },
    {
      icon: Smile,
      title: language === 'ar' ? 'مصمم خصيصاً للاستخدام المستقل' : 'Intuitive Independent Navigation',
      desc: language === 'ar'
        ? 'أيقونات وأزرار واضحة الحجم وأحرف كبيرة تناسب أصابع وأيدي الأطفال وتسمح لهم باختيار اللعبة بنقرة واحدة.'
        : 'Large tactile cards and visual cues designed specifically for young hands to explore independently.',
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900',
    },
    {
      icon: Volume2,
      title: language === 'ar' ? 'تعزيز صوتي ونطق واضح' : 'Clear Audio & Vocal Feedback',
      desc: language === 'ar'
        ? 'تفاعل صوتي مشجع ونطق سليمان للحروف والأرقام باللغتين العربية والإنجليزية لدعم التعلم الاستماعي.'
        : 'Encouraging spoken feedback and clear letter/number pronunciation supporting auditory learning.',
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900',
    },
    {
      icon: Zap,
      title: language === 'ar' ? 'استجابة فورية بدون تعقيد' : 'Instant Single-Tap Play',
      desc: language === 'ar'
        ? 'وصول مباشر إلى جميع الألعاب والأنشطة دون الحاجة لتسجيل حسابات أو خطوات دخول طويلة.'
        : 'Direct 1-tap access to all 18 educational games and interactive stories without registration walls.',
      color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-900',
    },
  ];

  return (
    <div className="flex-1 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex flex-col gap-8">
      {/* Navigation Breadcrumb */}
      <div>
        <Link
          to="/"
          onClick={() => sound.playClick()}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-sky-600 dark:text-sky-400 hover:underline"
        >
          <BackIcon className="w-4 h-4" />
          <span>{language === 'ar' ? 'العودة إلى الصفحة الرئيسية' : 'Back to Home'}</span>
        </Link>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-sky-600 dark:from-slate-900 dark:via-emerald-950 dark:to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-start">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md p-2 flex items-center justify-center shrink-0 shadow-inner">
              <ButterflyIcon className="w-11 h-11 object-contain" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-4xl font-black">
                  {language === 'ar' ? 'التعلم الذاتي دون إعلانات' : 'Ad-Free Self-Learning Environment'}
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100 dark:text-emerald-200 mt-2 max-w-2xl">
                {language === 'ar'
                  ? `صُممت منصة ${brandName} لتكون بيئة رقمية آمنة بنسبة ١٠٠٪ تتيح للطفل الاستكشاف والتعلم بمفرده بثقة وأمان.`
                  : `${brandName} is crafted as a 100% child-safe digital haven empowering young learners to explore independently.`}
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20">
            <ShieldCheck className="w-8 h-8 text-emerald-200" />
            <div className="text-xs">
              <p className="font-black text-emerald-200">{language === 'ar' ? 'بيئة آمنة معتمدة' : 'Verified Child-Safe'}</p>
              <p className="text-slate-200">{language === 'ar' ? 'بدون تتبع أو إعلانات' : 'No Tracking or Ads'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {features.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-[#0b1329] rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-4 items-start"
            >
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-xs ${item.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-base sm:text-lg text-slate-800 dark:text-slate-100 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Section */}
      <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Gamepad2 className="w-10 h-10 text-sky-500 shrink-0" />
          <div>
            <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
              {language === 'ar' ? 'جاهز لبدء رحلة التعلم الذاتي؟' : 'Ready to begin self-learning?'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'ar'
                ? 'استكشف الآن ألعاب الحروف والأرقام والذاكرة والتفكير والقصص'
                : 'Explore letters, numbers, memory, logic games, and interactive stories now.'}
            </p>
          </div>
        </div>
        <Link
          to="/games"
          onClick={() => sound.playClick()}
          className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-full text-xs sm:text-sm font-black whitespace-nowrap shadow-md transition-transform hover:scale-105 active:scale-95"
        >
          {language === 'ar' ? 'تصفح جميع الألعاب' : 'Browse All Games'}
        </Link>
      </div>
    </div>
  );
};

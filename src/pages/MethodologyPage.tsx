import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { sound } from '../utils/audio';
import {
  Brain,
  Sparkles,
  Award,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Heart,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Puzzle,
  Lightbulb
} from 'lucide-react';
import { ButterflyIcon } from '../components/common/ButterflyIcon';

export const MethodologyPage: React.FC = () => {
  const { language } = useLanguage();
  const brandName = language === 'ar' ? 'تالين' : 'TALEEN';
  const BackIcon = language === 'ar' ? ArrowRight : ArrowLeft;

  const pillars = [
    {
      icon: Brain,
      title: language === 'ar' ? 'التنمية المعرفية والتفكير المنطقي' : 'Cognitive Development & Logic',
      desc: language === 'ar'
        ? 'تعتمد ألعابنا على تحفيز خلايا الدماغ والتسلسل المنطقي من خلال حل الألغاز واكتشاف الأنماط بدلاً من التلقين الحفظي.'
        : 'Our games stimulate brain development and logical sequencing through puzzle-solving and pattern recognition instead of rote memorization.',
      bg: 'from-sky-500 to-indigo-500',
    },
    {
      icon: Puzzle,
      title: language === 'ar' ? 'التعلم القائم على اللعب التفاعلي' : 'Game-Based Experiential Learning',
      desc: language === 'ar'
        ? 'يتعلم الطفل المفهوم العلمي أو اللغوي أثناء خوض تجربة ممتعة وتفاعلية مع التعزيز الصوتي والبصري الإيجابي.'
        : 'Children grasp scientific and linguistic concepts while engaging in fun interactive play with positive auditory and visual feedback.',
      bg: 'from-amber-500 to-orange-500',
    },
    {
      icon: Heart,
      title: language === 'ar' ? 'البيئة الآمنة وخصائص الطفولة المبكرة' : 'Child-Centered Safe Environment',
      desc: language === 'ar'
        ? 'تصميم خالٍ تماماً من الإعلانات والمشتريات والروابط الخارجية الضارة، ومناسب لبناء الاستقلالية لدى الطفل.'
        : 'A completely ad-free, distraction-free environment with no in-app purchases, tailored to foster child autonomy.',
      bg: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Lightbulb,
      title: language === 'ar' ? 'التدرج في مستويات الصعوبة' : 'Scaffolded Skill Progression',
      desc: language === 'ar'
        ? 'تتدرج التحديات من الأساسيات البسيطة (مثل التعرف على الأشكال والحروف) إلى المهارات الأكثر تعقيداً كالعد والتركيب.'
        : 'Challenges scale smoothly from simple fundamentals (letter/shape recognition) to complex counting and reasoning tasks.',
      bg: 'from-purple-500 to-pink-500',
    },
  ];

  const goals = [
    language === 'ar' ? 'تعزيز الحصيلة اللغوية والنطق السليم للحروف العربية والإنجليزية.' : 'Enhance vocabulary and proper pronunciation in Arabic and English.',
    language === 'ar' ? 'تطوير مهارات التآزر البصري الحركي والدقة في الملاحظة.' : 'Develop hand-eye coordination and visual discrimination skills.',
    language === 'ar' ? 'تنمية مهارات الحساب الذهني المبكر والمفاهيم الرياضية الأساسية.' : 'Build early mental math and foundational mathematical reasoning.',
    language === 'ar' ? 'تحفيز حب الاستكشاف وتطوير مهارات حل المشكلات لدى الطفل.' : 'Cultivate curiosity and problem-solving skills in early childhood.',
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

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 dark:from-slate-900 dark:via-sky-950 dark:to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-start">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md p-2 flex items-center justify-center shrink-0 shadow-inner">
              <ButterflyIcon className="w-11 h-11 object-contain" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-4xl font-black">
                  {language === 'ar' ? 'منهجية التعليم في تالين' : 'Taleen Educational Methodology'}
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-sky-100 dark:text-sky-200 mt-2 max-w-2xl">
                {language === 'ar'
                  ? 'رؤية تربوية حديثة تدمج بين علوم تطور الطفل المبكر والتفاعل الممتع لتوفير بيئة تعليمية آمنة ومثمرة.'
                  : 'A modern pedagogical framework integrating early childhood development research with interactive fun in a safe digital space.'}
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20">
            <GraduationCap className="w-8 h-8 text-amber-300" />
            <div className="text-xs">
              <p className="font-black text-amber-300">{language === 'ar' ? 'معايير تربوية' : 'Pedagogical Standard'}</p>
              <p className="text-slate-200">{language === 'ar' ? 'للأعمار من ٢ إلى ٧ سنوات' : 'For ages 2-7 yrs'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Methodological Pillars */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-amber-500" />
          <span>{language === 'ar' ? 'ركائز المنهجية التعليمية' : 'Key Methodological Pillars'}</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-[#0b1329] rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-4 items-start"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${pillar.bg} text-white flex items-center justify-center shrink-0 shadow-md`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-slate-800 dark:text-slate-100 mb-1">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Target Educational Goals */}
      <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="w-6 h-6 text-sky-500" />
          <span>{language === 'ar' ? 'الأهداف التعليمية المكتسبة' : 'Educational Outcomes'}</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {goals.map((goal, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
                {goal}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Parent & Educator Commitment */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="flex items-center gap-4">
          <ShieldCheck className="w-12 h-12 text-emerald-100 shrink-0" />
          <div>
            <h3 className="font-black text-lg sm:text-xl">
              {language === 'ar' ? 'التزامنا تجاه أولياء الأمور والمعلمين' : 'Our Commitment to Parents & Educators'}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1">
              {language === 'ar'
                ? `نوفر في ${brandName} بيئة موثوقة تحترم خصوصية الطفل وتمنحه تجربة تعلم ذاتي آمنة وفعالة.`
                : `At ${brandName}, we build a trusted environment that protects child privacy and fosters confident self-learning.`}
            </p>
          </div>
        </div>
        <Link
          to="/consultation"
          onClick={() => sound.playClick()}
          className="bg-white text-emerald-700 hover:bg-emerald-50 px-5 py-3 rounded-full text-xs sm:text-sm font-black whitespace-nowrap shadow-sm transition-transform hover:scale-105 active:scale-95"
        >
          {language === 'ar' ? 'احجز استشارة متخصصة' : 'Book Specialized Consultation'}
        </Link>
      </div>
    </div>
  );
};

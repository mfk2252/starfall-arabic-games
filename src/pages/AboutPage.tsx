import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { ShieldCheck, Sparkles, BookOpen, Heart, Brain, Lightbulb, Users, CheckCircle } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { t, language } = useLanguage();

  const principles = [
    {
      title: language === 'ar' ? 'التعلم القائم على اللعب' : 'Play-Based Learning',
      desc: language === 'ar'
        ? 'الألعاب مصممة لتحويل المفاهيم المجردة (الحروف، الأعداد، الأنماط) إلى تجارب تفاعلية مرحة تثير فضول الطفل.'
        : 'Games transform abstract concepts (letters, numbers, patterns) into joyful tangible interactions that spark curiosity.',
      icon: Sparkles,
      color: 'text-amber-500 bg-amber-50',
    },
    {
      title: language === 'ar' ? 'التعزيز الإيجابي بدون إحباط' : 'Positive Reinforcement',
      desc: language === 'ar'
        ? 'لا توجد عقوبات قاسية عند الخطأ؛ بل يتم تقديم تلميحات مشجعة ولطيفة تدعو الطفل لإعادة المحاولة بثقة.'
        : 'Zero punitive failures; gentle hints and supportive feedback empower children to retry with confidence.',
      icon: Heart,
      color: 'text-rose-500 bg-rose-50',
    },
    {
      title: language === 'ar' ? 'تنمية الذكاء الشامل' : 'Holistic Cognitive Growth',
      desc: language === 'ar'
        ? 'لا تقتصر المنصة على الحفظ، بل تعزز التفكير المنطقي، التمييز البصري، الإدراك المكاني، والذكاء العاطفي.'
        : 'Goes beyond rote memorization to nurture logical reasoning, visual distinction, spatial skills, and emotional empathy.',
      icon: Brain,
      color: 'text-sky-500 bg-sky-50',
    },
    {
      title: language === 'ar' ? 'الخصوصية والأمان التام' : '100% Privacy & Safety',
      desc: language === 'ar'
        ? 'المنصة خالية من الإعلانات، ولا تتطلب تسجيل حساب، ولا تجمع أي بيانات شخصية عن الطفل أو أسرته.'
        : 'Zero ads, no account registration required, and zero personal data collection from young children.',
      icon: ShieldCheck,
      color: 'text-emerald-500 bg-emerald-50',
    },
  ];

  const parentTips = [
    language === 'ar'
      ? 'اجلس بجانب طفلك وشجعه على التعبير بصوت عالٍ عما يراه في الشاشة.'
      : 'Sit alongside your child and encourage them to vocalize what they observe.',
    language === 'ar'
      ? 'امدح المحاولة والجهد وليس فقط الإجابة الصحيحة لتعزيز عقلية النمو.'
      : 'Praise effort and exploration rather than solely correct answers.',
    language === 'ar'
      ? 'حدد فترات استخدام مريحة (15-20 دقيقة لكل جلسة) حفاظاً على صحة عيني الطفل.'
      : 'Keep sessions balanced (15-20 minutes) to maintain focus and eye health.',
    language === 'ar'
      ? 'اربط مفاهيم اللعبة بحياتكم اليومية، مثل عد الفواكه أو ملاحظة فصول السنة أثناء النزهة.'
      : 'Connect game concepts to daily life, such as counting fruits or discussing the weather.',
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 bg-sky-100 px-3.5 py-1 rounded-full mb-3">
          <BookOpen className="w-3.5 h-3.5 text-sky-600" />
          <span>{language === 'ar' ? 'دليل أولياء الأمور والمعلمين' : 'Guide for Parents & Educators'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 mb-2">
          {language === 'ar' ? 'عن منصة ستار فل بالعربي' : 'About Starfall Arabic'}
        </h1>
        <p className="text-sm text-slate-600 font-medium leading-relaxed">
          {language === 'ar'
            ? 'مبادرة تربوية تقنية لإثراء المحتوى التعليمي الرقمي للأطفال باللغة العربية بجودة عالمية وتجربة مستخدم مخصصة'
            : 'An educational software initiative empowering digital learning for children in Arabic with world-class pedagogical design'}
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {principles.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div key={idx} className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-100 flex gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${p.color}`}>
                <Icon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800 mb-1.5">{p.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">{p.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Parent Tips Box */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-6 h-6 text-amber-600" />
          <h2 className="text-xl font-black text-amber-950">
            {language === 'ar' ? 'نصائح مقترحة لأولياء الأمور والمعلمات' : 'Tips for Parents & Teachers'}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {parentTips.map((tip, idx) => (
            <div key={idx} className="flex items-start gap-2.5 bg-white/80 p-3.5 rounded-2xl border border-amber-200/60">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 text-center">
        <h3 className="text-lg font-black text-slate-800 mb-2">
          {language === 'ar' ? 'الهندسة التقنية للمنصة' : 'Technical Specifications'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mb-6 max-w-xl mx-auto">
          {language === 'ar'
            ? 'مبنية وفق أحدث معايير هندسة الويب لتوفير سرعة تحميل فائقة وتوافق تام مع مختلف الأجهزة والشاشات'
            : 'Built with modern web engineering standards for instant loading and full cross-device responsiveness'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-slate-700">
          <span className="bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">⚛️ React 19</span>
          <span className="bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">🔷 TypeScript</span>
          <span className="bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">⚡ Vite</span>
          <span className="bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">🎨 Tailwind CSS v4</span>
          <span className="bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">🧭 React Router v7</span>
          <span className="bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">🧪 Vitest</span>
        </div>
      </div>
    </div>
  );
};

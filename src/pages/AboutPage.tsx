import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { sound } from '../utils/audio';
import {
  ShieldCheck,
  Sparkles,
  BookOpen,
  Heart,
  Brain,
  Lightbulb,
  Award,
  CheckCircle,
  ExternalLink,
  Stethoscope,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { language } = useLanguage();
  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;
  const officialPortfolioUrl = 'https://mfekry.vercel.app/';

  const principles = [
    {
      title: language === 'ar' ? 'التعلم القائم على اللعب والاستكشاف' : 'Play-Based Discovery',
      desc: language === 'ar'
        ? 'تحويل المفاهيم المجردة (الحروف، الأعداد، الأنماط، العلوم) إلى تجارب تفاعلية مرحة تثير فضول الطفل الفطري وتنمي استيعابه.'
        : 'Games transform abstract concepts (letters, numbers, patterns, science) into joyful tangible interactions that spark curiosity.',
      icon: Sparkles,
      color: 'text-amber-500 bg-amber-50',
    },
    {
      title: language === 'ar' ? 'التعزيز الإيجابي بدون إحباط' : 'Positive Reinforcement',
      desc: language === 'ar'
        ? 'لا توجد عقوبات قاسية أو شاشات فشل؛ بل يتم تقديم تلميحات مشجعة ولطيفة تدعو الطفل لإعادة المحاولة بثقة واعتزاز.'
        : 'Zero punitive failures; gentle hints and supportive feedback empower children to retry with confidence.',
      icon: Heart,
      color: 'text-rose-500 bg-rose-50',
    },
    {
      title: language === 'ar' ? 'تنمية الذكاء الشامل والتواصل' : 'Holistic Cognitive & Speech Growth',
      desc: language === 'ar'
        ? 'تصميم أنشطة تستهدف التمييز البصري، الإدراك السمعي، التركيز، وتطور النطق والتعبير اللغوي بأسس علمية وتربوية.'
        : 'Engineered activities targeting visual discrimination, auditory processing, attention, and expressive speech development.',
      icon: Brain,
      color: 'text-sky-500 bg-sky-50',
    },
    {
      title: language === 'ar' ? 'الخصوصية والأمان التام للطفل' : '100% Privacy & Child Safety',
      desc: language === 'ar'
        ? 'المنصة خالية من أي إعلانات، ولا تتطلب تسجيل حساب، ولا تجمع أي بيانات شخصية عن الطفل أو أسرته على الإطلاق.'
        : 'Zero advertisements, no account registration required, and absolutely zero personal data collection.',
      icon: ShieldCheck,
      color: 'text-emerald-500 bg-emerald-50',
    },
  ];

  const parentTips = [
    language === 'ar'
      ? 'اجلس بجانب طفلك وشجعه على التعبير بصوت عالٍ عما يراه في الشاشة لتطوير مفرداته.'
      : 'Sit alongside your child and encourage them to vocalize what they observe on screen.',
    language === 'ar'
      ? 'امدح المحاولة والجهد وليس فقط الإجابة الصحيحة لتعزيز عقلية النمو والفضول.'
      : 'Praise effort and exploration rather than solely correct answers.',
    language === 'ar'
      ? 'حدد فترات استخدام متوازنة (15-20 دقيقة لكل جلسة) حفاظاً على صحة عيني الطفل وتركيزه.'
      : 'Keep sessions balanced (15-20 minutes) to maintain focus and healthy screen habits.',
    language === 'ar'
      ? 'اربط مفاهيم الألعاب بالحياة اليومية، مثل عد الفواكه أو ملاحظة فصول السنة أثناء النزهة.'
      : 'Connect game concepts to daily life, such as counting fruits or discussing the seasons.',
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-100 dark:bg-sky-950/80 px-3.5 py-1 rounded-full mb-3 border border-sky-200 dark:border-sky-800">
          <BookOpen className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span>{language === 'ar' ? 'رؤيتنا ورسالتنا التربوية' : 'Our Pedagogical Mission'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white mb-2">
          {language === 'ar' ? 'عن منصة تالين | TALEEN' : 'About TALEEN Platform'}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          {language === 'ar'
            ? 'منصة عربية تفاعلية تجمع بين الألعاب التعليمية، والقصص المصورة، والأنشطة الإدراكية الهادفة لأطفال مرحلة ما قبل المدرسة والابتدائية'
            : 'An Arabic interactive educational platform uniting cognitive games, illustrated stories, and early development activities'}
        </p>
      </div>

      {/* Founder Section */}
      <div className="bg-gradient-to-br from-white to-sky-50/50 dark:from-[#0b1329] dark:to-slate-900/60 rounded-3xl p-6 sm:p-8 shadow-sm border border-sky-100 dark:border-slate-800 flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center text-5xl shadow-md shrink-0">
          👨‍⚕️
        </div>

        <div className="flex-1 text-center md:text-start space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-800 dark:text-sky-300 bg-sky-100 dark:bg-sky-950/60 px-3 py-1 rounded-full">
            <Award className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>{language === 'ar' ? 'مؤسس ومصمم المنصة' : 'Platform Founder & Designer'}</span>
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">
            {language === 'ar' ? 'محمد فكري الكفافي' : 'Mohamed Fekry El-Kafafi'}
          </h2>
          <p className="text-sm font-bold text-sky-700 dark:text-sky-400">
            {language === 'ar'
              ? 'أخصائي التربية الخاصة والتخاطب ومطور حلول تكنولوجيا التعليم الرقمية'
              : 'Special Education & Speech Therapist | EdTech Solutions Developer'}
          </p>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-2xl">
            {language === 'ar'
              ? 'انطلقت منصة «تالين» لتكون مساحة تعليمية آمنة ومدروسة تترجم خبرات التخاطب والتربية الخاصة إلى ألعاب ممتعة وقصص تنمي مدارك الطفل اللغوية والإدراكية دون أي ضغوط نفسية أو إعلانات.'
              : 'Taleen was created as a safe, pedagogically grounded digital space translating clinical speech and special education insights into playful cognitive activities and stories.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 justify-center md:justify-start">
            <a
              href={officialPortfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all hover:scale-105"
            >
              <span>{language === 'ar' ? 'الموقع الشخصي للأخصائي' : 'Specialist Official Website'}</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            </a>

            <Link
              to="/consultation"
              onClick={() => sound.playClick()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition-all hover:scale-105"
            >
              <Stethoscope className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'ar' ? 'حجز استشارة أو جلسة' : 'Book Consultation'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {principles.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div key={idx} className="bg-white dark:bg-[#0b1329] rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-100 dark:border-slate-800 flex gap-4 transition-colors">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${p.color} dark:bg-slate-800/60`}>
                <Icon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800 dark:text-white mb-1.5">{p.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{p.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Parent Tips Box */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-2 border-amber-200 dark:border-amber-900/60 rounded-3xl p-6 sm:p-8 transition-colors">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          <h2 className="text-xl font-black text-amber-950 dark:text-amber-200">
            {language === 'ar' ? 'نصائح مقترحة لأولياء الأمور والمعلمات' : 'Tips for Parents & Teachers'}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {parentTips.map((tip, idx) => (
            <div key={idx} className="flex items-start gap-2.5 bg-white/80 dark:bg-slate-900/40 p-3.5 rounded-2xl border border-amber-200/60 dark:border-amber-900/40">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="bg-white dark:bg-[#0b1329] rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800 text-center transition-colors">
        <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">
          {language === 'ar' ? 'الهندسة التقنية للمنصة' : 'Technical Specifications'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mb-6 max-w-xl mx-auto">
          {language === 'ar'
            ? 'مبنية وفق أحدث معايير هندسة الويب لتوفير سرعة استجابة فائقة، دعم شاشات اللمس، وتوافق تام عبر الهواتف والأجهزة اللوحية والحواسيب'
            : 'Built with modern web engineering standards for instant loading and full cross-device responsiveness'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <span className="bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">⚛️ React 19</span>
          <span className="bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">🔷 TypeScript</span>
          <span className="bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">⚡ Vite</span>
          <span className="bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">🎨 Tailwind CSS v4</span>
          <span className="bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">🧭 React Router v7</span>
          <span className="bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">🧪 Vitest</span>
        </div>
      </div>
    </div>
  );
};

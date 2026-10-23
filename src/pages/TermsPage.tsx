import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { sound } from '../utils/audio';
import {
  FileText,
  CheckCircle2,
  HelpCircle,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export const TermsPage: React.FC = () => {
  const { language } = useLanguage();
  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  const terms = [
    {
      title: language === 'ar' ? 'الاستخدام التعليمي والتربوي' : 'Educational Purpose',
      desc: language === 'ar'
        ? 'منصة تالين مصممة للاستخدام التعليمي المنزلي والتربوي للأطفال ومساعدتهم في تنمية المهارات اللغوية والإدراكية والحسابية من خلال اللعب.'
        : 'Taleen is designed for home educational and early developmental play, fostering language, cognitive, and arithmetic capabilities.'
    },
    {
      title: language === 'ar' ? 'الملكية الفكرية والمحتوى' : 'Intellectual Property',
      desc: language === 'ar'
        ? 'جميع الألعاب التفاعلية والقصص المصورة والبرمجيات مطورة برعاية وإشراف أخصائي التربية الخاصة والتخاطب محمد فكري الكفافي.'
        : 'All interactive games, illustrations, and software architectures are developed under the guidance of specialist Mohamed Fekry.'
    },
    {
      title: language === 'ar' ? 'دور ولي الأمر والمربي' : 'Parental Supervision',
      desc: language === 'ar'
        ? 'نشجع مشاركة أولياء الأمور لأطفالهم أثناء خوض الألعاب والقصص لتحقيق أقصى استفادة تفاعلية ولغوية.'
        : 'Parental co-play and guided engagement are warmly encouraged to maximize interactive learning and speech benefits.'
    },
    {
      title: language === 'ar' ? 'الاستشارات والجلسات' : 'Specialized Consultations',
      desc: language === 'ar'
        ? 'خدمات تقييم النطق والتخاطب والخطط العلاجية الفردية تُقدم عبر المنصة والموقع الرسمي المعتمد للأخصائي.'
        : 'Speech evaluation, diagnostic sessions, and individualized plans are delivered through the verified official portal.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb / Back button */}
        <div className="mb-6">
          <Link
            to="/"
            onClick={() => sound.playClick()}
            className="inline-flex items-center gap-2 text-sm font-bold text-sky-600 hover:text-sky-700 transition-colors"
          >
            <ArrowIcon className="w-4 h-4" />
            <span>{language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</span>
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 sm:p-10 mb-8">
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                {language === 'ar' ? 'شروط الاستخدام' : 'Terms of Use'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {language === 'ar' ? 'منصة تالين التعليمية • آخر تحديث: 2026' : 'Taleen Platform • Last updated: 2026'}
              </p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-600 leading-relaxed space-y-6">
            <p className="font-medium text-slate-700 bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4">
              {language === 'ar'
                ? 'مرحباً بكم في منصة تالين. باستخدامكم لهذه المنصة، فإنكم توافقون على الالتزام ببنود الاستخدام التعليمي الآمن والمصمم لمصلحة ونمو الطفل.'
                : 'Welcome to Taleen. By using this educational platform, you agree to these child-centered terms crafted for safe, enriching learning.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {terms.map((term, index) => (
                <div
                  key={index}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-indigo-300 transition-colors"
                >
                  <div className="flex items-center gap-2 text-indigo-600 font-bold mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-slate-900">{term.title}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-normal">
                    {term.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-6 mt-6">
              <p className="text-xs sm:text-sm text-slate-600">
                {language === 'ar'
                  ? 'لأي استفسار بخصوص شروط الاستخدام أو الشراكات التعليمية، يسعدنا تواصلكم عبر '
                  : 'For inquiries regarding terms of service or educational partnerships, visit '}
                <a
                  href="https://mfekry.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-sky-600 hover:underline"
                >
                  {language === 'ar' ? 'الموقع الرسمي للأخصائي محمد فكري' : 'the Official Website of Mohamed Fekry'}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { sound } from '../utils/audio';
import { BackButton } from '../components/common/BackButton';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Database,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  const { language } = useLanguage();
  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  const points = [
    {
      icon: EyeOff,
      title: language === 'ar' ? 'خلو تام من الإعلانات والتتبع' : 'Zero Ads & Zero Tracking',
      desc: language === 'ar'
        ? 'منصة تالين مصممة خصيصاً للأطفال الصغار، ولا تحتوي على أي إعلانات تجارية، ولا تستخدم أي أدوات تتبع سلوكية أو ملفات تعريف ارتباط دعائية.'
        : 'Taleen is crafted strictly for children without commercial ads, third-party trackers, or behavioral profiling cookies.'
    },
    {
      icon: Lock,
      title: language === 'ar' ? 'عدم طلب أي بيانات شخصية' : 'No Personal Data Collection',
      desc: language === 'ar'
        ? 'لا تتطلب المنصة إنشاء حسابات، ولا تطلب أسماء الأطفال الحقيقية، ولا بريداً إلكترونياً، ولا أرقام هواتف، ولا أي معلومات خاصة بالأسرة.'
        : 'The platform requires no account registration, real names, email addresses, phone numbers, or private family information.'
    },
    {
      icon: Database,
      title: language === 'ar' ? 'تخزين الإنجازات محلياً فقط' : 'Local Storage Only',
      desc: language === 'ar'
        ? 'النقاط والنجوم المكتسبة في الألعاب والقصص تُحفظ حصرياً داخل ذاكرة متصفحك (LocalStorage) ولا يتم إرسالها إلى أي خوادم خارجية، ويمكن للوالدين تصفيرها في أي وقت.'
        : 'All earned stars and scores reside strictly inside your local browser storage (LocalStorage), never sent to external servers.'
    },
    {
      icon: ShieldCheck,
      title: language === 'ar' ? 'معايير أمان عالمية للأطفال' : 'Compliant Child Safety Standards',
      desc: language === 'ar'
        ? 'نلتزم بالمبادئ التوجيهية العالمية لحماية خصوصية الأطفال عبر الإنترنت (مثل روح معايير COPPA وGDPR-K)، مما يوفر للأهل راحة بال تامة.'
        : 'We strictly adhere to global child online privacy guidelines (COPPA and GDPR-K principles) for total parental peace of mind.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Unified Back button */}
        <div className="mb-6">
          <BackButton />
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 sm:p-10 mb-8">
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                {language === 'ar' ? 'سياسة الخصوصية وأمان الأطفال' : 'Child Privacy & Safety Policy'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {language === 'ar' ? 'منصة تالين التعليمية • آخر تحديث: 2026' : 'Taleen Platform • Last updated: 2026'}
              </p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-600 leading-relaxed space-y-6">
            <p className="font-medium text-slate-700 bg-sky-50/70 border border-sky-100 rounded-2xl p-4">
              {language === 'ar'
                ? 'في تالين، نؤمن بأن الطفل يستحق بيئة رقمية نظيفة، آمنة ومبهجة، خالية تماماً من الاستغلال التجاري أو التتبع. خصوصية طفلك وأمانه هي أولويتنا المطلقة.'
                : 'At Taleen, we believe every child deserves a clean, joyful, and completely secure digital sanctuary without commercial exploitation or tracking.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {points.map((point, index) => {
                const IconComponent = point.icon;
                return (
                  <div
                    key={index}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-sky-300 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 text-sky-600 font-bold mb-2">
                      <IconComponent className="w-5 h-5" />
                      <span className="text-slate-900">{point.title}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-normal">
                      {point.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-slate-100 pt-6 mt-6">
              <h3 className="text-base font-bold text-slate-800 mb-2 flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-rose-500" />
                <span>{language === 'ar' ? 'تواصل معنا واستفسارات أولياء الأمور' : 'Parent Contact & Inquiries'}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                {language === 'ar'
                  ? 'إذا كان لديكم أي سؤال أو استفسار حول سياسة الخصوصية أو تجربة طفلكم على المنصة، يمكنكم التواصل مباشرة مع المؤسس والأخصائي المسؤول عبر '
                  : 'If you have any questions or feedback regarding privacy or your child’s learning experience, please reach out via '}
                <a
                  href="https://mfekry.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-sky-600 hover:underline"
                >
                  {language === 'ar' ? 'الموقع الرسمي للأخصائي' : 'the Official Specialist Website'}
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

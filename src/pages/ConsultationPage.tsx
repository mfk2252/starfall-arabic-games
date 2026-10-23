import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { sound } from '../utils/audio';
import {
  Sparkles,
  ExternalLink,
  Heart,
  ShieldCheck,
  CheckCircle,
  MessageSquare,
  Award,
  Users,
  Compass,
  FileText,
  Calendar,
  Stethoscope,
  Smile,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export const ConsultationPage: React.FC = () => {
  const { language } = useLanguage();
  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;
  const officialPortfolioUrl = 'https://mfekry.vercel.app/';

  const services = [
    {
      title: language === 'ar' ? 'تقييم وتشخيص النطق والتخاطب' : 'Speech & Language Evaluation',
      desc: language === 'ar'
        ? 'فحص شامل لمخارج الحروف، طلاقة الكلام، التأتأة، والحصيلة اللغوية للأطفال بمختلف المراحل العمرية.'
        : 'Comprehensive diagnostic evaluation of articulation, speech fluency, stuttering, and vocabulary development.',
      icon: MessageSquare,
      color: 'from-sky-500 to-blue-600',
      bgLight: 'bg-sky-50',
    },
    {
      title: language === 'ar' ? 'برامج التدخل المبكر وتأخر اللغة' : 'Early Language Intervention',
      desc: language === 'ar'
        ? 'خطط علاجية وتدريبية مخصصة للأطفال الذين يعانون من تأخر ظهور الكلمات أو صعوبة تكوين الجمل.'
        : 'Tailored therapeutic programs for toddlers and children experiencing delayed speech or sentence formation.',
      icon: Sparkles,
      color: 'from-amber-500 to-orange-500',
      bgLight: 'bg-amber-50',
    },
    {
      title: language === 'ar' ? 'خطط التعلم الفردية (IEP)' : 'Individualized Educational Plans',
      desc: language === 'ar'
        ? 'بناء برامج تدريبية رقمية وتربوية تناسب احتياجات كل طفل وفق قدراته الإدراكية والتواصلية.'
        : 'Designing personalized cognitive and educational roadmaps aligned with each child\'s specific profile.',
      icon: FileText,
      color: 'from-emerald-500 to-teal-600',
      bgLight: 'bg-emerald-50',
    },
    {
      title: language === 'ar' ? 'استشارات وإرشاد أولياء الأمور' : 'Parent Guidance & Family Support',
      desc: language === 'ar'
        ? 'جلسات إرشادية وتدريبية للوالدين لتطبيق أساليب التحفيز اللغوي السليمة داخل المنزل والروتين اليومي.'
        : 'Actionable guidance for parents on fostering language-rich home environments and positive daily routines.',
      icon: Users,
      color: 'from-purple-500 to-indigo-600',
      bgLight: 'bg-purple-50',
    },
    {
      title: language === 'ar' ? 'تنمية المهارات الاجتماعية والتواصل' : 'Social & Pragmatic Communication',
      desc: language === 'ar'
        ? 'تعزيز التواصل البصري، فهم المشاعر، مهارات المحادثة، وتبادل الأدوار في التفاعل اليومي.'
        : 'Enhancing eye contact, emotional recognition, turn-taking, and conversational social skills.',
      icon: Smile,
      color: 'from-rose-500 to-pink-600',
      bgLight: 'bg-rose-50',
    },
    {
      title: language === 'ar' ? 'استشارات صعوبات التعلم والتركيز' : 'Attention & Learning Support',
      desc: language === 'ar'
        ? 'استراتيجيات تحفيز الانتباه والذاكرة البصرية والسمعية وتهيئة الطفل للمرحلة المدرسية.'
        : 'Techniques for visual and auditory focus, working memory, and pre-school school readiness.',
      icon: Compass,
      color: 'from-cyan-500 to-blue-500',
      bgLight: 'bg-cyan-50',
    },
  ];

  const steps = [
    {
      number: '1',
      title: language === 'ar' ? 'الانتقال للبوابة الرسمية' : 'Visit Official Portal',
      desc: language === 'ar'
        ? 'الدخول إلى الموقع الشخصي المعتمد للأخصائي محمد فكري الكفافي.'
        : 'Access the accredited professional site of therapist Mohamed Fekry El-Kafafi.',
    },
    {
      number: '2',
      title: language === 'ar' ? 'تحديد طبيعة الاستشارة' : 'Specify Child\'s Needs',
      desc: language === 'ar'
        ? 'اختيار نوع التقييم أو الاستشارة (نطق، لغة، تدخل مبكر، إرشاد أسري).'
        : 'Select the area of inquiry (speech evaluation, early delay, or parent coaching).',
    },
    {
      number: '3',
      title: language === 'ar' ? 'تنسيق الموعد والمتابعة' : 'Direct Scheduling',
      desc: language === 'ar'
        ? 'تحديد موعد الجلسة المباشرة وتلقي خطة المتابعة والتوجيهات المخصصة للطفل.'
        : 'Coordinate convenient session timing and receive a personalized follow-up roadmap.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-12">
      {/* Hero / Header */}
      <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden text-center sm:text-start">
        <div className="absolute top-4 right-8 text-4xl opacity-20 pointer-events-none">⭐</div>
        <div className="absolute bottom-4 left-8 text-5xl opacity-20 pointer-events-none">🌱</div>

        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold border border-white/30 text-white shadow-xs">
            <Stethoscope className="w-4 h-4 text-amber-300" />
            <span>
              {language === 'ar'
                ? 'الاستشارات وجلسات التربية الخاصة والتخاطب'
                : 'Special Education & Speech Consultations'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {language === 'ar'
              ? 'احجز استشارتك مع أخصائي التربية الخاصة والتخاطب'
              : 'Book a Consultation with Our Speech & Special Ed Specialist'}
          </h1>

          <p className="text-sm sm:text-base text-sky-100 font-medium leading-relaxed max-w-2xl">
            {language === 'ar'
              ? 'تقديم خدمات التشخيص والتقييم، وخطط التدخل المبكر لعلاج تأخر الكلام وصعوبات التواصل للأطفال، بإشراف وتنسيق مباشر مع مؤسس المنصة محمد فكري الكفافي.'
              : 'Direct clinical and developmental consultations, speech evaluations, and early intervention roadmaps supervised directly by platform founder Mohamed Fekry El-Kafafi.'}
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-3 justify-center sm:justify-start">
            <a
              href={officialPortfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="bg-amber-400 hover:bg-amber-300 text-amber-950 px-7 py-3.5 rounded-full font-black text-base shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 border-2 border-amber-300"
            >
              <span>{language === 'ar' ? 'حجز جلسة عبر الموقع الرسمي للأخصائي' : 'Book Session on Official Portal'}</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <a
              href={officialPortfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3.5 rounded-full font-bold text-sm shadow-md backdrop-blur-md transition-all border border-white/40 flex items-center gap-2"
            >
              <span>{language === 'ar' ? 'الملف المهني للأخصائي' : 'Professional Profile'}</span>
              <ArrowIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Specialist Bio Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center text-5xl shadow-md shrink-0">
          👨‍⚕️
        </div>

        <div className="flex-1 text-center md:text-start space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-800 bg-sky-100 px-3 py-1 rounded-full">
            <Award className="w-3.5 h-3.5 text-sky-600" />
            <span>{language === 'ar' ? 'مؤسس منصة تالين التعليمية' : 'Founder of Taleen Platform'}</span>
          </div>
          <h2 className="text-2xl font-black text-slate-800">
            {language === 'ar' ? 'محمد فكري الكفافي' : 'Mohamed Fekry El-Kafafi'}
          </h2>
          <p className="text-sm font-bold text-sky-700">
            {language === 'ar'
              ? 'أخصائي التربية الخاصة والتخاطب وتطوير الحلول التعليمية للأطفال'
              : 'Special Education & Speech Therapist | EdTech Solutions Developer'}
          </p>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-2xl">
            {language === 'ar'
              ? 'خبرة تزيد عن 9 سنوات في تقييم وتشخيص اضطرابات النطق والكلام، تأهيل حالات اضطراب طيف التوحد وتأخر النمو اللغوي، وبناء الأدوات الرقمية والأنشطة التفاعلية الهادفة للطفل العربي.'
              : 'Over 9 years of clinical and educational experience in diagnosing speech impairments, early language delay, autism support, and authoring interactive digital therapy tools for children.'}
          </p>
        </div>

        <div className="shrink-0">
          <a
            href={officialPortfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm shadow-md transition-all hover:scale-105"
          >
            <span>{language === 'ar' ? 'زيارة الموقع الرسمي' : 'Visit Official Portal'}</span>
            <ExternalLink className="w-4 h-4 text-amber-400" />
          </a>
        </div>
      </div>

      {/* Services Grid */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">
            {language === 'ar' ? 'المجالات والخدمات الاستشارية' : 'Consultation & Therapy Domains'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            {language === 'ar'
              ? 'برامج علمية مدروسة قائمة على الدليل تهدف لتنمية قدرات الطفل اللغوية والإدراكية'
              : 'Evidence-based developmental programs designed to nurture communication and cognitive growth'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md border border-slate-100 flex flex-col justify-between transition-all"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${srv.color} text-white flex items-center justify-center text-xl shadow-xs mb-4`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-slate-800 mb-2">{srv.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {srv.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking Procedure Steps */}
      <div className="bg-gradient-to-br from-slate-50 to-sky-50/60 rounded-3xl p-6 sm:p-8 border border-sky-100">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-2">
            {language === 'ar' ? 'كيفية حجز الجلسة أو الاستشارة' : 'How Booking Works'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            {language === 'ar'
              ? 'خطوات بسيطة وواضحة لتنسيق الموعد والمتابعة الرسمية'
              : 'Simple steps to schedule your appointment and personalized follow-up'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((st, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 shadow-xs border border-sky-100 flex flex-col items-center text-center relative"
            >
              <div className="w-10 h-10 rounded-full bg-sky-600 text-white font-black flex items-center justify-center text-sm shadow-xs mb-3">
                {st.number}
              </div>
              <h4 className="font-black text-base text-slate-800 mb-1.5">{st.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{st.desc}</p>
            </div>
          ))}
        </div>

        {/* Security & Authenticity notice */}
        <div className="mt-8 bg-white/90 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 max-w-2xl mx-auto text-emerald-900 text-xs sm:text-sm">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-semibold">
            {language === 'ar'
              ? 'ملاحظة للأمان والخصوصية: لضمان أمان بيانات أطفالكم وأسركم، لا نجمع أي مدفوعات أو بيانات اتصال حساسة عبر هذا التطبيق. يتم حجز كافة الجلسات وتنسيق المواعيد حصرًا عبر البوابة الشخصية المعتمدة للأخصائي.'
              : 'Privacy Notice: To protect your family\'s data and privacy, we never collect payment or sensitive personal information on this app. All consultations are scheduled securely via the specialist\'s official verified portal.'}
          </p>
        </div>

        {/* Final CTA button */}
        <div className="mt-8 text-center">
          <a
            href={officialPortfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            className="inline-flex items-center gap-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white px-8 py-4 rounded-full font-black text-base shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>{language === 'ar' ? 'تفضل بزيارة البوابة الرسمية واحجز جلستك الآن' : 'Go to Official Portal & Book Your Session'}</span>
            <ExternalLink className="w-5 h-5 text-amber-300" />
          </a>
        </div>
      </div>
    </div>
  );
};

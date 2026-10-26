import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { useLanguage } from '../../i18n/LanguageContext';
import { sound } from '../../utils/audio';
import { Download, Share, PlusSquare, X, Smartphone, Check } from 'lucide-react';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'pill' | 'banner' | 'icon';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'pill'
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { language } = useLanguage();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  // If app is running as an installed PWA, hide install trigger
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    sound.playClick();
    if (isInstallable) {
      const success = await install();
      if (success) {
        setJustInstalled(true);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  const buttonText = language === 'ar' ? 'ثبّت تالين' : 'Install Taleen';

  return (
    <>
      {/* Install Button Trigger */}
      {(isInstallable || isIOS) && (
        <button
          onClick={handleInstallClick}
          className={`inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-amber-950 font-black px-3.5 py-1.5 rounded-full text-xs sm:text-sm shadow-sm hover:shadow-md transition-all transform hover:scale-105 active:scale-95 cursor-pointer border border-amber-300 ${className}`}
          title={buttonText}
        >
          <Download className="w-4 h-4 animate-bounce" />
          <span>{buttonText}</span>
        </button>
      )}

      {/* iOS Safari Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#20091b] rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-pink-200 dark:border-[#3d122f] text-slate-800 dark:text-pink-100 animate-pop-in relative">
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 end-4 text-slate-400 hover:text-slate-600 dark:hover:text-pink-200 p-1 rounded-full bg-pink-50 dark:bg-[#2a0c24] cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-950/80 text-pink-600 dark:text-pink-400 flex items-center justify-center text-2xl mb-3 shadow-inner">
              <Smartphone className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-extrabold text-slate-900 dark:text-pink-100 mb-2">
              {language === 'ar' ? 'تثبيت تطبيق تالين على iPhone / iPad' : 'Install Taleen on iPhone / iPad'}
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              {language === 'ar'
                ? 'لاتباع الخطوات البسيطة لتنزيل تالين على شاشتك الرئيسية بدون متجر:'
                : 'Follow these quick steps to add Taleen to your home screen:'}
            </p>

            <div className="space-y-3 text-xs font-semibold text-slate-700 dark:text-slate-200 mb-6">
              <div className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                <Share className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-black text-slate-900 dark:text-white">
                    {language === 'ar' ? '١. اضغط زر المشاركة (Share)' : '1. Tap Share'}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'ar' ? 'في أسفل شاشة متصفح Safari' : 'At the bottom of Safari toolbar'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                <PlusSquare className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-black text-slate-900 dark:text-white">
                    {language === 'ar' ? '٢. اختر «إضافة إلى الشاشة الرئيسية»' : '2. Choose "Add to Home Screen"'}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'ar' ? 'من قائمة الخيارات التفاعلية' : 'From the list of available actions'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-black text-slate-900 dark:text-white">
                    {language === 'ar' ? '٣. أكّد التثبيت' : '3. Tap Add'}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'ar' ? 'سيظهر أيقونة تالين فوراً بجانب تطبيقاتك' : 'Taleen app icon will appear instantly'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-black py-2.5 rounded-2xl text-xs transition-colors cursor-pointer"
            >
              {language === 'ar' ? 'فهمت ذلك' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

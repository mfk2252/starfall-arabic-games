import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { sound } from '../../utils/audio';

/**
 * Floating tactile back-to-top button that appears gently on scroll
 * to improve navigation on smaller screens and long game catalogs.
 */
export const BackToTopButton: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onScroll = () => {
      setVisible(window.scrollY > 360);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  const label = language === 'ar' ? 'العودة للأعلى' : 'Back to top';

  return (
    <button
      type="button"
      onClick={() => {
        sound.playClick();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      className="fixed bottom-5 end-5 z-40 w-11 h-11 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg shadow-pink-500/30 border-2 border-white/80 dark:border-[#3d122f] flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 animate-pop-in cursor-pointer"
      title={label}
      aria-label={label}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};

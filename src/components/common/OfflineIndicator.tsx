import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const { language } = useLanguage();
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowRestored(true);
      const timer = setTimeout(() => setShowRestored(false), 3000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowRestored(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showRestored) return null;

  return (
    <div className="fixed bottom-4 start-4 z-50 animate-pop-in">
      {!isOnline && (
        <div className="flex items-center gap-2 bg-amber-500 text-amber-950 px-3.5 py-2 rounded-2xl font-bold text-xs shadow-lg border border-amber-300">
          <WifiOff className="w-4 h-4 text-amber-950 animate-pulse" />
          <span>
            {language === 'ar'
              ? 'الوضع غير متصل بالإنترنت — تعمل الألعاب المحفوظة مؤقتاً'
              : 'Offline Mode — Playing cached games'}
          </span>
        </div>
      )}

      {isOnline && showRestored && (
        <div className="flex items-center gap-2 bg-emerald-500 text-white px-3.5 py-2 rounded-2xl font-bold text-xs shadow-lg border border-emerald-300">
          <Wifi className="w-4 h-4 text-white" />
          <span>
            {language === 'ar'
              ? 'تم استعادة الاتصال بالإنترنت'
              : 'Internet connection restored'}
          </span>
        </div>
      )}
    </div>
  );
};

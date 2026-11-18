import React from 'react';
import { useNavigate, useInRouterContext } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { sound } from '../../utils/audio';

interface BackButtonProps {
  to?: string;
  label?: string;
  className?: string;
  onClick?: () => void;
}

const NavigationHandler: React.FC<{
  to?: string;
  label: string;
  className: string;
  onClick?: () => void;
  BackIcon: typeof ArrowRight;
}> = ({ to, label, className, onClick, BackIcon }) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    sound.playClick();
    if (onClick) {
      onClick();
      return;
    }
    if (to) {
      navigate(to);
      return;
    }
    if (window.history.state && typeof window.history.state.idx === 'number' && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/games', { replace: true });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-2 bg-white/95 dark:bg-[#20091b] hover:bg-pink-50 dark:hover:bg-[#2d0e26] text-slate-700 dark:text-pink-100 px-4 py-2.5 rounded-full font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 border border-pink-200/80 dark:border-[#3d122f] cursor-pointer text-sm ${className}`}
      title={label}
      aria-label={label}
    >
      <BackIcon className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0" />
      <span>{label}</span>
    </button>
  );
};

export const BackButton: React.FC<BackButtonProps> = ({
  to,
  label,
  className = '',
  onClick,
}) => {
  const inRouter = useInRouterContext();
  const { t, language } = useLanguage();
  const BackIcon = language === 'ar' ? ArrowRight : ArrowLeft;
  const defaultLabel = language === 'ar' ? 'العودة إلى الألعاب' : t('backToGames');
  const displayLabel = label || defaultLabel;

  if (inRouter) {
    return (
      <NavigationHandler
        to={to}
        label={displayLabel}
        className={className}
        onClick={onClick}
        BackIcon={BackIcon}
      />
    );
  }

  // Standalone fallback when rendered outside Router (e.g., in unit tests)
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        sound.playClick();
        if (onClick) onClick();
        else if (to) window.location.href = to;
        else window.location.href = '/games';
      }}
      className={`inline-flex items-center gap-2 bg-white/95 dark:bg-[#20091b] hover:bg-pink-50 dark:hover:bg-[#2d0e26] text-slate-700 dark:text-pink-100 px-4 py-2.5 rounded-full font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 border border-pink-200/80 dark:border-[#3d122f] cursor-pointer text-sm ${className}`}
      title={displayLabel}
      aria-label={displayLabel}
    >
      <BackIcon className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0" />
      <span>{displayLabel}</span>
    </button>
  );
};

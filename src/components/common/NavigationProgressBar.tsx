import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Lightweight non-blocking top shimmer bar that provides immediate
 * visual feedback when navigating between pages or games.
 */
export const NavigationProgressBar: React.FC = () => {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50 h-1 overflow-hidden pointer-events-none"
    >
      <div className="h-full w-full bg-gradient-to-r from-pink-500 via-amber-400 to-rose-500 animate-nav-progress shadow-xs" />
    </div>
  );
};

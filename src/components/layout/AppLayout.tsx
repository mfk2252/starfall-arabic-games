import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { OfflineIndicator } from '../common/OfflineIndicator';
import { NavigationProgressBar } from '../common/NavigationProgressBar';
import { BackToTopButton } from '../common/BackToTopButton';

export const AppLayout: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <div className="min-h-dvh w-full max-w-full overflow-x-clip flex flex-col bg-gradient-to-br from-[#fff1f5] via-[#fdf2f8] to-[#fce7f3] dark:from-[#160612] dark:via-[#1e0819] dark:to-[#12040f] text-slate-800 dark:text-pink-50 transition-colors duration-200">
      <NavigationProgressBar />
      <Navbar />
      <main className="flex-1 flex flex-col w-full min-w-0">
        <div key={pathname} className="flex-1 flex flex-col w-full min-w-0 animate-page-enter">
          <Outlet />
        </div>
      </main>
      <Footer />
      <BackToTopButton />
      <OfflineIndicator />
    </div>
  );
};

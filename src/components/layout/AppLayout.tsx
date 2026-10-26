import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { OfflineIndicator } from '../common/OfflineIndicator';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#fff1f5] via-[#fdf2f8] to-[#fce7f3] dark:from-[#160612] dark:via-[#1e0819] dark:to-[#12040f] text-slate-800 dark:text-pink-50 transition-colors duration-200">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
      <OfflineIndicator />
    </div>
  );
};

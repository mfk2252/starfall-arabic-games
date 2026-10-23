import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { OfflineIndicator } from '../common/OfflineIndicator';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fff5f8] dark:bg-[#180816] text-slate-800 dark:text-pink-50 transition-colors duration-200">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
      <OfflineIndicator />
    </div>
  );
};

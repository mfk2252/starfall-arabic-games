import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#070e20] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/HomePage';
import { AllGamesPage } from './pages/AllGamesPage';
import { CategoriesOverviewPage } from './pages/CategoriesOverviewPage';
import { CategoryPage } from './pages/CategoryPage';
import { GamePlayPage } from './pages/GamePlayPage';
import { ProgressPage } from './pages/ProgressPage';
import { AboutPage } from './pages/AboutPage';

export function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="games" element={<AllGamesPage />} />
            <Route path="games/:gameId" element={<GamePlayPage />} />
            <Route path="categories" element={<CategoriesOverviewPage />} />
            <Route path="categories/:categoryId" element={<CategoryPage />} />
            <Route path="progress" element={<ProgressPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;

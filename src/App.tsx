import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import { ThemeProvider } from './theme/ThemeContext';
import { AppLayout } from './components/layout/AppLayout';
import { ScrollToTop } from './components/common/ScrollToTop';
import { usePWAAutoUpdate } from './hooks/usePWAAutoUpdate';
import { HomePage } from './pages/HomePage';
import { AllGamesPage } from './pages/AllGamesPage';
import { CategoriesOverviewPage } from './pages/CategoriesOverviewPage';
import { CategoryPage } from './pages/CategoryPage';
import { GamePlayPage } from './pages/GamePlayPage';
import { StoriesPage } from './pages/StoriesPage';
import { StoryViewPage } from './pages/StoryViewPage';
import { ConsultationPage } from './pages/ConsultationPage';
import { ProgressPage } from './pages/ProgressPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { MethodologyPage } from './pages/MethodologyPage';
import { SelfLearningPage } from './pages/SelfLearningPage';

const PWAUpdater: React.FC = () => {
  usePWAAutoUpdate();
  return null;
};

export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <ScrollToTop />
          <PWAUpdater />
          <Routes>
            {/* Standalone immersive fullscreen game play route (no AppLayout header/footer) */}
            <Route path="/games/:gameId" element={<GamePlayPage />} />

            {/* Standard platform layout for all other pages */}
            <Route path="/" element={<AppLayout />}>
              <Route index element={<HomePage />} />
              <Route path="games" element={<AllGamesPage />} />
              <Route path="categories" element={<CategoriesOverviewPage />} />
              <Route path="categories/:categoryId" element={<CategoryPage />} />
              <Route path="stories" element={<StoriesPage />} />
              <Route path="stories/:storyId" element={<StoryViewPage />} />
              <Route path="consultation" element={<ConsultationPage />} />
              <Route path="progress" element={<ProgressPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="privacy" element={<PrivacyPolicyPage />} />
              <Route path="terms" element={<TermsPage />} />
              <Route path="methodology" element={<MethodologyPage />} />
              <Route path="self-learning" element={<SelfLearningPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;

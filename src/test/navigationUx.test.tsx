import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LanguageProvider } from '../i18n/LanguageContext';
import { ThemeProvider } from '../theme/ThemeContext';
import { AppLayout } from '../components/layout/AppLayout';
import { HomePage } from '../pages/HomePage';
import { AllGamesPage } from '../pages/AllGamesPage';

describe('Navigation, Animation & UX Enhancements', () => {
  it('renders AppLayout with page-enter animation wrapper, navigation progress bar, and active aria-current link', () => {
    const { container } = render(
      <ThemeProvider>
        <LanguageProvider>
          <MemoryRouter initialEntries={['/']}>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<HomePage />} />
                <Route path="games" element={<AllGamesPage />} />
              </Route>
            </Routes>
          </MemoryRouter>
        </LanguageProvider>
      </ThemeProvider>
    );

    const animatedContainer = container.querySelector('.animate-page-enter');
    expect(animatedContainer).not.toBeNull();

    const progressBar = container.querySelector('.animate-nav-progress');
    expect(progressBar).not.toBeNull();

    const activeHomeLink = container.querySelector('a[href="/"][aria-current="page"]');
    expect(activeHomeLink).not.toBeNull();
  });

  it('triggers smooth route transition when navigating to AllGamesPage', () => {
    const { container } = render(
      <ThemeProvider>
        <LanguageProvider>
          <MemoryRouter initialEntries={['/']}>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<HomePage />} />
                <Route path="games" element={<AllGamesPage />} />
              </Route>
            </Routes>
          </MemoryRouter>
        </LanguageProvider>
      </ThemeProvider>
    );

    const gamesNavLink = container.querySelector('a[href="/games"]') as HTMLAnchorElement;
    expect(gamesNavLink).not.toBeNull();
    fireEvent.click(gamesNavLink);

    const activeGamesLink = container.querySelector('a[href="/games"][aria-current="page"]');
    expect(activeGamesLink).not.toBeNull();
  });
});

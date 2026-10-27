import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from '../i18n/LanguageContext';
import { MatchingGamesPage } from '../pages/MatchingGamesPage';
import { HomePage } from '../pages/HomePage';

describe('Matching Games Grouping & Page Integration', () => {
  it('renders MatchingGamesPage correctly with all matching games', () => {
    render(
      <BrowserRouter>
        <LanguageProvider>
          <MatchingGamesPage />
        </LanguageProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/ألعاب التطابق والذاكرة/)).toBeDefined();
    expect(screen.getByText('تطابق الأرقام')).toBeDefined();
    expect(screen.getByText('تطابق الحروف العربية')).toBeDefined();
    expect(screen.getByText('تطابق الحروف الإنجليزية')).toBeDefined();
    expect(screen.getByText('تطابق الصور والذاكرة')).toBeDefined();
  });

  it('renders grouped container ألعاب التطابق on HomePage', () => {
    render(
      <BrowserRouter>
        <LanguageProvider>
          <HomePage />
        </LanguageProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('ألعاب التطابق')).toBeDefined();
  });
});

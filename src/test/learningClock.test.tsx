import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LearningClockGame } from '../components/games/LearningClockGame';
import { LanguageProvider } from '../i18n/LanguageContext';
import { ThemeProvider } from '../theme/ThemeContext';

const renderClockGame = () => {
  return render(
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <LearningClockGame onGoHome={() => {}} />
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
};

describe('Learning Clock Game - Numeral System Toggle Feature', () => {
  it('renders menu and starts explore time mode', () => {
    renderClockGame();

    const startExploreBtn = screen.getByText('بدء الاستكشاف');
    expect(startExploreBtn).toBeDefined();
    fireEvent.click(startExploreBtn);

    // Header in explore mode should show Explore Time title
    expect(screen.getByText('استكشف الوقت')).toBeDefined();
  });

  it('renders the number system toggle button and toggles between Arabic and English numerals', () => {
    renderClockGame();

    // Start explore mode
    fireEvent.click(screen.getByText('بدء الاستكشاف'));

    // Check for the toggle button with numeral icon
    const toggleBtn = screen.getByTitle(/التبديل إلى الأرقام الإنجليزية/);
    expect(toggleBtn).toBeDefined();
    expect(screen.getByText('١٢٣')).toBeDefined();

    // Initially clock shows Arabic numerals like ١٢
    expect(screen.getAllByText('١٢').length).toBeGreaterThanOrEqual(1);

    // Click to toggle to English numerals (123)
    fireEvent.click(toggleBtn);

    // Label should now reflect 123
    expect(screen.getByText('123')).toBeDefined();
    expect(screen.getAllByText('12').length).toBeGreaterThanOrEqual(1);

    // Click again to toggle back to Arabic numerals
    fireEvent.click(toggleBtn);
    expect(screen.getByText('١٢٣')).toBeDefined();
    expect(screen.getAllByText('١٢').length).toBeGreaterThanOrEqual(1);
  });
});

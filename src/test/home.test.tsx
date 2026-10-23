import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { LanguageProvider } from '../i18n/LanguageContext';
import { ThemeProvider } from '../theme/ThemeContext';

const renderHome = () => {
  return render(
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
};

describe('HomePage App Launcher Requirements', () => {
  it('renders direct 1-click app launcher cards for games and stories', () => {
    const { container } = renderHome();

    // Check for direct links to games
    const numberMatchLink = container.querySelector('a[href="/games/numbers"]');
    expect(numberMatchLink).not.toBeNull();

    const arabicLettersLink = container.querySelector('a[href="/games/arabic-letters"]');
    expect(arabicLettersLink).not.toBeNull();

    // Check for story direct link
    const storyLink = container.querySelector('a[href="/stories/tortoise-and-hare"]');
    expect(storyLink).not.toBeNull();
  });

  it('provides a search bar that filters activities dynamically', () => {
    const { container } = renderHome();

    const searchInput = container.querySelector('input[type="text"]') as HTMLInputElement;
    expect(searchInput).not.toBeNull();

    // Type a specific term
    fireEvent.change(searchInput, { target: { value: 'فصول' } });

    // Should match the seasons game
    const seasonsLink = container.querySelector('a[href="/games/seasons"]');
    expect(seasonsLink).not.toBeNull();

    // Should NOT match numbers game
    const numbersLink = container.querySelector('a[href="/games/numbers"]');
    expect(numbersLink).toBeNull();
  });

  it('renders quick action buttons including random surprise game', () => {
    const { container } = renderHome();

    const surpriseBtn = container.querySelector('button[title="اختر لي لعبة عشوائية"]');
    expect(surpriseBtn).not.toBeNull();
  });
});

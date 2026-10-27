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

    // Check for matching games group container link
    const matchingGroupLink = container.querySelector('a[href="/matching-games"]');
    expect(matchingGroupLink).not.toBeNull();

    // Check for direct game links
    const wordBuilderLink = container.querySelector('a[href="/games/word-builder"]');
    expect(wordBuilderLink).not.toBeNull();

    // Check for story group link (since stories are grouped in 'all' view)
    const storiesGroupLink = container.querySelector('a[href="/stories"]');
    expect(storiesGroupLink).not.toBeNull();
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

    // Should NOT match word-builder when searching 'فصول'
    const wordBuilderLink = container.querySelector('a[href="/games/word-builder"]');
    expect(wordBuilderLink).toBeNull();
  });

  it('renders quick action buttons including random surprise game', () => {
    const { container } = renderHome();

    const surpriseBtn = container.querySelector('button[title="اختر لي لعبة عشوائية"]');
    expect(surpriseBtn).not.toBeNull();
  });
});

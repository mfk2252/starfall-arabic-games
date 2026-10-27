import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from '../i18n/LanguageContext';
import { FlamingoGame } from '../components/games/FlamingoGame';
import { GAMES_LIST } from '../data/games';

describe('Flamingo Game Integration', () => {
  it('is registered in GAMES_LIST with correct metadata', () => {
    const flamingo = GAMES_LIST.find((g) => g.id === 'flamingo-game');
    expect(flamingo).toBeDefined();
    expect(flamingo?.title).toBe('لعبة الفلامينجو الوردي');
    expect(flamingo?.icon).toBe('🦩');
    expect(flamingo?.minAge).toBe(3);
  });

  it('renders FlamingoGame title and mascot asset header', () => {
    render(
      <BrowserRouter>
        <LanguageProvider>
          <FlamingoGame onGoHome={() => {}} />
        </LanguageProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('لعبة الفلامينجو الوردي')).toBeDefined();
    expect(screen.getByText('فلامينجو تالين الوردي 🦩')).toBeDefined();
    expect(screen.getByText(/توازن الأرقام/)).toBeDefined();
  });
});

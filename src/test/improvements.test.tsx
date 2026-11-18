import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LanguageProvider } from '../i18n/LanguageContext';
import { StoryViewPage } from '../pages/StoryViewPage';
import { ProgressPage } from '../pages/ProgressPage';
import { AllGamesPage } from '../pages/AllGamesPage';
import { NumbersGame } from '../components/games/NumbersGame';
import { DayNightGame } from '../components/games/DayNightGame';
import { SeasonsGame } from '../components/games/SeasonsGame';
import { FlamingoGame } from '../components/games/FlamingoGame';
import { AnimalsEncyclopediaGame } from '../components/games/AnimalsEncyclopediaGame';
import { GAMES_LIST } from '../data/games';

describe('Project Improvements Verification', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders Read-Aloud TTS controls on StoryViewPage', () => {
    render(
      <MemoryRouter initialEntries={['/stories/tortoise-and-hare']}>
        <LanguageProvider>
          <Routes>
            <Route path="/stories/:storyId" element={<StoryViewPage />} />
          </Routes>
        </LanguageProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('استمع للقصة')).toBeDefined();
    expect(screen.getByTitle('استمع للسؤال')).toBeDefined();
  });

  it('displays dynamic game count and active creative_explorer badge on ProgressPage', () => {
    render(
      <MemoryRouter>
        <LanguageProvider>
          <ProgressPage />
        </LanguageProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(`/ ${GAMES_LIST.length * 3}`)).toBeDefined();
    expect(screen.getByText(`/ ${GAMES_LIST.length}`)).toBeDefined();
    expect(screen.getByText('المستكشف المبدع')).toBeDefined();
    expect(screen.queryByText('مهندس التركيب')).toBeNull();
  });

  it('displays dynamic game count on AllGamesPage', () => {
    render(
      <MemoryRouter>
        <LanguageProvider>
          <AllGamesPage />
        </LanguageProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(new RegExp(`${GAMES_LIST.length} لعبة تعليمية`))).toBeDefined();
  });

  it('supports bilingual English mode across refactored games', () => {
    localStorage.setItem('taleen_lang', 'en');
    const noop = () => {};

    const { unmount: unmountNumbers } = render(
      <LanguageProvider>
        <NumbersGame onGoHome={noop} />
      </LanguageProvider>
    );
    expect(screen.getByText('Number Match')).toBeDefined();
    unmountNumbers();

    const { unmount: unmountDayNight } = render(
      <LanguageProvider>
        <DayNightGame onGoHome={noop} />
      </LanguageProvider>
    );
    expect(screen.getByText('Day and Night')).toBeDefined();
    unmountDayNight();

    const { unmount: unmountSeasons } = render(
      <LanguageProvider>
        <SeasonsGame onGoHome={noop} />
      </LanguageProvider>
    );
    expect(screen.getByText('The Four Seasons')).toBeDefined();
    unmountSeasons();

    const { unmount: unmountFlamingo } = render(
      <LanguageProvider>
        <FlamingoGame onGoHome={noop} />
      </LanguageProvider>
    );
    expect(screen.getByText('Pink Flamingo Game')).toBeDefined();
    unmountFlamingo();

    const { unmount: unmountEncyclopedia } = render(
      <LanguageProvider>
        <AnimalsEncyclopediaGame onGoHome={noop} />
      </LanguageProvider>
    );
    expect(screen.getByText('50 Animals Encyclopedia')).toBeDefined();
    unmountEncyclopedia();
  });
});

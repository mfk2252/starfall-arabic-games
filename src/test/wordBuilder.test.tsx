import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import {
  WordBuilderGame,
  ARABIC_WORD_DATABASE,
  ENGLISH_WORD_DATABASE,
} from '../components/games/WordBuilderGame';
import { LanguageProvider } from '../i18n/LanguageContext';
import { ThemeProvider } from '../theme/ThemeContext';

const renderWordBuilder = () => {
  return render(
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <WordBuilderGame onGoHome={() => {}} />
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
};

describe('Word Builder (تكوين الكلمات) Game Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('contains expanded databases for Arabic and English with Egypt flag word included', () => {
    expect(ARABIC_WORD_DATABASE.length).toBeGreaterThanOrEqual(30);
    expect(ENGLISH_WORD_DATABASE.length).toBeGreaterThanOrEqual(30);

    // Verify Egypt flag word is present in Arabic database
    const egyptWord = ARABIC_WORD_DATABASE.find((w) => w.word === 'مصر');
    expect(egyptWord).toBeDefined();
    expect(egyptWord?.image).toBe('🇪🇬');
    expect(egyptWord?.translation).toBe('Egypt');
  });

  it('renders initial Menu Screen with Arabic and English mode toggles', () => {
    renderWordBuilder();

    expect(screen.getAllByText(/تكوين الكلمات/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/الكلمات العربية/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/الكلمات الإنجليزية/).length).toBeGreaterThanOrEqual(1);
  });

  it('allows switching between Arabic and English modes', () => {
    renderWordBuilder();

    const enToggleBtn = screen.getByText(/الكلمات الإنجليزية/);
    fireEvent.click(enToggleBtn);

    // Should display English containers
    expect(screen.getByText(/2-Letter Words/)).toBeDefined();
    expect(screen.getByText(/3-Letter Words/)).toBeDefined();
  });

  it('starts a level and initializes letter slots and available letters', () => {
    renderWordBuilder();

    // Click 3-Letter Words container
    const level3Btn = screen.getByText('كلمات من 3 حروف');
    fireEvent.click(level3Btn);

    // Game screen active
    expect(screen.getByText(/رتب الحروف هنا/)).toBeDefined();
    expect(screen.getByText('1 / 5')).toBeDefined();
  });
});

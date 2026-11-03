import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { NumberSortingGame } from '../components/games/NumberSortingGame';
import { GAMES_LIST } from '../data/games';
import { LanguageProvider } from '../i18n/LanguageContext';
import { ThemeProvider } from '../theme/ThemeContext';

const renderNumberSortingGame = () => {
  return render(
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <NumberSortingGame onGoHome={() => {}} />
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
};

describe('Number Sorting Game (لعبة الترتيب)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('is registered in GAMES_LIST with proper title, icon and metadata', () => {
    const game = GAMES_LIST.find((g) => g.id === 'number-sorting');
    expect(game).toBeDefined();
    expect(game?.title).toBe('لعبة الترتيب');
    expect(game?.titleEn).toBe('Number Sorting Game');
    expect(game?.icon).toBe('🧩');
    expect(game?.category).toBe('numbers');
  });

  it('renders GameHeader and initial 4x4 grid board', () => {
    renderNumberSortingGame();

    expect(screen.getAllByText(/لعبة الترتيب/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/4x4/)).toBeDefined();
    expect(screen.getByText(/خلط جديد 🔀/)).toBeDefined();
  });

  it('allows changing grid size between 3x3, 4x4, and 5x5', () => {
    renderNumberSortingGame();

    const btn3x3 = screen.getByText(/3x3/);
    fireEvent.click(btn3x3);

    expect(btn3x3.className).toContain('bg-rose-600');
  });

  it('toggles number format between Arabic and English numerals', () => {
    renderNumberSortingGame();

    const numFormatBtn = screen.getByTitle('تبديل شكل الأرقام');
    fireEvent.click(numFormatBtn);

    expect(screen.getByText('123')).toBeDefined();
  });

  it('toggles target solution preview box', () => {
    renderNumberSortingGame();

    const previewBtn = screen.getByText('معاينة الهدف');
    fireEvent.click(previewBtn);

    expect(screen.getByText(/الشكل النهائي المطلوب/)).toBeDefined();
  });

  it('resets board when shuffle button is clicked', () => {
    renderNumberSortingGame();

    const shuffleBtn = screen.getByText('خلط جديد 🔀');
    fireEvent.click(shuffleBtn);

    expect(screen.getByText((content) => content.includes('الخطوات'))).toBeDefined();
  });
});

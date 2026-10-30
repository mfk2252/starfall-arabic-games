import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MyLittleWorldGame } from '../components/games/MyLittleWorldGame';
import { GAMES_LIST } from '../data/games';
import {
  PALETTE_BLOCKS,
  MODEL_BLUEPRINTS,
  WORD_CHALLENGES,
  NUMBER_CHALLENGES,
  SHAPE_CHALLENGES,
  ARABIC_LETTERS,
  ENGLISH_LETTERS,
  NUMBER_BLOCKS_LIST,
} from '../data/myLittleWorldData';
import { LanguageProvider } from '../i18n/LanguageContext';
import { ThemeProvider } from '../theme/ThemeContext';

const renderMyLittleWorld = () => {
  return render(
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <MyLittleWorldGame onGoHome={() => {}} />
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
};

describe('My Little World (عالمي الصغير) Game Integration', () => {
  it('is registered in GAMES_LIST with proper title and short description', () => {
    const game = GAMES_LIST.find((g) => g.id === 'my-little-world');
    expect(game).toBeDefined();
    expect(game?.title).toBe('عالمي الصغير');
    expect(game?.titleEn).toBe('My Little World');
    expect(game?.description).toContain('ابنِ، ركّب، واكتشف عالمك الخاص');
    expect(game?.icon).toBe('🧱');
  });

  it('contains comprehensive building blocks, models, letters, numbers, and shapes datasets', () => {
    expect(PALETTE_BLOCKS.length).toBeGreaterThanOrEqual(15);
    expect(MODEL_BLUEPRINTS.length).toBeGreaterThanOrEqual(8);
    expect(WORD_CHALLENGES.length).toBeGreaterThanOrEqual(10);
    expect(NUMBER_CHALLENGES.length).toBeGreaterThanOrEqual(6);
    expect(SHAPE_CHALLENGES.length).toBeGreaterThanOrEqual(4);
    expect(ARABIC_LETTERS.length).toBe(28);
    expect(ENGLISH_LETTERS.length).toBe(26);
    expect(NUMBER_BLOCKS_LIST.length).toBe(21);
  });

  it('renders the game interface and 5 activity modes navigation tabs', () => {
    renderMyLittleWorld();

    expect(screen.getByText('عالمي الصغير')).toBeDefined();
    expect(screen.getByText(/١\. البناء الحر/)).toBeDefined();
    expect(screen.getByText(/٢\. ابنِ الشكل/)).toBeDefined();
    expect(screen.getByText(/٣\. عالم الحروف/)).toBeDefined();
    expect(screen.getByText(/٤\. عالم الأرقام/)).toBeDefined();
    expect(screen.getByText(/٥\. عالم الأشكال/)).toBeDefined();
  });

  it('allows switching between activity modes smoothly', () => {
    renderMyLittleWorld();

    // Switch to Build Model
    const buildModelTab = screen.getByText(/٢\. ابنِ الشكل/);
    fireEvent.click(buildModelTab);
    expect(screen.getByText('المنزل السعيد')).toBeDefined();

    // Switch to Letters World
    const lettersTab = screen.getByText(/٣\. عالم الحروف/);
    fireEvent.click(lettersTab);
    expect(screen.getByText(/تحدي الكلمة/)).toBeDefined();

    // Switch to Numbers World
    const numbersTab = screen.getByText(/٤\. عالم الأرقام/);
    fireEvent.click(numbersTab);
    expect(screen.getByText(/ضع ٣ مكعبات/)).toBeDefined();

    // Switch to Shapes World
    const shapesTab = screen.getByText(/٥\. عالم الأشكال/);
    fireEvent.click(shapesTab);
    expect(screen.getByText('تحدي المنزل الهندسي')).toBeDefined();
  });

  it('places a block on the canvas when clicked from palette', () => {
    const { container } = renderMyLittleWorld();

    // Click on Red Cube in palette
    const redCubeBtn = screen.getByTitle('مكعب أحمر');
    fireEvent.click(redCubeBtn);

    // Block counter should show 1
    expect(screen.getByText('عدد القطع: 1')).toBeDefined();

    // Undo should now be enabled and clicking it returns to 0
    const undoBtn = screen.getByTitle('تراجع عن آخر حركة');
    fireEvent.click(undoBtn);
    expect(screen.getByText('عدد القطع: 0')).toBeDefined();
  });
});

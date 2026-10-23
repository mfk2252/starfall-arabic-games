import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from '../i18n/LanguageContext';
import { ThemeProvider } from '../theme/ThemeContext';
import { OPPOSITES_DATA, OPPOSITE_CATEGORIES, OppositeCategory } from '../data/oppositesData';
import { OppositesGame } from '../components/games/OppositesGame';

describe('Opposites Educational Dataset & Integrity', () => {
  it('contains at least 100 opposite pairs (200+ distinct concepts)', () => {
    expect(OPPOSITES_DATA.length).toBeGreaterThanOrEqual(100);
    const totalConcepts = OPPOSITES_DATA.length * 2;
    expect(totalConcepts).toBeGreaterThanOrEqual(200);
  });

  it('guarantees unique pair IDs across the entire dataset', () => {
    const ids = OPPOSITES_DATA.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('guarantees unique concept IDs for all items', () => {
    const itemIds = OPPOSITES_DATA.flatMap((p) => [p.itemA.id, p.itemB.id]);
    const uniqueItemIds = new Set(itemIds);
    expect(uniqueItemIds.size).toBe(itemIds.length);
  });

  it('covers all 12 educational categories without empty classifications', () => {
    const requiredCategories: OppositeCategory[] = [
      'size',
      'length',
      'quantity',
      'speed',
      'temperature',
      'light',
      'state',
      'direction',
      'time',
      'emotions',
      'weight',
      'actions',
    ];

    expect(OPPOSITE_CATEGORIES.length).toBe(12);

    requiredCategories.forEach((cat) => {
      const count = OPPOSITES_DATA.filter((p) => p.category === cat).length;
      expect(count).toBeGreaterThanOrEqual(7);
    });
  });

  it('ensures each pair has complete educational metadata, icons and bilingual text', () => {
    OPPOSITES_DATA.forEach((pair) => {
      expect(pair.id.length).toBeGreaterThan(0);
      expect(pair.itemA.nameAr.length).toBeGreaterThan(0);
      expect(pair.itemA.nameEn.length).toBeGreaterThan(0);
      expect(pair.itemA.icon.length).toBeGreaterThan(0);

      expect(pair.itemB.nameAr.length).toBeGreaterThan(0);
      expect(pair.itemB.nameEn.length).toBeGreaterThan(0);
      expect(pair.itemB.icon.length).toBeGreaterThan(0);

      expect(pair.contextSentenceAr.length).toBeGreaterThan(0);
      expect(pair.contextSentenceEn.length).toBeGreaterThan(0);
      expect(pair.explanationAr.length).toBeGreaterThan(0);
      expect(pair.explanationEn.length).toBeGreaterThan(0);

      // Verify difficulty is valid
      expect(['easy', 'medium', 'advanced']).toContain(pair.difficulty);
    });
  });
});

describe('OppositesGame Component & Multi-Mode Interaction', () => {
  const renderGame = () => {
    return render(
      <ThemeProvider>
        <LanguageProvider>
          <BrowserRouter>
            <OppositesGame onGoHome={() => {}} />
          </BrowserRouter>
        </LanguageProvider>
      </ThemeProvider>
    );
  };

  it('renders the game header with title and score', () => {
    renderGame();
    expect(screen.getByText('المعكوسات والمفاهيم المتضادة')).toBeDefined();
    expect(screen.getByText('النقاط:')).toBeDefined();
  });

  it('renders all 5 mode navigation tabs', () => {
    renderGame();
    expect(screen.getByText('اختيار الضد')).toBeDefined();
    expect(screen.getByText('مطابقة الأزواج')).toBeDefined();
    expect(screen.getByText('إكمال السياق')).toBeDefined();
    expect(screen.getByText('تحدي الكلمات')).toBeDefined();
    expect(screen.getByText('المراجعة والاستكشاف')).toBeDefined();
  });

  it('switches to Pair Matching mode smoothly', () => {
    renderGame();
    const matchTab = screen.getByText('مطابقة الأزواج');
    fireEvent.click(matchTab);
    expect(screen.getByText('المجموعة الأولى')).toBeDefined();
    expect(screen.getByText('المجموعة المتضادة')).toBeDefined();
  });

  it('switches to Review & Explorer encyclopedia mode and allows searching', () => {
    renderGame();
    const reviewTab = screen.getByText('المراجعة والاستكشاف');
    fireEvent.click(reviewTab);
    expect(screen.getByText('موسوعة واستكشاف المعكوسات')).toBeDefined();

    const searchInput = screen.getByPlaceholderText(/ابحث عن أي مفهوم/i);
    expect(searchInput).toBeDefined();
    fireEvent.change(searchInput, { target: { value: 'كبير' } });
  });
});

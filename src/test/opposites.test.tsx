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

describe('OppositesGame Component & Gameplay Flow', () => {
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

  it('renders the child-friendly level menu with title and level cards', () => {
    renderGame();
    expect(screen.getByText('تحدي المعكوسات والمفاهيم المتضادة')).toBeDefined();
    expect(screen.getByText('سهل')).toBeDefined();
    expect(screen.getByText('متوسط')).toBeDefined();
    expect(screen.getByText('متقدم')).toBeDefined();
  });

  it('starts playing when clicking a difficulty level card', () => {
    renderGame();
    const easyBtn = screen.getByText('سهل');
    fireEvent.click(easyBtn);

    // After clicking easy, playing UI should appear with two matching columns
    expect(screen.getByText('المجموعة الأولى')).toBeDefined();
    expect(screen.getByText('المجموعة المتضادة')).toBeDefined();
    expect(screen.getByText(/التقدم المحرز:/i)).toBeDefined();
  });

  it('renders GameHeader with score and restart in playing mode', () => {
    renderGame();
    fireEvent.click(screen.getByText('سهل'));

    expect(screen.getByText('المعكوسات والمفاهيم المتضادة')).toBeDefined();
    expect(screen.getByText(/النقاط:/i)).toBeDefined();
  });
});

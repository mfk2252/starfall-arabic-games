import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from '../i18n/LanguageContext';
import { AnimalsEncyclopediaGame } from '../components/games/AnimalsEncyclopediaGame';
import { ANIMALS_DATA } from '../data/animalsData';
import { GAMES_LIST } from '../data/games';

describe('Animals Encyclopedia Game & Dataset', () => {
  it('contains exactly 50 distinct animals with complete facts and audio metadata', () => {
    expect(ANIMALS_DATA.length).toBe(50);

    const ids = new Set<string>();
    for (const animal of ANIMALS_DATA) {
      expect(animal.id).toBeDefined();
      expect(ids.has(animal.id)).toBe(false);
      ids.add(animal.id);

      expect(animal.nameAr.trim().length).toBeGreaterThan(0);
      expect(animal.habitatAr.trim().length).toBeGreaterThan(0);
      expect(animal.foodAr.trim().length).toBeGreaterThan(0);
      expect(animal.soundNameAr.trim().length).toBeGreaterThan(0);
      expect(animal.babyNameAr.trim().length).toBeGreaterThan(0);
      expect(animal.funFactAr.trim().length).toBeGreaterThan(0);
    }
  });

  it('spans 5 distinct balanced categories with 10 animals each', () => {
    const categories = ['wild', 'farm', 'birds', 'marine', 'insects'];
    for (const cat of categories) {
      const count = ANIMALS_DATA.filter((a) => a.category === cat).length;
      expect(count).toBe(10);
    }
  });

  it('is properly registered in GAMES_LIST', () => {
    const registered = GAMES_LIST.find((g) => g.id === 'animals-encyclopedia');
    expect(registered).toBeDefined();
    expect(registered?.minAge).toBe(3);
  });

  it('renders AnimalsEncyclopediaGame component header correctly', () => {
    render(
      <BrowserRouter>
        <LanguageProvider>
          <AnimalsEncyclopediaGame onGoHome={() => {}} />
        </LanguageProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('موسوعة ومعرض الحيوانات الـ ٥٠')).toBeDefined();
    expect(screen.getByText(/الكل \(٥٠ حيوان\)/)).toBeDefined();
    expect(screen.getByText('الأسد')).toBeDefined();
    expect(screen.getByText('الدلفين')).toBeDefined();
  });
});

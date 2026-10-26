import { describe, it, expect } from 'vitest';
import { SHADOW_GAME_DATA } from '../data/shadowGameData';

describe('Shadow Game Data & Logic Verification', () => {
  it('contains at least 50 valid shadow questions with bilingual titles and image sources', () => {
    expect(SHADOW_GAME_DATA.length).toBeGreaterThanOrEqual(50);

    const ids = new Set<string>();
    for (const q of SHADOW_GAME_DATA) {
      expect(q.id).toBeDefined();
      expect(ids.has(q.id)).toBe(false);
      ids.add(q.id);

      expect(q.nameAr.trim().length).toBeGreaterThan(0);
      expect(q.nameEn.trim().length).toBeGreaterThan(0);
      expect(q.image).toMatch(/^https?:\/\//);
      expect(q.fallbackImage).toMatch(/^https?:\/\//);
      expect(q.emoji.trim().length).toBeGreaterThan(0);
    }
  });

  it('generates exactly 6 unique options for advanced difficulty', () => {
    const optionsCount = 6;
    for (const currentQuestion of SHADOW_GAME_DATA) {
      const correctOption = currentQuestion;
      const pool = SHADOW_GAME_DATA.filter((q) => q.id !== correctOption.id);
      const sameCategoryDistractors = pool.filter((q) => q.category === correctOption.category);

      let distractors = sameCategoryDistractors.slice(0, optionsCount - 1);
      if (distractors.length < optionsCount - 1) {
        const remainingPool = pool.filter((q) => !distractors.some((d) => d.id === q.id));
        distractors = [...distractors, ...remainingPool.slice(0, optionsCount - 1 - distractors.length)];
      }

      const generatedOptions = [correctOption, ...distractors];
      expect(generatedOptions.length).toBe(6);

      const uniqueIds = new Set(generatedOptions.map((o) => o.id));
      expect(uniqueIds.size).toBe(6);
      expect(uniqueIds.has(correctOption.id)).toBe(true);
    }
  });

  it('covers multiple diverse categories without broken identifiers', () => {
    const categories = new Set(SHADOW_GAME_DATA.map((q) => q.category));
    expect(categories.size).toBeGreaterThanOrEqual(5);
    expect(categories.has('pets')).toBe(true);
    expect(categories.has('wild')).toBe(true);
    expect(categories.has('sea')).toBe(true);
    expect(categories.has('fruits')).toBe(true);
    expect(categories.has('transport')).toBe(true);
  });
});

import { describe, it, expect } from 'vitest';
import { arTranslations } from '../i18n/ar';
import { enTranslations } from '../i18n/en';

describe('i18n translation completeness', () => {
  it('should have matching top-level keys in Arabic and English dictionaries', () => {
    const arKeys = Object.keys(arTranslations).sort();
    const enKeys = Object.keys(enTranslations).sort();
    expect(arKeys).toEqual(enKeys);
  });

  it('should have all 6 category names translated in both languages', () => {
    const expectedCategories = ['numbers', 'letters', 'words', 'visual', 'logic', 'science'];
    expectedCategories.forEach((cat) => {
      expect(arTranslations.categoryNames[cat]).toBeDefined();
      expect(enTranslations.categoryNames[cat]).toBeDefined();
      expect(arTranslations.categoryDescriptions[cat]).toBeDefined();
      expect(enTranslations.categoryDescriptions[cat]).toBeDefined();
    });
  });

  it('should have valid non-empty core UI labels with TALEEN brand', () => {
    expect(arTranslations.appName).toContain('تالين');
    expect(enTranslations.appName).toContain('TALEEN');
    expect(arTranslations.allGames.length).toBeGreaterThan(0);
    expect(enTranslations.allGames.length).toBeGreaterThan(0);
    expect(arTranslations.stories.length).toBeGreaterThan(0);
    expect(arTranslations.consultation.length).toBeGreaterThan(0);
    expect(arTranslations.founderName).toBe('محمد فكري الكفافي');
  });
});

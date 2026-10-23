import { describe, it, expect } from 'vitest';
import { RELATIONS_DATA } from '../data/relationsData';

describe('Relations Game Data & Logic', () => {
  it('should have at least 50 relations', () => {
    expect(RELATIONS_DATA.length).toBeGreaterThanOrEqual(50);
  });

  it('should have unique IDs for all relations', () => {
    const ids = RELATIONS_DATA.map(r => r.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have at least 100 unique icons across all items', () => {
    const icons = new Set<string>();
    RELATIONS_DATA.forEach(r => {
      icons.add(r.itemA.icon);
      icons.add(r.itemB.icon);
    });
    expect(icons.size).toBeGreaterThanOrEqual(100);
  });

  it('should have both Arabic and English names/explanations for all relations', () => {
    RELATIONS_DATA.forEach(r => {
      expect(r.itemA.nameAr.length).toBeGreaterThan(0);
      expect(r.itemA.nameEn.length).toBeGreaterThan(0);
      expect(r.itemB.nameAr.length).toBeGreaterThan(0);
      expect(r.itemB.nameEn.length).toBeGreaterThan(0);
      expect(r.explanationAr.length).toBeGreaterThan(0);
      expect(r.explanationEn.length).toBeGreaterThan(0);
    });
  });

  it('should have valid categories for all relations', () => {
    const validCategories = ['tools', 'nature', 'food', 'parts', 'daily', 'animals', 'habitats', 'products'];
    RELATIONS_DATA.forEach(r => {
      expect(validCategories).toContain(r.category);
    });
  });

  it('should have difficulty levels for all relations', () => {
    const validLevels = ['easy', 'medium', 'advanced'];
    RELATIONS_DATA.forEach(r => {
      expect(validLevels).toContain(r.difficulty);
    });
  });
});

import { describe, it, expect } from 'vitest';
import { GAMES_LIST } from '../data/games';

describe('GAMES_LIST data integrity', () => {
  it('should contain exactly 18 playable educational games', () => {
    expect(GAMES_LIST.length).toBe(18);
  });

  it('should have unique ids for all games', () => {
    const ids = GAMES_LIST.map((g) => g.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should contain all 12 original ported games and 6 new educational games', () => {
    const original12 = [
      'numbers',
      'arabic-letters',
      'english-letters',
      'arabic-words',
      'english-words',
      'images',
      'relations',
      'opposites',
      'puzzle-2',
      'puzzle-4',
      'seasons',
      'day-night',
    ];
    const new6 = [
      'pattern-complete',
      'odd-one-out',
      'animal-habitats',
      'counting-compare',
      'color-shape-sorter',
      'emotions-kids',
    ];

    const currentIds = GAMES_LIST.map((g) => g.id);
    original12.forEach((id) => expect(currentIds).toContain(id));
    new6.forEach((id) => expect(currentIds).toContain(id));
  });

  it('each game should have valid bilingual titles, descriptions, icons and age ranges', () => {
    GAMES_LIST.forEach((game) => {
      expect(game.title.length).toBeGreaterThan(0);
      expect(game.titleEn.length).toBeGreaterThan(0);
      expect(game.description.length).toBeGreaterThan(0);
      expect(game.descriptionEn.length).toBeGreaterThan(0);
      expect(game.icon.length).toBeGreaterThan(0);
      expect(game.minAge).toBeLessThanOrEqual(game.maxAge);
      expect(game.skills.length).toBeGreaterThan(0);
      expect(game.skillsEn.length).toBeGreaterThan(0);
    });
  });
});

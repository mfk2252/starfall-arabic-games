import { describe, it, expect } from 'vitest';
import { GAMES_LIST } from '../data/games';

describe('GAMES_LIST data integrity', () => {
  it('should contain a set of playable educational games', () => {
    expect(GAMES_LIST.length).toBeGreaterThanOrEqual(18);
  });

  it('should have unique ids for all games', () => {
    const ids = GAMES_LIST.map((g) => g.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should contain all core educational games', () => {
    const coreGames = [
      'numbers',
      'arabic-letters',
      'english-letters',
      'arabic-words',
      'english-words',
      'images',
      'relations',
      'opposites',
      'seasons',
      'day-night',
      'pattern-complete',
      'odd-one-out',
      'animal-habitats',
      'counting-compare',
      'color-shape-sorter',
      'emotions-kids',
      'math-game',
      'word-builder',
      'xo-game',
      'shadow-game',
      'learning-clock'
    ];

    const currentIds = GAMES_LIST.map((g) => g.id);
    coreGames.forEach((id) => expect(currentIds).toContain(id));
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

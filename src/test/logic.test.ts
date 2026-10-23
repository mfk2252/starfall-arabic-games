import { describe, it, expect } from 'vitest';
import { PATTERN_QUESTIONS, ODD_ONE_OUT_QUESTIONS, ANIMAL_HABITATS, EMOTIONS_DATA } from '../data/gameContent';

describe('Educational Game Content Logic', () => {
  it('each pattern question must have exactly one correct answer', () => {
    PATTERN_QUESTIONS.forEach((q) => {
      const correctOptions = q.options.filter((o) => o.isCorrect);
      expect(correctOptions.length).toBe(1);
      expect(q.sequence[q.sequence.length - 1]).toBe('؟');
    });
  });

  it('each odd-one-out question must have exactly one odd element with non-empty reason', () => {
    ODD_ONE_OUT_QUESTIONS.forEach((q) => {
      const oddItems = q.items.filter((i) => i.isOdd);
      expect(oddItems.length).toBe(1);
      expect(oddItems[0].reason.length).toBeGreaterThan(0);
      expect(oddItems[0].reasonEn.length).toBeGreaterThan(0);
    });
  });

  it('each animal habitat question must have exactly one correct habitat and favorite food', () => {
    ANIMAL_HABITATS.forEach((q) => {
      const correctHabitats = q.habitats.filter((h) => h.isCorrect);
      expect(correctHabitats.length).toBe(1);
      expect(q.favoriteFood.name.length).toBeGreaterThan(0);
      expect(q.funFact.length).toBeGreaterThan(0);
    });
  });

  it('emotions data must have valid entries', () => {
    expect(EMOTIONS_DATA.length).toBeGreaterThan(0);
    EMOTIONS_DATA.forEach((e) => {
      expect(e.emoji.length).toBeGreaterThan(0);
      expect(e.labelAr.length).toBeGreaterThan(0);
      expect(e.labelEn.length).toBeGreaterThan(0);
    });
  });
});

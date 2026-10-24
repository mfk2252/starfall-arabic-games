import { describe, it, expect } from 'vitest';
import { SEQUENCE_STORIES } from '../data/sequenceData';
import { GAMES_LIST } from '../data/games';

describe('Chronological Sequence Game - Data Integrity', () => {
  it('should be present in GAMES_LIST dataset', () => {
    const gameInfo = GAMES_LIST.find((g) => g.id === 'chronological-sequence');
    expect(gameInfo).toBeDefined();
    expect(gameInfo?.title).toBe('التسلسل الزمني');
    expect(gameInfo?.category).toBe('logic');
  });

  it('should contain at least 30 complete stories', () => {
    expect(SEQUENCE_STORIES.length).toBeGreaterThanOrEqual(30);
  });

  it('should have unique IDs for all stories', () => {
    const ids = SEQUENCE_STORIES.map((s) => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have valid step counts and sequential IDs for every story', () => {
    SEQUENCE_STORIES.forEach((story) => {
      expect(story.steps.length).toBeGreaterThanOrEqual(3);
      expect(story.steps.length).toBeLessThanOrEqual(4);

      // Verify each step has required fields
      story.steps.forEach((step) => {
        expect(step.id).toBeGreaterThan(0);
        expect(step.label).toBeTruthy();
        expect(step.labelEn).toBeTruthy();
        expect(step.icon).toBeTruthy();
      });

      // Check step IDs form 1..N sequence
      const stepIds = story.steps.map((s) => s.id).sort((a, b) => a - b);
      const expectedIds = Array.from({ length: story.steps.length }, (_, i) => i + 1);
      expect(stepIds).toEqual(expectedIds);
    });
  });

  it('should support difficulty filtering for easy, medium, and advanced', () => {
    const easyStories = SEQUENCE_STORIES.filter((s) => s.difficulty === 'easy');
    const mediumStories = SEQUENCE_STORIES.filter((s) => s.difficulty === 'medium');
    const advancedStories = SEQUENCE_STORIES.filter((s) => s.difficulty === 'advanced');

    expect(easyStories.length).toBeGreaterThan(0);
    expect(mediumStories.length).toBeGreaterThan(0);
    expect(advancedStories.length).toBeGreaterThan(0);
  });

  it('should correctly evaluate chronological order check', () => {
    const story = SEQUENCE_STORIES[0];
    const correctSteps = [...story.steps].sort((a, b) => a.id - b.id);
    const wrongSteps = [...story.steps].sort((a, b) => b.id - a.id);

    const isCorrect = correctSteps.every((step, idx) => step.id === idx + 1);
    const isWrong = wrongSteps.every((step, idx) => step.id === idx + 1);

    expect(isCorrect).toBe(true);
    expect(isWrong).toBe(false);
  });
});

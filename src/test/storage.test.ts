import { describe, it, expect, beforeEach } from 'vitest';
import { saveGameProgress, getGameProgress, getAllProgress, clearAllProgress } from '../utils/storage';

describe('Storage and Progress Tracking', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should save and retrieve progress for a specific game', () => {
    saveGameProgress('numbers', 80, true);
    const prog = getGameProgress('numbers');
    expect(prog).not.toBeNull();
    expect(prog?.score).toBe(80);
    expect(prog?.completed).toBe(true);
    expect(prog?.stars).toBe(3); // Score >= 80 awards 3 stars
  });

  it('should properly award 2 stars for score 60-79', () => {
    saveGameProgress('arabic-letters', 65, true);
    const prog = getGameProgress('arabic-letters');
    expect(prog?.stars).toBe(2);
  });

  it('should properly award 1 star for scores below 60', () => {
    saveGameProgress('puzzle-2', 40, true);
    const prog = getGameProgress('puzzle-2');
    expect(prog?.stars).toBe(1);
  });

  it('should maintain the highest score and highest star count across replays', () => {
    saveGameProgress('seasons', 90, true);
    // Lower score replay
    saveGameProgress('seasons', 30, true);
    const prog = getGameProgress('seasons');
    expect(prog?.highScore).toBe(90);
    expect(prog?.stars).toBe(3);
    expect(prog?.timesPlayed).toBe(2);
  });

  it('migrates legacy starfall_progress data into taleen_progress automatically', () => {
    const legacy = {
      numbers: { score: 85, highScore: 85, timesPlayed: 1, completed: true, date: '2026-01-01', stars: 3 },
    };
    localStorage.setItem('starfall_progress', JSON.stringify(legacy));

    const all = getAllProgress();
    expect(all.numbers?.stars).toBe(3);
    expect(localStorage.getItem('taleen_progress')).not.toBeNull();
  });

  it('clearAllProgress removes both current and legacy storage keys', () => {
    localStorage.setItem('starfall_progress', JSON.stringify({ numbers: { stars: 2 } }));
    saveGameProgress('numbers', 80, true);
    clearAllProgress();

    expect(localStorage.getItem('taleen_progress')).toBeNull();
    expect(localStorage.getItem('starfall_progress')).toBeNull();
    expect(getAllProgress()).toEqual({});
  });
});

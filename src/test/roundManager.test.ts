import { describe, it, expect, beforeEach } from 'vitest';
import { RoundManager } from '../utils/roundManager';

interface DummyItem {
  id: string;
  name: string;
}

const dummyPool: DummyItem[] = Array.from({ length: 20 }, (_, i) => ({
  id: `item_${i + 1}`,
  name: `Item ${i + 1}`,
}));

describe('RoundManager Utility Logic', () => {
  let manager: RoundManager<DummyItem>;

  beforeEach(() => {
    manager = new RoundManager<DummyItem>(dummyPool, 15);
  });

  it('selects requested number of items without internal duplicate IDs', () => {
    const round1 = manager.getNextRoundItems(5);
    expect(round1.length).toBe(5);
    const ids = round1.map((item) => item.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(5);
  });

  it('prevents repeating items across consecutive rounds until pool is exhausted', () => {
    const round1 = manager.getNextRoundItems(5);
    const round1Ids = new Set(round1.map((item) => item.id));

    const round2 = manager.getNextRoundItems(5);
    round2.forEach((item) => {
      expect(round1Ids.has(item.id)).toBe(false);
    });
  });

  it('recycles items gracefully when requested count exceeds remaining unseen items', () => {
    // 20 items in total pool. Get 15 in first rounds.
    manager.getNextRoundItems(10);
    manager.getNextRoundItems(8);
    // Only 2 unseen left, but asking for 5
    const round3 = manager.getNextRoundItems(5);
    expect(round3.length).toBe(5);
  });

  it('resets session memory properly', () => {
    manager.getNextRoundItems(10);
    expect(manager.getSeenCount()).toBeGreaterThan(0);
    manager.resetSession();
    expect(manager.getSeenCount()).toBe(0);
  });
});

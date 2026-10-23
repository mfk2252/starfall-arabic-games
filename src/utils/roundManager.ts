/**
 * Smart Round & Content Manager for TALEEN Educational Games
 * Handles non-repetitive selection across rounds, difficulty filtering,
 * random option shuffling, and session history memory.
 */

export interface HasId {
  id: string | number;
}

export class RoundManager<T extends HasId> {
  private fullPool: T[];
  private seenIds: Set<string | number>;
  private maxHistory: number;

  constructor(pool: T[], maxHistory: number = 30) {
    this.fullPool = pool;
    this.seenIds = new Set();
    this.maxHistory = maxHistory;
  }

  /**
   * Resets session memory history.
   */
  public resetSession(): void {
    this.seenIds.clear();
  }

  /**
   * Shuffles an array randomly using Fisher-Yates algorithm.
   */
  public shuffle<U>(array: U[]): U[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /**
   * Returns a fresh selection of items for a new round, prioritizing items not recently seen in the session.
   */
  public getNextRoundItems(count: number, filterFn?: (item: T) => boolean): T[] {
    let pool = filterFn ? this.fullPool.filter(filterFn) : [...this.fullPool];
    if (pool.length === 0) {
      pool = filterFn ? this.fullPool.filter(filterFn) : [...this.fullPool];
    }

    // Unseen pool items
    const unseen = pool.filter((item) => !this.seenIds.has(item.id));

    let selected: T[] = [];

    if (unseen.length >= count) {
      selected = this.shuffle(unseen).slice(0, count);
    } else {
      // If unseen items are fewer than requested count, pick all unseen plus shuffle previously seen ones
      const seenInPool = pool.filter((item) => this.seenIds.has(item.id));
      const needed = count - unseen.length;
      const recycled = this.shuffle(seenInPool).slice(0, needed);
      selected = this.shuffle([...unseen, ...recycled]);
    }

    // Record selected IDs into session history
    selected.forEach((item) => {
      this.seenIds.add(item.id);
    });

    // Prune history if it exceeds maxHistory
    if (this.seenIds.size > this.maxHistory) {
      const seenArray = Array.from(this.seenIds);
      const trimmed = seenArray.slice(seenArray.length - this.maxHistory);
      this.seenIds = new Set(trimmed);
    }

    return selected;
  }

  /**
   * Checks if an ID has been seen in the current session.
   */
  public hasSeen(id: string | number): boolean {
    return this.seenIds.has(id);
  }

  /**
   * Gets the total count of unique items seen in the session.
   */
  public getSeenCount(): number {
    return this.seenIds.size;
  }
}

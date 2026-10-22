import { GameId, GameProgress, AllProgress } from '../types';

const STORAGE_KEY = 'starfall_progress';

export function getAllProgress(): AllProgress {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function getGameProgress(gameId: GameId): GameProgress | null {
  const all = getAllProgress();
  return all[gameId] || null;
}

export function saveGameProgress(
  gameId: GameId,
  score: number,
  completed: boolean = true
): GameProgress {
  const all = getAllProgress();
  const existing = all[gameId];

  // Calculate stars (1, 2, or 3 based on score/completion)
  let stars = 1;
  if (score >= 60) stars = 2;
  if (score >= 80) stars = 3;

  const updated: GameProgress = {
    score: score,
    highScore: existing ? Math.max(existing.highScore || 0, score) : score,
    timesPlayed: (existing?.timesPlayed || 0) + 1,
    completed: completed || (existing?.completed ?? false),
    date: new Date().toISOString(),
    stars: existing ? Math.max(existing.stars || 1, stars) : stars,
  };

  all[gameId] = updated;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // LocalStorage full or private browsing
  }

  return updated;
}

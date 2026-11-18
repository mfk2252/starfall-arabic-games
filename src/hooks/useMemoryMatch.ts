import { useState, useEffect, useCallback, useRef } from 'react';
import { GameId } from '../types';
import { sound } from '../utils/audio';
import { saveGameProgress } from '../utils/storage';

export interface MemoryCardBase {
  id: number;
  isFlipped: boolean;
  isMatched: boolean;
}

interface UseMemoryMatchOptions<TCard extends MemoryCardBase> {
  gameId: GameId;
  totalPairs: number;
  buildCards: () => Omit<TCard, 'id' | 'isFlipped' | 'isMatched'>[];
  isMatch: (first: TCard, second: TCard) => boolean;
  onMatch?: (first: TCard, second: TCard, nextScore: number, nextMatchedPairs: number) => void;
  onMismatch?: (first: TCard, second: TCard) => void;
  pointsPerMatch?: number;
  mismatchPenalty?: number;
  matchDelayMs?: number;
  mismatchDelayMs?: number;
}

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function useMemoryMatch<TCard extends MemoryCardBase>({
  gameId,
  totalPairs,
  buildCards,
  isMatch,
  onMatch,
  onMismatch,
  pointsPerMatch = 10,
  mismatchPenalty = 2,
  matchDelayMs = 500,
  mismatchDelayMs = 1000,
}: UseMemoryMatchOptions<TCard>) {
  const [cards, setCards] = useState<TCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const timersRef = useRef<number[]>([]);
  const scoreRef = useRef<number>(0);
  const matchedPairsRef = useRef<number>(0);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    timersRef.current = [];
  }, []);

  const scheduleTimer = useCallback((fn: () => void, delayMs: number) => {
    const id = window.setTimeout(() => {
      timersRef.current = timersRef.current.filter((t) => t !== id);
      fn();
    }, delayMs);
    timersRef.current.push(id);
  }, []);

  const initGame = useCallback(() => {
    clearTimers();
    const rawCards = shuffleArray(buildCards());
    const initialCards = rawCards.map((item, idx) => ({
      ...item,
      id: idx,
      isFlipped: false,
      isMatched: false,
    })) as TCard[];

    setCards(initialCards);
    setFlippedIndices([]);
    scoreRef.current = 0;
    matchedPairsRef.current = 0;
    setScore(0);
    setMatchedPairs(0);
    setIsGameOver(false);
  }, [buildCards, clearTimers]);

  useEffect(() => {
    initGame();
    return () => {
      clearTimers();
    };
  }, [initGame, clearTimers]);

  const handleCardClick = useCallback(
    (index: number) => {
      if (flippedIndices.length >= 2) return;
      const clicked = cards[index];
      if (!clicked || clicked.isFlipped || clicked.isMatched) return;

      sound.playFlip();

      const updated = cards.map((c, i) =>
        i === index ? { ...c, isFlipped: true } : c
      );
      setCards(updated);

      const newFlipped = [...flippedIndices, index];
      setFlippedIndices(newFlipped);

      if (newFlipped.length === 2) {
        const [firstIdx, secondIdx] = newFlipped;
        const firstCard = updated[firstIdx];
        const secondCard = updated[secondIdx];

        if (isMatch(firstCard, secondCard)) {
          scheduleTimer(() => {
            sound.playMatch();
            setCards((prev) =>
              prev.map((c, i) =>
                i === firstIdx || i === secondIdx ? { ...c, isMatched: true } : c
              )
            );
            setFlippedIndices([]);

            const nextMatched = matchedPairsRef.current + 1;
            const nextScore = scoreRef.current + pointsPerMatch;
            matchedPairsRef.current = nextMatched;
            scoreRef.current = nextScore;
            setMatchedPairs(nextMatched);
            setScore(nextScore);

            onMatch?.(firstCard, secondCard, nextScore, nextMatched);

            if (nextMatched >= totalPairs) {
              saveGameProgress(gameId, nextScore, true);
              setIsGameOver(true);
            }
          }, matchDelayMs);
        } else {
          scheduleTimer(() => {
            sound.playWrong();
            setCards((prev) =>
              prev.map((c, i) =>
                i === firstIdx || i === secondIdx ? { ...c, isFlipped: false } : c
              )
            );
            setFlippedIndices([]);

            const nextScore = Math.max(0, scoreRef.current - mismatchPenalty);
            scoreRef.current = nextScore;
            setScore(nextScore);

            onMismatch?.(firstCard, secondCard);
          }, mismatchDelayMs);
        }
      }
    },
    [
      cards,
      flippedIndices,
      gameId,
      isMatch,
      matchDelayMs,
      mismatchDelayMs,
      mismatchPenalty,
      onMatch,
      onMismatch,
      pointsPerMatch,
      scheduleTimer,
      totalPairs,
    ]
  );

  return {
    cards,
    score,
    matchedPairs,
    isGameOver,
    initGame,
    handleCardClick,
  };
}

export type GameId =
  | 'numbers'
  | 'english-letters'
  | 'arabic-letters'
  | 'arabic-words'
  | 'english-words'
  | 'images'
  | 'relations'
  | 'opposites'
  | 'puzzle-2'
  | 'puzzle-4'
  | 'seasons'
  | 'day-night'
  | 'pattern-complete'
  | 'odd-one-out'
  | 'animal-habitats'
  | 'counting-compare'
  | 'color-shape-sorter'
  | 'emotions-kids'
  | 'math-game'
  | 'word-builder'
  | 'xo-game'
  | 'shadow-game'
  | 'listen-choose'
  | 'learning-clock';

export type GameCategory =
  | 'numbers'
  | 'letters'
  | 'words'
  | 'visual'
  | 'logic'
  | 'science';

export interface GameInfo {
  id: GameId;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
  gradient: string;
  accentColor: string;
  category: GameCategory;
  ageRange: string;
  ageRangeEn: string;
  minAge: number;
  maxAge: number;
  difficulty: 'easy' | 'medium' | 'advanced';
  isNew?: boolean;
  featured?: boolean;
  skills: string[];
  skillsEn: string[];
}

export interface GameProgress {
  score: number;
  highScore: number;
  timesPlayed: number;
  completed: boolean;
  date: string;
  stars: number; // 1, 2, or 3
}

export type AllProgress = Record<string, GameProgress>;

/**
 * Типи профілю — окремий файл, щоб уникнути циклічних залежностей
 * між `store/profile.ts` і `features/achievements/registry.ts`.
 */

export type ThemeId = 'space' | 'dino' | 'world' | 'voxel' | 'blocky';

export type TopicId =
  | 'oral'
  | 'column'
  | 'order'
  | 'fractions'
  | 'decimals'
  | 'word'
  | 'units'
  | 'geometry'
  | 'logic'
  | 'equations';

export type Difficulty = 1 | 2 | 3 | 4 | 5;

export interface TopicProgress {
  topicId: TopicId;
  totalAttempts: number;
  correct: number;
  currentDifficulty: Difficulty;
  unlocked: boolean;
  mastered: boolean;
  consecutiveCorrect: number;
  recentMistakes: number;
}

/** Один елемент у журналі помилок (інтервальне повторення). */
export interface ErrorQueueItem {
  id: string;
  topicId: TopicId;
  subtopic: string;
  question: string;
  correctAnswer: string;
  acceptedAnswers?: string[];
  hints: string[];
  solution: string;
  difficulty: Difficulty;
  nextReviewDate: string;
  successStreak: number;
  reviewCount: number;
  addedDate: string;
}

export interface ProfileFlags {
  hadPerfectSession?: boolean;
  perfectSessionsCount?: number;
  hadFastSession?: boolean;
  highestExamGrade?: number;
  errorsResolved?: number;
}

export interface DailyActivity {
  date: string;
  attempts: number;
  correct: number;
  stars: number;
  timeSec: number;
}

export interface ProfileSettings {
  soundsEnabled: boolean;
  parentPinHash?: string;
}

export interface DailyGoal {
  type: 'tasks' | 'minutes';
  value: number;
}

export interface Profile {
  name: string;
  age: number;
  theme: ThemeId | null;
  createdAt: number;
  level: number;
  xp: number;
  stars: number;
  coins: number;
  streak: number;
  longestStreak: number;
  shieldsCount: number;
  lastActiveDate: string | null;
  achievements: string[];
  /** Нещодавно отримані ачивки — для тостера. */
  pendingAchievements: string[];
  dailyGoal: DailyGoal;
  topics: Record<TopicId, TopicProgress>;
  flags: ProfileFlags;
  errorQueue: ErrorQueueItem[];
  activity: Record<string, DailyActivity>;
  settings: ProfileSettings;
}

export const TOPIC_IDS: TopicId[] = [
  'oral',
  'column',
  'order',
  'fractions',
  'decimals',
  'word',
  'units',
  'geometry',
  'logic',
  'equations',
];

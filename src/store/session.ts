import { create } from 'zustand';
import type { Task } from '@/features/tasks/types';
import type { TopicId } from './profile';

export type Stars = 0 | 1 | 2 | 3;
export type SessionMode = 'practice' | 'exam' | 'review';

export interface AttemptRecord {
  taskId: string;
  isCorrect: boolean;
  stars: Stars;
  hintLevel: number;
  timeSec: number;
  attempts: number;
}

interface SessionState {
  topicId: TopicId | null;
  tasks: Task[];
  index: number;
  records: AttemptRecord[];
  mode: SessionMode;
  examTitle?: string;
  /** Для режиму review: id елементів `errorQueue`, з яких побудовані task'и. */
  reviewIds?: string[];
  startSession: (topicId: TopicId, tasks: Task[]) => void;
  startExam: (title: string, tasks: Task[]) => void;
  startReview: (tasks: Task[], reviewIds: string[]) => void;
  recordAttempt: (record: AttemptRecord) => void;
  next: () => void;
  reset: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  topicId: null,
  tasks: [],
  index: 0,
  records: [],
  mode: 'practice',
  examTitle: undefined,
  reviewIds: undefined,
  startSession: (topicId, tasks) =>
    set({
      topicId,
      tasks,
      index: 0,
      records: [],
      mode: 'practice',
      examTitle: undefined,
      reviewIds: undefined,
    }),
  startExam: (title, tasks) =>
    set({
      topicId: null,
      tasks,
      index: 0,
      records: [],
      mode: 'exam',
      examTitle: title,
      reviewIds: undefined,
    }),
  startReview: (tasks, reviewIds) =>
    set({
      topicId: null,
      tasks,
      index: 0,
      records: [],
      mode: 'review',
      examTitle: undefined,
      reviewIds,
    }),
  recordAttempt: (record) => set((s) => ({ records: [...s.records, record] })),
  next: () => set((s) => ({ index: s.index + 1 })),
  reset: () =>
    set({
      topicId: null,
      tasks: [],
      index: 0,
      records: [],
      mode: 'practice',
      examTitle: undefined,
      reviewIds: undefined,
    }),
}));

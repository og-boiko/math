import type { Difficulty, TopicId } from '@/store/profile';

export type AnswerType = 'number' | 'text' | 'choice' | 'fraction' | 'decimal';

export interface Task {
  id: string;
  topicId: TopicId;
  subtopic: string;
  difficulty: Difficulty;
  question: string;
  answerType: AnswerType;
  correctAnswer: string;
  /** Альтернативні правильні відповіді (наприклад, для дробів: "1/2" і "2/4") */
  acceptedAnswers?: string[];
  options?: string[];
  hints: string[];
  solution: string;
  estimatedSec: number;
}

export interface Generator {
  topicId: TopicId;
  subtopic: string;
  generate: (difficulty: Difficulty) => Task;
}

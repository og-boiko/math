/**
 * Реєстр ачивок. Перевірка ачивок — в `profile.checkAchievements`.
 * Кожна ачивка має умову (predicate) на знімок профілю.
 */
import type { Profile, TopicProgress } from '@/store/profile-types';

export interface Achievement {
  id: string;
  emoji: string;
  title: string;
  description: string;
  check: (p: Profile) => boolean;
}

export const achievements: Achievement[] = [
  {
    id: 'first-step',
    emoji: '👶',
    title: 'Перший крок',
    description: 'Розв’яжи свою першу задачу',
    check: (p) => totalAttempts(p) >= 1,
  },
  {
    id: 'centurion',
    emoji: '💯',
    title: 'Сотня!',
    description: 'Розв’яжи 100 задач',
    check: (p) => totalAttempts(p) >= 100,
  },
  {
    id: 'half-thousand',
    emoji: '🚀',
    title: '500 задач',
    description: 'Розв’яжи 500 задач',
    check: (p) => totalAttempts(p) >= 500,
  },
  {
    id: 'star-collector',
    emoji: '⭐',
    title: 'Зорелов',
    description: 'Збери 100 зірок',
    check: (p) => p.stars >= 100,
  },
  {
    id: 'star-shower',
    emoji: '🌟',
    title: 'Зорепад',
    description: 'Збери 500 зірок',
    check: (p) => p.stars >= 500,
  },
  {
    id: 'level-5',
    emoji: '🥉',
    title: 'Початківець',
    description: 'Досягни 5-го рівня',
    check: (p) => p.level >= 5,
  },
  {
    id: 'level-10',
    emoji: '🥈',
    title: 'Досвідчений',
    description: 'Досягни 10-го рівня',
    check: (p) => p.level >= 10,
  },
  {
    id: 'level-20',
    emoji: '🥇',
    title: 'Майстер',
    description: 'Досягни 20-го рівня',
    check: (p) => p.level >= 20,
  },
  {
    id: 'streak-3',
    emoji: '🔥',
    title: 'Три дні поспіль',
    description: 'Заходь 3 дні підряд',
    check: (p) => p.streak >= 3,
  },
  {
    id: 'streak-7',
    emoji: '🔥',
    title: 'Тиждень підряд',
    description: 'Заходь 7 днів підряд',
    check: (p) => p.streak >= 7,
  },
  {
    id: 'streak-30',
    emoji: '👑',
    title: 'Місяць підряд',
    description: 'Заходь 30 днів підряд',
    check: (p) => p.streak >= 30,
  },
  {
    id: 'perfect-session',
    emoji: '💎',
    title: 'Перфектна сесія',
    description: 'Сесія без жодної помилки',
    check: (p) => Boolean(p.flags?.hadPerfectSession),
  },
  {
    id: 'three-perfect',
    emoji: '💠',
    title: 'Три перфектні',
    description: '3 ідеальні сесії',
    check: (p) => (p.flags?.perfectSessionsCount ?? 0) >= 3,
  },
  {
    id: 'lightning',
    emoji: '⚡',
    title: 'Блискавка',
    description: 'Сесія < 5 хв',
    check: (p) => Boolean(p.flags?.hadFastSession),
  },
  {
    id: 'topic-master',
    emoji: '🎯',
    title: 'Майстер теми',
    description: 'Дійти до 5 рівня в темі',
    check: (p) =>
      Object.values(p.topics).some(
        (t: TopicProgress) => t.currentDifficulty === 5 && t.totalAttempts >= 30,
      ),
  },
  {
    id: 'omnivore',
    emoji: '🌈',
    title: 'Всеїдний',
    description: 'Спробуй усі 10 тем',
    check: (p) =>
      Object.values(p.topics).filter((t: TopicProgress) => t.totalAttempts > 0).length >= 10,
  },
  {
    id: 'exam-passed',
    emoji: '🎓',
    title: 'Випускник',
    description: 'Здай контрольну на 10 і вище',
    check: (p) => Boolean(p.flags?.highestExamGrade && p.flags.highestExamGrade >= 10),
  },
  {
    id: 'errors-fixed',
    emoji: '🔁',
    title: 'Робота над помилками',
    description: 'Виправити 10 помилок',
    check: (p) => (p.flags?.errorsResolved ?? 0) >= 10,
  },
  {
    id: 'workbench-engineer',
    emoji: '🧰',
    title: 'Інженер',
    description: 'Скористайся робочим столом 10 разів',
    check: (p) => (p.flags?.workbenchUses ?? 0) >= 10,
  },
  {
    id: 'workbench-thinker',
    emoji: '📝',
    title: 'Не довіряй голові',
    description: 'Розв\u2019яжи 50 задач із робочим столом',
    check: (p) => (p.flags?.workbenchCorrectAnswers ?? 0) >= 50,
  },
];

function totalAttempts(p: Profile): number {
  return Object.values(p.topics).reduce(
    (s: number, t: TopicProgress) => s + t.totalAttempts,
    0,
  );
}

export function findAchievement(id: string): Achievement | undefined {
  return achievements.find((a) => a.id === id);
}

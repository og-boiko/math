import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { todayKey, dayDiff, addDays } from '@/lib/dates';
import { achievements as ACHIEVEMENTS } from '@/features/achievements/registry';
import type {
  Profile,
  ThemeId,
  TopicId,
  Difficulty,
  TopicProgress,
  ErrorQueueItem,
  ProfileFlags,
  ProfileSettings,
  DailyActivity,
  DailyGoal,
} from './profile-types';
import { TOPIC_IDS } from './profile-types';

export type {
  Profile,
  ThemeId,
  TopicId,
  Difficulty,
  TopicProgress,
  ErrorQueueItem,
  ProfileFlags,
  ProfileSettings,
  DailyActivity,
  DailyGoal,
};

const REVIEW_INTERVALS = [1, 2, 4, 8, 16];

function defaultTopics(): Record<TopicId, TopicProgress> {
  const map = {} as Record<TopicId, TopicProgress>;
  for (const id of TOPIC_IDS) {
    map[id] = {
      topicId: id,
      totalAttempts: 0,
      correct: 0,
      currentDifficulty: 1,
      unlocked: true,
      mastered: false,
      consecutiveCorrect: 0,
      recentMistakes: 0,
    };
  }
  return map;
}

function levelFromXp(xp: number): number {
  return Math.max(1, Math.floor(Math.sqrt(xp / 100)) + 1);
}

function detectNewAchievements(profile: Profile): string[] {
  const earned = new Set(profile.achievements);
  const fresh: string[] = [];
  for (const a of ACHIEVEMENTS) {
    if (!earned.has(a.id) && a.check(profile)) fresh.push(a.id);
  }
  return fresh;
}

function applyAchievements(profile: Profile): Profile {
  const fresh = detectNewAchievements(profile);
  if (!fresh.length) return profile;
  return {
    ...profile,
    achievements: [...profile.achievements, ...fresh],
    pendingAchievements: [...profile.pendingAchievements, ...fresh],
    coins: profile.coins + fresh.length * 5,
  };
}

function updateStreak(profile: Profile): Profile {
  const today = todayKey();
  if (profile.lastActiveDate === today) return profile;
  const newStreak =
    profile.lastActiveDate && dayDiff(profile.lastActiveDate, today) === 1
      ? profile.streak + 1
      : 1;
  return {
    ...profile,
    streak: newStreak,
    longestStreak: Math.max(profile.longestStreak, newStreak),
    lastActiveDate: today,
  };
}

function trackActivity(
  profile: Profile,
  delta: { attempts: number; correct: number; stars: number; timeSec: number },
): Profile {
  const today = todayKey();
  const prev: DailyActivity = profile.activity[today] ?? {
    date: today,
    attempts: 0,
    correct: 0,
    stars: 0,
    timeSec: 0,
  };
  return {
    ...profile,
    activity: {
      ...profile.activity,
      [today]: {
        date: today,
        attempts: prev.attempts + delta.attempts,
        correct: prev.correct + delta.correct,
        stars: prev.stars + delta.stars,
        timeSec: prev.timeSec + delta.timeSec,
      },
    },
  };
}

interface AwardArgs {
  topicId: TopicId;
  correct: boolean;
  stars: number;
  timeSec: number;
}

interface SessionSummaryArgs {
  total: number;
  correct: number;
  totalTimeSec: number;
}

interface ProfileState {
  profile: Profile | null;
  initProfile: (data: { name: string; age: number }) => void;
  setTheme: (theme: ThemeId) => void;
  awardForAnswer: (args: AwardArgs) => void;
  finishSession: (args: SessionSummaryArgs) => void;
  recordExamGrade: (grade: number) => void;
  addError: (
    item: Omit<ErrorQueueItem, 'nextReviewDate' | 'successStreak' | 'reviewCount' | 'addedDate'>,
  ) => void;
  reviewError: (id: string, wasCorrect: boolean) => void;
  dueErrors: () => ErrorQueueItem[];
  updateSettings: (patch: Partial<ProfileSettings>) => void;
  updateDailyGoal: (goal: DailyGoal) => void;
  consumePendingAchievements: () => string[];
  resetProfile: () => void;
}

function emptyProfile(name: string, age: number): Profile {
  return {
    name,
    age,
    theme: null,
    createdAt: Date.now(),
    level: 1,
    xp: 0,
    stars: 0,
    coins: 0,
    streak: 0,
    longestStreak: 0,
    shieldsCount: 0,
    lastActiveDate: null,
    achievements: [],
    pendingAchievements: [],
    dailyGoal: { type: 'tasks', value: 20 },
    topics: defaultTopics(),
    flags: {},
    errorQueue: [],
    activity: {},
    settings: { soundsEnabled: true },
  };
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: null,

      initProfile: ({ name, age }) => set(() => ({ profile: emptyProfile(name, age) })),

      setTheme: (theme) => set((s) => (s.profile ? { profile: { ...s.profile, theme } } : s)),

      awardForAnswer: ({ topicId, correct, stars, timeSec }) =>
        set((s) => {
          if (!s.profile) return s;
          const t = s.profile.topics[topicId];
          const totalAttempts = t.totalAttempts + 1;
          const correctCount = t.correct + (correct ? 1 : 0);
          let consecutive = correct ? t.consecutiveCorrect + 1 : 0;
          let recent = correct ? Math.max(0, t.recentMistakes - 1) : t.recentMistakes + 1;
          let difficulty = t.currentDifficulty;

          if (consecutive >= 3 && difficulty < 5) {
            difficulty = (difficulty + 1) as Difficulty;
            consecutive = 0;
          }
          if (recent >= 2 && difficulty > 1) {
            difficulty = (difficulty - 1) as Difficulty;
            recent = 0;
          }

          const xpGain = stars * 10;
          const xp = s.profile.xp + xpGain;
          const level = levelFromXp(xp);

          let next: Profile = {
            ...s.profile,
            xp,
            level,
            stars: s.profile.stars + stars,
            coins: s.profile.coins + (correct ? 1 : 0),
            topics: {
              ...s.profile.topics,
              [topicId]: {
                ...t,
                totalAttempts,
                correct: correctCount,
                consecutiveCorrect: consecutive,
                recentMistakes: recent,
                currentDifficulty: difficulty,
              },
            },
          };

          if (correct) next = updateStreak(next);
          next = trackActivity(next, {
            attempts: 1,
            correct: correct ? 1 : 0,
            stars,
            timeSec,
          });
          next = applyAchievements(next);
          return { profile: next };
        }),

      finishSession: ({ total, correct, totalTimeSec }) =>
        set((s) => {
          if (!s.profile) return s;
          const perfect = total > 0 && correct === total;
          const fast = total >= 10 && totalTimeSec <= 300;
          let next: Profile = {
            ...s.profile,
            flags: {
              ...s.profile.flags,
              hadPerfectSession: s.profile.flags.hadPerfectSession || perfect,
              perfectSessionsCount:
                (s.profile.flags.perfectSessionsCount ?? 0) + (perfect ? 1 : 0),
              hadFastSession: s.profile.flags.hadFastSession || fast,
            },
            coins: s.profile.coins + 5,
          };
          next = applyAchievements(next);
          return { profile: next };
        }),

      recordExamGrade: (grade) =>
        set((s) => {
          if (!s.profile) return s;
          let next: Profile = {
            ...s.profile,
            flags: {
              ...s.profile.flags,
              highestExamGrade: Math.max(s.profile.flags.highestExamGrade ?? 0, grade),
            },
          };
          next = applyAchievements(next);
          return { profile: next };
        }),

      addError: (item) =>
        set((s) => {
          if (!s.profile) return s;
          if (s.profile.errorQueue.some((e) => e.id === item.id)) return s;
          const fullItem: ErrorQueueItem = {
            ...item,
            nextReviewDate: addDays(todayKey(), REVIEW_INTERVALS[0]),
            successStreak: 0,
            reviewCount: 0,
            addedDate: todayKey(),
          };
          return {
            profile: { ...s.profile, errorQueue: [...s.profile.errorQueue, fullItem] },
          };
        }),

      reviewError: (id, wasCorrect) =>
        set((s) => {
          if (!s.profile) return s;
          const queue = s.profile.errorQueue;
          const idx = queue.findIndex((e) => e.id === id);
          if (idx === -1) return s;
          const item = queue[idx];
          const reviewCount = item.reviewCount + 1;

          if (wasCorrect) {
            const successStreak = item.successStreak + 1;
            if (successStreak >= 5) {
              const next: Profile = {
                ...s.profile,
                errorQueue: queue.filter((_, i) => i !== idx),
                flags: {
                  ...s.profile.flags,
                  errorsResolved: (s.profile.flags.errorsResolved ?? 0) + 1,
                },
              };
              return { profile: applyAchievements(next) };
            }
            const interval =
              REVIEW_INTERVALS[Math.min(successStreak, REVIEW_INTERVALS.length - 1)];
            const updated: ErrorQueueItem = {
              ...item,
              successStreak,
              reviewCount,
              nextReviewDate: addDays(todayKey(), interval),
            };
            return {
              profile: {
                ...s.profile,
                errorQueue: queue.map((e, i) => (i === idx ? updated : e)),
              },
            };
          }

          const updated: ErrorQueueItem = {
            ...item,
            successStreak: 0,
            reviewCount,
            nextReviewDate: addDays(todayKey(), REVIEW_INTERVALS[0]),
          };
          return {
            profile: {
              ...s.profile,
              errorQueue: queue.map((e, i) => (i === idx ? updated : e)),
            },
          };
        }),

      dueErrors: () => {
        const p = get().profile;
        if (!p) return [];
        const today = todayKey();
        return p.errorQueue.filter((e) => e.nextReviewDate <= today && e.addedDate !== today);
      },

      updateSettings: (patch) =>
        set((s) =>
          s.profile
            ? { profile: { ...s.profile, settings: { ...s.profile.settings, ...patch } } }
            : s,
        ),

      updateDailyGoal: (goal) =>
        set((s) => (s.profile ? { profile: { ...s.profile, dailyGoal: goal } } : s)),

      consumePendingAchievements: () => {
        const p = get().profile;
        if (!p) return [];
        const pending = [...p.pendingAchievements];
        if (pending.length) set({ profile: { ...p, pendingAchievements: [] } });
        return pending;
      },

      resetProfile: () => set({ profile: null }),
    }),
    {
      name: 'mathquest-profile-v2',
      version: 2,
      migrate: (state) => {
        const s = state as { profile?: Partial<Profile> } | undefined;
        if (!s?.profile) return state as ProfileState;
        const p = s.profile;
        return {
          profile: {
            ...emptyProfile(p.name ?? 'Артем', p.age ?? 10),
            ...p,
            flags: p.flags ?? {},
            errorQueue: p.errorQueue ?? [],
            activity: p.activity ?? {},
            pendingAchievements: p.pendingAchievements ?? [],
            longestStreak: p.longestStreak ?? p.streak ?? 0,
            achievements: p.achievements ?? [],
          },
        } as ProfileState;
      },
    },
  ),
);

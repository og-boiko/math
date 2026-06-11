/**
 * Cloud-sync для спрощеної моделі (1 user = 1 profile).
 */
import { cloudEnabled, supabase } from '../supabase';
import { useProfileStore } from '@/store/profile';
import {
  upsertMyStats,
  upsertMyTopics,
  upsertMyActivity,
  replaceMyErrors,
  fetchMyFullSnapshot,
} from '../api/me';

const DEBOUNCE_MS = 4000;
let timer: ReturnType<typeof setTimeout> | null = null;
let lastSerialized = '';
let started = false;
let pushing = false;

export function startCloudSync(): void {
  if (!cloudEnabled || started) return;
  started = true;
  const supa = supabase();
  if (!supa) return;

  supa.auth.getSession().then(({ data: { session } }) => {
    if (session) refreshFromCloud();
  });

  supa.auth.onAuthStateChange((_event, session) => {
    if (session) refreshFromCloud();
  });

  useProfileStore.subscribe((state) => {
    const p = state.profile;
    if (!p) return;
    const ser = serialize(p);
    if (ser === lastSerialized) return;
    lastSerialized = ser;
    schedulePush();
  });

  window.addEventListener('beforeunload', () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
      void pushOnce();
    }
  });
}

function serialize(p: ReturnType<typeof useProfileStore.getState>['profile']): string {
  if (!p) return '';
  return JSON.stringify({
    s: [
      p.level,
      p.xp,
      p.stars,
      p.coins,
      p.streak,
      p.longestStreak,
      p.lastActiveDate,
      p.achievements,
    ],
    t: Object.values(p.topics).map((t) => [
      t.topicId,
      t.totalAttempts,
      t.correct,
      t.currentDifficulty,
      t.consecutiveCorrect,
      t.recentMistakes,
    ]),
    a: p.lastActiveDate ? p.activity[p.lastActiveDate] : null,
    e: p.errorQueue.map((e) => [e.id, e.successStreak, e.reviewCount, e.nextReviewDate]),
  });
}

function schedulePush(): void {
  if (timer) clearTimeout(timer);
  timer = setTimeout(pushOnce, DEBOUNCE_MS);
}

async function pushOnce(): Promise<void> {
  if (pushing) return;
  const supa = supabase();
  if (!supa) return;
  const { data: { session } } = await supa.auth.getSession();
  if (!session) return;

  const p = useProfileStore.getState().profile;
  if (!p) return;
  pushing = true;
  try {
    const totalAttempts = Object.values(p.topics).reduce((a, t) => a + t.totalAttempts, 0);
    const totalCorrect = Object.values(p.topics).reduce((a, t) => a + t.correct, 0);

    await upsertMyStats({
      level: p.level,
      xp: p.xp,
      stars: p.stars,
      coins: p.coins,
      streak: p.streak,
      longest_streak: p.longestStreak,
      total_attempts: totalAttempts,
      total_correct: totalCorrect,
      achievements: p.achievements,
      last_active_date: p.lastActiveDate,
    });

    await upsertMyTopics(
      Object.values(p.topics).map((t) => ({
        topic_id: t.topicId,
        total_attempts: t.totalAttempts,
        correct: t.correct,
        current_difficulty: t.currentDifficulty,
        consecutive_correct: t.consecutiveCorrect,
        recent_mistakes: t.recentMistakes,
      })),
    );

    if (p.lastActiveDate && p.activity[p.lastActiveDate]) {
      const a = p.activity[p.lastActiveDate];
      await upsertMyActivity({
        date: a.date,
        attempts: a.attempts,
        correct: a.correct,
        stars: a.stars,
        time_sec: a.timeSec,
      });
    }

    await replaceMyErrors(
      p.errorQueue.map((e) => ({
        id: e.id,
        topic_id: e.topicId,
        subtopic: e.subtopic,
        question: e.question,
        correct_answer: e.correctAnswer,
        accepted_answers: e.acceptedAnswers ?? [],
        hints: e.hints,
        solution: e.solution,
        difficulty: e.difficulty,
        next_review_date: e.nextReviewDate,
        success_streak: e.successStreak,
        review_count: e.reviewCount,
        added_date: e.addedDate,
      })),
    );
  } catch (err) {
    console.warn('[cloudSync.pushOnce]', err);
  } finally {
    pushing = false;
  }
}

async function refreshFromCloud(): Promise<void> {
  const snap = await fetchMyFullSnapshot();
  if (!snap) return;
  useProfileStore.getState().hydrateFromSnapshot(snap);
  const p = useProfileStore.getState().profile;
  if (p) lastSerialized = serialize(p);
}

export function resetSyncState(): void {
  if (timer) clearTimeout(timer);
  timer = null;
  lastSerialized = '';
}

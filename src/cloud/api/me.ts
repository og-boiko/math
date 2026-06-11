/**
 * Спрощений API: 1 auth.user = 1 child_profile.
 */
import { supabase } from '../supabase';

export interface MyProfileRow {
  id: string;
  family_id: string;
  display_name: string;
  age: number;
  theme: string;
  leaderboard_opt_in: boolean;
}

export interface MyStatsRow {
  profile_id: string;
  level: number;
  xp: number;
  stars: number;
  coins: number;
  streak: number;
  longest_streak: number;
  total_attempts: number;
  total_correct: number;
  achievements: string[] | null;
  last_active_date: string | null;
}

export interface MyTopicRow {
  profile_id: string;
  topic_id: string;
  total_attempts: number;
  correct: number;
  current_difficulty: number;
  consecutive_correct: number;
  recent_mistakes: number;
}

export interface MyActivityRow {
  profile_id: string;
  date: string;
  attempts: number;
  correct: number;
  stars: number;
  time_sec: number;
}

export interface MyErrorRow {
  id: string;
  profile_id: string;
  topic_id: string;
  subtopic: string;
  question: string;
  correct_answer: string;
  accepted_answers: string[] | null;
  hints: string[] | null;
  solution: string;
  difficulty: number;
  next_review_date: string;
  success_streak: number;
  review_count: number;
  added_date: string;
}

export interface MyFullSnapshot {
  child: MyProfileRow;
  stats: MyStatsRow | null;
  topics: MyTopicRow[];
  activity: MyActivityRow[];
  errors: MyErrorRow[];
}

export async function getOrCreateMyProfile(input: {
  display_name: string;
  age: number;
  theme: string;
}): Promise<MyProfileRow | null> {
  const supa = supabase();
  if (!supa) return null;
  const { data, error } = await supa.rpc('get_or_create_my_profile', {
    p_display_name: input.display_name,
    p_age: input.age,
    p_theme: input.theme,
  });
  if (error) {
    console.error('[getOrCreateMyProfile]', error);
    throw new Error(error.message);
  }
  return (data as MyProfileRow | null) ?? null;
}

export async function fetchMyFullSnapshot(): Promise<MyFullSnapshot | null> {
  const supa = supabase();
  if (!supa) return null;
  const { data, error } = await supa.rpc('get_my_full_snapshot');
  if (error) {
    console.error('[fetchMyFullSnapshot]', error);
    return null;
  }
  return (data as MyFullSnapshot | null) ?? null;
}

export async function fetchMySnapshot(): Promise<MyFullSnapshot | null> {
  return fetchMyFullSnapshot();
}

export async function upsertMyStats(stats: {
  level: number;
  xp: number;
  stars: number;
  coins: number;
  streak: number;
  longest_streak: number;
  total_attempts: number;
  total_correct: number;
  achievements: string[];
  last_active_date: string | null;
}): Promise<void> {
  const supa = supabase();
  if (!supa) return;
  const { error } = await supa.rpc('upsert_my_stats', {
    p_level: stats.level,
    p_xp: stats.xp,
    p_stars: stats.stars,
    p_coins: stats.coins,
    p_streak: stats.streak,
    p_longest_streak: stats.longest_streak,
    p_total_attempts: stats.total_attempts,
    p_total_correct: stats.total_correct,
    p_achievements: stats.achievements,
    p_last_active_date: stats.last_active_date,
  });
  if (error) console.warn('[upsertMyStats]', error);
}

export async function upsertMyTopics(
  topics: Array<{
    topic_id: string;
    total_attempts: number;
    correct: number;
    current_difficulty: number;
    consecutive_correct: number;
    recent_mistakes: number;
  }>,
): Promise<void> {
  const supa = supabase();
  if (!supa) return;
  const { error } = await supa.rpc('upsert_my_topics', { p_topics: topics });
  if (error) console.warn('[upsertMyTopics]', error);
}

export async function upsertMyActivity(args: {
  date: string;
  attempts: number;
  correct: number;
  stars: number;
  time_sec: number;
}): Promise<void> {
  const supa = supabase();
  if (!supa) return;
  const { error } = await supa.rpc('upsert_my_activity', {
    p_date: args.date,
    p_attempts: args.attempts,
    p_correct: args.correct,
    p_stars: args.stars,
    p_time_sec: args.time_sec,
  });
  if (error) console.warn('[upsertMyActivity]', error);
}

export async function replaceMyErrors(
  errors: Array<{
    id: string;
    topic_id: string;
    subtopic: string;
    question: string;
    correct_answer: string;
    accepted_answers: string[];
    hints: string[];
    solution: string;
    difficulty: number;
    next_review_date: string;
    success_streak: number;
    review_count: number;
    added_date: string;
  }>,
): Promise<void> {
  const supa = supabase();
  if (!supa) return;
  const { error } = await supa.rpc('replace_my_errors', { p_errors: errors });
  if (error) console.warn('[replaceMyErrors]', error);
}

export async function setMyLeaderboardOptIn(optIn: boolean): Promise<void> {
  const supa = supabase();
  if (!supa) return;
  const { error } = await supa.rpc('set_my_leaderboard_opt_in', { p_opt_in: optIn });
  if (error) console.warn('[setMyLeaderboardOptIn]', error);
}

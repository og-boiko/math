/**
 * Читання публічного лідерборду (тільки SELECT, через RLS бачимо лише opt-in профілі).
 */
import { supabase } from '../supabase';

export type LeaderboardKind = 'weekly_xp' | 'streak' | 'season_xp';

export interface LeaderboardRow {
  profile_id: string;
  display_name: string;
  theme: string;
  level: number;
  value: number;
}

const TABLE: Record<LeaderboardKind, string> = {
  weekly_xp: 'leaderboard_weekly_xp',
  streak: 'leaderboard_streak',
  season_xp: 'leaderboard_season_xp',
};

export async function fetchTop(
  kind: LeaderboardKind,
  limit = 100,
): Promise<LeaderboardRow[]> {
  const supa = supabase();
  if (!supa) return [];
  const { data } = await supa
    .from(TABLE[kind])
    .select('profile_id, display_name, theme, level, value')
    .order('value', { ascending: false })
    .limit(limit);
  return (data as LeaderboardRow[] | null) ?? [];
}

/**
 * Знайти ранг конкретного профілю (відносно opt-in вибірки).
 */
export async function fetchOwnRank(
  kind: LeaderboardKind,
  profileId: string,
): Promise<{ rank: number; row: LeaderboardRow } | null> {
  const supa = supabase();
  if (!supa) return null;
  const { data: ownRows } = await supa
    .from(TABLE[kind])
    .select('profile_id, display_name, theme, level, value')
    .eq('profile_id', profileId)
    .maybeSingle();
  if (!ownRows) return null;
  const row = ownRows as LeaderboardRow;
  const { count } = await supa
    .from(TABLE[kind])
    .select('profile_id', { count: 'exact', head: true })
    .gt('value', row.value);
  return { rank: (count ?? 0) + 1, row };
}

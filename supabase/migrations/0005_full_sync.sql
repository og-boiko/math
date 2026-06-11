-- =====================================================================
-- 0005_full_sync.sql
-- Розширений sync: topics / activity / errors push & full snapshot.
-- Плюс — простий тригер для materialized leaderboards (без edge functions).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. PUSH topics (всі рядки за раз — їх максимум 10)
-- ---------------------------------------------------------------------
create or replace function public.upsert_my_topics(p_topics jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_profile_id uuid;
  v_row jsonb;
begin
  if v_user is null then
    raise exception 'not_authenticated';
  end if;

  select cp.id into v_profile_id
  from public.child_profiles cp
  join public.family_members fm on fm.family_id = cp.family_id
  where fm.user_id = v_user
  limit 1;

  if v_profile_id is null then
    raise exception 'no_profile';
  end if;

  for v_row in select * from jsonb_array_elements(p_topics)
  loop
    insert into public.topic_progress (
      profile_id, topic_id, total_attempts, correct,
      current_difficulty, consecutive_correct, recent_mistakes, updated_at
    ) values (
      v_profile_id,
      v_row->>'topic_id',
      coalesce((v_row->>'total_attempts')::int, 0),
      coalesce((v_row->>'correct')::int, 0),
      coalesce((v_row->>'current_difficulty')::int, 1),
      coalesce((v_row->>'consecutive_correct')::int, 0),
      coalesce((v_row->>'recent_mistakes')::int, 0),
      now()
    )
    on conflict (profile_id, topic_id) do update set
      total_attempts      = excluded.total_attempts,
      correct             = excluded.correct,
      current_difficulty  = excluded.current_difficulty,
      consecutive_correct = excluded.consecutive_correct,
      recent_mistakes     = excluded.recent_mistakes,
      updated_at          = now();
  end loop;
end;
$$;

grant execute on function public.upsert_my_topics(jsonb) to authenticated;

-- ---------------------------------------------------------------------
-- 2. PUSH today's activity (1 рядок)
-- ---------------------------------------------------------------------
create or replace function public.upsert_my_activity(
  p_date date,
  p_attempts int,
  p_correct int,
  p_stars int,
  p_time_sec int
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_profile_id uuid;
begin
  if v_user is null then raise exception 'not_authenticated'; end if;

  select cp.id into v_profile_id
  from public.child_profiles cp
  join public.family_members fm on fm.family_id = cp.family_id
  where fm.user_id = v_user
  limit 1;

  if v_profile_id is null then raise exception 'no_profile'; end if;

  insert into public.daily_activity (profile_id, date, attempts, correct, stars, time_sec)
  values (v_profile_id, p_date, p_attempts, p_correct, p_stars, p_time_sec)
  on conflict (profile_id, date) do update set
    attempts = excluded.attempts,
    correct  = excluded.correct,
    stars    = excluded.stars,
    time_sec = excluded.time_sec;
end;
$$;

grant execute on function public.upsert_my_activity(date, int, int, int, int) to authenticated;

-- ---------------------------------------------------------------------
-- 3. PUSH error queue (replace-all, бо черга невелика)
-- ---------------------------------------------------------------------
create or replace function public.replace_my_errors(p_errors jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_profile_id uuid;
  v_row jsonb;
begin
  if v_user is null then raise exception 'not_authenticated'; end if;

  select cp.id into v_profile_id
  from public.child_profiles cp
  join public.family_members fm on fm.family_id = cp.family_id
  where fm.user_id = v_user
  limit 1;

  if v_profile_id is null then raise exception 'no_profile'; end if;

  -- Видаляємо старі (не вирішені) і записуємо актуальний стан
  delete from public.error_queue
  where profile_id = v_profile_id and resolved_at is null;

  for v_row in select * from jsonb_array_elements(p_errors)
  loop
    insert into public.error_queue (
      id, profile_id, topic_id, subtopic, question,
      correct_answer, accepted_answers, hints, solution,
      difficulty, next_review_date, success_streak, review_count, added_date
    ) values (
      coalesce((v_row->>'id')::uuid, gen_random_uuid()),
      v_profile_id,
      v_row->>'topic_id',
      coalesce(v_row->>'subtopic', ''),
      v_row->>'question',
      v_row->>'correct_answer',
      coalesce(
        array(select jsonb_array_elements_text(v_row->'accepted_answers')),
        array[]::text[]
      ),
      coalesce(v_row->'hints', '[]'::jsonb),
      coalesce(v_row->>'solution', ''),
      coalesce((v_row->>'difficulty')::int, 1),
      coalesce((v_row->>'next_review_date')::date, current_date),
      coalesce((v_row->>'success_streak')::int, 0),
      coalesce((v_row->>'review_count')::int, 0),
      coalesce((v_row->>'added_date')::date, current_date)
    )
    on conflict (id) do nothing;
  end loop;
end;
$$;

grant execute on function public.replace_my_errors(jsonb) to authenticated;

-- ---------------------------------------------------------------------
-- 4. Розширений snapshot — повертає все
-- ---------------------------------------------------------------------
create or replace function public.get_my_full_snapshot()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_profile public.child_profiles;
  v_stats   public.profile_stats;
begin
  if v_user is null then raise exception 'not_authenticated'; end if;

  select cp.* into v_profile
  from public.child_profiles cp
  join public.family_members fm on fm.family_id = cp.family_id
  where fm.user_id = v_user
  limit 1;

  if v_profile.id is null then return null; end if;

  select * into v_stats from public.profile_stats where profile_id = v_profile.id;

  return jsonb_build_object(
    'child', to_jsonb(v_profile),
    'stats', to_jsonb(v_stats),
    'topics', coalesce(
      (select jsonb_agg(to_jsonb(t)) from public.topic_progress t
        where t.profile_id = v_profile.id),
      '[]'::jsonb
    ),
    'activity', coalesce(
      (
        select jsonb_agg(to_jsonb(a))
        from (
          select *
          from public.daily_activity
          where profile_id = v_profile.id
          order by date desc
          limit 90
        ) a
      ),
      '[]'::jsonb
    ),
    'errors', coalesce(
      (select jsonb_agg(to_jsonb(e)) from public.error_queue e
        where e.profile_id = v_profile.id and e.resolved_at is null),
      '[]'::jsonb
    )
  );
end;
$$;

grant execute on function public.get_my_full_snapshot() to authenticated;

-- ---------------------------------------------------------------------
-- 5. Тригер на profile_stats → оновлює всі 3 leaderboards
-- ---------------------------------------------------------------------
create or replace function public.refresh_leaderboards_for(p_profile_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cp public.child_profiles;
  v_stats public.profile_stats;
  v_weekly_xp int;
begin
  select * into v_cp from public.child_profiles where id = p_profile_id;
  if v_cp.id is null or not v_cp.leaderboard_opt_in then
    delete from public.leaderboard_weekly_xp where profile_id = p_profile_id;
    delete from public.leaderboard_streak    where profile_id = p_profile_id;
    delete from public.leaderboard_season_xp where profile_id = p_profile_id;
    return;
  end if;

  select * into v_stats from public.profile_stats where profile_id = p_profile_id;
  if v_stats.profile_id is null then return; end if;

  -- Weekly XP: сума stars*10 з активності за останні 7 днів — апроксимація.
  -- Якщо немає detailed answer_events, беремо total_xp як fallback.
  select coalesce(sum(stars), 0) * 10 into v_weekly_xp
  from public.daily_activity
  where profile_id = p_profile_id
    and date >= current_date - interval '7 days';

  insert into public.leaderboard_weekly_xp (profile_id, display_name, theme, level, value, updated_at)
  values (p_profile_id, v_cp.display_name, v_cp.theme, v_stats.level, v_weekly_xp, now())
  on conflict (profile_id) do update set
    display_name = excluded.display_name,
    theme        = excluded.theme,
    level        = excluded.level,
    value        = excluded.value,
    updated_at   = now();

  insert into public.leaderboard_streak (profile_id, display_name, theme, level, value, updated_at)
  values (p_profile_id, v_cp.display_name, v_cp.theme, v_stats.level, v_stats.longest_streak, now())
  on conflict (profile_id) do update set
    display_name = excluded.display_name,
    theme        = excluded.theme,
    level        = excluded.level,
    value        = excluded.value,
    updated_at   = now();

  insert into public.leaderboard_season_xp (profile_id, display_name, theme, level, value, league, updated_at)
  values (p_profile_id, v_cp.display_name, v_cp.theme, v_stats.level, v_stats.xp, 'bronze', now())
  on conflict (profile_id) do update set
    display_name = excluded.display_name,
    theme        = excluded.theme,
    level        = excluded.level,
    value        = excluded.value,
    updated_at   = now();
end;
$$;

create or replace function public.trg_profile_stats_lb()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.refresh_leaderboards_for(new.profile_id);
  return new;
end;
$$;

drop trigger if exists ps_lb_refresh on public.profile_stats;
create trigger ps_lb_refresh
after insert or update on public.profile_stats
for each row execute function public.trg_profile_stats_lb();

create or replace function public.trg_daily_activity_lb()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.refresh_leaderboards_for(new.profile_id);
  return new;
end;
$$;

drop trigger if exists da_lb_refresh on public.daily_activity;
create trigger da_lb_refresh
after insert or update on public.daily_activity
for each row execute function public.trg_daily_activity_lb();

-- ---------------------------------------------------------------------
-- 6. Toggle leaderboard opt-in
-- ---------------------------------------------------------------------
create or replace function public.set_my_leaderboard_opt_in(p_opt_in boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_profile_id uuid;
begin
  if v_user is null then raise exception 'not_authenticated'; end if;

  select cp.id into v_profile_id
  from public.child_profiles cp
  join public.family_members fm on fm.family_id = cp.family_id
  where fm.user_id = v_user
  limit 1;

  if v_profile_id is null then raise exception 'no_profile'; end if;

  update public.child_profiles
  set leaderboard_opt_in = p_opt_in
  where id = v_profile_id;

  perform public.refresh_leaderboards_for(v_profile_id);
end;
$$;

grant execute on function public.set_my_leaderboard_opt_in(boolean) to authenticated;

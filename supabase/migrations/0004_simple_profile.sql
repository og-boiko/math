-- =====================================================================
-- 0004_simple_profile.sql
-- Спрощена модель: 1 auth.user = 1 child_profile (без видимої "родини").
-- Family/family_members лишаються в схемі як деталь реалізації, але
-- фронтенд про них не знає — користується одним RPC.
-- =====================================================================

create or replace function public.get_or_create_my_profile(
  p_display_name text,
  p_age int,
  p_theme text
)
returns public.child_profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_family_id uuid;
  v_row public.child_profiles;
begin
  if v_user is null then
    raise exception 'not_authenticated';
  end if;

  -- 1. знайти або створити "тіньову" family для цього user
  select family_id into v_family_id
  from public.family_members
  where user_id = v_user
  limit 1;

  if v_family_id is null then
    insert into public.families (name, created_by)
    values (coalesce(p_display_name, 'Профіль'), v_user)
    returning id into v_family_id;

    insert into public.family_members (family_id, user_id, role)
    values (v_family_id, v_user, 'parent');
  end if;

  -- 2. перевірити чи є child_profile в цій family
  select * into v_row
  from public.child_profiles
  where family_id = v_family_id
  limit 1;

  -- немає → створити
  if v_row.id is null then
    insert into public.child_profiles (family_id, display_name, age, theme)
    values (v_family_id, p_display_name, p_age, p_theme)
    returning * into v_row;
  end if;

  return v_row;
end;
$$;

grant execute on function public.get_or_create_my_profile(text, int, text) to authenticated;

-- ---------------------------------------------------------------------
-- RPC для оновлення власних stats (denormalized snapshot push)
-- ---------------------------------------------------------------------
create or replace function public.upsert_my_stats(
  p_level int,
  p_xp int,
  p_stars int,
  p_coins int,
  p_streak int,
  p_longest_streak int,
  p_total_attempts int,
  p_total_correct int,
  p_achievements text[],
  p_last_active_date date
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

  insert into public.profile_stats (
    profile_id, level, xp, stars, coins, streak, longest_streak,
    total_attempts, total_correct, achievements, last_active_date, updated_at
  ) values (
    v_profile_id, p_level, p_xp, p_stars, p_coins, p_streak, p_longest_streak,
    p_total_attempts, p_total_correct, p_achievements, p_last_active_date, now()
  )
  on conflict (profile_id) do update set
    level             = excluded.level,
    xp                = excluded.xp,
    stars             = excluded.stars,
    coins             = excluded.coins,
    streak            = excluded.streak,
    longest_streak    = excluded.longest_streak,
    total_attempts    = excluded.total_attempts,
    total_correct     = excluded.total_correct,
    achievements      = excluded.achievements,
    last_active_date  = excluded.last_active_date,
    updated_at        = now();
end;
$$;

grant execute on function public.upsert_my_stats(
  int, int, int, int, int, int, int, int, text[], date
) to authenticated;

-- ---------------------------------------------------------------------
-- RPC: повернути snapshot моєї дитини (для відновлення на іншому пристрої)
-- ---------------------------------------------------------------------
create or replace function public.get_my_profile_snapshot()
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
  if v_user is null then
    raise exception 'not_authenticated';
  end if;

  select cp.* into v_profile
  from public.child_profiles cp
  join public.family_members fm on fm.family_id = cp.family_id
  where fm.user_id = v_user
  limit 1;

  if v_profile.id is null then
    return null;
  end if;

  select * into v_stats
  from public.profile_stats
  where profile_id = v_profile.id;

  return jsonb_build_object(
    'child', to_jsonb(v_profile),
    'stats', to_jsonb(v_stats)
  );
end;
$$;

grant execute on function public.get_my_profile_snapshot() to authenticated;

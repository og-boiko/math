-- =====================================================================
-- MathQuest — leaderboards (v1.2 schema, готова заздалегідь під v1.0)
-- =====================================================================
-- 3 дошки: 🆙 приріст тижня / 🔥 streak / 🌟 сезон XP
-- Усі — денормалізовані рядки, оновлюються через pg_cron + materialized
-- views або тригери на answer_events.
-- =====================================================================

-- Спільна структура: 1 рядок на дитину на дошку
create table public.leaderboard_weekly_xp (
  profile_id    uuid primary key references public.child_profiles (id) on delete cascade,
  display_name  text not null,
  theme         text not null,
  level         int  not null,
  value         int  not null default 0,        -- Δ XP за останні 7 днів
  updated_at    timestamptz not null default now()
);

create index on public.leaderboard_weekly_xp (value desc);

create table public.leaderboard_streak (
  profile_id    uuid primary key references public.child_profiles (id) on delete cascade,
  display_name  text not null,
  theme         text not null,
  level         int  not null,
  value         int  not null default 0,        -- longest_streak
  updated_at    timestamptz not null default now()
);

create index on public.leaderboard_streak (value desc);

create table public.leaderboard_season_xp (
  profile_id    uuid primary key references public.child_profiles (id) on delete cascade,
  display_name  text not null,
  theme         text not null,
  level         int  not null,
  value         int  not null default 0,        -- XP за поточний сезон
  league        text not null default 'bronze' check (league in ('bronze','silver','gold','diamond','champion')),
  updated_at    timestamptz not null default now()
);

create index on public.leaderboard_season_xp (league, value desc);

-- Лідерборди читаються анонімно (тільки якщо leaderboard_opt_in = true).
alter table public.leaderboard_weekly_xp enable row level security;
alter table public.leaderboard_streak    enable row level security;
alter table public.leaderboard_season_xp enable row level security;

create policy lw_public_read on public.leaderboard_weekly_xp
  for select using (
    exists (
      select 1 from public.child_profiles cp
      where cp.id = leaderboard_weekly_xp.profile_id and cp.leaderboard_opt_in
    )
  );

create policy ls_public_read on public.leaderboard_streak
  for select using (
    exists (
      select 1 from public.child_profiles cp
      where cp.id = leaderboard_streak.profile_id and cp.leaderboard_opt_in
    )
  );

create policy lsx_public_read on public.leaderboard_season_xp
  for select using (
    exists (
      select 1 from public.child_profiles cp
      where cp.id = leaderboard_season_xp.profile_id and cp.leaderboard_opt_in
    )
  );

-- Записи в борди — тільки edge functions (service role обходить RLS).

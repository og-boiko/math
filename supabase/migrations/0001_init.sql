-- =====================================================================
-- MathQuest — initial schema (v1.0)
-- =====================================================================
-- Цілі:
--   1. Multi-profile (один батько → багато дітей)
--   2. Дитячий пристрій авторизується pairing-кодом + device token
--   3. Прогрес дитини зберігається денормалізовано (для швидкого читання)
--      + granular лог відповідей (для анти-чіту і лідерборду)
--   4. RLS закриває чужі дані, навіть якщо ключ просочиться
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- families: 1 рядок на родину
-- ---------------------------------------------------------------------
create table public.families (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  created_by    uuid not null references auth.users (id) on delete cascade,
  created_at    timestamptz not null default now()
);

-- хто з auth.users має доступ до family (батько / другий батько)
create table public.family_members (
  family_id     uuid not null references public.families (id) on delete cascade,
  user_id       uuid not null references auth.users (id) on delete cascade,
  role          text not null check (role in ('parent', 'co_parent')),
  joined_at     timestamptz not null default now(),
  primary key (family_id, user_id)
);

-- ---------------------------------------------------------------------
-- child_profiles: профіль дитини
-- ---------------------------------------------------------------------
create table public.child_profiles (
  id                    uuid primary key default gen_random_uuid(),
  family_id             uuid not null references public.families (id) on delete cascade,
  display_name          text not null check (length(display_name) between 1 and 20),
  age                   int  not null check (age between 5 and 18),
  theme                 text not null check (theme in ('space','dino','world','voxel','blocky')),
  leaderboard_opt_in    boolean not null default true,
  created_at            timestamptz not null default now()
);

create index on public.child_profiles (family_id);

-- ---------------------------------------------------------------------
-- profile_stats: денормалізовані агрегати (1:1 з child_profiles)
-- ---------------------------------------------------------------------
create table public.profile_stats (
  profile_id        uuid primary key references public.child_profiles (id) on delete cascade,
  level             int  not null default 1,
  xp                int  not null default 0,
  stars             int  not null default 0,
  coins             int  not null default 0,
  streak            int  not null default 0,
  longest_streak    int  not null default 0,
  total_attempts    int  not null default 0,
  total_correct     int  not null default 0,
  perfect_sessions  int  not null default 0,
  achievements      text[] not null default array[]::text[],
  last_active_date  date,
  updated_at        timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- topic_progress: 10 рядків на дитину
-- ---------------------------------------------------------------------
create table public.topic_progress (
  profile_id            uuid not null references public.child_profiles (id) on delete cascade,
  topic_id              text not null,
  total_attempts        int  not null default 0,
  correct               int  not null default 0,
  current_difficulty    int  not null default 1 check (current_difficulty between 1 and 5),
  consecutive_correct   int  not null default 0,
  recent_mistakes       int  not null default 0,
  updated_at            timestamptz not null default now(),
  primary key (profile_id, topic_id)
);

-- ---------------------------------------------------------------------
-- daily_activity: 1 рядок на (дитина, дата)
-- ---------------------------------------------------------------------
create table public.daily_activity (
  profile_id    uuid not null references public.child_profiles (id) on delete cascade,
  date          date not null,
  attempts      int  not null default 0,
  correct       int  not null default 0,
  stars         int  not null default 0,
  time_sec      int  not null default 0,
  primary key (profile_id, date)
);

create index on public.daily_activity (profile_id, date desc);

-- ---------------------------------------------------------------------
-- error_queue: журнал помилок (інтервальне повторення)
-- ---------------------------------------------------------------------
create table public.error_queue (
  id                uuid primary key default gen_random_uuid(),
  profile_id        uuid not null references public.child_profiles (id) on delete cascade,
  topic_id          text not null,
  subtopic          text not null,
  question          text not null,
  correct_answer    text not null,
  accepted_answers  text[] not null default array[]::text[],
  hints             jsonb not null default '[]'::jsonb,
  solution          text not null,
  difficulty        int  not null check (difficulty between 1 and 5),
  next_review_date  date not null,
  success_streak    int  not null default 0,
  review_count      int  not null default 0,
  added_date        date not null default current_date,
  resolved_at       timestamptz
);

create index on public.error_queue (profile_id, next_review_date)
  where resolved_at is null;

-- ---------------------------------------------------------------------
-- answer_events: granular лог (анти-чіт + лідерборд)
-- ---------------------------------------------------------------------
create table public.answer_events (
  id                  uuid primary key,                 -- з клієнта (UUIDv7), для ідемпотентності
  profile_id          uuid not null references public.child_profiles (id) on delete cascade,
  topic_id            text not null,
  subtopic            text,
  difficulty          int  not null check (difficulty between 1 and 5),
  question_hash       text not null,                    -- щоб уникнути зарахування 1 задачі двічі
  is_correct          boolean not null,
  hints_used          int not null default 0,
  stars               int not null default 0,
  time_sec            int not null default 0,
  client_created_at   timestamptz not null,
  server_received_at  timestamptz not null default now()
);

create index on public.answer_events (profile_id, server_received_at desc);
create index on public.answer_events (profile_id, topic_id);

-- ---------------------------------------------------------------------
-- device_sessions: токени дитячих пристроїв
-- ---------------------------------------------------------------------
create table public.device_sessions (
  id              uuid primary key default gen_random_uuid(),
  profile_id      uuid not null references public.child_profiles (id) on delete cascade,
  token_hash      text not null unique,                 -- sha256 від device token
  device_label    text,                                 -- "iPhone Safari", "iPad Chrome"
  created_at      timestamptz not null default now(),
  last_seen_at    timestamptz not null default now(),
  revoked_at      timestamptz
);

create index on public.device_sessions (profile_id) where revoked_at is null;

-- ---------------------------------------------------------------------
-- pairing_codes: 6-значні одноразові коди
-- ---------------------------------------------------------------------
create table public.pairing_codes (
  code              char(6) primary key,
  profile_id        uuid not null references public.child_profiles (id) on delete cascade,
  created_by_user   uuid not null references auth.users (id) on delete cascade,
  created_at        timestamptz not null default now(),
  expires_at        timestamptz not null default (now() + interval '10 minutes'),
  used_at           timestamptz
);

create index on public.pairing_codes (profile_id) where used_at is null;

-- ---------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------
alter table public.families         enable row level security;
alter table public.family_members   enable row level security;
alter table public.child_profiles   enable row level security;
alter table public.profile_stats    enable row level security;
alter table public.topic_progress   enable row level security;
alter table public.daily_activity   enable row level security;
alter table public.error_queue      enable row level security;
alter table public.answer_events    enable row level security;
alter table public.device_sessions  enable row level security;
alter table public.pairing_codes    enable row level security;

-- Допоміжна функція: чи user входить у family
create or replace function public.is_family_member(p_family_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.family_members
    where family_id = p_family_id and user_id = auth.uid()
  );
$$;

-- Family: бачать тільки члени
create policy family_select on public.families
  for select using (public.is_family_member(id));

create policy family_insert on public.families
  for insert with check (created_by = auth.uid());

create policy family_update on public.families
  for update using (public.is_family_member(id));

-- Family members: член бачить інших членів
create policy fm_select on public.family_members
  for select using (public.is_family_member(family_id));

create policy fm_insert on public.family_members
  for insert with check (user_id = auth.uid() or public.is_family_member(family_id));

-- Child profiles: тільки члени родини
create policy cp_select on public.child_profiles
  for select using (public.is_family_member(family_id));

create policy cp_insert on public.child_profiles
  for insert with check (public.is_family_member(family_id));

create policy cp_update on public.child_profiles
  for update using (public.is_family_member(family_id));

create policy cp_delete on public.child_profiles
  for delete using (public.is_family_member(family_id));

-- Profile_stats / topic_progress / daily_activity / error_queue:
-- доступ через зв'язок із child_profiles → family
create or replace function public.owns_child(p_profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.child_profiles cp
    join public.family_members fm on fm.family_id = cp.family_id
    where cp.id = p_profile_id and fm.user_id = auth.uid()
  );
$$;

create policy ps_rw on public.profile_stats
  for all using (public.owns_child(profile_id)) with check (public.owns_child(profile_id));

create policy tp_rw on public.topic_progress
  for all using (public.owns_child(profile_id)) with check (public.owns_child(profile_id));

create policy da_rw on public.daily_activity
  for all using (public.owns_child(profile_id)) with check (public.owns_child(profile_id));

create policy eq_rw on public.error_queue
  for all using (public.owns_child(profile_id)) with check (public.owns_child(profile_id));

create policy ae_rw on public.answer_events
  for all using (public.owns_child(profile_id)) with check (public.owns_child(profile_id));

-- Device sessions і pairing codes — тільки edge functions через service role.
-- Звичайному користувачу — read-only список власних пристроїв.
create policy ds_select on public.device_sessions
  for select using (public.owns_child(profile_id));

create policy ds_delete on public.device_sessions
  for delete using (public.owns_child(profile_id));

create policy pc_select on public.pairing_codes
  for select using (public.owns_child(profile_id));

-- ---------------------------------------------------------------------
-- Тригер: при створенні child_profile одразу створюємо profile_stats
-- ---------------------------------------------------------------------
create or replace function public.bootstrap_child_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profile_stats (profile_id) values (new.id);
  insert into public.topic_progress (profile_id, topic_id)
  select new.id, t from unnest(array[
    'oral','column','order','fractions','decimals',
    'word','units','geometry','logic','equations'
  ]) as t;
  return new;
end;
$$;

create trigger trg_bootstrap_child_profile
after insert on public.child_profiles
for each row execute function public.bootstrap_child_profile();

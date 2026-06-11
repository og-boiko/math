# MathQuest Cloud (v2 — simplified)

Backend на Supabase: один **email+пароль** акаунт = один дитячий профіль.
Без сімей, без батьківських панелей, без pairing-кодів — все стало
простіше після UX-ревізії.

Поки нема `.env.local` зі змінними `VITE_SUPABASE_*` — додаток працює
повністю локально (zustand+persist), без жодних мережевих викликів.

## 1. Створення Supabase-проекту

1. <https://supabase.com/dashboard> → **New Project**
2. Регіон бажано `Frankfurt (eu-central-1)`
3. Збережи:
   - Project URL: `https://<PROJECT_REF>.supabase.co`
   - `anon` public key
   - `service_role` key (НЕ комітити в репо)

## 2. Заливка схеми

В **SQL Editor → New query** виконай по черзі:

```
supabase/migrations/0001_init.sql
supabase/migrations/0002_leaderboards.sql
supabase/migrations/0003_family_helpers.sql
supabase/migrations/0004_simple_profile.sql
supabase/migrations/0005_full_sync.sql
```

Або через CLI:

```bash
brew install supabase/tap/supabase
supabase link --project-ref <PROJECT_REF>
supabase db push
```

## 3. Налаштування Auth

Дуже важливо для роботи signup-флоу:

1. **Authentication → Sign In / Up → User Signups**
   - ✅ Allow new users to sign up
   - ❌ Confirm email (вимикаємо, інакше після signup треба клікати лінк)

2. **Authentication → Sign In / Up → Email** провайдер
   - ✅ Enable email provider
   - Min password length: `6`

## 4. Front-end .env.local

В корені проєкту створи `.env.local` (gitignored):

```env
VITE_SUPABASE_URL=https://<PROJECT_REF>.supabase.co
VITE_SUPABASE_ANON_KEY=ey...
```

Перезапусти `npm run dev`. На `/welcome` має з'явитися картка
**«Створити акаунт або увійти»** — це індикатор, що `cloudEnabled === true`.

## 5. Edge Functions

У спрощеній моделі Edge Functions **не потрібні**. Уся логіка — у
SQL `security definer` RPC. Якщо у твоєму проєкті ще задеплоєні старі
функції з v1 (pairing/submit-events/get-snapshot/rotate-leaderboards),
видали їх:

```bash
supabase functions delete create-pairing-code
supabase functions delete claim-pairing-code
supabase functions delete submit-events
supabase functions delete get-snapshot
supabase functions delete rotate-leaderboards
```

## 6. Як це працює

### Sign-up

1. Юзер на `/auth` вводить email + password + ім'я + вік + сетинг.
2. `supabase.auth.signUp()` → одразу сесія (бо confirm-email вимкнений).
3. RPC `get_or_create_my_profile` створює "тіньову" `families` + `family_members` + `child_profiles` (це деталь схеми, фронт її не бачить).
4. Локальний zustand-store ініціалізується з тих самих даних → одразу `/`.

### Sync пакета

Кожна зміна Profile (xp, stars, topics, error_queue, today's activity)
підписана через `useProfileStore.subscribe()` → debounced 4с → push:

| RPC | Що оновлює |
|---|---|
| `upsert_my_stats` | агрегати: level/xp/stars/streak/achievements/last_active |
| `upsert_my_topics` | прогрес по 10 темах |
| `upsert_my_activity` | сьогоднішній денний рядок |
| `replace_my_errors` | actual error queue (replace-all) |

Перед закриттям вкладки — flush через `beforeunload`.

### Hydrate

На login (або при старті, якщо є сесія) → `get_my_full_snapshot` →
`hydrateFromSnapshot` у store. Локальні дані замінюються хмарою
(хмара завжди джерело правди для логінутого юзера).

### Leaderboards

3 матеріалізовані таблиці (`leaderboard_weekly_xp`, `..._streak`,
`..._season_xp`) оновлюються тригерами на `profile_stats` і
`daily_activity`. RLS-політика дозволяє читати лише ті рядки, де
`child_profiles.leaderboard_opt_in = true`.

Перемикач opt-in — на `/settings` (картка "Брати участь у лідерборді").

## 7. Тестування flow

1. <http://localhost:5173/welcome> → "Створити акаунт або увійти"
2. Заповни форму signup → одразу `/`
3. Розв'яжи 3-4 задачі → почекай 5с
4. У Supabase **Table Editor**:
   - `profile_stats` — оновлений рядок
   - `topic_progress` — змінений `current_difficulty` чи `total_attempts`
   - `daily_activity` — сьогоднішня дата
   - `leaderboard_weekly_xp` — новий рядок
5. Інкогніто → `/auth` → **Увійти** з тим самим email → той самий профіль завантажиться зі snapshot

## 8. Troubleshooting

| Помилка | Причина | Рішення |
|---|---|---|
| `Email signups are disabled` | Auth → Sign Ups вимкнений | Увімкнути в Dashboard (див. крок 3) |
| `Email not confirmed` | Confirm email увімкнений | Вимкнути або клікнути лінк з пошти |
| `not_authenticated` від RPC | Сесія втрачена | Залогінитись знову на `/auth` |
| `no_profile` від RPC | Юзер є, профілю — нема | Зайти ще раз на `/auth`, signup-mode дозаповнить |
| Хмара "не бачить" зміни | `.env.local` на інший проєкт | Перевір `VITE_SUPABASE_URL` vs Dashboard URL |

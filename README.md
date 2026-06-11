# MathQuest

PWA-тренажер математики для підготовки до 5 класу. Український інтерфейс,
гейміфікація: зірки, рівні, стрик, ачивки, профіль, календар, тематична
карта світу.

З **v2** (червень 2026) — опціональна **хмарна синхронізація через Supabase**:
один email-акаунт = один профіль, доступний з будь-якого пристрою. Без хмари
застосунок працює повністю локально (zustand+persist).

## Швидкий старт

```bash
npm install
npm run dev
```

Відкрити: <http://localhost:5173>

З телефона в тій же Wi-Fi мережі:

```bash
npm run dev -- --host
```

## Збірка

```bash
npm run build
npm run preview
```

Результат — у `dist/`. PWA-маніфест та service worker генеруються автоматично.

## Хмара (опціонально)

Усе про Supabase-бекенд — у [`docs/CLOUD.md`](docs/CLOUD.md). Коротко:

1. Створити Supabase-проект → залити 5 SQL-міграцій із `supabase/migrations/`
2. У Auth Settings: ✅ Sign Ups, ❌ Confirm Email
3. Додати в `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://<project>.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGci...
   ```
4. `npm run dev` — на `/welcome` з'явиться картка "Створити акаунт або увійти"

## Деплой на Cloudflare Pages

1. Запушити репо у GitHub.
2. Cloudflare Pages → Create project → Connect Git → обрати репо.
3. Build settings:
   - Framework preset: **None**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version: `20` (через env-var `NODE_VERSION`)
4. Environment variables: додати `VITE_SUPABASE_URL` і `VITE_SUPABASE_ANON_KEY`.
5. Save and Deploy.

## Структура

```
src/
  app/                  # App, маршрути
  pages/                # Welcome, Auth, ThemeSelect, Hub, Practice, Task,
                        # Results, Errors, Profile, Calendar, Settings,
                        # WorldMap, Exams, Leaderboard
  components/           # UI (Card, Button, HintPanel, ProgressBar,
                        # AchievementToast, Confetti)
  features/
    tasks/              # генератори і реєстр + контрольні
    themes/             # сетинги (космос, динозаври, світ, воксельний, блочний)
    achievements/       # ≥15 ачивок
  store/
    profile.ts          # Zustand+persist (профіль, теми, помилки, ачивки)
    profile-types.ts    # типи окремо (avoid циклу)
    session.ts          # активна сесія
  cloud/                # Supabase інтеграція (no-op без env)
    supabase.ts
    api/me.ts           # RPC-обгортки для одного профілю
    api/leaderboard.ts  # читання публічних борд
    sync/cloudSync.ts   # debounced push + hydrate
  lib/
    random.ts · format.ts · sounds.ts · dates.ts · pin.ts
  styles/globals.css
supabase/
  migrations/           # 5 SQL-міграцій
public/                 # icons
docs/                   # SPEC.md, CONTENT.md, ROADMAP.md, CLOUD.md
```

## Що працює (v2)

### Навчання

- 10 тем (`oral`, `column`, `order`, `fractions`, `decimals`, `word`,
  `units`, `geometry`, `logic`, `equations`) із 5 рівнями складності
- Підтеми за зразком шкільних самостійних (ділення з підбором частки,
  приведення до одиниці, круги Ейлера, степені, подвійні нерівності)
- Контрольні роботи з оцінкою за 12-бальною шкалою
- 2 рівні підказок + повне рішення на кожну задачу
- Адаптивна складність: +1 після 3 правильних підряд, −1 після 2 помилок

### Гейміфікація

- Зірки (3/2/1/0), XP, рівні, валюта по сетингу
- Streak (поточний + найдовший), щоденна ціль
- ≥15 ачивок, тостер, конфеті
- Героїчний `/map` із прогресом по локаціях

### Робота над помилками

- Журнал помилок із інтервальним повторенням (1, 2, 4, 8, 16 днів)
- 5 успішних повторень → задача йде з черги
- Окремий екран `/errors` із session-режимом review

### Хмара (v2, нове)

- Email + password signup без email-confirmation
- Один акаунт = один профіль (без сімей, без pairing-кодів)
- Debounced push (4с) усього стану: stats, topics, today's activity, error queue
- Hydrate з повного snapshot після login на новому пристрої
- Публічний лідерборд (тиждень / streak / сезон) з opt-in перемикачем
- Logout-кнопка на `/settings`
- Робота повністю офлайн коли `.env.local` без Supabase-ключів

### Платформа

- PWA: повний маніфест, іконки 192/512/maskable, apple-touch-icon
- Web Audio API для звуків (без зовнішніх файлів)
- Анімації: pop-in, slide-in toast, конфеті — у CSS keyframes
- `tailwind-merge` для безпечного перевизначення класів

## Документація

- [`docs/SPEC.md`](docs/SPEC.md) — функціональна специфікація
- [`docs/CONTENT.md`](docs/CONTENT.md) — мапа тем, підтем, рівнів
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — статус і плани
- [`docs/CLOUD.md`](docs/CLOUD.md) — Supabase setup і flow

## Стек

Vite 5 · React 18 · TypeScript 5 · Tailwind 3 · Zustand 4 · React Router 6 ·
lucide-react · tailwind-merge · vite-plugin-pwa · Supabase JS v2.

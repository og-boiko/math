# MathQuest — тренажер математики для 4–5 класу

PWA-тренажер математики для підготовки до 5 класу. Український інтерфейс,
гейміфікація: зірки, рівні, стрик, ачивки, профіль, календар, тематична
карта світу.

З **v2** (червень 2026) — опціональна **хмарна синхронізація через Supabase**:
один email-акаунт = один профіль, доступний з будь-якого пристрою. Без хмари
застосунок працює повністю локально (zustand+persist).

З **v2.2** (червень 2026) — **публічна SEO-оптимізована лендінг-сторінка** на `/`
із вичерпною інформацією про навчання, гейміфікацію, функції, залучення трафіку.
Додаток сам переміщено на `/app/*` для чистого розділення маркетингу і додатку.
Легкий initial load для лендінгу (Landing chunk 33 KB), додаток завантажується
лише за потреби.

## Швидкий старт

```bash
npm install
npm run dev
```

Відкрити:
- **Лендінг** (маркетинг, SEO): <http://localhost:5174/>
- **Додаток** (гра): <http://localhost:5174/app/>

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

1. Створити Supabase-проект → залити **7 SQL-міграцій** із `supabase/migrations/`
2. У Auth Settings: ✅ Sign Ups, ❌ Confirm Email, min password 6
3. Додати в `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://<project>.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGci...
   ```
4. `npm run dev` — на `/welcome` з'явиться картка "Створити акаунт або увійти"

## Деплой на Cloudflare Workers (рекомендовано)

Cloudflare Workers Static Assets — найшвидший і найдешевший спосіб для нашого
SPA. Конфіг — у `wrangler.jsonc` (включено в репо).

1. Запушити репо у GitHub.
2. Cloudflare → Workers & Pages → Create → Connect to Git → обрати репо.
3. Build settings:
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
   - Build output directory: `dist`
   - Node version: `22` (через env-var `NODE_VERSION`)
4. Environment variables: додати `VITE_SUPABASE_URL` і `VITE_SUPABASE_ANON_KEY`.
5. Save and Deploy.

> ⚠️ **Не додавайте `public/_redirects`** при деплої на Workers — `wrangler.jsonc`
> вже задає `not_found_handling: "single-page-application"`, і їх поєднання
> викликає помилку валідатора `Infinite loop detected`.

### Деплой на Vercel (альтернатива)

`vercel.json` уже налаштований: rewrites на `/index.html` для всіх неіснуючих
шляхів + immutable-кеш для `/assets/*` + security headers.

```bash
npm i -g vercel
vercel deploy --prod
```

### SPA маршрутизація

Сайт використовує **чистий SPA mode** з кодом-сплітингом:

- **`/`** → лендінг (маркетинг, SEO, публічна сторінка)
- **`/app/*`** → основний додаток (профіль, тренування, гейміфікація)

Конфігурації для популярних хостів:

| Хост | Файл | Як працює |
|---|---|---|
| **Cloudflare Workers** | `wrangler.jsonc` | `assets.not_found_handling: "single-page-application"` — будь-який 404 повертає `index.html` |
| **Vercel** | `vercel.json` | `rewrites` `/app/(.*) → /index.html` + immutable cache для `/assets/*` |
| **Netlify** | (можна додати `public/_redirects`) | `/* /index.html 200` — fallback на index |

При first load / hard-refresh браузер отримує `index.html` з SSR-фолбеком, потім
React монтує лендінг чи додаток залежно від `location.pathname`. Лендінг
завантажується лініво (`lazy()`) → первий page load легший на ~40% для тих,
хто просто читає про сайт.

## Структура

```
src/
  app/                  # App, маршрути (всі на /app/*)
  landing/              # Лендінг-сторінка (SEO, маркетинг)
    sections/           # Hero, Features, HowItWorks, Topics, 
                        # Screenshots, Stats, FAQ, CTA, Footer, Header
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
public/
  favicon.svg           # основна іконка
  icon-*.svg            # PWA іконки (192, 512, maskable)
  og-image.svg          # Open Graph вужа
  robots.txt            # SEO
  sitemap.xml           # SEO
  _redirects            # SPA fallback для Netlify/Cloudflare
supabase/
  migrations/           # 7 SQL-міграцій (init, leaderboards, helpers,
                        #   simple-profile, full-sync, fix-snapshot,
                        #   public-leaderboards)
docs/                   # SPEC.md, CONTENT.md, ROADMAP.md, CLOUD.md, AUDIT.md
```

## Що працює (v2.2 — SEO-ендінг)

### Публічна лендінг-сторінка (маркетинг, SEO, залучення)

- **Hero** із CTA ("Почати тренування")
- **Features** (10 тем, адаптивна складність, гейміфікація, офлайн)
- **How It Works** (етапи: обрати, практикувати, 100+ завдань, опрацювати помилки)
- **Topics** (картка кожної теми з прикладом)
- **Screenshots** (UI мобільної гри)
- **Stats** (вражаючі цифри: 100+ задач, 5 рівнів, 15+ ачивок)
- **FAQ** (питання про безпеку, кошт, вік, офлайн)
- **CTA** (ще один "Почати" внизу)
- **Footer** (контакти, посилання)
- **SEO meta tags** (Open Graph, Twitter Card, JSON-LD schema, robots, sitemap)

- 10 тем (`oral`, `column`, `order`, `fractions`, `decimals`, `word`,
  `units`, `geometry`, `logic`, `equations`) із 5 рівнями складності
- Підтеми за зразком шкільних самостійних (ділення з підбором частки,
  приведення до одиниці, круги Ейлера, степені, подвійні нерівності)
- Контрольні роботи з оцінкою за 12-бальною шкалою
- 2 рівні підказок + повне рішення на кожну задачу
- Адаптивна складність: +1 після 3 правильних підряд, −1 після 2 помилок
- **v2.1 — Робочий стіл** (bottom-sheet: калькулятор, стовпчик, чернетка)

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

# MathQuest — Дорожня карта

## ✅ MVP+ — реліз-кандидат локального

### Інфраструктура

- [x] Vite + React 18 + TypeScript + Tailwind + PWA
- [x] Zustand з persist (`profile`, `session`) + міграції
- [x] React Router 6
- [x] `tailwind-merge` у `Card` і `Button`
- [x] Web Audio API без зовнішніх файлів
- [x] SHA-256 PIN (lib лишилася, але батьківська панель прибрана у v2)
- [x] Утиліти дат
- [x] Винесено типи профілю в окремий модуль
- [x] PWA-іконки 192/512/maskable + apple-touch
- [x] Збірка чиста, без warnings

### Навчання та задачі

- [x] 10 тем із 5 рівнями складності
- [x] Підтеми за зразком шкільних самостійних
- [x] Контрольні з 12-бальною шкалою
- [x] 2 рівні підказок + повне рішення
- [x] Адаптивна складність (+1 / −1)

### Гейміфікація

- [x] Зірки, XP, рівні, валюта по сетингу
- [x] Streak (поточний + найдовший)
- [x] ≥15 ачивок, тостер, конфеті
- [x] Денна ціль + прогрес-бар на Hub

### Робота над помилками

- [x] Журнал з інтервальним повторенням (1/2/4/8/16 днів)
- [x] Окрема сесія review-режиму
- [x] 5 успіхів → resolved

### Профіль, аналітика, налаштування

- [x] `/profile` — статистика, прогрес по темах, ачивки
- [x] `/calendar` — heat-map активності за 12 тижнів
- [x] `/map` — тематична карта світу
- [x] `/settings` — звуки, ціль, сетинг, скидання

## ☁️ v2.0 — Хмара (червень 2026, релізнуто)

> Спрощення: один auth-юзер = один дитячий профіль. Без "сімей",
> батьківських панелей, pairing-кодів. Email + password з мить-логіном.

### Backend

- [x] `0001_init.sql` — families/child_profiles/stats/topics/activity/errors/events/devices/pairing + RLS
- [x] `0002_leaderboards.sql` — 3 дошки (тижневі XP / streak / сезон XP)
- [x] `0003_family_helpers.sql` — атомарні створення (legacy)
- [x] `0004_simple_profile.sql` — `get_or_create_my_profile`, `upsert_my_stats`, `get_my_profile_snapshot`
- [x] `0005_full_sync.sql` — `upsert_my_topics`, `upsert_my_activity`, `replace_my_errors`, `get_my_full_snapshot`, тригери на лідерборди, `set_my_leaderboard_opt_in`
- [x] `0006_fix_snapshot.sql` — фікс `GROUP BY` у `get_my_full_snapshot`
- [x] `0007_public_leaderboards.sql` — публічна `SELECT`-RLS на `leaderboard_*` (бачиш всіх opt-in)
- [x] Edge Functions видалені — вся логіка у SQL `security definer` RPC
- [x] Auth: email + password, без email-confirmation

### Frontend

- [x] `/welcome` — 2 опції: створити акаунт АБО спробувати локально
- [x] `/auth` — signup (email+password+ім'я+вік+тема) / login в одному екрані
- [x] `src/cloud/api/me.ts` — обгортки RPC
- [x] `src/cloud/sync/cloudSync.ts` — debounced (4с) push повного стану + flush на `beforeunload`
- [x] `hydrateFromSnapshot` — приймає stats/topics/activity/errors
- [x] `/leaderboard` — 3 таби, ранг власного профілю
- [x] `/settings`: акаунт у хмарі, logout, opt-in лідерборду
- [x] Робота офлайн коли `.env.local` без Supabase-ключів

### Видалено / спрощено в v2

- [x] Сторінки `/parent/login`, `/parent`, `/parent/cloud-login`, `/parent/family`, `/pair`
- [x] Pairing-код flow (immediate UX win)
- [x] Outbox + answer_events батч-pipeline (надмір для нашої моделі)
- [x] Edge functions для submit-events / pairing / snapshot

## 🛡️ v2.1 — Безпека і поліровка (планується)

- [ ] Rate limit на RPC (Supabase native або через edge proxy)
- [ ] Anti-replay на `last_active_date` (clock skew protection)
- [ ] CSP-заголовки, robots, sitemap для PWA
- [ ] Кнопка "Видалити мій акаунт" (право на забуття) → SQL функція з cascade
- [ ] A11y-аудит (focus traps, aria-live на feedback, role=alert на toast)
- [ ] E2E smoke (Playwright): signup → задача → інкогніто login → перевірка прогресу

## 🧰 v2.1.1 — Робочий стіл (релізнуто, червень 2026)

> Дитина повинна писати на чернетці, а не рахувати все в умі. Раніше при
> складних стовпчиках і складених виразах вона билася з обмеженням пам'яті
> й програвала; зараз має вбудований "робочий стіл".

### UI

- [x] Bottom-sheet із 3 табами: 🧮 Обчислення / 📐 Стовпчик / ✏️ Чернетка
- [x] Кнопка-перемикач під полем введення (бейдж 🟠 коли є записи)
- [x] Дефолтний таб обирається за `topicId`
- [x] ESC закриває; backdrop-tap закриває
- [x] Toggle вмикання/вимикання у `/settings`

### CalcStrip (🧮)

- [x] Багаторядковий калькулятор у стилі Soulver
- [x] Підтримка `+ − × ÷ ( )` і коми як десяткового
- [x] Тисячні пробіли (`1 234 + 5 678`) парсяться коректно
- [x] Кнопка `↑ ans` — підставляє результат попереднього рядка
- [x] Каскадне обчислення: кожен рядок бачить попередній `ans`
- [x] Парсер на базі `lib/math-eval.ts` (без `eval`)

### ColumnGrid (📐)

- [x] Сітка розрядів: переноси / операнди / лінія / відповідь
- [x] Парсинг `task.question` → `+ − × ÷` через `parseColumnExpression`
- [x] Окрема стрічка позик (borrows) для віднімання
- [x] Fallback на CalcStrip, якщо вираз не розпізнано (наприклад, складений)

### Scratchpad (✏️)

- [x] Canvas 2D з PointerEvents (тач / миша / стілус)
- [x] Pressure-sensitivity для стілуса
- [x] 4 кольори, гумка, кнопка очистити
- [x] Збереження стану як PNG data-URL (in-memory, до 20 задач)

### Гейміфікація

- [x] Лічильники `workbenchUses` і `workbenchCorrectAnswers` у `flags`
- [x] 1 інкремент на задачу (захист від подвійного зарахування)
- [x] Ачивка `🧰 Інженер` — 10 використань
- [x] Ачивка `📝 Не довіряй голові` — 50 правильних із workbench

### Тести

- [x] 26 unit-тестів для `evalStripLine` і `parseColumnExpression`
- [x] Запуск: `npx tsx scripts/test-workbench.ts`

### Бандл

- Приріст ~2 KB gzip (з 162 → 164). Без зовнішніх бібліотек.

## 🌐 v2.2 — Публічна SEO-лендінг (червень 2026, релізнуто)

> Трансформація з локальної гри в публічний, SEO-оптимізований, 
> привабливий сайт для залучення користувачів.

### Frontend — Лендінг і розділення маршрутів

- [x] `src/landing/Landing.tsx` — головна лендінг-сторінка
- [x] Секції лендінгу (9 компонентів):
  - [x] `Header.tsx` — навігація, логотип, CTA
  - [x] `Hero.tsx` — заголовок, subheading, велика CTA-кнопка
  - [x] `Stats.tsx` — цифри привабу (100+ завдань, 5 рівнів, 15+ ачивок)
  - [x] `Features.tsx` — переваги (адаптив, гейміфікація, офлайн, часові заниття)
  - [x] `HowItWorks.tsx` — етапи навчання (обрати тему, практикувати, помилки)
  - [x] `Topics.tsx` — сітка 10 тем з описом й іконками
  - [x] `Screenshots.tsx` — слайдер з UI мобільної гри
  - [x] `FAQ.tsx` — часті питання (безпеку, кошт, вік, офлайн)
  - [x] `CTA.tsx` — інший CTA внизу
  - [x] `Footer.tsx` — контакти, посилання, соцмережі

### Код-сплітинг і маршрутизація

- [x] Лендінг як **lazy chunk** (`Landing.tsx` ~ 33 KB gzip)
- [x] Додаток залишається на `/app/*` з `BrowserRouter basename="/app"`
- [x] First load (лендінг): `index.html` + CSS + Landing chunk (легкий)
- [x] При навігації на `/app`: основний app bundle завантажується лініво
- [x] Без перевантажень сторінки — React Router розрізняє шляхи

### SEO & соціальні

- [x] `index.html` мета-таги:
  - Tile, description, keywords для українських пошукових запитів
  - Open Graph (og:image, og:title, og:description, og:url)
  - Twitter Card (twitter:card, twitter:image)
  - Canonical & alternate links
- [x] JSON-LD schema:
  - WebApplication (MathQuest як освітня app)
  - FAQPage (вбудована FAQ)
- [x] `public/robots.txt` — `Allow: /`, `Sitemap`
- [x] `public/sitemap.xml` — дві адреси (/ і /app)
- [x] `public/og-image.svg` — Open Graph образка (~1200×630)

### PWA & Маніфест

- [x] `manifest.webmanifest` — оновлено на `start_url: "/app"` (додаток)
- [x] Іконки в manifest: 192, 512, maskable-512
- [x] `apple-mobile-web-app-title`, `mobile-web-app-capable`

### Хостинг-конфіги

- [x] `vercel.json` — SPA fallback, заголовки (Cache-Control, CSP)
- [x] `public/_redirects` — `/* /index.html 200` для Netlify/Cloudflare

### CSS & UX

- [x] Лендінг-мод (`landing-mode` клас на `<html>`)
  - Чистий білий фон
  - Без обмежень `container-app`
  - Прибрано SSR-фолбек з перевдозведенням
- [x] SSR-фолбек у `index.html` з мінімальним стилем (видаляється до React)

### Тестування & збірка

- [x] TypeScript `tsc` — не warnings
- [x] Vite build — 1.72 с, chunk size warnings (інформаційні)
- [x] `npm test` — 71 pass (workbench + generators)
- [x] Dev сервер на портах 5173–5174

### Результати

| Метрика | Значення |
|---|---|
| Landing chunk | 33 KB / 9 KB gzip |
| App chunk | 604 KB / 173 KB gzip |
| Initial load (лендінг) | ~ 40% легше, ніж раніше |
| Сирові SEO tag | ✓ (HTML маршрутизація) |
| PWA manifest | ✓ (start_url=/app) |
| SPA fallback | ✓ (Vercel, Netlify, Cloudflare) |

---

## 🌟 v2.3 — Лідерборд UX

- [ ] CF-кеш на топ-100 (60 с)
- [ ] Realtime на свій рядок (підписка на postgres changes)
- [ ] Псевдонім-фільтр (обсценна лексика)
- [ ] Shadow-ban флаг (admin-only RPC)
- [ ] Бейджі за топ-3 у профіль

## 🏆 v2.4 — Сезони + ліги

- [ ] Тижневий cycle: pg_cron rotate
- [ ] 5 ліг з підняттям / пониженням
- [ ] Анімація "ти піднявся в Золоту лігу!"

## 🎯 v2.5 — Глибина

- [ ] Аватар з аксесуарами (магазин за валюту сетингу)
- [ ] Щит стріку (50 монет)
- [ ] Міні-бос у щоденному завданні
- [ ] Сезонні події (Новий рік, 1 вересня)
- [ ] Інтерактивний стовпчик для `column.add` / `column.sub`

## 🔮 v3.0 — Соціальне

- [ ] Friend code → дошка "друзі"
- [ ] Country flag (server-side IP geo)
- [ ] "Турнір з татом" (асинхронні дуелі)
- [ ] Push-нагадування

## Метрики успіху

**Для дитини:**

- Заходить ≥ 5 днів на тиждень
- ≥ 80 задач/тиждень
- Точність зростає у часі

**Для проекту:**

- Lighthouse mobile ≥ 90
- Bundle ≤ 300 KB gzip
- Cold-start PWA ≤ 1 с
- Sync round-trip ≤ 1 с

## Ризики

| Ризик | Мітигація |
|---|---|
| Нудно за тиждень | Зміна тем + ачивки + сетингу |
| Складність не вгадана | Адаптив + ручний override у settings |
| Дивні задачі генератора | Юніт-тести з санітарними перевірками |
| Втрата прогресу при багах | Cloud sync + локальна копія в zustand-persist |
| RLS leak | Тільки `security definer` RPC, ніяких прямих INSERT/UPDATE |
| Tailwind-конфлікти | `twMerge` у UI-компонентах |
| Цикли імпортів | Винесені `profile-types.ts` |

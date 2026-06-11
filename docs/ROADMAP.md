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

## 🌟 v2.2 — Лідерборд UX

- [ ] CF-кеш на топ-100 (60 с)
- [ ] Realtime на свій рядок (підписка на postgres changes)
- [ ] Псевдонім-фільтр (обсценна лексика)
- [ ] Shadow-ban флаг (admin-only RPC)
- [ ] Бейджі за топ-3 у профіль

## 🏆 v2.3 — Сезони + ліги

- [ ] Тижневий cycle: pg_cron rotate
- [ ] 5 ліг з підняттям / пониженням
- [ ] Анімація "ти піднявся в Золоту лігу!"

## 🎯 v2.4 — Глибина

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

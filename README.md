# MathQuest

PWA-тренажер математики для підготовки до 5 класу. Український інтерфейс, гейміфікація: зірки, рівні, стрик, ачивки, профіль, календар, тематична карта світу і батьківська панель.

## Швидкий старт

```bash
npm install
npm run dev
```

Відкрити: `http://localhost:5173`

З телефона в тій же Wi-Fi мережі:

```bash
npm run dev -- --host
```

→ скопіювати URL з `Network:` (наприклад `http://192.168.x.x:5173`).

## Збірка

```bash
npm run build
npm run preview
```

Результат — у `dist/`. PWA-маніфест та service worker генеруються автоматично через `vite-plugin-pwa`.

## Деплой на Cloudflare Pages

1. Запушити репо у GitHub.
2. Cloudflare Pages → Create project → Connect Git → обрати репо.
3. Build settings:
   - Framework preset: **None**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version (Environment variable `NODE_VERSION`): `20`
4. Save and Deploy.

## Структура

```
src/
  app/                  # App, маршрути
  pages/                # Welcome, ThemeSelect, Hub, Practice, Task, Results,
                        # Errors, Profile, Calendar, Settings, WorldMap,
                        # Exams, ParentLogin, ParentPanel
  components/           # UI-компоненти (Card, Button, HintPanel, ProgressBar,
                        # AchievementToast, Confetti)
  features/
    tasks/              # генератори і реєстр + контрольні (exams.ts)
    themes/             # сетинги (космос, динозаври, світ, воксельний, блочний)
    achievements/       # ≥15 ачивок з умовами на профіль
  store/
    profile.ts          # Zustand-стор + persist (профіль, теми, помилки, ачивки)
    profile-types.ts    # типи (винесено окремо, щоб уникнути циклу)
    session.ts          # активна сесія (звичайна або review)
  lib/
    random.ts           # детермінований randInt, choice, shuffle
    format.ts           # парсинг / нормалізація / checkAnswer
    sounds.ts           # Web Audio API: correct / wrong / finish / levelUp
    dates.ts            # todayKey, dayDiff, addDays, formatRelative
    pin.ts              # SHA-256 для PIN батьківської панелі
  styles/globals.css    # Tailwind + keyframes (toast, confetti, pop-in)
public/                 # icons (192/512/maskable), favicon
docs/                   # SPEC.md, CONTENT.md, ROADMAP.md
```

## Що працює (MVP+)

### Навчання

- Усі **10 тем** (`oral`, `column`, `order`, `fractions`, `decimals`, `word`,
  `units`, `geometry`, `logic`, `equations`) із 5 рівнями складності.
- Підтеми за зразком шкільних самостійних (зокрема ділення з підбором частки,
  приведення до одиниці, круги Ейлера, степені, подвійні нерівності).
- Контрольні роботи (екзамени) з оцінкою за 12-бальною шкалою.
- 2 рівні підказок + повне рішення на кожну задачу.
- Адаптивна складність: +1 рівень після 3 правильних підряд, −1 після 2 помилок.

### Гейміфікація

- Зірки (3/2/1/0), XP, рівні (формула `√(xp/100)+1`), валюта по сетингу.
- **Streak**: щоденний візит, найдовший streak, ачивки на 3/7/30 днів.
- **≥15 ачивок**: перші задачі, сотня, зірки, рівні, streak, перфектні сесії,
  блискавка, майстер теми, всеїдний, випускник, робота над помилками…
- Глобальний тостер ачивок (`AchievementToast`) та CSS-конфеті на результатах.
- Денна ціль (задачі / хвилини) з прогрес-баром на Hub-екрані.

### Робота над помилками

- Журнал помилок з інтервальним повторенням (1, 2, 4, 8, 16 днів).
- 5 успішних повторень → задача йде з черги, фіксується як виправлена.
- Окремий екран `/errors` зі своєю сесією review-режиму.

### Профіль, статистика, налаштування

- `/profile` — статистика, прогрес по темах, отримані ачивки.
- `/calendar` — heat-map активності за 12 тижнів.
- `/map` — тематична карта світу з лінійним прогресом по сетингу.
- `/settings` — звуки, денна ціль, зміна сетингу, PIN, повне скидання.

### Батьківська панель

- PIN через SHA-256 (`/parent/login`).
- `/parent` — зведення, точність по темах, слабкі теми, експорт JSON.

### Платформа

- PWA: повний маніфест, іконки 192/512/maskable, apple-touch-icon.
- Звукові ефекти через Web Audio API (без зовнішніх файлів).
- Анімації: pop-in, slide-in (toast), конфеті — у CSS keyframes.
- `tailwind-merge` для безпечного перевизначення класів у UI-компонентах.

## Документація

- [`docs/SPEC.md`](docs/SPEC.md) — повна функціональна специфікація.
- [`docs/CONTENT.md`](docs/CONTENT.md) — мапа тем, підтем і рівнів складності.
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — поточний статус і плани (v2.0).

## Стек

Vite 5 · React 18 · TypeScript 5 · Tailwind 3 · Zustand 4 · React Router 6 ·
lucide-react · tailwind-merge · vite-plugin-pwa.


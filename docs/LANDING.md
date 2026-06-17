# MathQuest — Лендінг-сторінка і SEO (v2.2)

## Огляд

Лендінг-сторінка (`/`) — публічна сторінка для залучення користувачів і SEO-індексації.
Виділена від основного додатку (`/app/*`), що залишається для авторизованих користувачів.

Лендінг завантажується **лініво** (lazy chunk ~33 KB / 9 KB gzip) для швидкого first load
та для запобігання завантаженню зайвого коду для гостей, які тільки читають інформацію.

---

## Архітектура маршрутизації

```
┌─ http://example.com/
│  └─ BrowserRouter (根)
│     ├─ Route "/" → Landing (лінива)
│     └─ Route "*" → Navigate to "/"
│
└─ http://example.com/app/...
   └─ BrowserRouter basename="/app"
      ├─ Route "/" → Hub (основний додаток)
      ├─ Route "/welcome" → Welcome
      ├─ Route "/practice" → Practice
      └─ ... (інші приватні маршрути)
```

При першому завантаженні React.js перевіряє `window.location.pathname`:

- Якщо починається з `/app` → монтує BrowserRouter з `basename="/app"`
- Інакше → монтує BrowserRouter з лендінгом (лініво завантажується)

**Навігація між лендінгом і додатком:**
- Користувач клацає "Почати тренування" → браузер переходить на `/app/` (full-page redirect)
- React unmount старий router, mount новий
- Ніякої необхідності переписувати `navigate('/task')` і т. д. — чистий SPA mode

---

## Компоненти лендінгу

Всі розташовані в `src/landing/sections/`:

### 1. **Header** (`Header.tsx`)
- Навігація: логотип + посилання на FAQ, About, Pricing (якщо є)
- CTA-кнопка: "Почати" або "Увійти"
- Липко-вверх при скролі

### 2. **Hero** (`Hero.tsx`)
- Велика CTA-кнопка з описом: "Тренуй математику з гейміфікацією"
- Subheading: "100+ задач, 5 рівнів складності, 15+ ачивок"
- Фоновий градієнт чи зображення
- Допомагає SEO (H1, текст, CTA)

### 3. **Stats** (`Stats.tsx`)
- 4–5 вражаючих цифр: кількість задач, рівнів, ачивок, користувачів (якщо є)
- Число-карточки з іконками
- Допомагає переконати користувача

### 4. **Features** (`Features.tsx`)
- 4–6 основних переваг з іконками (lucide-react)
  - "Адаптивна складність"
  - "Працює офлайн (PWA)"
  - "Гейміфікація: ачивки, стрики"
  - "10 тем за програмою"
- Короткі опису, залишають місця для деталей на окремих сторінках

### 5. **HowItWorks** (`HowItWorks.tsx`)
- 3–4 кроків (етапи навчання)
  1. "Обрати тему" → вибір складності
  2. "Практикувати" → розв'язування задач
  3. "Опрацювати помилки" → інтервальне повторення
  4. (опціонально) "Отримати ачивку" → нагороди
- Кожен крок з приміром або скріншотом

### 6. **Topics** (`Topics.tsx`)
- Сітка 10 тем (2–3 колони) з мініатюрами
  - `oral` (усний рахунок) 🗣️
  - `column` (письмові обчислення) 📝
  - `order` (порядок дій) 🔢
  - `fractions` (дроби) 🍕
  - `decimals` (десяткові) 💯
  - `word` (текстові задачі) 📖
  - `units` (одиниці) 📏
  - `geometry` (геометрія) 📐
  - `logic` (логіка) 🧩
  - `equations` (рівняння) ⚖️
- На кожну — назва, іконка, короткий opis

### 7. **Screenshots** (`Screenshots.tsx`)
- Слайдер (або просто гріді) зі скріншотами:
  - Екран "Обери тему"
  - Екран "Розв'яжи задачу"
  - Екран "Робочий стіл" (калькулятор, стовпчик, чернетка)
  - Екран "/profile" або "/map"
- Цей розділ показує фактичний UI, допомагає користувачеві вирішити

### 8. **FAQ** (`FAQ.tsx`)
- Частті питання (6–10) з деталями / прихованим контентом
  - "Це справді безкоштовно?" → "Так, без реклами."
  - "Для якого віку?" → "4–5 клас, 9–11 років."
  - "Чи потрібна реєстрація?" → "Ні, гостьовий режим працює."
  - "Чи це працює офлайн?" → "Так, це PWA."
  - "На якій мові?" → "Українська."
  - "Як насчет приватності?" → "Дані локальні, хмара опціональна."
- JSON-LD `FAQPage` schema в `index.html` для rich snippets

### 9. **CTA** (`CTA.tsx`)
- Повторна CTA-секція (перед footer)
- Великий заголовок: "Готовий почати?"
- Кнопка "Почати тренування"
- Можливо, форма email-підписки (для future email-марету)

### 10. **Footer** (`Footer.tsx`)
- Логотип
- Посилання (Privacy, Terms, Contact)
- Соціальні мережі (якщо є)
- Copyright

---

## SEO & соціальні теги

### Meta-теги у `index.html`

```html
<!-- Primary SEO -->
<title>MathQuest — тренажер математики для 4–5 класу українською</title>
<meta name="description" content="..." />
<meta name="keywords" content="математика 4 клас, математика 5 клас, ..." />
<meta name="author" content="MathQuest" />
<meta name="robots" content="index, follow, max-image-preview:large" />
<link rel="canonical" href="https://mathquest.com.ua/" />

<!-- Open Graph (для Facebook, LinkedIn, Viber) -->
<meta property="og:type" content="website" />
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="https://mathquest.com.ua/og-image.svg" />
<meta property="og:url" content="https://mathquest.com.ua/" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="..." />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="..." />
```

### JSON-LD Schema (`index.html`)

1. **WebApplication** — основна інформація про додаток
   ```json
   {
     "@type": "WebApplication",
     "name": "MathQuest",
     "description": "...",
     "applicationCategory": "EducationalApplication",
     "isAccessibleForFree": true,
     "featureList": [...]
   }
   ```

2. **FAQPage** — часті питання з rich snippets
   ```json
   {
     "@type": "FAQPage",
     "mainEntity": [
       { "@type": "Question", "name": "...", "acceptedAnswer": {...} },
       ...
     ]
   }
   ```

### `robots.txt`

```
User-agent: *
Allow: /

# Sitemap для кращої індексації
Sitemap: https://mathquest.com.ua/sitemap.xml
```

### `sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://mathquest.com.ua/</loc>
    <lastmod>2026-06-16</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://mathquest.com.ua/app</loc>
    <lastmod>2026-06-16</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
```

### Open Graph образка (`public/og-image.svg`)

SVelte-образка (1200×630 px) із:
- Логотипом MathQuest
- Заголовком
- Короткою описом
- Брендовими кольорами (фіолетовий/рожевий)

Використовується при поширенні в Facebook, Viber, Telegram для привабивого preview.

---

## Код-сплітинг і бандлінг

### Лендінг як lazy chunk

```tsx
const Landing = lazy(() =>
  import('@/landing/Landing').then((m) => ({ default: m.Landing })),
);

// У root App:
<BrowserRouter>
  <Suspense fallback={<LandingFallback />}>
    <Routes>
      <Route path="/" element={<Landing />} />
    </Routes>
  </Suspense>
</BrowserRouter>
```

**Результат:**
- First load (`/`): index.html + globals.css + Landing chunk (~33 KB / 9 KB gzip)
- App chunks (при навігації на `/app`): додаткові 604 KB / 173 KB

### Chunking стратегія (Vite default)

- `index-*.js` — app bundle (React, React Router, store, pages, components)
- `Landing-*.js` — лендінг (lazy)
- Vendor chunks автоматично (lucide-react, react-dom, zustand, etc.)

Якщо app bundle занадто великий (604 KB), можна розділити вручну через `manualChunks`:

```ts
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom', 'react-router-dom'],
        supabase: ['@supabase/supabase-js'],
        lucide: ['lucide-react'],
      }
    }
  }
}
```

---

## Хостинг & SPA маршрутизація

### Vercel (`vercel.json`)

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    { "source": "/(.*)", "headers": [
      { "key": "Cache-Control", "value": "public, max-age=3600" }
    ]}
  ]
}
```

Всі запити → index.html, React Router розбирає маршрут.

### Netlify / Cloudflare Pages (`public/_redirects`)

```
/* /index.html 200
```

Простий fallback: усе повертаємо на index.html з кодом 200 (не redirect).

### Локальна розробка (Vite dev сервер)

Vite автоматично обслуговує SPA без додаткової конфіги — `npm run dev` просто працює.

---

## Вебінальні перевірки

### SEO Lighthouse

```bash
npm run build
npm run preview
# Then open browser tools → Lighthouse → SEO audit
```

Мета: ≥ 90.

### PWA Lighthouse

- Маніфест: ✓ (público/manifest.webmanifest)
- Service Worker: ✓ (vite-plugin-pwa)
- Icons: ✓ (192, 512, maskable)
- HTTPS: ✓ (при деплої)

### Open Graph preview

Використовуй https://www.opengraphcheck.com/ для перевірки og:image, title, description.

---

## Стратегія контенту

### Цільові пошукові запити (укр)

- "математика 4 клас тренажер"
- "тренажер математики для дітей"
- "практика математики онлайн"
- "задачи з математики"
- "НУШ математика"
- "дроби, рівняння, геометрія"
- "онлайн курс математики"
- "бесплатный тренажер математики" (також RU)

Кожен з цих запитів знаходиться у:
- Title / Description
- H1, H2, H3 на лендінгу
- Keywords meta-тегу
- JSON-LD `featureList`

### Дорожня карта контенту

1. **Блог / статті** (future):
   - "Як допомогти дитині полюбити математику"
   - "5 причин, чому адаптивна складність працює"
   - "Гейміфікація у навчанні"

2. **Відео** (future):
   - UI walkthrough
   - Як розв'язати складну задачу (від app UI)

3. **Соціальні** (future):
   - TikTok: короткі мотиваційні кліпи про ачивки
   - Instagram: скріншоти + цитати про навчання

---

## Файлова структура

```
src/
  landing/
    Landing.tsx          # Root компонент лендінгу
    sections/
      Header.tsx         # Навігація
      Hero.tsx           # Вступ
      Stats.tsx          # Цифри
      Features.tsx       # Переваги
      HowItWorks.tsx     # Етапи
      Topics.tsx         # 10 тем
      Screenshots.tsx    # UI слайдер
      FAQ.tsx            # Часті питання
      CTA.tsx            # Повторна CTA
      Footer.tsx         # Підвал

public/
  robots.txt             # SEO
  sitemap.xml            # SEO
  og-image.svg           # Open Graph образка

index.html               # Meta, JSON-LD, SSR-fallback
```

---

## Чек-лист запуску

- [ ] Title, description, keywords у `index.html`
- [ ] Open Graph meta-теги заповнені
- [ ] Twitter Card tags присутні
- [ ] JSON-LD WebApplication & FAQPage додано
- [ ] `robots.txt` налаштовано
- [ ] `sitemap.xml` створено
- [ ] `og-image.svg` готова
- [ ] Vercel / Netlify конфіги передані
- [ ] Вебінальний Lighthouse audit: ≥ 90 SEO
- [ ] Опис Landing-компонентів у README
- [ ] Лендінг тестують реальні користувачі (A/B, feedback)

---

## Аналітика & виміри

Рекомендації для future інтеграції:

- **Google Analytics**: відстежувати page views, CTA clicks, bounce rate
- **Hotjar / Clarity**: вивчати поведінку користувача (скролінг, клаки)
- **Google Search Console**: монітор індексації, запити, CTR
- **Supabase**: відстежувати signup/login funnel

Цільові KPI:
- Landing CTR → `/app`: ≥ 20% від відвідувачів
- Signup rate: ≥ 30% від CTR
- Daily active users: зростаючий тренд
- Lighthouse SEO: 90+


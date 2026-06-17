# 🚀 MathQuest — Developer Quick Start v2.2

Шутрий посібник для нових розробників по структурі проекту та як все працює.

---

## 📁 Файлова структура (key files)

```
mathquest/
├── src/
│   ├── landing/                   ← **Публічна лендінг-сторінка**
│   │   ├── Landing.tsx            ← Root компонент лендінгу
│   │   └── sections/              ← 10 секцій лендінгу
│   │       ├── Header.tsx         ← Навігація + CTA
│   │       ├── Hero.tsx           ← Вступна секція (H1 + CTA)
│   │       ├── Stats.tsx          ← Цифри (100+ задач, etc)
│   │       ├── Features.tsx       ← Переваги
│   │       ├── HowItWorks.tsx     ← Етапи навчання
│   │       ├── Topics.tsx         ← Сітка 10 тем
│   │       ├── Screenshots.tsx    ← Скріншоти UI
│   │       ├── FAQ.tsx            ← Часті питання
│   │       ├── CTA.tsx            ← Повторна CTA
│   │       └── Footer.tsx         ← Підвал
│   │
│   ├── app/                       ← **Основний додаток (на /app/***)**
│   │   └── App.tsx                ← Router logic + маршрути (BrowserRouter basename="/app")
│   │
│   ├── pages/                     ← Сторінки додатку (Welcome, Auth, Hub, Practice, etc)
│   ├── components/                ← UI компоненти (Card, Button, HintPanel, etc)
│   ├── store/                     ← Zustand store (profile, session)
│   ├── cloud/                     ← Supabase integration (api/, sync/)
│   ├── lib/                       ← Утиліти (random, format, sounds, dates, etc)
│   ├── features/                  ← Tasks (generators), themes, achievements
│   ├── main.tsx                   ← Entry point (removes SSR fallback)
│   └── styles/globals.css         ← Global styles + landing-mode
│
├── public/
│   ├── favicon.svg                ← App icon
│   ├── icon-192.svg               ← PWA icon (192×192)
│   ├── icon-512.svg               ← PWA icon (512×512)
│   ├── icon-maskable-512.svg      ← Adaptive icon
│   ├── og-image.svg               ← Open Graph образка (1200×630)
│   ├── robots.txt                 ← SEO: robots rules
│   ├── sitemap.xml                ← SEO: site structure
│   ├── _redirects                 ← SPA fallback (Netlify/Cloudflare)
│   └── manifest.webmanifest       ← PWA manifest (generated or manual)
│
├── index.html                     ← Main HTML: meta tags, SSR fallback, JSON-LD
├── vite.config.ts                 ← Vite config + PWA plugin
├── tailwind.config.ts             ← Tailwind config
├── tsconfig.json                  ← TypeScript config
├── package.json                   ← Dependencies
├── README.md                       ← Project overview
├── LAUNCH-CHECKLIST.md            ← Pre-launch checklist
│
└── docs/
    ├── SPEC.md                    ← Technical spec (v2.2)
    ├── ROADMAP.md                 ← Feature roadmap (includes v2.2)
    ├── CONTENT.md                 ← Task generators & topics
    ├── CLOUD.md                   ← Supabase setup
    ├── AUDIT.md                   ← Bug fixes & competitor analysis
    ├── LANDING.md                 ← **Landing page documentation** (NEW)
    └── DOCS-AUDIT-v2.2.md         ← **Documentation audit** (NEW)
```

---

## 🔀 Маршрутизація (Routing)

### Архітектура

```
User visits https://mathquest.com.ua/
    ↓
index.html (SSR fallback shown briefly)
    ↓
React.js starts (`src/main.tsx`)
    ↓
Checks window.location.pathname:

IF pathname.startsWith('/app'):
    ├─ Mounts BrowserRouter with basename="/app"
    ├─ Renders AppRoutes (Hub, Practice, Task, etc)
    └─ All navigate() calls work relative to /app
        e.g., navigate('/task') → /app/task

ELSE (pathname === '/' or unrecognized):
    ├─ Mounts BrowserRouter (no basename)
    ├─ Renders Landing (lazy chunk)
    └─ Landing has link: <Link to="/app/welcome">
        → browser navigates to /app/welcome
        → React unmounts Landing, mounts AppRoutes
```

### URLs

| URL | Component | Bundle |
|---|---|---|
| `/` | Landing | Light (33 KB/9 KB gzip) |
| `/about` (or any non-/app) | Landing (catch-all) | Light |
| `/app/` | Hub | Heavy (app bundle + deps) |
| `/app/practice` | Practice | (same bundle) |
| `/app/task` | Task | (same bundle) |

---

## 🎯 Landing Page (/ route)

### How to add content

1. **Create a new section** in `src/landing/sections/NewSection.tsx`:
   ```tsx
   export function NewSection() {
     return (
       <section className="py-12 sm:py-20">
         {/* Your content here */}
       </section>
     );
   }
   ```

2. **Add it to Landing.tsx**:
   ```tsx
   import { NewSection } from './sections/NewSection';
   
   export function Landing() {
     // ...
     return (
       <div>
         {/* existing sections */}
         <NewSection />
       </div>
     );
   }
   ```

3. **Styles**: Use Tailwind classes. For responsive, use `sm:`, `md:`, `lg:` prefixes.

### SEO Best Practices

- Use semantic HTML: `<h1>`, `<h2>`, `<section>`, `<nav>`
- Include meaningful alt text on images
- Keep headings hierarchical (H1 in Hero, H2 for sections, H3 for subsections)
- Use good contrast (4.5:1 or better)
- Keep text scannable (bullet points, short paragraphs)

---

## 🔧 Development Workflow

### Setup

```bash
npm install
npm run dev
# Visits http://localhost:5174/
```

### Dev Server URLs

- **Landing**: http://localhost:5174/
- **App**: http://localhost:5174/app/
- **Welcome page**: http://localhost:5174/app/welcome

### Build & Test

```bash
npm run build       # TypeScript + Vite production build
npm test            # Unit tests (workbench + generators)
npm run preview     # Preview production build locally
```

### Format Code

```bash
npm run format      # Prettier on src/**/*.{ts,tsx,css,md}
```

---

## 🎨 Styling

### Tailwind + tailwind-merge

All CSS is via Tailwind classes. Use `twMerge` in UI components for safe class merging:

```tsx
import { twMerge } from 'tailwind-merge';

export function Button({ className, ...props }) {
  return (
    <button
      className={twMerge(
        'px-4 py-2 rounded bg-brand-600 text-white',
        className // user-provided classes override defaults
      )}
      {...props}
    />
  );
}
```

### Landing Mode

On landing page, `<html>` gets class `landing-mode`. You can use it:

```css
.landing-mode {
  background: white;  /* pure white background */
}

.landing-mode .container-app {
  max-width: none;  /* no width constraint on landing */
}
```

---

## 🌐 Deployment

### Vercel

```bash
git push origin main
# Vercel auto-deploys (see vercel.json for rewrites)
```

### Netlify / Cloudflare Pages

```bash
npm run build
# Upload dist/ folder
# Or: push to GitHub, connect repo, auto-deploys
```

**Important**: Both use `public/_redirects` for SPA fallback:
```
/* /index.html 200
```

---

## 📱 PWA Setup

### Manifest

Edit `public/manifest.webmanifest` or vite-plugin-pwa config in `vite.config.ts`:

```json
{
  "start_url": "/app",  ← Users installing PWA start here
  "scope": "/app",      ← PWA covers /app/* routes
  "icons": [...]
}
```

### Install on Mobile

1. Visit https://mathquest.com.ua on phone
2. Browser shows "Install app" prompt
3. Click install → PWA installed with app icon
4. Opens at `/app/` (thanks to start_url)

---

## ☁️ Cloud Sync (Optional)

See [`docs/CLOUD.md`](docs/CLOUD.md) for Supabase setup.

If `.env.local` has no Supabase keys → app works 100% offline with zustand-persist.

---

## 🧪 Testing

### Unit Tests

All tests in `scripts/`:
- `test-workbench.ts` — tests workbench functionality
- `test-generators.ts` — tests all 10 topics × ~7 subtopics each

Run:
```bash
npm test
# or individually:
npm run test:workbench
npm run test:generators
```

### Manual Testing

**Landing page:**
1. Open http://localhost:5174/
2. Check all sections render
3. Click "Почати" button → goes to `/app/welcome`
4. Check Open Graph preview (https://ogimage.og/)

**App:**
1. Visit http://localhost:5174/app/
2. Create profile (name, age, theme)
3. Practice a task
4. Check store persistence (refresh page)

---

## 🔐 Secrets & Environment

### `.env.local` (not committed)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

### On Host (Vercel/Netlify)

Set the same variables in project settings.

**Never commit `.env.local` or secrets!**

---

## 📚 Documentation

- **`README.md`** — Project overview, quick start
- **`docs/SPEC.md`** — Technical specification (v2.2)
- **`docs/ROADMAP.md`** — Feature roadmap (includes v2.2 landing)
- **`docs/CONTENT.md`** — Task generators & topics
- **`docs/CLOUD.md`** — Supabase setup
- **`docs/LANDING.md`** — Landing page architecture & SEO (NEW)
- **`LAUNCH-CHECKLIST.md`** — Pre-launch verification checklist

---

## 🐛 Debugging

### Browser Console

```js
// Check if landing or app is mounted
console.log(window.location.pathname);

// Check store state
const profileStore = require('@/store/profile');
console.log(profileStore.useProfileStore.getState());

// Check service worker
navigator.serviceWorker.getRegistrations().then(regs => console.log(regs));
```

### Network Tab

- Look for `Landing-*.js` chunk (should be loaded only on `/`)
- Look for `index-*.js` chunk (should be loaded only on `/app/`)

### Performance

- Run Lighthouse audit (DevTools → Lighthouse)
- Check Core Web Vitals

---

## 🚀 Ready to Launch?

See **`LAUNCH-CHECKLIST.md`** for final pre-launch verification.

---

**Questions?** Check the docs or reach out! 🙌


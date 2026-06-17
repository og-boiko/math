# Design Document: Rebranding MathQuest to YaKMath

## Context & Goals
The project **MathQuest** (a math training web application/PWA for 4–5 grades in Ukraine) is being rebranded to **YaKMath** to align with the partner brand **YaK Language School** (`yakls.com.ua`). 
In the future, other subject trainers may be developed under separate micro-brands (e.g., *YaKLogic*, *YaKArt*, *YaK*). Therefore, **YaKMath** will be a dedicated domain and brand for this math application.

This document describes the design changes for the rebranding, covering code modifications, SEO metadata updates, PWA configuration, asset updates, and partner link integration.

## Design Details

### 1. Brand Name & Copy Replacements
All user-facing and metadata instances of "MathQuest" will be rebranded to "YaKMath".
- **Primary Brand Spelling**: `YaKMath`
- **Application Titles**: `YaKMath — тренажер математики (4–5 клас НУШ)`
- **Dynamic SEO Page Titles**: `YaKMath — Тренажер: [Тема] (4–5 клас НУШ)`

### 2. Domain & SEO Canonical Changes
The production domain is changing from `mathquest.com.ua` to `yakmath.com.ua`.
- **Sitemap**: `/public/sitemap.xml` will be updated to use `https://yakmath.com.ua/`.
- **Robots.txt**: Updated to point to `https://yakmath.com.ua/sitemap.xml`.
- **HTML Canonical Tags**: Canonical, OpenGraph, and Twitter tags in `index.html` will be updated to point to the new domain.
- **Structured Data (JSON-LD)**: Schema.org structured data in `index.html` and `docs/LANDING.md` will be updated.

### 3. PWA Manifest Configuration
In `vite.config.ts`, the PWA manifest details will be updated:
- `name` from `'MathQuest — тренажер математики'` to `'YaKMath — тренажер математики'`
- `short_name` from `'MathQuest'` to `'YaKMath'`

### 4. Graphic Assets
The SVG logo/social sharing card at `/public/og-image.svg` contains text "MathQuest". The text node inside this SVG will be updated to "YaKMath".

### 5. Partner Link Integration
A simple partner link section will be integrated into the landing page footer (`src/landing/sections/Footer.tsx`) to establish mutual traffic routing with YaK Language School:
- Link: `https://yakls.com.ua/`
- Text: `Партнери: YaK Language School — онлайн-курси іноземних мов для дітей та дорослих`
- Attributes: `target="_blank" rel="noopener"` for SEO and security best practices.

## Verification & Testing
- Build the Vite project locally (`npm run build`) to ensure no typescript errors or broken imports occur.
- Manually run the dev server (`npm run dev`) and inspect the app UI to ensure "YaKMath" is displayed correctly in the headers, footer, and settings.
- Inspect the generated DOM to verify meta canonical tags and JSON-LD structured data.
- Validate that `public/og-image.svg` displays the updated text correctly when rendered.

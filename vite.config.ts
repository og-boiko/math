import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: false },
      includeAssets: [
        'favicon.svg',
        'icon-192.svg',
        'icon-512.svg',
        'icon-maskable-512.svg',
        'og-image.svg',
        'robots.txt',
        'sitemap.xml',
      ],
      manifest: {
        name: 'MathQuest — тренажер математики',
        short_name: 'MathQuest',
        description: 'Тренажер математики для 4–5 класу. Українською.',
        lang: 'uk',
        theme_color: '#7c3aed',
        background_color: '#f8fafc',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/app',
        scope: '/',
        icons: [
          { src: '/icon-192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any' },
          { src: '/icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any' },
          {
            src: '/icon-maskable-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  build: {
    // Розбиваємо великий index.js на менші чанки, щоб Cloudflare/Vercel
    // не падали на ліміті розміру окремого файлу і браузер кешував залежності
    // окремо від нашого коду (рідше інвалідація → швидші повторні візити).
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'state-vendor': ['zustand'],
          'icons-vendor': ['lucide-react'],
          'supabase-vendor': ['@supabase/supabase-js'],
        },
      },
    },
    // Підвищуємо межу попередження — у нас є один великий чанк додатку.
    chunkSizeWarningLimit: 700,
    // Source maps лише в DEV — у проді не треба, бо роздуває деплой.
    sourcemap: false,
  },
});

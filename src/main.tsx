import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/App';
import './styles/globals.css';
import { startCloudSync } from './cloud/sync/cloudSync';

startCloudSync();

// Прибираємо SSR-фолбек (з index.html) до того, як React почне рендерити —
// інакше при першому кадрі може блимнути «Завантажуємо…».
const fallback = document.getElementById('ssr-fallback');
if (fallback) fallback.remove();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

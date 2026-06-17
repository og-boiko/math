import { useEffect } from 'react';
import { LandingHeader } from './sections/Header';
import { Hero } from './sections/Hero';
import { Features } from './sections/Features';
import { HowItWorks } from './sections/HowItWorks';
import { Screenshots } from './sections/Screenshots';
import { Topics } from './sections/Topics';
import { Stats } from './sections/Stats';
import { FAQ } from './sections/FAQ';
import { Partners } from './sections/Partners';
import { CTA } from './sections/CTA';
import { LandingFooter } from './sections/Footer';

/**
 * Маркетинговий лендінг — публічна сторінка для SEO та залучення трафіку.
 * Лежить на `/`. Сам додаток — на `/app/*`.
 */
export function Landing() {
  // Тегаємо <html> класом, щоб скоригувати фон і прибрати «container-app»-обмеження.
  useEffect(() => {
    document.documentElement.classList.add('landing-mode');
    return () => document.documentElement.classList.remove('landing-mode');
  }, []);

  return (
    <div className="bg-white text-slate-900 min-h-screen overflow-x-hidden">
      <LandingHeader />
      <main>
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <Topics />
        <Screenshots />
        <FAQ />
        <Partners />
        <CTA />
      </main>
      <LandingFooter />
    </div>
  );
}

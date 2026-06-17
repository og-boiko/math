export function LandingFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-200 bg-slate-50/60">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span
                className="w-9 h-9 rounded-xl grid place-items-center text-xl
                  bg-gradient-to-br from-brand-500 to-fuchsia-500 text-white"
                aria-hidden
              >
                🧠
              </span>
              <span className="font-extrabold text-lg tracking-tight">
                YaK<span className="text-brand-600">Math</span>
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-600 max-w-sm leading-relaxed">
              Адаптивний тренажер математики для 4–5 класу. Українською. Без
              реклами. Працює офлайн.
            </p>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Продукт
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="#features" className="text-slate-700 hover:text-brand-700">
                  Можливості
                </a>
              </li>
              <li>
                <a href="#how" className="text-slate-700 hover:text-brand-700">
                  Як працює
                </a>
              </li>
              <li>
                <a href="#topics" className="text-slate-700 hover:text-brand-700">
                  Теми
                </a>
              </li>
              <li>
                <a href="#faq" className="text-slate-700 hover:text-brand-700">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Почати
            </div>
            <div className="mt-3">
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="/app/welcome" className="text-slate-700 hover:text-brand-700">
                    Створити профіль
                  </a>
                </li>
                <li>
                  <a href="/app" className="text-slate-700 hover:text-brand-700">
                    Увійти
                  </a>
                </li>
                <li>
                  <a href="/app/leaderboard" className="text-slate-700 hover:text-brand-700">
                    Лідерборд
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex flex-col gap-1.5">
            <div>© {year} YaKMath. Створено в Україні з любов’ю до математики.</div>
            <div>
              Партнер:{' '}
              <a
                href="https://yakls.com.ua/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-slate-600 hover:text-brand-600 underline decoration-slate-300 hover:decoration-brand-600 transition"
              >
                YaK Language School
              </a>{' '}
              — онлайн-курси іноземних мов для дітей та дорослих.
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span>Без реклами</span>
            <span>·</span>
            <span>Без трекінгу дітей</span>
            <span>·</span>
            <span>PWA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

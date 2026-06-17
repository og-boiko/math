import { ArrowRight, LogIn } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div
          className="relative overflow-hidden rounded-[2.5rem] px-6 sm:px-12 py-14 sm:py-20 text-center
            bg-gradient-to-br from-brand-600 via-fuchsia-600 to-rose-500 text-white shadow-2xl
            shadow-brand-900/20"
        >
          {/* декор */}
          <div
            className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-2xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-white/10 blur-2xl"
            aria-hidden
          />

          <div className="relative">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Перші 5 задач — за хвилину.
              <br />
              Без реєстрації.
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
              Дайте дитині спробувати. Якщо сподобається — залишиться надовго.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/app/welcome"
                className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-2xl
                  bg-white text-brand-700 font-bold text-lg shadow-xl shadow-brand-900/10
                  hover:scale-105 transition active:scale-95"
              >
                Почати безкоштовно <ArrowRight size={20} />
              </a>
              <a
                href="/app"
                className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-2xl
                  bg-brand-700 hover:bg-brand-800 text-white font-bold text-lg
                  transition active:scale-95 border border-brand-500"
              >
                <LogIn size={20} /> Увійти
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

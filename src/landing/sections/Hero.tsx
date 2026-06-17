import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* фонові кольорові блоби */}
      <div
        className="pointer-events-none absolute -top-40 -left-32 w-[520px] h-[520px] rounded-full
          bg-gradient-to-br from-brand-300/50 to-fuchsia-300/40 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-48 -right-32 w-[560px] h-[560px] rounded-full
          bg-gradient-to-tr from-emerald-200/50 to-sky-200/40 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8 pt-12 sm:pt-20 pb-16 sm:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 border border-brand-200
                px-3 py-1 text-xs font-bold text-brand-700"
            >
              <Sparkles size={12} /> Українською · 4–5 клас · НУШ
            </span>
            <h1
              className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]
                text-slate-900"
            >
              Математика, від якої{' '}
              <span className="bg-gradient-to-r from-brand-600 via-fuchsia-600 to-rose-500 bg-clip-text text-transparent">
                не нудно
              </span>
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-slate-600 max-w-xl leading-relaxed">
              Тренажер з адаптивною складністю, робочим столом для чернетки і
              щоденним прогресом. Дитина вчиться сама, а ви бачите результат.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="/app/welcome"
                className="inline-flex items-center justify-center gap-2 h-14 px-7 rounded-2xl
                  bg-brand-600 hover:bg-brand-700 text-white font-bold text-base shadow-lg
                  shadow-brand-600/25 transition active:scale-[0.98]"
              >
                Почати безкоштовно <ArrowRight size={18} />
              </a>
              <a
                href="#how"
                className="flex items-center justify-center gap-2 h-14 px-6 rounded-2xl border-2 border-slate-200/50 bg-white/50 text-slate-600 font-bold backdrop-blur-sm sm:w-auto hover:border-brand-300 hover:text-brand-700 transition"
              >
                Як це працює
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-emerald-600" />
                Без реклами
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-emerald-600" />
                Працює офлайн (PWA)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-emerald-600" />
                Жодних PII від дитини
              </span>
            </div>
          </div>

          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

/** Декоративний "скріншот" задачі — чистий SVG/HTML, ніяких зображень (швидко, чітко на ретіні). */
function HeroVisual() {
  return (
    <div className="relative">
      <div
        className="absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-br from-brand-100 via-white to-fuchsia-100
          shadow-2xl shadow-brand-900/10 ring-1 ring-slate-200/60"
        aria-hidden
      />
      <div className="relative p-5 sm:p-8">
        {/* "Телефон" */}
        <div
          className="mx-auto w-full max-w-sm rounded-[2rem] bg-white shadow-2xl shadow-slate-900/10
            ring-1 ring-slate-200 p-5"
        >
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-3">
            <span>Задача 4 / 10</span>
            <span>Рівень 3</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 mb-4 overflow-hidden">
            <div className="h-full w-2/5 rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-500" />
          </div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">
            Прості рівняння
          </div>
          <div className="text-3xl font-extrabold text-center my-6 leading-snug">
            Розв&apos;яжи рівняння:
            <br />
            <span className="font-black">x + 47 = 113</span>
          </div>
          <div className="h-14 rounded-2xl border-2 border-emerald-400 bg-emerald-50 grid place-items-center text-2xl font-extrabold text-emerald-700">
            66
          </div>
          <div className="mt-3 inline-flex items-center gap-2 text-emerald-600 font-extrabold">
            ✓ Правильно! +3 ⭐
          </div>
        </div>

        {/* плаваючі картки-нотатки */}
        <div
          className="hidden sm:flex absolute -left-6 top-10 rounded-2xl bg-white shadow-xl
            ring-1 ring-slate-200 px-4 py-3 items-center gap-2 rotate-[-6deg]"
          aria-hidden
        >
          <span className="text-2xl">🔥</span>
          <div>
            <div className="text-xs text-slate-500">Серія</div>
            <div className="font-extrabold">7 днів поспіль</div>
          </div>
        </div>
        <div
          className="hidden sm:flex absolute -right-4 bottom-12 rounded-2xl bg-white shadow-xl
            ring-1 ring-slate-200 px-4 py-3 items-center gap-2 rotate-[5deg]"
          aria-hidden
        >
          <span className="text-2xl">🏆</span>
          <div>
            <div className="text-xs text-slate-500">Нова ачивка</div>
            <div className="font-extrabold">Ідеальна сесія</div>
          </div>
        </div>
      </div>
    </div>
  );
}

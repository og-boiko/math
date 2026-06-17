import { SectionHead } from './Features';

const STEPS = [
  {
    n: '01',
    title: 'Створи профіль',
    desc: 'Без email, якщо не хочеш — локальний профіль працює одразу. Облікового запису достатньо для синхронізації між пристроями.',
    icon: '🚀',
  },
  {
    n: '02',
    title: 'Обирай тему',
    desc: 'Множення, дроби, рух, геометрія, нерівності — 10 розділів за програмою НУШ для 4–5 класу.',
    icon: '🧭',
  },
  {
    n: '03',
    title: 'Тренуйся щодня',
    desc: 'Невеликі сесії по 5–10 задач. Помилки повертаються пізніше, рівень підлаштовується під результат.',
    icon: '⚡',
  },
  {
    n: '04',
    title: 'Отримуй нагороди',
    desc: 'Зірки, монети, ачивки і теми оформлення. Серії днів і героїв — як у грі, але вчиш математику.',
    icon: '🏆',
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-20 sm:py-28 bg-gradient-to-b from-slate-50/60 to-white">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHead
          eyebrow="Як це працює"
          title="Чотири кроки до впевненості"
          desc="Працює з першого відкриття. Реєстрація — не обов'язкова."
        />

        <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li
              key={s.n}
              className="relative rounded-3xl bg-white border border-slate-200 p-6 hover:border-brand-300 transition"
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl" aria-hidden>{s.icon}</span>
                <span className="text-xs font-black tracking-widest text-slate-300 tabular-nums">
                  {s.n}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-extrabold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-slate-600 leading-relaxed text-sm">{s.desc}</p>
              {i < STEPS.length - 1 && (
                <div
                  className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-slate-200"
                  aria-hidden
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

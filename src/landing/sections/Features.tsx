import {
  Brain,
  Wrench,
  Trophy,
  RotateCw,
  CalendarHeart,
  WifiOff,
} from 'lucide-react';
import type { ReactNode } from 'react';

const FEATURES: Array<{
  icon: ReactNode;
  title: string;
  desc: string;
  tone: 'brand' | 'emerald' | 'amber' | 'sky' | 'rose' | 'slate';
}> = [
  {
    icon: <Brain size={22} />,
    title: 'Адаптивна складність',
    desc: 'Кожна правильна відповідь робить наступну задачу трохи складнішою. Помилка — повертає до зручного рівня. Без розчарувань.',
    tone: 'brand',
  },
  {
    icon: <Wrench size={22} />,
    title: 'Робочий стіл',
    desc: 'Калькулятор-стрічка, чернетка для малювання і помічник для стовпчика. Як паперовий зошит — тільки розумніший.',
    tone: 'emerald',
  },
  {
    icon: <RotateCw size={22} />,
    title: 'Журнал помилок',
    desc: 'Помилився — задача автоматично повернеться через день, тиждень, місяць. Поки не закріпиться. Без зубріння.',
    tone: 'amber',
  },
  {
    icon: <Trophy size={22} />,
    title: 'Ачивки та зірки',
    desc: 'Понад 30 досягнень: за серію, за швидкість, за ідеальні сесії. Дитина бачить, що росте — і хоче ще.',
    tone: 'sky',
  },
  {
    icon: <CalendarHeart size={22} />,
    title: 'Щоденний ритм',
    desc: 'Невелика мета на день, серії днів, календар-теплокарта. Стабільність важливіша, ніж марафони.',
    tone: 'rose',
  },
  {
    icon: <WifiOff size={22} />,
    title: 'Працює офлайн',
    desc: 'PWA з повним кешуванням. У дорозі, на дачі, в літаку — все працює. Прогрес синхронізується, коли мережа з’явиться.',
    tone: 'slate',
  },
];

const TONES: Record<NonNullable<(typeof FEATURES)[number]['tone']>, string> = {
  brand: 'bg-brand-50 text-brand-700 ring-brand-200',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  amber: 'bg-amber-50 text-amber-700 ring-amber-200',
  sky: 'bg-sky-50 text-sky-700 ring-sky-200',
  rose: 'bg-rose-50 text-rose-700 ring-rose-200',
  slate: 'bg-slate-100 text-slate-700 ring-slate-200',
};

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHead
          eyebrow="Можливості"
          title="Усе, щоб дитина любила математику"
          desc="Не енциклопедія завдань — а тренер, який підлаштовується під вашу дитину."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <article
              key={f.title}
              className="group rounded-3xl bg-white border border-slate-200 p-6
                hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/5
                transition-all"
            >
              <div
                className={`w-12 h-12 grid place-items-center rounded-2xl ring-1 ${TONES[f.tone]}
                  group-hover:scale-105 transition-transform`}
                aria-hidden
              >
                {f.icon}
              </div>
              <h3 className="mt-4 text-lg font-extrabold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-slate-600 leading-relaxed">{f.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SectionHead(props: { eyebrow: string; title: string; desc?: string }) {
  return (
    <div className="max-w-2xl">
      <div className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
        {props.eyebrow}
      </div>
      <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
        {props.title}
      </h2>
      {props.desc && <p className="mt-4 text-lg text-slate-600 leading-relaxed">{props.desc}</p>}
    </div>
  );
}

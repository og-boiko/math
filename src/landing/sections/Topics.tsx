import { SectionHead } from './Features';

const TOPICS = [
  { id: 'oral', name: 'Усний рахунок', emoji: '🧮', sample: '47 + 38' },
  { id: 'column', name: 'Стовпчиком', emoji: '📐', sample: '1234 × 56' },
  { id: 'order', name: 'Порядок дій', emoji: '🎯', sample: '(5 + 3) × 2' },
  { id: 'fractions', name: 'Дроби', emoji: '½', sample: '3/4 від 20' },
  { id: 'decimals', name: 'Десяткові', emoji: '🔢', sample: '3,14 + 1,5' },
  { id: 'word', name: 'Текстові задачі', emoji: '📖', sample: 'Поїзд… км/год' },
  { id: 'units', name: 'Одиниці', emoji: '⚖️', sample: '2 м 30 см + 80 см' },
  { id: 'geometry', name: 'Геометрія', emoji: '📏', sample: 'P трикутника' },
  { id: 'logic', name: 'Логіка', emoji: '🧩', sample: '1, 1, 2, 3, 5, ?' },
  { id: 'equations', name: 'Рівняння', emoji: '=', sample: 'x + 47 = 113' },
];

export function Topics() {
  return (
    <section id="topics" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHead
          eyebrow="Зміст"
          title="10 тем — повна програма НУШ для 4–5 класу"
          desc="Від усного рахунку до подвійних нерівностей і об’єму паралелепіпеда. Кожна тема — 5 рівнів складності."
        />

        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TOPICS.map((t) => (
            <a
              href={`/topics/${t.id}`}
              key={t.id}
              className="group rounded-2xl bg-white border border-slate-200 p-4 flex items-center gap-4
                hover:border-brand-300 hover:shadow-md hover:shadow-brand-900/5 transition"
            >
              <span
                className="w-12 h-12 grid place-items-center rounded-xl bg-gradient-to-br from-brand-50 to-fuchsia-50
                  ring-1 ring-brand-100 text-2xl shrink-0"
                aria-hidden
              >
                {t.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-extrabold text-slate-900 group-hover:text-brand-600 transition">{t.name}</div>
                <div className="text-sm text-slate-500 font-mono truncate">{t.sample}</div>
              </div>
            </a>
          ))}
        </ul>
      </div>
    </section>
  );
}

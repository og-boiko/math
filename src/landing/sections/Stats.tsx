/**
 * Маленька «довірча» смужка з ключовими числами.
 * Числа реальні: 10 тем — у нашому реєстрі, 50+ генераторів — теж.
 */
const ITEMS = [
  { value: '10', label: 'тем програми' },
  { value: '50+', label: 'типів задач' },
  { value: '5', label: 'рівнів складності' },
  { value: '0', label: 'реклами' },
];

export function Stats() {
  return (
    <section className="border-y border-slate-200 bg-slate-50/50">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-8 sm:py-10">
        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {ITEMS.map((it) => (
            <li key={it.label}>
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                {it.value}
              </div>
              <div className="mt-1 text-sm text-slate-600">{it.label}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

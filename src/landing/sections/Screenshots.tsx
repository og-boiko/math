import { SectionHead } from './Features';

/**
 * «Скріншоти» намальовано HTML-ом — векторно, чітко на ретіні, без зайвих байтів.
 * Три картки: задача, ачивка, статистика.
 */
export function Screenshots() {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-white to-slate-50/60">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHead
          eyebrow="Інтерфейс"
          title="Чисто, тепло, без зайвого"
          desc="Дизайн без яскравих відволікань: дитина концентрується на завданні."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <ScreenCard title="Сесія задач" subtitle="Розв'язування з підказками">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">
              Зустрічний рух
            </div>
            <div className="text-xl font-extrabold leading-snug">
              З двох міст одночасно виїхали велосипедисти. Через 3 год вони
              зустрілися. Знайди швидкість другого, якщо першого — 12 км/год,
              а відстань — 78 км.
            </div>
            <div className="mt-4 h-12 rounded-xl border-2 border-brand-300 bg-white grid place-items-center font-extrabold text-brand-700">
              14
            </div>
            <div className="mt-3 flex justify-between text-xs">
              <span className="text-slate-500">Підказка 1/2</span>
              <span className="text-emerald-600 font-bold">+2 ⭐</span>
            </div>
          </ScreenCard>

          <ScreenCard title="Ачивки" subtitle="Понад 30 досягнень" tone="amber">
            <div className="space-y-2">
              {[
                { e: '🔥', t: 'Серія 7 днів', s: 'Розблоковано вчора' },
                { e: '🏆', t: 'Ідеальна сесія', s: '10/10 без підказок' },
                { e: '⚡', t: 'Швидкі пальці', s: 'Менше 6 секунд на задачу' },
                { e: '🛠️', t: 'Робочий майстер', s: 'Чернетка 25 разів' },
              ].map((a) => (
                <div
                  key={a.t}
                  className="flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-slate-200"
                >
                  <span className="text-2xl" aria-hidden>{a.e}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm">{a.t}</div>
                    <div className="text-xs text-slate-500 truncate">{a.s}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScreenCard>

          <ScreenCard title="Прогрес" subtitle="Графіки і серія" tone="emerald">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Metric label="Усього задач" value="1 248" />
              <Metric label="Точність" value="87%" />
              <Metric label="Серія днів" value="12 🔥" />
              <Metric label="Зірок" value="3 421 ⭐" />
            </div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">
              Активність за тиждень
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {[3, 5, 4, 7, 6, 2, 8].map((h, i) => (
                <div
                  key={i}
                  className="rounded-md bg-emerald-200/80"
                  style={{ height: `${h * 8}px`, marginTop: 'auto' }}
                />
              ))}
            </div>
          </ScreenCard>
        </div>
      </div>
    </section>
  );
}

function ScreenCard(props: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  tone?: 'brand' | 'amber' | 'emerald';
}) {
  const tones = {
    brand: 'from-brand-100 to-fuchsia-100',
    amber: 'from-amber-100 to-rose-100',
    emerald: 'from-emerald-100 to-sky-100',
  } as const;
  const tone = props.tone ?? 'brand';

  return (
    <article className="rounded-3xl bg-white border border-slate-200 overflow-hidden">
      <div className={`px-5 py-4 bg-gradient-to-br ${tones[tone]} border-b border-slate-200`}>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
          {props.subtitle}
        </div>
        <div className="text-lg font-extrabold text-slate-900">{props.title}</div>
      </div>
      <div className="p-5">{props.children}</div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 ring-1 ring-slate-200 p-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-xl font-black tabular-nums">{value}</div>
    </div>
  );
}

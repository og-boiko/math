import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useProfileStore } from '@/store/profile';
import { Card } from '@/components/ui/Card';
import { lastNDays, monthName, shortDayName, todayKey } from '@/lib/dates';

const HEAT_DAYS = 84; // 12 тижнів × 7

function intensityClass(attempts: number): string {
  if (attempts === 0) return 'bg-slate-100';
  if (attempts < 5) return 'bg-brand-100';
  if (attempts < 15) return 'bg-brand-400';
  if (attempts < 30) return 'bg-brand-600';
  return 'bg-brand-800';
}

export function Calendar() {
  const navigate = useNavigate();
  const profile = useProfileStore((s) => s.profile)!;
  const [selected, setSelected] = useState<string | null>(todayKey());

  const days = lastNDays(HEAT_DAYS);
  // Розкласти по тижнях (стовпчиках). Кожна колонка — 7 днів (Пн..Нд).
  const weeks: string[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  // Етикетки місяців над тижнями
  const monthLabels: Array<{ idx: number; label: string }> = [];
  let prevMonth = -1;
  weeks.forEach((w, i) => {
    const first = new Date(`${w[0]}T00:00:00`);
    if (first.getMonth() !== prevMonth) {
      monthLabels.push({ idx: i, label: monthName(first.getMonth()) });
      prevMonth = first.getMonth();
    }
  });

  const selectedActivity = selected ? profile.activity[selected] : undefined;
  const totalDays = Object.values(profile.activity).filter((a) => a.attempts > 0).length;
  const totalAttempts = Object.values(profile.activity).reduce((s, a) => s + a.attempts, 0);
  const totalTime = Object.values(profile.activity).reduce((s, a) => s + a.timeSec, 0);

  return (
    <div className="container-app">
      <header className="flex items-center mb-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100"
          aria-label="Назад"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-extrabold ml-2">Календар</h1>
      </header>

      <Card className="mb-4">
        <div className="grid grid-cols-3 gap-2 text-center mb-3">
          <div>
            <div className="text-2xl font-extrabold">{totalDays}</div>
            <div className="text-xs text-slate-500">днів активності</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold">{totalAttempts}</div>
            <div className="text-xs text-slate-500">задач загалом</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold">{Math.round(totalTime / 60)}</div>
            <div className="text-xs text-slate-500">хв тренувань</div>
          </div>
        </div>

        <div className="text-xs text-slate-500 mb-2">
          Останні {HEAT_DAYS} днів. Тапни день, щоб подивитись деталі.
        </div>

        {/* Heat-map */}
        <div className="flex gap-1 overflow-x-auto pb-1">
          {/* Метрика днів тижня — компактна, тільки Пн і Пт */}
          <div className="flex flex-col gap-1 mr-1">
            {['Пн', '', 'Ср', '', 'Пт', '', ''].map((d, i) => (
              <div key={i} className="h-4 text-[9px] text-slate-400">
                {d}
              </div>
            ))}
          </div>
          <div className="flex gap-1">
            {weeks.map((week, wi) => {
              const label = monthLabels.find((m) => m.idx === wi)?.label;
              return (
                <div key={wi} className="flex flex-col gap-1">
                  <div className="h-3 text-[9px] text-slate-400 -mb-0.5">{label ?? ''}</div>
                  {week.map((d) => {
                    const a = profile.activity[d];
                    const att = a?.attempts ?? 0;
                    const isSel = selected === d;
                    return (
                      <button
                        key={d}
                        onClick={() => setSelected(d)}
                        className={`w-4 h-4 rounded-sm ${intensityClass(att)} ${isSel ? 'ring-2 ring-rose-400' : ''}`}
                        title={`${d}: ${att} задач`}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Легенда */}
        <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-500">
          <span>менше</span>
          {['bg-slate-100', 'bg-brand-100', 'bg-brand-400', 'bg-brand-600', 'bg-brand-800'].map((c) => (
            <span key={c} className={`w-3 h-3 rounded-sm ${c}`} />
          ))}
          <span>більше</span>
        </div>
      </Card>

      {selected && (
        <Card>
          <div className="font-extrabold mb-2">
            {selected}{' '}
            <span className="text-xs text-slate-500 font-normal">
              ({shortDayName(selected)})
            </span>
          </div>
          {selectedActivity ? (
            <div className="grid grid-cols-4 gap-2 text-center">
              <Stat value={selectedActivity.attempts} label="задач" />
              <Stat value={selectedActivity.correct} label="вірних" />
              <Stat value={selectedActivity.stars} label="зірок" />
              <Stat value={Math.round(selectedActivity.timeSec / 60)} label="хв" />
            </div>
          ) : (
            <div className="text-sm text-slate-500">У цей день тренувань не було</div>
          )}
        </Card>
      )}
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-slate-50 rounded-xl p-2">
      <div className="text-lg font-extrabold">{value}</div>
      <div className="text-[10px] text-slate-500">{label}</div>
    </div>
  );
}

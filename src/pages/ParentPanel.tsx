import { useNavigate } from 'react-router-dom';
import { ChevronLeft, LogOut } from 'lucide-react';
import { useProfileStore } from '@/store/profile';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { achievements } from '@/features/achievements/registry';
import { lastNDays } from '@/lib/dates';

const TOPIC_NAMES: Record<string, string> = {
  oral: 'Усний рахунок',
  column: 'Стовпчиком',
  order: 'Порядок дій',
  fractions: 'Дроби',
  decimals: 'Десяткові',
  word: 'Текстові',
  units: 'Одиниці',
  geometry: 'Геометрія',
  logic: 'Логіка',
  equations: 'Рівняння',
};

export function ParentPanel() {
  const navigate = useNavigate();
  const profile = useProfileStore((s) => s.profile)!;
  const updateDailyGoal = useProfileStore((s) => s.updateDailyGoal);

  const logout = () => {
    sessionStorage.removeItem('parent-authed');
    navigate('/');
  };

  // Зведення за 7 днів
  const week = lastNDays(7);
  const weekData = week.map((d) => profile.activity[d]);
  const weekAttempts = weekData.reduce((s, a) => s + (a?.attempts ?? 0), 0);
  const weekCorrect = weekData.reduce((s, a) => s + (a?.correct ?? 0), 0);
  const weekTime = weekData.reduce((s, a) => s + (a?.timeSec ?? 0), 0);
  const weekAcc = weekAttempts > 0 ? Math.round((weekCorrect / weekAttempts) * 100) : 0;

  const totalAttempts = Object.values(profile.topics).reduce((s, t) => s + t.totalAttempts, 0);
  const totalCorrect = Object.values(profile.topics).reduce((s, t) => s + t.correct, 0);
  const totalAcc = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  // Слабкі теми (відсортовані за точністю, мінімум 5 задач)
  const weak = Object.values(profile.topics)
    .filter((t) => t.totalAttempts >= 5)
    .map((t) => ({ ...t, acc: Math.round((t.correct / t.totalAttempts) * 100) }))
    .sort((a, b) => a.acc - b.acc)
    .slice(0, 3);

  const exportData = () => {
    const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mathquest-${profile.name}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container-app">
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/')}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100"
            aria-label="Назад"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-extrabold ml-2">Батьки</h1>
        </div>
        <button
          onClick={logout}
          className="p-2 -mr-2 rounded-full hover:bg-slate-100"
          aria-label="Вийти"
          title="Вийти"
        >
          <LogOut size={20} />
        </button>
      </header>

      <Card className="mb-4">
        <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">За 7 днів</div>
        <div className="grid grid-cols-4 gap-2 text-center">
          <BigStat value={weekAttempts} label="задач" />
          <BigStat value={`${weekAcc}%`} label="точність" />
          <BigStat value={Math.round(weekTime / 60)} label="хв" />
          <BigStat value={profile.streak} label="стрик" />
        </div>
      </Card>

      <Card className="mb-4">
        <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">Загалом</div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <BigStat value={totalAttempts} label="задач" />
          <BigStat value={`${totalAcc}%`} label="точність" />
          <BigStat value={profile.level} label="рівень" />
        </div>
        <div className="text-xs text-slate-500 mt-2 text-center">
          XP: {profile.xp} · Ачивок: {profile.achievements.length} / {achievements.length}
        </div>
      </Card>

      <h2 className="text-xs uppercase tracking-wider text-slate-500 mb-2">По темах</h2>
      <div className="space-y-1.5 mb-4">
        {Object.values(profile.topics).map((t) => {
          const acc = t.totalAttempts > 0 ? Math.round((t.correct / t.totalAttempts) * 100) : 0;
          return (
            <Card key={t.topicId} className="!p-2.5">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold">{TOPIC_NAMES[t.topicId]}</div>
                <div className="text-xs text-slate-500">
                  Р.{t.currentDifficulty} · {t.totalAttempts} · {acc}%
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {weak.length > 0 && (
        <Card className="mb-4 bg-amber-50 border-amber-200">
          <div className="font-bold text-amber-900 mb-2">Слабкі теми</div>
          <div className="space-y-1 text-sm">
            {weak.map((t) => (
              <div key={t.topicId} className="flex justify-between">
                <span>{TOPIC_NAMES[t.topicId]}</span>
                <span className="font-bold text-amber-700">{t.acc}%</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <h2 className="text-xs uppercase tracking-wider text-slate-500 mb-2">
        Журнал помилок ({profile.errorQueue.length})
      </h2>
      {profile.errorQueue.length === 0 ? (
        <Card className="mb-4 text-sm text-slate-500">Помилок у черзі немає 🎉</Card>
      ) : (
        <div className="space-y-1.5 mb-4">
          {profile.errorQueue.slice(0, 10).map((e) => (
            <Card key={e.id} className="!p-2.5">
              <div className="text-xs text-slate-500">{TOPIC_NAMES[e.topicId]} · {e.subtopic}</div>
              <div className="text-sm font-bold truncate">{e.question}</div>
              <div className="text-xs text-slate-500 mt-0.5">
                Прогрес: {e.successStreak}/5 · наступне: {e.nextReviewDate}
              </div>
            </Card>
          ))}
        </div>
      )}

      <h2 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Налаштування</h2>
      <Card className="mb-3">
        <div className="font-bold mb-2">Щоденна ціль (задач)</div>
        <div className="grid grid-cols-4 gap-2">
          {[10, 20, 30, 50].map((n) => (
            <button
              key={n}
              onClick={() => updateDailyGoal({ type: 'tasks', value: n })}
              className={`h-12 rounded-2xl font-extrabold border-2 transition ${
                profile.dailyGoal.value === n
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-slate-200'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </Card>

      <Card className="mb-3">
        <div className="font-bold mb-1">Експорт прогресу</div>
        <div className="text-xs text-slate-500 mb-3">
          Завантажить JSON-файл із усією статистикою
        </div>
        <Button variant="secondary" onClick={exportData}>
          Завантажити JSON
        </Button>
      </Card>
    </div>
  );
}

function BigStat({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-2">
      <div className="text-xl font-extrabold">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

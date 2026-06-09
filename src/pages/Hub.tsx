import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Coins,
  Flame,
  Map as MapIcon,
  Repeat,
  Settings as SettingsIcon,
  Star,
  Target,
  UserRound,
} from 'lucide-react';
import { useProfileStore } from '@/store/profile';
import { useSessionStore } from '@/store/session';
import { getThemePack } from '@/features/themes/registry';
import { generateSession } from '@/features/tasks/registry';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { todayKey } from '@/lib/dates';

export function Hub() {
  const profile = useProfileStore((s) => s.profile)!;
  const dueErrors = useProfileStore((s) => s.dueErrors);
  const startSession = useSessionStore((s) => s.startSession);
  const theme = getThemePack(profile.theme);
  const navigate = useNavigate();

  const today = todayKey();
  const todayAct = profile.activity[today];
  const goal = profile.dailyGoal.value;
  const done = todayAct?.attempts ?? 0;
  const goalPct = Math.min(100, Math.round((done / Math.max(1, goal)) * 100));
  const goalReached = done >= goal;

  const dueCount = dueErrors().length;

  // Швидкий старт: бере «найслабшу» тему за точністю.
  const quickStart = () => {
    const topics = Object.values(profile.topics);
    const withAttempts = topics.filter((t) => t.totalAttempts > 0);
    let target = withAttempts.length
      ? withAttempts
          .map((t) => ({ ...t, acc: t.correct / t.totalAttempts }))
          .sort((a, b) => a.acc - b.acc)[0]
      : topics[0];
    const tasks = generateSession(target.topicId, target.currentDifficulty, 10);
    startSession(target.topicId, tasks);
    navigate('/task');
  };

  return (
    <div className="container-app">
      <header className="flex items-center justify-between mb-5">
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3 -ml-1"
        >
          <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-2xl">
            {theme.emoji}
          </div>
          <div className="text-left">
            <div className="font-extrabold">{profile.name}</div>
            <div className="text-xs text-slate-500">
              Рівень {profile.level} · {profile.xp} xp
            </div>
          </div>
        </button>
        <button
          onClick={() => navigate('/settings')}
          className="p-2 rounded-full hover:bg-slate-100"
          aria-label="Налаштування"
        >
          <SettingsIcon size={22} />
        </button>
      </header>

      <Card className="mb-3">
        <div className="flex justify-around text-center">
          <Stat
            icon={<Flame className="text-orange-500" size={22} />}
            label="Стрик"
            value={profile.streak}
          />
          <Stat
            icon={<Star className="text-amber-400 fill-amber-400" size={22} />}
            label="Зірки"
            value={profile.stars}
          />
          <Stat
            icon={<Coins className="text-yellow-500" size={22} />}
            label={theme.currency}
            value={profile.coins}
          />
        </div>
      </Card>

      {/* Прогрес дня */}
      <Card className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-brand-600" />
            <span className="font-bold text-sm">Сьогодні</span>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {done} / {goal} задач
          </span>
        </div>
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${goalReached ? 'bg-emerald-500' : 'bg-gradient-to-r from-brand-500 to-brand-700'} transition-all`}
            style={{ width: `${goalPct}%` }}
          />
        </div>
        {goalReached && (
          <div className="text-xs text-emerald-700 font-bold mt-2">🎯 Денну ціль виконано!</div>
        )}
      </Card>

      <div className="space-y-3">
        <Card className="bg-brand-600 text-white border-brand-700">
          <h3 className="text-xl font-extrabold mb-1">⚡ Швидкий старт</h3>
          <p className="text-sm opacity-90 mb-3">
            10 задач зі слабкої теми. Найшвидший спосіб потренуватися.
          </p>
          <Button variant="secondary" onClick={quickStart}>
            Поїхали →
          </Button>
        </Card>

        {dueCount > 0 && (
          <Card className="bg-rose-500 text-white border-rose-600">
            <div className="flex items-start gap-3 mb-3">
              <Repeat size={24} className="shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xl font-extrabold">Робота над помилками</h3>
                <p className="text-sm opacity-90">
                  Готові до повторення: <b>{dueCount}</b>
                </p>
              </div>
            </div>
            <Button variant="secondary" onClick={() => navigate('/errors')}>
              Повторити →
            </Button>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-3">
          <NavCard
            onClick={() => navigate('/practice')}
            emoji="📚"
            title="Вільне тренування"
            subtitle="10 тем"
          />
          <NavCard
            onClick={() => navigate('/map')}
            emoji="🗺️"
            title="Карта"
            subtitle={theme.name}
            icon={<MapIcon size={18} />}
          />
          <NavCard
            onClick={() => navigate('/exams')}
            emoji="📝"
            title="Контрольні"
            subtitle="Як у школі"
          />
          <NavCard
            onClick={() => navigate('/errors')}
            emoji="🔁"
            title="Помилки"
            subtitle={
              profile.errorQueue.length > 0
                ? `Черга: ${profile.errorQueue.length}`
                : 'Порожньо'
            }
          />
          <NavCard
            onClick={() => navigate('/calendar')}
            emoji="📅"
            title="Календар"
            subtitle="Активність"
            icon={<CalendarDays size={18} />}
          />
          <NavCard
            onClick={() => navigate('/profile')}
            emoji="🏆"
            title="Профіль"
            subtitle={`Ачивок: ${profile.achievements.length}`}
            icon={<UserRound size={18} />}
          />
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="flex flex-col items-center">
      {icon}
      <div className="text-lg font-extrabold mt-1">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

function NavCard({
  emoji,
  title,
  subtitle,
  onClick,
  icon,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  onClick: () => void;
  icon?: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="text-left bg-white rounded-3xl p-4 border border-slate-100 shadow-sm active:scale-95 transition"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{emoji}</span>
        {icon && <span className="text-slate-400">{icon}</span>}
      </div>
      <div className="font-extrabold">{title}</div>
      <div className="text-xs text-slate-500 mt-0.5">{subtitle}</div>
    </button>
  );
}

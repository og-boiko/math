import type { ReactNode } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  CalendarDays,
  Coins,
  Flame,
  Map as MapIcon,
  Repeat,
  Settings as SettingsIcon,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  UserRound,
  X,
} from 'lucide-react';
import { useProfileStore } from '@/store/profile';
import { useSessionStore } from '@/store/session';
import { getThemePack } from '@/features/themes/registry';
import { generateSession } from '@/features/tasks/registry';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { todayKey } from '@/lib/dates';

type StatKey = 'streak' | 'stars' | 'coins' | 'xp' | 'achievements';

export function Hub() {
  const profile = useProfileStore((s) => s.profile)!;
  const dueErrors = useProfileStore((s) => s.dueErrors);
  const startSession = useSessionStore((s) => s.startSession);
  const theme = getThemePack(profile.theme);
  const navigate = useNavigate();
  const [info, setInfo] = useState<StatKey | null>(null);

  const today = todayKey();
  const todayAct = profile.activity[today];
  const goal = profile.dailyGoal.value;
  const done = todayAct?.attempts ?? 0;
  const goalPct = Math.min(100, Math.round((done / Math.max(1, goal)) * 100));
  const goalReached = done >= goal;

  const dueCount = dueErrors().length;

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
        <div className="grid grid-cols-5 gap-1">
          <StatPill
            icon={<Flame className="text-orange-500" size={20} />}
            label="Стрик"
            value={profile.streak}
            onClick={() => setInfo('streak')}
          />
          <StatPill
            icon={<Star className="text-amber-400 fill-amber-400" size={20} />}
            label="Зірки"
            value={profile.stars}
            onClick={() => setInfo('stars')}
          />
          <StatPill
            icon={<Coins className="text-yellow-500" size={20} />}
            label={theme.currency}
            value={profile.coins}
            onClick={() => setInfo('coins')}
          />
          <StatPill
            icon={<TrendingUp className="text-brand-600" size={20} />}
            label="XP"
            value={profile.xp}
            onClick={() => setInfo('xp')}
          />
          <StatPill
            icon={<Award className="text-emerald-600" size={20} />}
            label="Ачивки"
            value={profile.achievements.length}
            onClick={() => setInfo('achievements')}
          />
        </div>
        <p className="text-[11px] text-center text-slate-400 mt-2">
          💡 Тапни будь-яку, щоб дізнатися як отримати більше
        </p>
      </Card>

      <Card className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-brand-600" />
            <span className="font-bold text-sm">Сьогодні </span>
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
            Задачі по темам. Найшвидший спосіб потренуватися.
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
            emoji="��"
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
          <NavCard
            onClick={() => navigate('/leaderboard')}
            emoji="👑"
            title="Лідерборд"
            subtitle="Світовий рейтинг"
          />
        </div>
      </div>

      {info && (
        <InfoModal
          stat={info}
          theme={{ currency: theme.currency, emoji: theme.emoji }}
          onClose={() => setInfo(null)}
        />
      )}
    </div>
  );
}

function StatPill({
  icon,
  label,
  value,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center py-1.5 rounded-2xl active:bg-slate-100 transition"
    >
      {icon}
      <div className="text-base font-extrabold mt-1 leading-none">{value}</div>
      <div className="text-[10px] text-slate-500 mt-0.5 truncate max-w-full">{label}</div>
    </button>
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

interface ThemeMeta {
  currency: string;
  emoji: string;
}

const STATS_INFO: Record<
  StatKey,
  (t: ThemeMeta) => {
    icon: ReactNode;
    title: string;
    color: string;
    desc: string;
    rules: string[];
  }
> = {
  streak: () => ({
    icon: <Flame className="text-orange-500" size={28} />,
    title: 'Стрик',
    color: 'bg-orange-50 border-orange-200',
    desc: 'Скільки днів поспіль ти заходив і виконував денну ціль.',
    rules: [
      '+1 день, якщо сьогодні виконав денну ціль.',
      'Не виконав — стрик скидається на 0.',
      'Найдовший стрик зберігається назавжди.',
      'Ачивки: 3, 7, 14, 30 днів.',
    ],
  }),
  stars: () => ({
    icon: <Star className="text-amber-400 fill-amber-400" size={28} />,
    title: 'Зірки',
    color: 'bg-amber-50 border-amber-200',
    desc: 'Якість відповідей. Чим менше підказок — тим більше зірок.',
    rules: [
      '⭐⭐⭐ — правильно з першої спроби, без підказок.',
      '⭐⭐ — правильно з 1 підказкою.',
      '⭐ — правильно з 2 підказками або з 2-ї спроби.',
      '0 — відкрив відповідь або > 2 спроб.',
    ],
  }),
  coins: (t) => ({
    icon: <Coins className="text-yellow-500" size={28} />,
    title: t.currency,
    color: 'bg-yellow-50 border-yellow-200',
    desc: `Внутрішня валюта сетингу ${t.emoji}.`,
    rules: [
      '+1 за кожну правильну відповідь.',
      '+5 за завершену сесію.',
      '+5 бонус за кожну нову ачивку.',
      'Скоро: щит для стрику (50), аксесуари аватара.',
    ],
  }),
  xp: () => ({
    icon: <TrendingUp className="text-brand-600" size={28} />,
    title: 'XP',
    color: 'bg-brand-50 border-brand-200',
    desc: 'Очки досвіду. Визначають рівень і місце в лідерборді.',
    rules: [
      '+10 XP за кожну зароблену зірку.',
      'Рівень = √(XP / 100) + 1.',
      'Рівень 2 — 100 XP, 3 — 400, 4 — 900, 5 — 1600…',
      'Лідерборд "Сезон" — саме за загальним XP.',
    ],
  }),
  achievements: () => ({
    icon: <Award className="text-emerald-600" size={28} />,
    title: 'Ачивки',
    color: 'bg-emerald-50 border-emerald-200',
    desc: 'Особливі досягнення. Кожна — +5 монет і запис у профілі.',
    rules: [
      '🏁 Перші 10 / 100 / 500 задач.',
      '🔥 Стрик 3 / 7 / 14 / 30 днів.',
      '⚡ Перфектна сесія (10/10 без помилок).',
      '🚀 Швидкі сесії (10 задач за 5 хв).',
      '🧠 Майстер теми (50+ задач, 90%+ точності).',
      '✅ Випускник (всі 10 тем розблоковано).',
    ],
  }),
};

function InfoModal({
  stat,
  theme,
  onClose,
}: {
  stat: StatKey;
  theme: ThemeMeta;
  onClose: () => void;
}) {
  const m = STATS_INFO[stat](theme);
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-900/40 flex items-end sm:items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md rounded-3xl border-2 p-5 shadow-xl ${m.color}`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
              {m.icon}
            </div>
            <h3 className="text-2xl font-extrabold">{m.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/60"
            aria-label="Закрити"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-sm text-slate-700 mb-3 leading-relaxed">{m.desc}</p>
        <div className="bg-white rounded-2xl p-3">
          <div className="flex items-center gap-1 text-xs font-extrabold text-slate-600 mb-2">
            <Sparkles size={12} className="text-brand-500" />
            ЯК ОТРИМАТИ
          </div>
          <ul className="text-sm text-slate-700 space-y-1.5">
            {m.rules.map((r, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-brand-500">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full h-11 rounded-2xl bg-slate-900 text-white font-extrabold"
        >
          Зрозуміло
        </button>
      </div>
    </div>
  );
}

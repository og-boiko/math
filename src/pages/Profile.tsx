import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Coins, Flame, Star, Trophy } from 'lucide-react';
import { useProfileStore } from '@/store/profile';
import { getThemePack } from '@/features/themes/registry';
import { achievements } from '@/features/achievements/registry';
import { Card } from '@/components/ui/Card';

const TOPIC_NAMES: Record<string, { emoji: string; name: string }> = {
  oral: { emoji: '⚡', name: 'Усний рахунок' },
  column: { emoji: '🧮', name: 'Стовпчиком' },
  order: { emoji: '🔢', name: 'Порядок дій' },
  fractions: { emoji: '🍕', name: 'Дроби' },
  decimals: { emoji: '🔟', name: 'Десяткові' },
  word: { emoji: '📖', name: 'Текстові' },
  units: { emoji: '📏', name: 'Одиниці' },
  geometry: { emoji: '📐', name: 'Геометрія' },
  logic: { emoji: '🧩', name: 'Логіка' },
  equations: { emoji: '🟰', name: 'Рівняння' },
};

export function Profile() {
  const navigate = useNavigate();
  const profile = useProfileStore((s) => s.profile)!;
  const theme = getThemePack(profile.theme);
  const earnedSet = new Set(profile.achievements);

  const xpForCurrent = (profile.level - 1) ** 2 * 100;
  const xpForNext = profile.level ** 2 * 100;
  const xpProgress = profile.xp - xpForCurrent;
  const xpNeeded = xpForNext - xpForCurrent;
  const xpPct = Math.min(100, Math.round((xpProgress / xpNeeded) * 100));

  const totalAttempts = Object.values(profile.topics).reduce((s, t) => s + t.totalAttempts, 0);
  const totalCorrect = Object.values(profile.topics).reduce((s, t) => s + t.correct, 0);
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

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
        <h1 className="text-xl font-extrabold ml-2">Профіль</h1>
      </header>

      <Card className={`mb-4 ${theme.cardClass}`}>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-5xl">
            {theme.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-2xl font-extrabold truncate">{profile.name}</div>
            <div className="text-sm opacity-90">{theme.hero}</div>
            <div className="text-xs opacity-80 mt-0.5">
              {totalAttempts} задач · {accuracy}% точність
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs font-bold mb-1">
            <span>Рівень {profile.level}</span>
            <span>
              {xpProgress} / {xpNeeded} xp
            </span>
          </div>
          <div className="w-full h-2 bg-white/25 rounded-full overflow-hidden">
            <div className="h-full bg-white" style={{ width: `${xpPct}%` }} />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-4 gap-2 mb-4">
        <Stat icon={<Flame className="text-orange-500" size={18} />} value={profile.streak} label="Стрик" />
        <Stat
          icon={<Trophy className="text-amber-500" size={18} />}
          value={profile.longestStreak}
          label="Рекорд"
        />
        <Stat
          icon={<Star className="fill-amber-400 text-amber-400" size={18} />}
          value={profile.stars}
          label="Зірок"
        />
        <Stat icon={<Coins className="text-yellow-500" size={18} />} value={profile.coins} label={theme.currency} />
      </div>

      <h2 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Прогрес по темах</h2>
      <div className="space-y-2 mb-4">
        {Object.values(profile.topics).map((t) => {
          const info = TOPIC_NAMES[t.topicId];
          const acc = t.totalAttempts > 0 ? Math.round((t.correct / t.totalAttempts) * 100) : 0;
          return (
            <Card key={t.topicId} className="!p-3">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{info?.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm">{info?.name}</div>
                  <div className="text-xs text-slate-500">
                    Рівень {t.currentDifficulty} · {t.totalAttempts} задач
                    {t.totalAttempts > 0 ? ` · ${acc}%` : ''}
                  </div>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div
                      key={n}
                      className={`w-2 h-6 mx-0.5 rounded-sm ${n <= t.currentDifficulty ? 'bg-brand-500' : 'bg-slate-200'}`}
                    />
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <h2 className="text-xs uppercase tracking-wider text-slate-500 mb-2">
        Ачивки ({profile.achievements.length} / {achievements.length})
      </h2>
      <div className="grid grid-cols-3 gap-2">
        {achievements.map((a) => {
          const earned = earnedSet.has(a.id);
          return (
            <div
              key={a.id}
              className={`rounded-2xl p-3 text-center border-2 transition ${
                earned ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200 opacity-50'
              }`}
              title={a.description}
            >
              <div className="text-3xl mb-1">{earned ? a.emoji : '🔒'}</div>
              <div className="text-[11px] font-bold leading-tight">{a.title}</div>
              <div className="text-[10px] text-slate-500 leading-tight mt-0.5">
                {a.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-2 border border-slate-100 text-center">
      <div className="flex justify-center">{icon}</div>
      <div className="text-base font-extrabold leading-tight mt-0.5">{value}</div>
      <div className="text-[10px] text-slate-500">{label}</div>
    </div>
  );
}

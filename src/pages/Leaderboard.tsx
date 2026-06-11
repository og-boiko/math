import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Flame, Sparkles, Trophy } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cloudEnabled } from '@/cloud/supabase';
import {
  fetchOwnRank,
  fetchTop,
  type LeaderboardKind,
  type LeaderboardRow,
} from '@/cloud/api/leaderboard';
import { fetchMySnapshot } from '@/cloud/api/me';

const TABS: { kind: LeaderboardKind; label: string; icon: React.ReactNode; hint: string }[] = [
  {
    kind: 'weekly_xp',
    label: 'Приріст тижня',
    icon: <Sparkles size={18} />,
    hint: 'XP, які ти заробив за останні 7 днів',
  },
  {
    kind: 'streak',
    label: 'Streak',
    icon: <Flame size={18} className="text-orange-500" />,
    hint: 'Найдовший streak усього часу',
  },
  {
    kind: 'season_xp',
    label: 'Сезон',
    icon: <Trophy size={18} className="text-amber-500" />,
    hint: 'XP за поточний сезон (4 тижні)',
  },
];

export function Leaderboard() {
  const [tab, setTab] = useState<LeaderboardKind>('weekly_xp');
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [own, setOwn] = useState<{ rank: number; row: LeaderboardRow } | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const snap = await fetchMySnapshot();
      setProfileId(snap?.child.id ?? null);
    })();
  }, []);

  useEffect(() => {
    setLoading(true);
    (async () => {
      const top = await fetchTop(tab, 100);
      setRows(top);
      if (profileId) setOwn(await fetchOwnRank(tab, profileId));
      setLoading(false);
    })();
  }, [tab, profileId]);

  if (!cloudEnabled) {
    return (
      <div className="container-app">
        <Card>
          <h2 className="text-xl font-extrabold mb-2">🏆 Лідерборд недоступний</h2>
          <p className="text-sm text-slate-600 mb-3">
            Поки що сетинг не підключений до хмари. Прогрес і так зберігається локально.
          </p>
          <Button onClick={() => navigate(-1)}>Назад</Button>
        </Card>
      </div>
    );
  }

  const tabMeta = TABS.find((t) => t.kind === tab)!;

  return (
    <div className="container-app">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          <Crown className="text-amber-500" /> Лідерборд
        </h1>
      </header>

      <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t.kind}
            onClick={() => setTab(t.kind)}
            className={`flex items-center gap-1 px-3 h-9 rounded-full text-sm font-bold shrink-0 ${
              tab === t.kind
                ? 'bg-brand-600 text-white'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-500 mb-3">{tabMeta.hint}</p>

      {own && (
        <Card className="mb-3 bg-brand-50 border-brand-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-600">Твоє місце</div>
              <div className="text-2xl font-extrabold text-brand-700">#{own.rank}</div>
            </div>
            <div className="text-right">
              <div className="font-extrabold">{own.row.value}</div>
              <div className="text-xs text-slate-500">рівень {own.row.level}</div>
            </div>
          </div>
        </Card>
      )}

      <Card>
        {loading ? (
          <div className="text-center text-slate-500 py-6">Завантаження…</div>
        ) : rows.length === 0 ? (
          <div className="text-center text-slate-500 py-6">
            Поки що ніхто не в борді. Будь першим!
          </div>
        ) : (
          <ol className="divide-y divide-slate-100">
            {rows.map((r, i) => (
              <li
                key={r.profile_id}
                className={`flex items-center gap-3 py-2 ${
                  profileId === r.profile_id ? 'bg-brand-50 -mx-2 px-2 rounded-xl' : ''
                }`}
              >
                <span
                  className={`w-8 text-center text-sm font-extrabold ${
                    i < 3 ? 'text-amber-500' : 'text-slate-400'
                  }`}
                >
                  {i + 1}
                </span>
                <span className="text-lg">{themeEmoji(r.theme)}</span>
                <span className="flex-1 truncate font-bold">{r.display_name}</span>
                <span className="text-xs text-slate-500 mr-2">lvl {r.level}</span>
                <span className="font-extrabold text-brand-700">{r.value}</span>
              </li>
            ))}
          </ol>
        )}
      </Card>
    </div>
  );
}

function themeEmoji(theme: string): string {
  switch (theme) {
    case 'space':
      return '🚀';
    case 'dino':
      return '🦕';
    case 'world':
      return '🌍';
    case 'voxel':
      return '🟩';
    case 'blocky':
      return '🟪';
    default:
      return '⭐';
  }
}

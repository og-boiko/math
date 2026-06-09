import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Lock } from 'lucide-react';
import { useProfileStore, type TopicId } from '@/store/profile';
import { useSessionStore } from '@/store/session';
import { getThemePack } from '@/features/themes/registry';
import { generateSession, isTopicAvailable } from '@/features/tasks/registry';
import { Card } from '@/components/ui/Card';

interface MapNode {
  topicId: TopicId;
  /** Назва локації в темі (різна для кожного сетингу) */
  labels: Record<string, string>;
  /** Прев'ю-emoji */
  emojis: Record<string, string>;
  /** Залежність — попередня тема (для лінійного прогресу). */
  prereq?: TopicId;
}

const NODES: MapNode[] = [
  {
    topicId: 'oral',
    labels: {
      space: 'База на Землі',
      dino: 'Розкопки I',
      world: 'Київ',
      voxel: 'Спавн',
      blocky: 'Лобі',
    },
    emojis: { space: '🏠', dino: '⛏️', world: '🏠', voxel: '🟫', blocky: '🟦' },
  },
  {
    topicId: 'column',
    labels: {
      space: 'Місяць',
      dino: 'Юра',
      world: 'Львів',
      voxel: 'Печери',
      blocky: 'Обба 1',
    },
    emojis: { space: '🌕', dino: '🦕', world: '🏰', voxel: '🪨', blocky: '🟥' },
    prereq: 'oral',
  },
  {
    topicId: 'order',
    labels: {
      space: 'Марс',
      dino: 'Крейда',
      world: 'Стамбул',
      voxel: 'Адська брама',
      blocky: 'Обба 2',
    },
    emojis: { space: '🔴', dino: '🦖', world: '🕌', voxel: '🔥', blocky: '🟧' },
    prereq: 'column',
  },
  {
    topicId: 'units',
    labels: {
      space: 'Юпітер',
      dino: 'Тріас',
      world: 'Каїр',
      voxel: 'Пустеля',
      blocky: 'Обба 3',
    },
    emojis: { space: '🪐', dino: '🦎', world: '🐪', voxel: '🏜️', blocky: '🟨' },
    prereq: 'order',
  },
  {
    topicId: 'fractions',
    labels: {
      space: 'Сатурн',
      dino: 'Океан',
      world: 'Рим',
      voxel: 'Снігові гори',
      blocky: 'Обба 4',
    },
    emojis: { space: '🪐', dino: '🐟', world: '🏛️', voxel: '🏔️', blocky: '🟩' },
    prereq: 'units',
  },
  {
    topicId: 'decimals',
    labels: {
      space: 'Уран',
      dino: 'Болото',
      world: 'Париж',
      voxel: 'Болото',
      blocky: 'Обба 5',
    },
    emojis: { space: '🔵', dino: '🐊', world: '🗼', voxel: '🍄', blocky: '🟪' },
    prereq: 'fractions',
  },
  {
    topicId: 'word',
    labels: {
      space: 'Нептун',
      dino: 'Льодовиковий',
      world: 'Лондон',
      voxel: 'Хмари',
      blocky: 'Обба 6',
    },
    emojis: { space: '🌊', dino: '🦣', world: '☂️', voxel: '☁️', blocky: '🟫' },
    prereq: 'decimals',
  },
  {
    topicId: 'geometry',
    labels: {
      space: 'Плутон',
      dino: 'Гори',
      world: 'Нью-Йорк',
      voxel: 'Гори',
      blocky: 'Обба 7',
    },
    emojis: { space: '⚪', dino: '🌋', world: '🗽', voxel: '⛰️', blocky: '🟦' },
    prereq: 'word',
  },
  {
    topicId: 'logic',
    labels: {
      space: 'Пояс астероїдів',
      dino: 'Загадкова долина',
      world: 'Токіо',
      voxel: 'Енд-острів',
      blocky: 'Обба 8',
    },
    emojis: { space: '☄️', dino: '🦴', world: '🎌', voxel: '🌌', blocky: '🟧' },
    prereq: 'geometry',
  },
  {
    topicId: 'equations',
    labels: {
      space: 'Чорна діра',
      dino: 'Тиранозавр',
      world: 'Бермуди',
      voxel: 'Ендер-дракон',
      blocky: 'Бос-обба',
    },
    emojis: { space: '🕳️', dino: '🦖', world: '⚓', voxel: '🐉', blocky: '👹' },
    prereq: 'logic',
  },
];

export function WorldMap() {
  const navigate = useNavigate();
  const profile = useProfileStore((s) => s.profile)!;
  const theme = getThemePack(profile.theme);
  const startSession = useSessionStore((s) => s.startSession);

  const isUnlocked = (node: MapNode): boolean => {
    if (!node.prereq) return true;
    const prev = profile.topics[node.prereq];
    return prev.totalAttempts >= 5 || prev.correct >= 3;
  };

  const start = (topicId: TopicId) => {
    if (!isTopicAvailable(topicId)) return;
    const difficulty = profile.topics[topicId].currentDifficulty;
    const tasks = generateSession(topicId, difficulty, 10);
    startSession(topicId, tasks);
    navigate('/task');
  };

  return (
    <div className="container-app">
      <header className="flex items-center mb-3">
        <button
          onClick={() => navigate('/')}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100"
          aria-label="Назад"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-extrabold ml-2">Карта · {theme.name}</h1>
      </header>

      <Card className={`mb-4 ${theme.cardClass}`}>
        <div className="text-sm">
          Просувайся по локаціях: відкривай нові, перемагай боса в кінці. Бос — тема{' '}
          <b>«Рівняння»</b>.
        </div>
      </Card>

      <div className="space-y-2">
        {NODES.map((node, i) => {
          const unlocked = isUnlocked(node);
          const tp = profile.topics[node.topicId];
          const label = node.labels[theme.id] ?? theme.name;
          const emoji = node.emojis[theme.id] ?? '⭐';
          const accuracy = tp.totalAttempts > 0 ? Math.round((tp.correct / tp.totalAttempts) * 100) : 0;
          const isBoss = !node.prereq ? false : i === NODES.length - 1;
          return (
            <Card
              key={node.topicId}
              className={`!p-3 ${isBoss ? 'border-rose-300 bg-rose-50' : ''} ${
                !unlocked ? 'opacity-60' : ''
              }`}
            >
              <button
                onClick={() => unlocked && start(node.topicId)}
                disabled={!unlocked}
                className="flex items-center gap-3 w-full text-left"
              >
                <div className="text-3xl">{unlocked ? emoji : <Lock size={22} />}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-extrabold">
                    {i + 1}. {label} {isBoss && '👹'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {unlocked
                      ? `Рівень ${tp.currentDifficulty} · ${tp.totalAttempts} задач${tp.totalAttempts ? ` · ${accuracy}%` : ''}`
                      : `Спочатку: ${node.prereq ? profile.topics[node.prereq].topicId : ''}`}
                  </div>
                </div>
                <div className="text-xs font-bold text-brand-600">
                  {unlocked ? '→' : ''}
                </div>
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

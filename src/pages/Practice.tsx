import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useProfileStore, type TopicId } from '@/store/profile';
import { useSessionStore } from '@/store/session';
import { generateSession, isTopicAvailable } from '@/features/tasks/registry';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const TOPICS: { id: TopicId; emoji: string; name: string }[] = [
  { id: 'oral', emoji: '⚡', name: 'Усний рахунок' },
  { id: 'column', emoji: '🧮', name: 'Стовпчиком' },
  { id: 'order', emoji: '🔢', name: 'Порядок дій' },
  { id: 'fractions', emoji: '🍕', name: 'Звичайні дроби' },
  { id: 'decimals', emoji: '🔟', name: 'Десяткові дроби' },
  { id: 'word', emoji: '📖', name: 'Текстові задачі' },
  { id: 'units', emoji: '📏', name: 'Одиниці вимірювання' },
  { id: 'geometry', emoji: '📐', name: 'Геометрія' },
  { id: 'logic', emoji: '🧩', name: 'Логіка' },
  { id: 'equations', emoji: '🟰', name: 'Рівняння' },
];

export function Practice() {
  const profile = useProfileStore((s) => s.profile)!;
  const startSession = useSessionStore((s) => s.startSession);
  const navigate = useNavigate();

  const start = (topicId: TopicId) => {
    if (!isTopicAvailable(topicId)) return;
    const difficulty = profile.topics[topicId].currentDifficulty;
    const tasks = generateSession(topicId, difficulty, 10);
    startSession(topicId, tasks);
    navigate('/task');
  };

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
        <h1 className="text-xl font-extrabold ml-2">Обери тему</h1>
      </header>

      <div className="space-y-3">
        {TOPICS.map((t) => {
          const available = isTopicAvailable(t.id);
          const progress = profile.topics[t.id];
          const accuracy =
            progress.totalAttempts > 0
              ? Math.round((progress.correct / progress.totalAttempts) * 100)
              : null;
          return (
            <Card key={t.id} className={!available ? 'opacity-60' : ''}>
              <div className="flex items-center gap-4">
                <div className="text-4xl">{t.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-extrabold">{t.name}</div>
                  <div className="text-xs text-slate-500">
                    {available
                      ? `Рівень ${progress.currentDifficulty}` +
                        (accuracy !== null
                          ? ` · ${accuracy}% точність · ${progress.totalAttempts} задач`
                          : '')
                      : 'Скоро відкриється'}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={available ? 'primary' : 'ghost'}
                  disabled={!available}
                  onClick={() => start(t.id)}
                >
                  {available ? 'Старт' : '🔒'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

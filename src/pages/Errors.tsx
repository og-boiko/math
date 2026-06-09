import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Repeat, Sparkles } from 'lucide-react';
import { useProfileStore, type ErrorQueueItem } from '@/store/profile';
import { useSessionStore } from '@/store/session';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { dayDiff, todayKey } from '@/lib/dates';
import type { Task } from '@/features/tasks/types';

function itemToTask(item: ErrorQueueItem): Task {
  return {
    id: item.id,
    topicId: item.topicId,
    subtopic: item.subtopic,
    difficulty: item.difficulty,
    question: item.question,
    answerType: 'text',
    correctAnswer: item.correctAnswer,
    acceptedAnswers: item.acceptedAnswers,
    hints: item.hints,
    solution: item.solution,
    estimatedSec: 30,
  };
}

export function Errors() {
  const navigate = useNavigate();
  const profile = useProfileStore((s) => s.profile)!;
  const dueErrors = useProfileStore((s) => s.dueErrors);
  const startReview = useSessionStore((s) => s.startReview);

  const today = todayKey();
  const due = useMemo(() => dueErrors(), [dueErrors, profile.errorQueue]);
  const upcoming = profile.errorQueue.filter((e) => e.nextReviewDate > today);

  const start = (items: ErrorQueueItem[]) => {
    if (!items.length) return;
    const tasks = items.map(itemToTask);
    startReview(tasks, items.map((i) => i.id));
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
        <h1 className="text-xl font-extrabold ml-2">Робота над помилками</h1>
      </header>

      <Card className="mb-4 bg-sky-50 border-sky-200">
        <div className="flex items-start gap-3">
          <Sparkles size={22} className="text-sky-600 shrink-0 mt-0.5" />
          <div className="text-sm text-sky-900">
            <p className="font-bold mb-1">Як це працює</p>
            <p>
              Кожна помилка повертається через 1, 2, 4, 8 і 16 днів. Після 5 правильних поспіль —
              задача зникає з черги. Це найшвидший спосіб запам&apos;ятати назавжди.
            </p>
          </div>
        </div>
      </Card>

      {due.length === 0 && upcoming.length === 0 ? (
        <Card className="text-center py-8">
          <div className="text-5xl mb-3">🎉</div>
          <div className="font-extrabold text-lg mb-1">Помилок немає!</div>
          <div className="text-sm text-slate-500">Молодець. Тренуйся далі — і так тримай.</div>
          <Button className="mt-4" onClick={() => navigate('/practice')}>
            До тренувань
          </Button>
        </Card>
      ) : (
        <>
          {due.length > 0 ? (
            <Card className="mb-4 bg-rose-50 border-rose-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-extrabold text-rose-900">
                    Час повторити: {due.length}
                  </div>
                  <div className="text-xs text-rose-700">
                    Сьогодні готові до повторення
                  </div>
                </div>
                <div className="text-3xl">🔁</div>
              </div>
              <Button fullWidth onClick={() => start(due.slice(0, 10))}>
                <Repeat size={18} className="mr-1" />
                Повторити {Math.min(10, due.length)}
              </Button>
            </Card>
          ) : (
            <Card className="mb-4 bg-emerald-50 border-emerald-200">
              <div className="font-extrabold text-emerald-900 mb-1">
                Усе вже повторено сьогодні 👌
              </div>
              <div className="text-xs text-emerald-700">
                Наступне повторення — за розкладом нижче.
              </div>
            </Card>
          )}

          <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">
            Черга ({profile.errorQueue.length})
          </div>
          <div className="space-y-2">
            {profile.errorQueue.map((e) => {
              const days = dayDiff(today, e.nextReviewDate);
              return (
                <Card key={e.id} className="!p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-slate-500">{e.subtopic}</div>
                      <div className="text-sm font-bold truncate">{e.question}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div
                        className={
                          days <= 0
                            ? 'text-xs font-bold text-rose-600'
                            : 'text-xs font-bold text-slate-600'
                        }
                      >
                        {days <= 0 ? 'Сьогодні' : `Через ${days} дн.`}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {e.successStreak}/5 ✓
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

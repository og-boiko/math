import { useEffect, useMemo, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Lightbulb, Star, X } from 'lucide-react';
import { useSessionStore } from '@/store/session';
import { useProfileStore } from '@/store/profile';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Confetti } from '@/components/Confetti';
import { playSound } from '@/lib/sounds';

function gradeFromAccuracy(pct: number): { grade: number; label: string; color: string } {
  if (pct >= 95) return { grade: 12, label: 'Відмінно!', color: 'text-emerald-600' };
  if (pct >= 88) return { grade: 11, label: 'Чудово!', color: 'text-emerald-600' };
  if (pct >= 80) return { grade: 10, label: 'Дуже добре', color: 'text-emerald-600' };
  if (pct >= 72) return { grade: 9, label: 'Добре', color: 'text-sky-600' };
  if (pct >= 64) return { grade: 8, label: 'Добре', color: 'text-sky-600' };
  if (pct >= 56) return { grade: 7, label: 'Достатньо', color: 'text-amber-600' };
  if (pct >= 48) return { grade: 6, label: 'Достатньо', color: 'text-amber-600' };
  if (pct >= 40) return { grade: 5, label: 'Задовільно', color: 'text-amber-600' };
  if (pct >= 32) return { grade: 4, label: 'Початковий рівень', color: 'text-rose-600' };
  if (pct >= 24) return { grade: 3, label: 'Початковий рівень', color: 'text-rose-600' };
  if (pct >= 16) return { grade: 2, label: 'Початковий рівень', color: 'text-rose-600' };
  return { grade: 1, label: 'Потрібно більше тренувань', color: 'text-rose-600' };
}

export function Results() {
  const navigate = useNavigate();
  const { records, reset, mode, examTitle } = useSessionStore();
  const profile = useProfileStore((s) => s.profile);
  const finishSession = useProfileStore((s) => s.finishSession);
  const recordExamGrade = useProfileStore((s) => s.recordExamGrade);
  const isExam = mode === 'exam';
  const isReview = mode === 'review';

  const total = records.length;
  const correct = records.filter((r) => r.isCorrect).length;
  const stars = records.reduce((sum, r) => sum + r.stars, 0);
  const totalTimeSec = records.reduce((sum, r) => sum + r.timeSec, 0);
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const grade = useMemo(() => gradeFromAccuracy(accuracy), [accuracy]);
  const isPerfect = total > 0 && correct === total;

  // Запис фінальних метрик сесії в профіль — один раз
  useEffect(() => {
    if (total === 0) {
      navigate('/');
      return;
    }
    if (isExam) {
      recordExamGrade(grade.grade);
    } else if (!isReview) {
      finishSession({ total, correct, totalTimeSec });
    }
    playSound(isPerfect ? 'levelup' : 'finish');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (total === 0) return null;

  if (isExam) {
    return (
      <div className="container-app min-h-screen flex flex-col justify-center">
        {grade.grade >= 10 && <Confetti />}
        <Card className="text-center">
          <div className="text-5xl mb-1">📝</div>
          <h1 className="text-xl font-extrabold mb-1">{examTitle}</h1>
          <p className="text-sm text-slate-500 mb-5">завершено</p>

          <div className="mb-5">
            <div className={`text-7xl font-black ${grade.color} animate-pop-in`}>
              {grade.grade}
            </div>
            <div className={`text-lg font-extrabold ${grade.color}`}>{grade.label}</div>
            <div className="text-sm text-slate-500 mt-1">
              {correct} з {total} правильно · {accuracy}%
            </div>
          </div>

          <div className="text-left space-y-1.5 mb-5">
            {records.map((r, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-500 w-6">№{i + 1}</span>
                  {r.isCorrect ? (
                    <Check size={18} className="text-emerald-500" />
                  ) : (
                    <X size={18} className="text-rose-500" />
                  )}
                </div>
                <span className="text-xs text-slate-500">{r.timeSec}с</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Button
              fullWidth
              size="lg"
              onClick={() => {
                reset();
                navigate('/exams');
              }}
            >
              Інша контрольна
            </Button>
            <Button
              fullWidth
              variant="ghost"
              onClick={() => {
                reset();
                navigate('/');
              }}
            >
              На головну
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const message =
    accuracy === 100
      ? 'Ідеальна сесія! 🏆'
      : accuracy >= 80
        ? 'Молодець!'
        : accuracy >= 60
          ? 'Непогано! Потренуйся ще'
          : 'Це було складно — наступного разу буде краще!';

  return (
    <div className="container-app min-h-screen flex flex-col justify-center">
      {isPerfect && <Confetti />}
      <Card className="text-center">
        <div className="text-6xl mb-2 animate-pop-in">🎉</div>
        <h1 className="text-2xl font-extrabold mb-1">{message}</h1>
        <p className="text-slate-600 mb-1">
          {isReview ? 'Повторення завершено' : 'Сесію завершено'}
        </p>
        {profile && (
          <p className="text-xs text-slate-400 mb-4">
            Рівень {profile.level} · {profile.xp} xp · 🔥 {profile.streak}
          </p>
        )}

        <div className="grid grid-cols-3 gap-2 mb-5">
          <Stat
            icon={<Star className="fill-amber-400 text-amber-400" />}
            value={stars}
            label="Зірок"
          />
          <Stat
            icon={<Check className="text-emerald-500" />}
            value={`${correct}/${total}`}
            label="Правильно"
          />
          <Stat icon={<span className="text-2xl">🎯</span>} value={`${accuracy}%`} label="Точність" />
        </div>

        <div className="text-left space-y-1.5 mb-5 max-h-56 overflow-auto pr-1">
          {records.map((r, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2 text-sm"
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-400 w-6">#{i + 1}</span>
                {r.isCorrect ? (
                  <Check size={16} className="text-emerald-500" />
                ) : (
                  <X size={16} className="text-rose-500" />
                )}
                {r.hintLevel > 0 && <Lightbulb size={14} className="text-amber-500" />}
                <span className="text-slate-500 text-xs">{r.timeSec}с</span>
              </div>
              <div className="flex">
                {[1, 2, 3].map((n) => (
                  <Star
                    key={n}
                    size={14}
                    className={n <= r.stars ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Button
            fullWidth
            size="lg"
            onClick={() => {
              reset();
              navigate(isReview ? '/errors' : '/practice');
            }}
          >
            {isReview ? 'До черги помилок' : 'Ще одна сесія'}
          </Button>
          <Button
            fullWidth
            variant="ghost"
            onClick={() => {
              reset();
              navigate('/');
            }}
          >
            На головну
          </Button>
        </div>
      </Card>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: ReactNode; value: ReactNode; label: string }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-3">
      <div className="flex justify-center mb-1">{icon}</div>
      <div className="text-xl font-extrabold">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

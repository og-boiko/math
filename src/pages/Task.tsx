import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { Check, X, Wrench } from 'lucide-react';
import { useProfileStore } from '@/store/profile';
import { useSessionStore, type Stars } from '@/store/session';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { HintPanel } from '@/components/HintPanel';
import { Workbench } from '@/components/workbench/Workbench';
import {
  clearTaskState,
  getTaskState,
  hasContent,
} from '@/components/workbench/workbenchStore';
import { checkAnswer } from '@/lib/format';
import { playSound, unlockAudio } from '@/lib/sounds';

type Status = 'idle' | 'wrong' | 'correct' | 'revealed';

export function TaskPage() {
  const navigate = useNavigate();
  const { tasks, index, recordAttempt, next, topicId, mode, examTitle, reviewIds } =
    useSessionStore();
  const awardForAnswer = useProfileStore((s) => s.awardForAnswer);
  const addError = useProfileStore((s) => s.addError);
  const reviewError = useProfileStore((s) => s.reviewError);
  const noteWorkbenchUse = useProfileStore((s) => s.noteWorkbenchUse);
  const workbenchEnabled =
    useProfileStore((s) => s.profile?.settings.workbenchEnabled) ?? true;
  const task = tasks[index];
  const isExam = mode === 'exam';
  const isReview = mode === 'review';

  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [hintLevel, setHintLevel] = useState(0);
  const [solutionShown, setSolutionShown] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [workbenchOpen, setWorkbenchOpen] = useState(false);
  const [workbenchTouched, setWorkbenchTouched] = useState(false);
  const startedAt = useRef<number>(Date.now());

  useEffect(() => {
    if (!tasks.length) {
      navigate('/');
    } else if (!topicId && mode === 'practice') {
      navigate('/practice');
    }
  }, [tasks.length, topicId, mode, navigate]);

  useEffect(() => {
    setAnswer('');
    setStatus('idle');
    setHintLevel(0);
    setSolutionShown(false);
    setAttempts(0);
    setWorkbenchOpen(false);
    setWorkbenchTouched(task ? hasContent(getTaskState(task.id)) : false);
    startedAt.current = Date.now();
  }, [index, task]);

  if (!task) return null;

  const computeStars = (): Stars => {
    if (status !== 'correct') return 0;
    if (attempts === 1 && hintLevel === 0) return 3;
    if (hintLevel <= 1 && attempts <= 2) return 2;
    return 1;
  };

  const submit = (overrideAnswer?: string) => {
    unlockAudio();
    const submitted = (overrideAnswer ?? answer).trim();
    if (!submitted) return;
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    const accepted = task.acceptedAnswers ?? [task.correctAnswer];
    const isCorrect = accepted.some((a) => checkAnswer(submitted, a));

    if (isCorrect) {
      setStatus('correct');
      playSound('correct');
    } else if (isExam) {
      setStatus('revealed');
      setSolutionShown(true);
      playSound('wrong');
    } else if (newAttempts >= 3) {
      setStatus('revealed');
      setHintLevel(task.hints.length);
      setSolutionShown(true);
      playSound('wrong');
    } else {
      setStatus('wrong');
      playSound('wrong');
    }
  };

  const proceed = () => {
    const timeSec = Math.round((Date.now() - startedAt.current) / 1000);
    const stars = computeStars();
    const isCorrect = status === 'correct';
    recordAttempt({
      taskId: task.id,
      isCorrect,
      stars,
      hintLevel,
      timeSec,
      attempts,
    });

    const used = hasContent(getTaskState(task.id));
    if (used) {
      noteWorkbenchUse(isCorrect);
    }

    if (isReview) {
      const reviewId = reviewIds?.[index];
      if (reviewId) reviewError(reviewId, isCorrect);
    } else if (topicId && !isExam) {
      awardForAnswer({ topicId, correct: isCorrect, stars, timeSec });
      if (!isCorrect) {
        addError({
          id: task.id,
          topicId,
          subtopic: task.subtopic,
          question: task.question,
          correctAnswer: task.correctAnswer,
          acceptedAnswers: task.acceptedAnswers,
          hints: task.hints,
          solution: task.solution,
          difficulty: task.difficulty,
        });
      }
    }

    clearTaskState(task.id);

    if (index + 1 >= tasks.length) {
      navigate('/results');
    } else {
      next();
    }
  };

  const useHint = () => {
    if (hintLevel < task.hints.length) setHintLevel((l) => l + 1);
  };

  const showSolution = () => {
    setHintLevel(task.hints.length);
    setSolutionShown(true);
    setStatus('revealed');
  };

  const inputDisabled = status === 'correct' || status === 'revealed';

  const headerLabel = isExam
    ? `📝 ${examTitle ?? 'Контрольна'}`
    : isReview
      ? '🔁 Робота над помилками'
      : `Задача ${index + 1} / ${tasks.length}`;

  return (
    <div className="container-app min-h-screen flex flex-col">
      <div className="mb-4">
        <div className="flex justify-between items-center text-sm text-slate-500 mb-2">
          <span>{headerLabel}</span>
          <span>
            {isExam || isReview
              ? `№${index + 1} / ${tasks.length}`
              : `Рівень ${task.difficulty}`}
          </span>
        </div>
        <ProgressBar value={index} max={tasks.length} />
      </div>

      <Card className="mb-4 flex-1">
        <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">{task.subtopic}</div>
        <div className="text-3xl font-extrabold text-center my-6 leading-snug">
          {task.question}
        </div>

        {task.answerType === 'choice' && task.options ? (
          <div className="grid grid-cols-3 gap-2 mb-3">
            {task.options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  if (inputDisabled) return;
                  setAnswer(opt);
                  submit(opt);
                }}
                disabled={inputDisabled}
                className={clsx(
                  'h-14 rounded-2xl border-2 text-2xl font-extrabold transition active:scale-95',
                  answer === opt && status === 'correct' && 'border-emerald-400 bg-emerald-50 text-emerald-700',
                  answer === opt && status === 'wrong' && 'border-rose-400 bg-rose-50',
                  (answer !== opt || status === 'idle') && 'border-slate-200 hover:border-brand-400',
                  inputDisabled && answer !== opt && 'opacity-50',
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <input
            type="text"
            inputMode={
              task.answerType === 'number'
                ? 'numeric'
                : task.answerType === 'decimal'
                  ? 'decimal'
                  : 'text'
            }
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={inputDisabled}
            placeholder="Твоя відповідь"
            className={clsx(
              'w-full h-14 px-4 rounded-2xl border-2 outline-none text-2xl text-center font-extrabold mb-3',
              status === 'wrong' && 'border-rose-400 bg-rose-50',
              status === 'correct' && 'border-emerald-400 bg-emerald-50 text-emerald-700',
              status === 'revealed' && 'border-slate-200 bg-slate-100',
              status === 'idle' && 'border-slate-200 focus:border-brand-400',
            )}
            onKeyDown={(e) => e.key === 'Enter' && status === 'idle' && submit()}
            autoFocus
          />
        )}

        {workbenchEnabled && status !== 'correct' && status !== 'revealed' && (
          <button
            onClick={() => setWorkbenchOpen(true)}
            className={clsx(
              'w-full h-11 rounded-2xl border-2 border-dashed font-bold text-sm flex items-center justify-center gap-2 mb-3 transition active:scale-[0.98]',
              workbenchTouched
                ? 'border-amber-300 bg-amber-50 text-amber-800 hover:border-amber-400'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-brand-300 hover:text-brand-700',
            )}
          >
            <Wrench size={16} />
            {workbenchTouched ? 'Відкрити робочий стіл (є записи)' : 'Робочий стіл'}
            {workbenchTouched && (
              <span className="w-2 h-2 rounded-full bg-amber-500" aria-hidden />
            )}
          </button>
        )}

        {status === 'wrong' && (
          <div className="flex items-center gap-2 text-rose-600 text-sm mb-3 font-semibold">
            <X size={18} /> Не зовсім, спробуй ще раз
          </div>
        )}
        {status === 'correct' && (
          <div className="flex items-center gap-2 text-emerald-600 font-extrabold mb-3">
            <Check size={20} /> Правильно! +{computeStars()} ⭐
          </div>
        )}
        {status === 'revealed' && (
          <div className="text-slate-700 text-sm mb-3">
            Подивись розв&apos;язання — наступного разу впораєшся!
          </div>
        )}

        {(status === 'wrong' || status === 'revealed') && !isExam && (
          <HintPanel
            hints={task.hints}
            hintLevel={hintLevel}
            solution={task.solution}
            solutionShown={solutionShown}
            onUseHint={useHint}
            onShowSolution={showSolution}
          />
        )}
        {status === 'revealed' && isExam && (
          <div className="rounded-2xl bg-slate-100 border border-slate-200 p-3 text-slate-800 text-sm whitespace-pre-line">
            <div className="font-bold mb-1">Правильна відповідь:</div>
            {task.solution}
          </div>
        )}
      </Card>

      {status === 'idle' && task.answerType !== 'choice' && (
        <Button size="lg" fullWidth onClick={() => submit()} disabled={!answer.trim()}>
          Перевірити
        </Button>
      )}
      {status === 'wrong' && task.answerType !== 'choice' && (
        <Button size="lg" fullWidth onClick={() => submit()} disabled={!answer.trim()}>
          Спробувати ще
        </Button>
      )}
      {status === 'wrong' && task.answerType === 'choice' && (
        <Button size="lg" fullWidth variant="secondary" onClick={() => setStatus('idle')}>
          Спробувати ще
        </Button>
      )}
      {(status === 'correct' || status === 'revealed') && (
        <Button size="lg" fullWidth onClick={proceed}>
          {index + 1 >= tasks.length ? 'Завершити' : 'Далі →'}
        </Button>
      )}

      {workbenchEnabled && (
        <Workbench
          open={workbenchOpen}
          onClose={() => {
            setWorkbenchOpen(false);
            setWorkbenchTouched(hasContent(getTaskState(task.id)));
          }}
          taskId={task.id}
          topicId={topicId}
          question={task.question}
        />
      )}
    </div>
  );
}

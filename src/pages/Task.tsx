import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, X } from 'lucide-react';
import { useSessionStore } from '@/store/session';
import { useProfileStore } from '@/store/profile';
import { HintPanel } from '@/components/HintPanel';
import { ProgressBar } from '@/components/ProgressBar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { playSound, unlockAudio } from '@/lib/sounds';
import { normalizeAnswer as normalize } from '@/lib/format';

type Feedback = 'idle' | 'correct' | 'wrong';

function isAnswerCorrect(input: string, correct: string, accepted?: string[]): boolean {
  const n = normalize(input);
  if (!n) return false;
  if (normalize(correct) === n) return true;
  if (accepted?.some((a) => normalize(a) === n)) return true;
  return false;
}

function starsFor(hintLevel: number, attempts: number, solutionShown: boolean): 0 | 1 | 2 | 3 {
  if (solutionShown) return 0;
  if (attempts > 1) return 1;
  if (hintLevel > 0) return 2;
  return 3;
}

export function TaskPage() {
  const navigate = useNavigate();
  const { tasks, index, mode, reviewIds, recordAttempt, next, reset } = useSessionStore();
  const awardForAnswer = useProfileStore((s) => s.awardForAnswer);
  const addError = useProfileStore((s) => s.addError);
  const reviewError = useProfileStore((s) => s.reviewError);

  const task = tasks[index];
  const total = tasks.length;
  const isExam = mode === 'exam';
  const isReview = mode === 'review';

  const [value, setValue] = useState('');
  const [hintLevel, setHintLevel] = useState(0);
  const [solutionShown, setSolutionShown] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>('idle');
  const [recorded, setRecorded] = useState(false);
  const startedAt = useRef<number>(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue('');
    setHintLevel(0);
    setSolutionShown(false);
    setAttempts(0);
    setFeedback('idle');
    setRecorded(false);
    startedAt.current = Date.now();
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [index]);

  useEffect(() => {
    if (!task) navigate('/');
  }, [task, navigate]);

  if (!task) return null;

  const timeSec = () => Math.max(1, Math.round((Date.now() - startedAt.current) / 1000));

  const finalize = (isCorrect: boolean, stars: 0 | 1 | 2 | 3) => {
    if (recorded) return;
    setRecorded(true);

    recordAttempt({
      taskId: task.id,
      isCorrect,
      stars,
      hintLevel,
      timeSec: timeSec(),
      attempts: Math.max(attempts, 1),
    });

    // У режимі іспиту не оновлюємо topic-stat (щоб контрольна не впливала на складність)
    if (!isExam && !isReview) {
      awardForAnswer({
        topicId: task.topicId,
        correct: isCorrect,
        stars,
        timeSec: timeSec(),
      });
      if (!isCorrect) {
        addError({
          id: `${task.id}-${Date.now()}`,
          topicId: task.topicId,
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

    if (isReview && reviewIds) {
      const id = reviewIds[index];
      if (id) reviewError(id, isCorrect);
    }
  };

  const goNext = () => {
    if (index + 1 >= total) {
      navigate('/results');
    } else {
      next();
    }
  };

  const submit = () => {
    unlockAudio();
    if (feedback === 'correct') {
      goNext();
      return;
    }
    if (!value.trim()) return;
    const correct = isAnswerCorrect(value, task.correctAnswer, task.acceptedAnswers);
    setAttempts((a) => a + 1);
    if (correct) {
      const stars = starsFor(hintLevel, attempts + 1, solutionShown);
      setFeedback('correct');
      playSound('correct');
      finalize(true, stars);
    } else {
      setFeedback('wrong');
      playSound('wrong');
      // У режимі іспиту — одна спроба
      if (isExam) {
        finalize(false, 0);
        setTimeout(() => goNext(), 600);
      } else {
        // Після 2-ї помилки — авто-фіналізація з 0 зірок
        if (attempts + 1 >= 2 && !solutionShown) {
          setSolutionShown(true);
          finalize(false, 0);
        }
      }
    }
  };

  const useHint = () => {
    if (hintLevel < task.hints.length) {
      setHintLevel((l) => l + 1);
      playSound('tap');
    }
  };

  const showSolution = () => {
    setSolutionShown(true);
    playSound('tap');
    if (!recorded) finalize(false, 0);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
  };

  const headerEmoji = useMemo(() => {
    if (isExam) return '📝';
    if (isReview) return '🔁';
    return '🎯';
  }, [isExam, isReview]);

  const headerLabel = useMemo(() => {
    if (isExam) return 'Контрольна';
    if (isReview) return 'Повторення';
    return `Тема: ${task.subtopic}`;
  }, [isExam, isReview, task.subtopic]);

  return (
    <div className="container-app">
      <header className="flex items-center mb-3">
        <button
          onClick={() => {
            reset();
            navigate(isExam ? '/exams' : isReview ? '/errors' : '/practice');
          }}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100"
          aria-label="Назад"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="ml-2 flex-1">
          <div className="text-xs text-slate-500">
            {headerEmoji} {headerLabel}
          </div>
          <div className="font-extrabold">
            Задача {index + 1} з {total}
          </div>
        </div>
      </header>

      <div className="mb-4">
        <ProgressBar value={index} max={total} />
      </div>

      <Card
        className={
          feedback === 'correct'
            ? 'ring-4 ring-emerald-300 animate-pop-in'
            : feedback === 'wrong'
              ? 'ring-4 ring-rose-300'
              : ''
        }
      >
        <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">
          {task.subtopic}
        </div>
        <div className="text-2xl font-extrabold mb-5 whitespace-pre-wrap leading-snug">
          {task.question}
        </div>

        {task.answerType === 'choice' && task.options ? (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {task.options.map((opt) => (
              <Button
                key={opt}
                variant={value === opt ? 'primary' : 'secondary'}
                onClick={() => {
                  setValue(opt);
                  playSound('tap');
                }}
                disabled={feedback === 'correct' || solutionShown}
              >
                {opt}
              </Button>
            ))}
          </div>
        ) : (
          <input
            ref={inputRef}
            type="text"
            inputMode={task.answerType === 'number' ? 'numeric' : 'text'}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Твоя відповідь"
            className="w-full h-14 text-xl text-center font-extrabold rounded-2xl border-2 border-slate-200 focus:border-brand-500 focus:outline-none mb-3"
            disabled={feedback === 'correct' || solutionShown}
            autoComplete="off"
          />
        )}

        {feedback === 'correct' && (
          <div className="flex items-center justify-center gap-2 text-emerald-600 font-extrabold mb-3 animate-pop-in">
            <Check size={20} /> Правильно!
          </div>
        )}
        {feedback === 'wrong' && (
          <div className="flex items-center justify-center gap-2 text-rose-600 font-extrabold mb-3">
            <X size={20} /> Спробуй ще раз
          </div>
        )}

        <Button fullWidth size="lg" onClick={submit} disabled={!isExam && solutionShown && feedback !== 'correct'}>
          {feedback === 'correct' || solutionShown ? 'Далі →' : 'Перевірити'}
        </Button>

        {!isExam && (
          <div className="mt-4">
            <HintPanel
              hints={task.hints}
              hintLevel={hintLevel}
              solution={task.solution}
              solutionShown={solutionShown}
              onUseHint={useHint}
              onShowSolution={showSolution}
            />
            {solutionShown && (
              <Button fullWidth className="mt-3" onClick={goNext}>
                Далі →
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { ChevronLeft, FileText } from 'lucide-react';
import { allExams, generateExamTasks } from '@/features/tasks/exams';
import { useSessionStore } from '@/store/session';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function Exams() {
  const navigate = useNavigate();
  const startExam = useSessionStore((s) => s.startExam);

  const start = (examId: string) => {
    const exam = allExams.find((e) => e.id === examId);
    if (!exam) return;
    const tasks = generateExamTasks(exam);
    startExam(exam.title, tasks);
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
        <h1 className="text-xl font-extrabold ml-2">Контрольні роботи</h1>
      </header>

      <Card className="mb-4 bg-amber-50 border-amber-200">
        <div className="flex items-start gap-3">
          <FileText size={24} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900">
            <p className="font-bold mb-1">Що це?</p>
            <p>
              Це підсумкова контрольна — як справжня в школі. <b>Без підказок</b>, з однієї спроби.
              На кожне завдання — обмежений час. У кінці отримаєш оцінку.
            </p>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        {allExams.map((exam) => (
          <Card key={exam.id}>
            <div className="flex items-start gap-3 mb-3">
              <div className="text-3xl">📝</div>
              <div className="flex-1 min-w-0">
                <div className="font-extrabold">{exam.title}</div>
                <div className="text-xs text-slate-500 mt-0.5">{exam.description}</div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-3 mb-3 text-xs text-slate-700 space-y-1">
              {exam.questions.map((q, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="font-bold text-slate-400 w-5">{i + 1}.</span>
                  <span>{q.label.replace(/^\d+\.\s*/, '')}</span>
                </div>
              ))}
            </div>
            <Button fullWidth onClick={() => start(exam.id)}>
              Розпочати контрольну
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

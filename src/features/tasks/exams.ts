import type { Difficulty, TopicId } from '@/store/profile';
import type { Task } from './types';
import { generateTask } from './registry';
import { randChoice } from '@/lib/random';

export interface ExamSpec {
  id: string;
  title: string;
  description: string;
  /** масив генераторів: кожен елемент описує одну задачу контрольної */
  questions: Array<{
    label: string;
    topicId: TopicId;
    subtopic?: string; // якщо треба конкретну підтему
    difficulty: Difficulty;
  }>;
}

/**
 * Контрольна 4 клас — за зразком діагностичної роботи.
 * Покриває: складені вирази, дії з іменованими, дріб від числа,
 * рівняння, складна задача на рух, прямокутник за площею.
 */
export const exam4thGrade: ExamSpec = {
  id: 'exam-4th-grade',
  title: 'Підсумкова діагностична робота 4 клас',
  description: '6 завдань без підказок, як на справжньому іспиті',
  questions: [
    { label: '1. Обчисли складений вираз', topicId: 'column', subtopic: 'Складені вирази', difficulty: 4 },
    { label: '2. Виконай дії з іменованими числами', topicId: 'units', subtopic: 'Дії з іменованими числами', difficulty: 3 },
    { label: '3. Знайди дріб від числа', topicId: 'fractions', subtopic: 'Дріб від числа', difficulty: 4 },
    { label: '4. Розв\'яжи рівняння', topicId: 'equations', subtopic: 'Прості рівняння', difficulty: 4 },
    { label: '5. Розв\'яжи задачу', topicId: 'word', subtopic: 'Складні задачі на рух', difficulty: 3 },
    { label: '6. Геометрія: знайди сторону прямокутника', topicId: 'geometry', subtopic: 'Сторона прямокутника', difficulty: 3 },
  ],
};

/**
 * Самостійна робота «Ділення багатоцифрових чисел» — за зразком
 * шкільного бланку (8 завдань: усне ділення, стовпчик, складені вирази,
 * ділення з підбором частки, рівняння, задача на приведення до одиниці,
 * іменовані числа).
 */
export const examDivisionWork: ExamSpec = {
  id: 'exam-division-work',
  title: 'Самостійна робота: Ділення багатоцифрових чисел',
  description: '8 завдань без підказок — точно як на самостійній у школі',
  questions: [
    { label: '1. Усне ділення (таблиця)', topicId: 'oral', subtopic: 'Множення', difficulty: 2 },
    { label: '2. Ділення багатоцифрового на 1-цифрове', topicId: 'column', subtopic: 'Ділення кутом', difficulty: 5 },
    { label: '3. Ділення кутом на 2-цифрове', topicId: 'column', subtopic: 'Ділення кутом', difficulty: 4 },
    { label: '4. Обчисли вираз (порядок дій з дужками)', topicId: 'order', subtopic: 'Порядок дій з дужками', difficulty: 3 },
    { label: '5. Ділення з підбором частки', topicId: 'column', subtopic: 'Ділення з підбором частки', difficulty: 4 },
    { label: '6. Розв\'яжи рівняння', topicId: 'equations', subtopic: 'Прості рівняння', difficulty: 4 },
    { label: '7. Задача (приведення до одиниці)', topicId: 'word', subtopic: 'Приведення до одиниці', difficulty: 4 },
    { label: '8. Дії з іменованими числами', topicId: 'units', subtopic: 'Дії з іменованими числами', difficulty: 3 },
  ],
};

export const allExams: ExamSpec[] = [exam4thGrade, examDivisionWork];

/**
 * Генерує задачі контрольної.
 * Якщо вказана `subtopic`, намагається кілька разів отримати задачу саме з цієї підтеми.
 */
export function generateExamTasks(spec: ExamSpec): Task[] {
  return spec.questions.map((q) => {
    if (!q.subtopic) {
      return generateTask(q.topicId, q.difficulty);
    }
    // Спробуємо до 20 разів отримати потрібну підтему
    for (let i = 0; i < 20; i++) {
      const t = generateTask(q.topicId, q.difficulty);
      if (t.subtopic === q.subtopic) return t;
    }
    // Fallback — будь-яка задача з теми
    return generateTask(q.topicId, q.difficulty);
  });
}

export function getExamById(id: string): ExamSpec | undefined {
  return allExams.find((e) => e.id === id);
}

// Для майбутнього: різні варіанти контрольної
export function pickRandomExam(): ExamSpec {
  return randChoice(allExams);
}

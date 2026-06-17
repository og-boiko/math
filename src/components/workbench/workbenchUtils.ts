/**
 * Утиліти для Workbench: визначення дефолтного табу і парсинг
 * виразу зі `task.question` для колонки.
 */
import type { TopicId } from '@/store/profile';
import type { WorkbenchTab } from './workbenchStore';

/**
 * Дефолтний таб під тему. Дитина може перемкнути вручну,
 * але при першому відкритті — обираємо найзручніше.
 */
export function defaultTabForTopic(topicId: TopicId | null | undefined): WorkbenchTab {
  switch (topicId) {
    case 'column':
      return 'column';
    case 'geometry':
    case 'logic':
      return 'pad';
    case 'oral':
    case 'order':
    case 'word':
    case 'units':
    case 'decimals':
    case 'fractions':
    case 'equations':
      return 'calc';
    default:
      return 'calc';
  }
}

export interface ColumnExpr {
  op: '+' | '-' | '×' | '÷';
  a: number;
  b: number;
}

/**
 * Витягує бінарну операцію з тексту запитання, якщо це проста "стовпчикова" задача.
 * Повертає null, якщо не вдалося розпізнати (наприклад, складений вираз чи 3+ операнди).
 *
 * Приклади що матчаться:
 *   "12 345 + 67 890 = ?"
 *   "987 − 123 = ?"
 *   "234 × 56 = ?"
 *   "504 ÷ 56 = ?"
 */
export function parseColumnExpression(question: string): ColumnExpr | null {
  // Прибираємо все, крім цифр, пробілів і операторів
  const cleaned = question
    .replace(/=.*$/, '') // все після "="
    .replace(/[^\d\s+\-×÷−*/]/g, '')
    .trim();

  // Має бути рівно один оператор посередині
  const match = cleaned.match(/^(\d[\d\s]*)\s*([+\-×÷−*/])\s*(\d[\d\s]*)$/);
  if (!match) return null;

  const a = parseInt(match[1].replace(/\s+/g, ''), 10);
  const b = parseInt(match[3].replace(/\s+/g, ''), 10);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;

  let op: ColumnExpr['op'];
  switch (match[2]) {
    case '+':
      op = '+';
      break;
    case '-':
    case '−':
      op = '-';
      break;
    case '×':
    case '*':
      op = '×';
      break;
    case '÷':
    case '/':
      op = '÷';
      break;
    default:
      return null;
  }

  return { op, a, b };
}

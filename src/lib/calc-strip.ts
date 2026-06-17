/**
 * Хелпери для CalcStrip — багаторядкового калькулятора у Workbench.
 *
 * Базується на `math-eval.ts`, але приймає "людський" формат:
 * - кома як десятковий розділювач (123,45)
 * - пробіли як розділювачі тисяч (1 234)
 * - "ans" / "↑" → значення попереднього рядка
 * - порожні рядки ігноруються
 *
 * Округлення до 4 знаків після коми, щоб уникати плаваючої точки
 * (0.1 + 0.2 = 0,3 а не 0,30000004).
 */
import { evalExpression } from './math-eval';

export interface StripLineResult {
  /** Чи вираз валідний і обчислений. */
  ok: boolean;
  /** Числовий результат, якщо ok. */
  value?: number;
  /** Текст для виводу праворуч від виразу: "= 168" або "помилка". */
  display: string;
  /** Повідомлення помилки, якщо !ok. */
  error?: string;
}

/** Округлення до 4 знаків після коми, щоб обходити float-нестабільність. */
function clean(n: number): number {
  if (!Number.isFinite(n)) return n;
  return Math.round(n * 10000) / 10000;
}

/** Форматує число для виводу: ціле без коми, дробове з комою (без зайвих нулів). */
export function formatStripNumber(n: number): string {
  if (!Number.isFinite(n)) return '∞';
  const rounded = clean(n);
  if (Number.isInteger(rounded)) return String(rounded);
  // 4 знаки максимум, прибираємо зайві нулі праворуч
  return rounded
    .toFixed(4)
    .replace(/0+$/, '')
    .replace(/\.$/, '')
    .replace('.', ',');
}

/**
 * Готує рядок до парсингу:
 * - замінює "ans" на значення попереднього рядка,
 * - видаляє пробіли (включно з тисячними),
 * - кому → крапку.
 */
function preprocess(raw: string, prevAns: number | undefined): string {
  let s = raw.trim();
  if (!s) return '';
  // ans → число (case-insensitive). Якщо ans немає — лишаємо як є,
  // щоб впав із зрозумілою помилкою.
  if (prevAns !== undefined) {
    s = s.replace(/ans/gi, String(prevAns));
  }
  // Прибираємо всі пробіли (тисячні, прогалини між операціями)
  s = s.replace(/\s+/g, '');
  // Кому → крапку (десятковий)
  s = s.replace(/,/g, '.');
  return s;
}

/**
 * Перевіряє, чи рядок схожий на завершений вираз
 * (тобто не закінчується оператором).
 */
function isComplete(s: string): boolean {
  if (!s) return false;
  return !/[+\-*/×÷−]$/.test(s);
}

/**
 * Обчислює один рядок CalcStrip.
 * @param raw   те, що ввела дитина
 * @param prevAns значення попереднього рядка (для "ans")
 */
export function evalStripLine(
  raw: string,
  prevAns: number | undefined,
): StripLineResult {
  const expr = preprocess(raw, prevAns);
  if (!expr) return { ok: false, display: '' };
  if (!isComplete(expr)) {
    return { ok: false, display: '…', error: 'Вираз не закінчений' };
  }
  try {
    const value = clean(evalExpression(expr));
    if (!Number.isFinite(value)) {
      return { ok: false, display: 'помилка', error: 'Ділення на нуль' };
    }
    return {
      ok: true,
      value,
      display: `= ${formatStripNumber(value)}`,
    };
  } catch (e) {
    return {
      ok: false,
      display: 'помилка',
      error: e instanceof Error ? e.message : 'Помилка виразу',
    };
  }
}

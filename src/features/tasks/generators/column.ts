import type { Difficulty } from '@/store/profile';
import type { Generator, Task } from '../types';
import { randChoice, randInt, uid } from '@/lib/random';
import { formatBigNumber } from '@/lib/format';

const colAddRanges: Record<Difficulty, [number, number]> = {
  1: [100, 999],
  2: [1000, 9999],
  3: [10000, 99999],
  4: [100000, 999999],
  5: [100000, 999999],
};

export const columnAddition: Generator = {
  topicId: 'column',
  subtopic: 'Додавання стовпчиком',
  generate(difficulty: Difficulty): Task {
    const [min, max] = colAddRanges[difficulty];
    const a = randInt(min, max);
    const b = randInt(min, max);
    const sum = a + b;
    return {
      id: uid('col-add-'),
      topicId: 'column',
      subtopic: 'Додавання стовпчиком',
      difficulty,
      question: `${formatBigNumber(a)} + ${formatBigNumber(b)} = ?`,
      answerType: 'number',
      correctAnswer: String(sum),
      acceptedAnswers: [String(sum), formatBigNumber(sum)],
      hints: [
        'Запиши числа стовпчиком, розряд під розрядом, починай з одиниць.',
        `Одиниці: ${a % 10} + ${b % 10} = ${(a % 10) + (b % 10)}. Якщо ≥ 10, переноси десяток.`,
      ],
      solution: `${formatBigNumber(a)} + ${formatBigNumber(b)} = ${formatBigNumber(sum)}`,
      estimatedSec: 30,
    };
  },
};

export const columnSubtraction: Generator = {
  topicId: 'column',
  subtopic: 'Віднімання стовпчиком',
  generate(difficulty: Difficulty): Task {
    const [min, max] = colAddRanges[difficulty];
    const a = randInt(min, max);
    const b = randInt(min, a);
    // На рівні 5 — навмисно числа з нулями посередині
    const aFinal = difficulty === 5 ? Math.floor(a / 1000) * 1000 + randInt(0, 99) : a;
    const bFinal = Math.min(b, aFinal);
    const diff = aFinal - bFinal;
    return {
      id: uid('col-sub-'),
      topicId: 'column',
      subtopic: 'Віднімання стовпчиком',
      difficulty,
      question: `${formatBigNumber(aFinal)} − ${formatBigNumber(bFinal)} = ?`,
      answerType: 'number',
      correctAnswer: String(diff),
      acceptedAnswers: [String(diff), formatBigNumber(diff)],
      hints: [
        'Запиши стовпчиком, починай з одиниць. Якщо не вистачає — позичай у сусіднього розряду.',
        `Перевір: ${formatBigNumber(bFinal)} + ? = ${formatBigNumber(aFinal)}.`,
      ],
      solution: `${formatBigNumber(aFinal)} − ${formatBigNumber(bFinal)} = ${formatBigNumber(diff)}`,
      estimatedSec: 30,
    };
  },
};

export const columnMultiplication: Generator = {
  topicId: 'column',
  subtopic: 'Множення стовпчиком',
  generate(difficulty: Difficulty): Task {
    let a: number, b: number;
    switch (difficulty) {
      case 1:
        a = randInt(11, 99);
        b = randInt(2, 9);
        break;
      case 2:
        a = randInt(100, 999);
        b = randInt(2, 9);
        break;
      case 3:
        a = randInt(11, 99);
        b = randInt(11, 99);
        break;
      case 4:
        a = randInt(100, 999);
        b = randInt(11, 99);
        break;
      case 5:
        a = randInt(100, 999);
        b = randInt(100, 999);
        break;
    }
    const product = a * b;
    return {
      id: uid('col-mul-'),
      topicId: 'column',
      subtopic: 'Множення стовпчиком',
      difficulty,
      question: `${a} × ${b} = ?`,
      answerType: 'number',
      correctAnswer: String(product),
      acceptedAnswers: [String(product), formatBigNumber(product)],
      hints: [
        'Множ кожну цифру другого множника на перше число, починай з одиниць.',
        `Спочатку ${a} × ${b % 10} = ${a * (b % 10)}.`,
      ],
      solution: `${a} × ${b} = ${formatBigNumber(product)}`,
      estimatedSec: 60,
    };
  },
};

export const columnDivision: Generator = {
  topicId: 'column',
  subtopic: 'Ділення кутом',
  generate(difficulty: Difficulty): Task {
    let dividend: number, divisor: number;
    let withRemainder = false;
    switch (difficulty) {
      case 1: {
        divisor = randInt(2, 9);
        const q = randInt(2, 9);
        dividend = divisor * q;
        break;
      }
      case 2: {
        divisor = randInt(2, 9);
        const q = randInt(11, 99);
        dividend = divisor * q;
        break;
      }
      case 3: {
        divisor = randInt(3, 9);
        const q = randInt(11, 99);
        dividend = divisor * q + randInt(1, divisor - 1);
        withRemainder = true;
        break;
      }
      case 4: {
        divisor = randInt(11, 25);
        const q = randInt(11, 99);
        dividend = divisor * q;
        break;
      }
      case 5: {
        divisor = randInt(2, 9);
        // Гарантуємо нуль у частці
        const q = randInt(2, 9) * 100 + randInt(0, 9);
        dividend = divisor * q;
        break;
      }
    }
    const quotient = Math.floor(dividend / divisor);
    const remainder = dividend % divisor;
    const correctAnswer = withRemainder ? `${quotient}(ост.${remainder})` : String(quotient);
    return {
      id: uid('col-div-'),
      topicId: 'column',
      subtopic: 'Ділення кутом',
      difficulty,
      question: withRemainder
        ? `${dividend} ÷ ${divisor} = ? (з остачею; формат: число(ост.число))`
        : `${dividend} ÷ ${divisor} = ?`,
      answerType: 'text',
      correctAnswer,
      acceptedAnswers: withRemainder
        ? [
            `${quotient}(ост.${remainder})`,
            `${quotient} ост ${remainder}`,
            `${quotient} (ост. ${remainder})`,
            `${quotient}ост${remainder}`,
          ]
        : [String(quotient)],
      hints: [
        'Ділення кутом: знаходь скільки разів дільник вміщується у поточну частину діленого.',
        withRemainder
          ? `${divisor} × ${quotient} = ${divisor * quotient}, лишок: ${dividend} − ${divisor * quotient} = ${remainder}.`
          : `${divisor} × ${quotient} = ${dividend}.`,
      ],
      solution: withRemainder
        ? `${dividend} ÷ ${divisor} = ${quotient} (остача ${remainder})`
        : `${dividend} ÷ ${divisor} = ${quotient}`,
      estimatedSec: 60,
    };
  },
};

/**
 * Складені вирази в стилі контрольної 4 класу:
 * 13268 + (540 − 37) · 23 = ?
 */
export const columnCombined: Generator = {
  topicId: 'column',
  subtopic: 'Складені вирази',
  generate(difficulty: Difficulty): Task {
    // Числові діапазони залежно від рівня
    const baseMax = difficulty <= 2 ? 999 : difficulty === 3 ? 9999 : difficulty === 4 ? 19999 : 99999;
    const inBracketsMax = difficulty <= 2 ? 99 : difficulty === 3 ? 500 : 999;
    const multiplierMax = difficulty <= 2 ? 9 : difficulty === 3 ? 25 : difficulty === 4 ? 50 : 99;

    // Шаблони (вибираємо випадково, контрольований результат)
    const variants = [
      // N + (a − b) × c
      () => {
        const a = randInt(20, inBracketsMax);
        const b = randInt(1, a - 1);
        const c = randInt(2, multiplierMax);
        const n = randInt(100, baseMax);
        const result = n + (a - b) * c;
        return {
          expr: `${n} + (${a} − ${b}) × ${c}`,
          result,
          steps: [
            `Спочатку дужки: ${a} − ${b} = ${a - b}.`,
            `Потім множення: ${a - b} × ${c} = ${(a - b) * c}.`,
            `Нарешті додавання: ${n} + ${(a - b) * c} = ${result}.`,
          ],
        };
      },
      // (a + b) × c − N
      () => {
        const a = randInt(10, inBracketsMax);
        const b = randInt(10, inBracketsMax);
        const c = randInt(2, multiplierMax);
        const product = (a + b) * c;
        const n = randInt(10, Math.max(11, product - 10));
        const result = product - n;
        return {
          expr: `(${a} + ${b}) × ${c} − ${n}`,
          result,
          steps: [
            `Спочатку дужки: ${a} + ${b} = ${a + b}.`,
            `Потім множення: ${a + b} × ${c} = ${product}.`,
            `Нарешті віднімання: ${product} − ${n} = ${result}.`,
          ],
        };
      },
      // N − (a + b) × c
      () => {
        const a = randInt(5, Math.floor(inBracketsMax / 2));
        const b = randInt(5, Math.floor(inBracketsMax / 2));
        const c = randInt(2, Math.min(multiplierMax, 9));
        const product = (a + b) * c;
        const n = randInt(product + 100, baseMax);
        const result = n - product;
        return {
          expr: `${n} − (${a} + ${b}) × ${c}`,
          result,
          steps: [
            `Спочатку дужки: ${a} + ${b} = ${a + b}.`,
            `Потім множення: ${a + b} × ${c} = ${product}.`,
            `Нарешті віднімання: ${n} − ${product} = ${result}.`,
          ],
        };
      },
      // (N − M) ÷ c + k
      () => {
        const c = randInt(2, 9);
        const quotient = randInt(50, 500);
        const m = randInt(100, 999);
        const n = quotient * c + m;
        const k = randInt(100, 999);
        const result = quotient + k;
        return {
          expr: `(${n} − ${m}) ÷ ${c} + ${k}`,
          result,
          steps: [
            `Спочатку дужки: ${n} − ${m} = ${n - m}.`,
            `Потім ділення: ${n - m} ÷ ${c} = ${quotient}.`,
            `Нарешті додавання: ${quotient} + ${k} = ${result}.`,
          ],
        };
      },
    ];

    const variant = (() => {
      // Обмежений цикл замість рекурсії — до 8 спроб згенерувати «гарний»
      // варіант (цілий, у межах 0..999_999). Інакше fallback.
      for (let attempt = 0; attempt < 8; attempt++) {
        const v = randChoice(variants)();
        if (Number.isInteger(v.result) && v.result >= 0 && v.result <= 999999) {
          return v;
        }
      }
      // Fallback: гарантовано безпечний шаблон N + (a − b) · c з малими числами
      const a = 20, b = 5, c = 3, n = 100;
      const result = n + (a - b) * c;
      return {
        expr: `${n} + (${a} − ${b}) × ${c}`,
        result,
        steps: [
          `Спочатку дужки: ${a} − ${b} = ${a - b}.`,
          `Потім множення: ${a - b} × ${c} = ${(a - b) * c}.`,
          `Нарешті додавання: ${n} + ${(a - b) * c} = ${result}.`,
        ],
      };
    })();

    return {
      id: uid('col-comb-'),
      topicId: 'column',
      subtopic: 'Складені вирази',
      difficulty,
      question: `${variant.expr} = ?`,
      answerType: 'number',
      correctAnswer: String(variant.result),
      acceptedAnswers: [String(variant.result), formatBigNumber(variant.result)],
      hints: [
        'Згадай порядок дій: спочатку дужки, потім ×÷, потім +−.',
        variant.steps[0],
        variant.steps.slice(1).join(' '),
      ],
      solution: `${variant.expr} = ${formatBigNumber(variant.result)}\n${variant.steps.join('\n')}`,
      estimatedSec: 90,
    };
  },
};

/**
 * Ділення з підбором частки (за зразком самостійної «Ділення багатоцифрових чисел»):
 *   504 : 56 = ?
 * Дільник — 2-цифровий, ділене — таке, що частка ціла й однозначна.
 * Дитину вчать: округлити дільник до десятків → прикинути → перевірити множенням.
 */
export const columnDivisionEstimate: Generator = {
  topicId: 'column',
  subtopic: 'Ділення з підбором частки',
  generate(difficulty: Difficulty): Task {
    let divisorMin: number, divisorMax: number;
    let quotientMin: number, quotientMax: number;
    switch (difficulty) {
      case 1:
        divisorMin = 12; divisorMax = 24;
        quotientMin = 3; quotientMax = 6;
        break;
      case 2:
        divisorMin = 15; divisorMax = 38;
        quotientMin = 4; quotientMax = 7;
        break;
      case 3:
        divisorMin = 22; divisorMax = 56;
        quotientMin = 5; quotientMax = 8;
        break;
      case 4:
        divisorMin = 34; divisorMax = 79;
        quotientMin = 6; quotientMax = 9;
        break;
      case 5:
      default:
        divisorMin = 45; divisorMax = 99;
        quotientMin = 6; quotientMax = 9;
        break;
    }
    const divisor = randInt(divisorMin, divisorMax);
    const quotient = randInt(quotientMin, quotientMax);
    const dividend = divisor * quotient;
    const roundedDivisor = Math.max(10, Math.round(divisor / 10) * 10);
    const roughEstimate = Math.round(dividend / roundedDivisor);

    return {
      id: uid('col-div-est-'),
      topicId: 'column',
      subtopic: 'Ділення з підбором частки',
      difficulty,
      question: `${dividend} ÷ ${divisor} = ?`,
      answerType: 'number',
      correctAnswer: String(quotient),
      hints: [
        `Прикидка: округли дільник ${divisor} ≈ ${roundedDivisor}. Тоді ${dividend} ÷ ${roundedDivisor} ≈ ${roughEstimate}.`,
        `Перевір множенням: ${divisor} × ${Math.max(1, quotient - 1)} = ${divisor * Math.max(1, quotient - 1)}, ${divisor} × ${quotient} = ${dividend}, ${divisor} × ${quotient + 1} = ${divisor * (quotient + 1)}. Серед них тільки одне дорівнює ${dividend}.`,
      ],
      solution: `Підказка: ${divisor} ≈ ${roundedDivisor}; ${dividend} ÷ ${roundedDivisor} ≈ ${roughEstimate}.\nПеревірка: ${divisor} × ${quotient} = ${dividend}.\nОтже, ${dividend} ÷ ${divisor} = ${quotient}.`,
      estimatedSec: 50,
    };
  },
};

export const columnGenerators: Generator[] = [
  columnAddition,
  columnSubtraction,
  columnMultiplication,
  columnDivision,
  columnCombined,
  columnDivisionEstimate,
];
import type { Difficulty } from '@/store/profile';
import type { Generator, Task } from '../types';
import { randChoice, randInt, uid } from '@/lib/random';
import { evalExpression } from '@/lib/math-eval';

/** Без дужок: 2-4 операції з + − × ÷ */
export const orderNoBrackets: Generator = {
  topicId: 'order',
  subtopic: 'Порядок дій без дужок',
  generate(difficulty: Difficulty): Task {
    const opsCount = Math.min(2 + Math.floor(difficulty / 2), 4);
    const max = difficulty <= 2 ? 20 : difficulty <= 4 ? 50 : 100;

    // Обмежений цикл замість рекурсії. До 8 спроб згенерувати «гарний» вираз
    // з цілим, не надто великим результатом.
    let expr = '';
    let result = 0;
    let ok = false;
    for (let attempt = 0; attempt < 8 && !ok; attempt++) {
      let e = String(randInt(2, max));
      for (let i = 0; i < opsCount; i++) {
        const op = randChoice(['+', '-', '×']);
        const n = randInt(2, max);
        e += ` ${op} ${n}`;
      }
      const jsExpr = e.replace(/×/g, '*').replace(/−/g, '-');
      const r = evalExpression(jsExpr);
      if (Number.isInteger(r) && Math.abs(r) <= 99999 && r >= 0) {
        expr = e;
        result = r;
        ok = true;
      }
    }
    if (!ok) {
      // Гарантований fallback: проста сума
      const a = randInt(2, max);
      const b = randInt(2, max);
      expr = `${a} + ${b}`;
      result = a + b;
    }
    return {
      id: uid('order-nb-'),
      topicId: 'order',
      subtopic: 'Порядок дій без дужок',
      difficulty,
      question: `${expr} = ?`,
      answerType: 'number',
      correctAnswer: String(result),
      hints: [
        'Спочатку множення і ділення, потім додавання і віднімання — зліва направо.',
        'Знайди в виразі × і ÷ — виконай їх першими.',
      ],
      solution: `${expr} = ${result}`,
      estimatedSec: 20,
    };
  },
};

/** З дужками */
export const orderWithBrackets: Generator = {
  topicId: 'order',
  subtopic: 'Порядок дій з дужками',
  generate(difficulty: Difficulty): Task {
    const max = difficulty <= 2 ? 20 : 50;

    // Обмежений цикл замість рекурсії. Шаблон вибирається за рівнем,
    // а параметри підбираються до 8 разів, доки результат не пройде перевірки.
    let expr = '';
    let result = 0;
    let ok = false;
    for (let attempt = 0; attempt < 8 && !ok; attempt++) {
      const a = randInt(2, max);
      const b = randInt(2, max);
      const c = randInt(2, max);
      const d = randInt(2, 9);
      let e: string;
      let r: number;
      if (difficulty <= 2) {
        e = `(${a} + ${b}) × ${c}`;
        r = (a + b) * c;
      } else if (difficulty === 3) {
        const big = Math.max(b, c);
        const small = Math.min(b, c);
        e = `${d} × (${big} − ${small})`;
        r = d * (big - small);
      } else if (difficulty === 4) {
        const big = Math.max(c, d) + 5;
        const small = Math.min(c, d);
        e = `(${a} + ${b}) × (${big} − ${small})`;
        r = (a + b) * (big - small);
      } else {
        e = `(${a} × ${b} − ${c}) × ${d}`;
        r = (a * b - c) * d;
      }
      if (Number.isFinite(r) && r >= 0 && Math.abs(r) <= 99999) {
        expr = e;
        result = r;
        ok = true;
      }
    }
    if (!ok) {
      // Гарантований fallback — найпростіша версія
      const a = randInt(2, max);
      const b = randInt(2, max);
      const c = randInt(2, max);
      expr = `(${a} + ${b}) × ${c}`;
      result = (a + b) * c;
    }
    return {
      id: uid('order-br-'),
      topicId: 'order',
      subtopic: 'Порядок дій з дужками',
      difficulty,
      question: `${expr} = ?`,
      answerType: 'number',
      correctAnswer: String(result),
      hints: [
        'Перше — те, що в дужках. Потім × і ÷, потім + і −.',
        'Спочатку обчисли вираз у дужках, заміни його на отримане число.',
      ],
      solution: `${expr} = ${result}`,
      estimatedSec: 25,
    };
  },
};

/** Степені — підготовка до 5 класу */
export const orderPowers: Generator = {
  topicId: 'order',
  subtopic: 'Степені',
  generate(difficulty: Difficulty): Task {
    if (difficulty === 1) {
      // a²
      const a = randInt(2, 10);
      return {
        id: uid('order-pow-'),
        topicId: 'order',
        subtopic: 'Степені',
        difficulty,
        question: `${a}² = ?`,
        answerType: 'number',
        correctAnswer: String(a * a),
        hints: ['Квадрат числа — це число помножене саме на себе.', `${a} × ${a} = ?`],
        solution: `${a}² = ${a} × ${a} = ${a * a}`,
        estimatedSec: 8,
      };
    }
    if (difficulty === 2) {
      const a = randInt(2, 5);
      return {
        id: uid('order-pow-'),
        topicId: 'order',
        subtopic: 'Степені',
        difficulty,
        question: `${a}³ = ?`,
        answerType: 'number',
        correctAnswer: String(a * a * a),
        hints: [
          'Куб числа — три однакові множники.',
          `${a} × ${a} = ${a * a}, тепер ${a * a} × ${a} = ?`,
        ],
        solution: `${a}³ = ${a} × ${a} × ${a} = ${a * a * a}`,
        estimatedSec: 12,
      };
    }
    if (difficulty === 3) {
      // a² + b²
      const a = randInt(2, 9);
      const b = randInt(2, 9);
      return {
        id: uid('order-pow-'),
        topicId: 'order',
        subtopic: 'Степені',
        difficulty,
        question: `${a}² + ${b}² = ?`,
        answerType: 'number',
        correctAnswer: String(a * a + b * b),
        hints: [
          'Спочатку обчисли кожен степінь, потім додай.',
          `${a}² = ${a * a}, ${b}² = ${b * b}.`,
        ],
        solution: `${a}² + ${b}² = ${a * a} + ${b * b} = ${a * a + b * b}`,
        estimatedSec: 15,
      };
    }
    if (difficulty === 4) {
      // (a + b)² − c²
      const a = randInt(2, 5);
      const b = randInt(2, 5);
      const c = randInt(2, a + b - 1);
      const result = (a + b) ** 2 - c * c;
      return {
        id: uid('order-pow-'),
        topicId: 'order',
        subtopic: 'Степені',
        difficulty,
        question: `(${a} + ${b})² − ${c}² = ?`,
        answerType: 'number',
        correctAnswer: String(result),
        hints: [
          'Спочатку обчисли вираз у дужках, потім піднеси у квадрат.',
          `(${a} + ${b}) = ${a + b}, ${a + b}² = ${(a + b) ** 2}, ${c}² = ${c * c}.`,
        ],
        solution: `(${a} + ${b})² − ${c}² = ${a + b}² − ${c * c} = ${(a + b) ** 2} − ${c * c} = ${result}`,
        estimatedSec: 25,
      };
    }
    // 5: знайти x, x² = N
    const x = randInt(2, 12);
    return {
      id: uid('order-pow-'),
      topicId: 'order',
      subtopic: 'Степені',
      difficulty,
      question: `Знайди x: x² = ${x * x}`,
      answerType: 'number',
      correctAnswer: String(x),
      hints: [
        'Тобі треба знайти таке число, яке помножене саме на себе дає вказаний результат.',
        `Подумай: яке число × саме на себе = ${x * x}?`,
      ],
      solution: `x = ${x}, бо ${x} × ${x} = ${x * x}`,
      estimatedSec: 20,
    };
  },
};

export const orderGenerators: Generator[] = [orderNoBrackets, orderWithBrackets, orderPowers];

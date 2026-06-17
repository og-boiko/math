import type { Difficulty } from '@/store/profile';
import type { Generator, Task } from '../types';
import { randChoice, randInt, uid } from '@/lib/random';

/** Прості рівняння: x + a = b, x - a = b, a × x = b, a ÷ x = b */
export const equationsSimple: Generator = {
  topicId: 'equations',
  subtopic: 'Прості рівняння',
  generate(difficulty: Difficulty): Task {
    const max = difficulty <= 2 ? 30 : difficulty === 3 ? 100 : 200;
    const ops = difficulty === 1 ? ['+'] : difficulty === 2 ? ['+', '-'] : difficulty === 3 ? ['×'] : ['+', '-', '×', '÷'];
    const op = randChoice(ops);
    const x = randInt(2, max);

    if (op === '+') {
      const a = randInt(2, max);
      const b = x + a;
      return {
        id: uid('eq-s-'),
        topicId: 'equations',
        subtopic: 'Прості рівняння',
        difficulty,
        question: `Розв'яжи рівняння: x + ${a} = ${b}`,
        answerType: 'number',
        correctAnswer: String(x),
        hints: [
          'Щоб знайти невідомий доданок, від суми відніми відомий доданок.',
          `x = ${b} − ${a} = ?`,
        ],
        solution: `x = ${b} − ${a} = ${x}`,
        estimatedSec: 25,
      };
    }
    if (op === '-') {
      // x - a = b
      const a = randInt(2, max);
      const b = randInt(2, max);
      const xVal = a + b;
      return {
        id: uid('eq-s-'),
        topicId: 'equations',
        subtopic: 'Прості рівняння',
        difficulty,
        question: `Розв'яжи рівняння: x − ${a} = ${b}`,
        answerType: 'number',
        correctAnswer: String(xVal),
        hints: [
          'Щоб знайти зменшуване, до різниці додай від\'ємник.',
          `x = ${b} + ${a} = ?`,
        ],
        solution: `x = ${b} + ${a} = ${xVal}`,
        estimatedSec: 25,
      };
    }
    if (op === '×') {
      // a × x = b: на рівнях 4-5 — великі числа (як у контрольній: 49 × x = 1715)
      const aMax = difficulty <= 2 ? 12 : difficulty === 3 ? 20 : difficulty === 4 ? 50 : 99;
      const xMax = difficulty <= 2 ? 15 : difficulty === 3 ? 25 : difficulty === 4 ? 50 : 99;
      const a = randInt(2, aMax);
      const xV = randInt(2, xMax);
      const b = a * xV;
      return {
        id: uid('eq-s-'),
        topicId: 'equations',
        subtopic: 'Прості рівняння',
        difficulty,
        question: `Розв'яжи рівняння: ${a} × x = ${b}`,
        answerType: 'number',
        correctAnswer: String(xV),
        hints: [
          'Щоб знайти невідомий множник, добуток поділи на відомий множник.',
          `x = ${b} ÷ ${a} = ?`,
        ],
        solution: `x = ${b} ÷ ${a} = ${xV}`,
        estimatedSec: difficulty >= 4 ? 60 : 25,
      };
    }
    // ÷
    const aMax = difficulty <= 2 ? 9 : difficulty === 3 ? 12 : difficulty === 4 ? 25 : 50;
    const xMax = difficulty <= 2 ? 15 : difficulty === 3 ? 30 : difficulty === 4 ? 50 : 99;
    const a = randInt(2, aMax);
    const xV = randInt(2, xMax);
    const b = a * xV;
    return {
      id: uid('eq-s-'),
      topicId: 'equations',
      subtopic: 'Прості рівняння',
      difficulty,
      question: `Розв'яжи рівняння: x ÷ ${a} = ${xV}`,
      answerType: 'number',
      correctAnswer: String(b),
      hints: [
        'Щоб знайти ділене, частку помнож на дільник.',
        `x = ${xV} × ${a} = ?`,
      ],
      solution: `x = ${xV} × ${a} = ${b}`,
      estimatedSec: difficulty >= 4 ? 60 : 25,
    };
  },
};

/** Складні рівняння з дужками */
export const equationsBrackets: Generator = {
  topicId: 'equations',
  subtopic: 'Рівняння з дужками',
  generate(difficulty: Difficulty): Task {
    if (difficulty <= 2) {
      // (x + a) × c = b
      const a = randInt(2, 10);
      const c = randInt(2, 5);
      const x = randInt(2, 15);
      const b = (x + a) * c;
      return {
        id: uid('eq-br-'),
        topicId: 'equations',
        subtopic: 'Рівняння з дужками',
        difficulty,
        question: `Розв'яжи рівняння: (x + ${a}) × ${c} = ${b}`,
        answerType: 'number',
        correctAnswer: String(x),
        hints: [
          'Спочатку знайди вираз у дужках: (x + a) = b ÷ c.',
          `(x + ${a}) = ${b} ÷ ${c} = ${b / c}. Тепер x = ${b / c} − ${a} = ?`,
        ],
        solution: `(x + ${a}) = ${b} ÷ ${c} = ${b / c}; x = ${b / c} − ${a} = ${x}`,
        estimatedSec: 45,
      };
    }
    // (x - a) ÷ c = b — конструюємо детерміновано, щоб не потрапляти в рекурсію.
    // Раніше було: випадковий xV у [15..30], і повторна спроба, якщо (xV-a)
    // не ділилось на c націло. Зараз обираємо b, далі xV = b·c + a.
    const a = randInt(2, 10);
    const c = randInt(2, 5);
    const b = randInt(2, 8);
    const xV = b * c + a;
    return {
      id: uid('eq-br-'),
      topicId: 'equations',
      subtopic: 'Рівняння з дужками',
      difficulty,
      question: `Розв'яжи рівняння: (x − ${a}) ÷ ${c} = ${b}`,
      answerType: 'number',
      correctAnswer: String(xV),
      hints: [
        '(x − a) = b × c.',
        `(x − ${a}) = ${b} × ${c} = ${b * c}. Тепер x = ${b * c} + ${a} = ?`,
      ],
      solution: `(x − ${a}) = ${b * c}; x = ${b * c} + ${a} = ${xV}`,
      estimatedSec: 45,
    };
  },
};

/** Текстові рівняння («я задумав число») */
export const equationsWord: Generator = {
  topicId: 'equations',
  subtopic: 'Текстові рівняння',
  generate(difficulty: Difficulty): Task {
    if (difficulty <= 2) {
      const x = randInt(3, 20);
      const a = randInt(5, 30);
      const result = x + a;
      return {
        id: uid('eq-w-'),
        topicId: 'equations',
        subtopic: 'Текстові рівняння',
        difficulty,
        question: `Я задумав число. Якщо до нього додати ${a}, отримаю ${result}. Яке число я задумав?`,
        answerType: 'number',
        correctAnswer: String(x),
        hints: [
          `Запиши рівняння: x + ${a} = ${result}.`,
          `x = ${result} − ${a} = ?`,
        ],
        solution: `x + ${a} = ${result}; x = ${result - a} = ${x}`,
        estimatedSec: 30,
      };
    }
    // 3-5: задумав число, додав, помножив
    const x = randInt(2, 10);
    const a = randInt(2, 15);
    const c = randInt(2, 5);
    const result = (x + a) * c;
    return {
      id: uid('eq-w-'),
      topicId: 'equations',
      subtopic: 'Текстові рівняння',
      difficulty,
      question: `Я задумав число. Якщо до нього додати ${a} і помножити на ${c}, отримаю ${result}. Яке число я задумав?`,
      answerType: 'number',
      correctAnswer: String(x),
      hints: [
        `Запиши рівняння: (x + ${a}) × ${c} = ${result}.`,
        `(x + ${a}) = ${result} ÷ ${c} = ${result / c}. Тепер x = ${result / c} − ${a} = ?`,
      ],
      solution: `(x + ${a}) × ${c} = ${result}; x + ${a} = ${result / c}; x = ${x}`,
      estimatedSec: 60,
    };
  },
};

/**
 * Подвійні нерівності: 12 < x ≤ 15.
 * Відповідь — всі цілі x, що задовольняють обидві нерівності, через кому.
 *
 * checkAnswer самостійно нормалізує списки чисел і порівнює як множини,
 * тож «1, 2, 3», «3 2 1», «1;2;3» — усі приймаються. Тут лишаємо явні
 * `acceptedAnswers` як зворотну сумісність зі старим кодом перевірки.
 */
export const equationsDoubleInequality: Generator = {
  topicId: 'equations',
  subtopic: 'Подвійні нерівності',
  generate(difficulty: Difficulty): Task {
    const max = difficulty <= 2 ? 20 : difficulty === 3 ? 40 : 100;
    const spanMax = difficulty <= 2 ? 4 : difficulty === 3 ? 6 : 8;

    // Бортовий цикл замість рекурсії: спробуємо до 8 раз згенерувати
    // непорожній набір цілих розв'язків. Якщо не вийшло — fallback.
    let lo = 0, hi = 0, leftStrict = false, rightStrict = false;
    const solutions: number[] = [];
    for (let attempt = 0; attempt < 8 && solutions.length === 0; attempt++) {
      lo = randInt(0, max - 4);
      const span = randInt(2, spanMax);
      hi = lo + span;
      leftStrict = randChoice([true, false]);
      rightStrict = randChoice([true, false]);
      const start = leftStrict ? lo + 1 : lo;
      const end = rightStrict ? hi - 1 : hi;
      for (let i = start; i <= end; i++) solutions.push(i);
    }
    if (solutions.length === 0) {
      // Гарантований fallback: 1 ≤ x ≤ 3 → {1,2,3}
      lo = 1; hi = 3; leftStrict = false; rightStrict = false;
      solutions.push(1, 2, 3);
    }

    const leftSign = leftStrict ? '<' : '≤';
    const rightSign = rightStrict ? '<' : '≤';

    const ansComma = solutions.join(', ');
    const accepted = [
      ansComma,
      solutions.join(','),
      solutions.join(' '),
      solutions.join('; '),
      solutions.join(';'),
    ];

    return {
      id: uid('eq-ineq-'),
      topicId: 'equations',
      subtopic: 'Подвійні нерівності',
      difficulty,
      question: `Знайди всі цілі числа x, для яких справджується нерівність: ${lo} ${leftSign} x ${rightSign} ${hi}. (Запиши через кому.)`,
      answerType: 'text',
      correctAnswer: ansComma,
      acceptedAnswers: accepted,
      hints: [
        'Знак < — суворий: число не включається. Знак ≤ — нестрогий: включається.',
        `${lo} ${leftSign} x означає x ${leftStrict ? `≥ ${lo + 1}` : `≥ ${lo}`}; x ${rightSign} ${hi} означає x ${rightStrict ? `≤ ${hi - 1}` : `≤ ${hi}`}.`,
      ],
      solution: `x ∈ {${ansComma}}`,
      estimatedSec: 45,
    };
  },
};

export const equationsGenerators: Generator[] = [
  equationsSimple,
  equationsBrackets,
  equationsWord,
  equationsDoubleInequality,
];

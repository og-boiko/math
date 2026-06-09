import type { Difficulty } from '@/store/profile';
import type { Generator, Task } from '../types';
import { gcd, randChoice, randInt, uid } from '@/lib/random';

/** Знайти дріб від числа: 3/4 від 20 */
export const fractionOfNumber: Generator = {
  topicId: 'fractions',
  subtopic: 'Дріб від числа',
  generate(difficulty: Difficulty): Task {
    const denomsByLevel: Record<Difficulty, number[]> = {
      1: [2, 3, 4, 5],
      2: [3, 4, 5, 6, 8, 10],
      3: [4, 5, 6, 8, 10, 12],
      4: [10, 12, 15, 20, 25],
      5: [15, 20, 25, 50, 100],
    };
    const denom = randChoice(denomsByLevel[difficulty]);
    const numer = randInt(1, Math.min(denom - 1, difficulty <= 2 ? 3 : difficulty - 1));
    const multiplierMax = difficulty <= 2 ? 5 : difficulty === 3 ? 10 : difficulty === 4 ? 30 : 100;
    const multiplier = randInt(2, multiplierMax);
    const total = denom * multiplier;
    const answer = (total / denom) * numer;
    return {
      id: uid('frac-of-'),
      topicId: 'fractions',
      subtopic: 'Дріб від числа',
      difficulty,
      question: `Знайди ${numer}/${denom} від числа ${total}.`,
      answerType: 'number',
      correctAnswer: String(answer),
      hints: [
        `Спочатку знайди 1/${denom} — поділи ${total} на ${denom}.`,
        `${total} ÷ ${denom} = ${total / denom}. Тепер помнож на ${numer}.`,
      ],
      solution: `${numer}/${denom} від ${total} = (${total} ÷ ${denom}) × ${numer} = ${total / denom} × ${numer} = ${answer}`,
      estimatedSec: 25,
    };
  },
};

/** Знайти число за його дробом: 2/5 = 30, знайти ціле */
export const fractionFindWhole: Generator = {
  topicId: 'fractions',
  subtopic: 'Число за його дробом',
  generate(difficulty: Difficulty): Task {
    const denoms = difficulty <= 2 ? [2, 3, 4, 5] : difficulty === 3 ? [3, 4, 5, 6, 8] : [4, 5, 6, 7, 8, 9, 10];
    const denom = randChoice(denoms);
    const numer = randInt(1, denom - 1);
    const onePart = randInt(2, difficulty <= 2 ? 8 : 15);
    const part = onePart * numer;
    const whole = onePart * denom;
    return {
      id: uid('frac-fw-'),
      topicId: 'fractions',
      subtopic: 'Число за його дробом',
      difficulty,
      question: `${numer}/${denom} числа дорівнює ${part}. Знайди це число.`,
      answerType: 'number',
      correctAnswer: String(whole),
      hints: [
        `Спочатку знайди 1/${denom} — поділи ${part} на ${numer}.`,
        `${part} ÷ ${numer} = ${onePart}. Це 1/${denom}. Тепер помнож на ${denom}.`,
      ],
      solution: `(${part} ÷ ${numer}) × ${denom} = ${onePart} × ${denom} = ${whole}`,
      estimatedSec: 25,
    };
  },
};

/** Додавання/віднімання дробів з однаковими знаменниками */
export const fractionSameDenom: Generator = {
  topicId: 'fractions',
  subtopic: 'Дії з однаковими знаменниками',
  generate(difficulty: Difficulty): Task {
    const denom = randChoice([4, 5, 6, 7, 8, 9, 10, 12]);
    const op = difficulty === 1 ? '+' : randChoice(['+', '−']);
    let a: number, b: number;
    if (op === '+') {
      a = randInt(1, denom - 2);
      b = randInt(1, denom - 1 - a);
    } else {
      a = randInt(2, denom - 1);
      b = randInt(1, a - 1);
    }
    const resultNum = op === '+' ? a + b : a - b;
    const g = gcd(resultNum, denom);
    const simplifiedNum = resultNum / g;
    const simplifiedDen = denom / g;
    const correctAnswer =
      simplifiedDen === 1 ? String(simplifiedNum) : `${simplifiedNum}/${simplifiedDen}`;
    return {
      id: uid('frac-sd-'),
      topicId: 'fractions',
      subtopic: 'Дії з однаковими знаменниками',
      difficulty,
      question: `${a}/${denom} ${op} ${b}/${denom} = ?`,
      answerType: 'fraction',
      correctAnswer,
      acceptedAnswers: [
        correctAnswer,
        `${resultNum}/${denom}`, // нескорочений варіант теж приймаємо
      ],
      hints: [
        'Знаменники однакові — додай (або відніми) тільки чисельники, знаменник залиши.',
        `Чисельник: ${a} ${op} ${b} = ${resultNum}. Знаменник: ${denom}.${g > 1 ? ` Скороти на ${g}.` : ''}`,
      ],
      solution:
        g > 1
          ? `${a}/${denom} ${op} ${b}/${denom} = ${resultNum}/${denom} = ${correctAnswer} (скоротили на ${g})`
          : `${a}/${denom} ${op} ${b}/${denom} = ${resultNum}/${denom}${simplifiedDen === 1 ? ` = ${correctAnswer}` : ''}`,
      estimatedSec: 20,
    };
  },
};

/** Порівняння дробів */
export const fractionCompare: Generator = {
  topicId: 'fractions',
  subtopic: 'Порівняння дробів',
  generate(difficulty: Difficulty): Task {
    let a: [number, number], b: [number, number];
    if (difficulty <= 2) {
      // однаковий знаменник
      const d = randChoice([4, 5, 6, 8, 10]);
      const n1 = randInt(1, d - 1);
      let n2 = randInt(1, d - 1);
      while (n2 === n1) n2 = randInt(1, d - 1);
      a = [n1, d];
      b = [n2, d];
    } else if (difficulty === 3) {
      // однаковий чисельник
      const n = randInt(1, 4);
      const d1 = randInt(n + 1, 10);
      let d2 = randInt(n + 1, 10);
      while (d2 === d1) d2 = randInt(n + 1, 10);
      a = [n, d1];
      b = [n, d2];
    } else {
      // дріб vs 1
      const d = randChoice([3, 4, 5, 6, 8]);
      const n = randChoice([randInt(1, d - 1), randInt(d + 1, d + 5)]);
      a = [n, d];
      b = [1, 1];
    }
    const va = a[0] / a[1];
    const vb = b[0] / b[1];
    const sign = va < vb ? '<' : va > vb ? '>' : '=';
    const aStr = a[1] === 1 ? String(a[0]) : `${a[0]}/${a[1]}`;
    const bStr = b[1] === 1 ? String(b[0]) : `${b[0]}/${b[1]}`;
    return {
      id: uid('frac-cmp-'),
      topicId: 'fractions',
      subtopic: 'Порівняння дробів',
      difficulty,
      question: `Постав знак (<, > або =): ${aStr} ___ ${bStr}`,
      answerType: 'choice',
      correctAnswer: sign,
      options: ['<', '>', '='],
      hints: [
        difficulty <= 2
          ? 'При однакових знаменниках більший той дріб, у якого більший чисельник.'
          : difficulty === 3
            ? 'При однакових чисельниках більший той дріб, у якого менший знаменник.'
            : 'Дріб менший за 1, якщо чисельник менший за знаменник.',
        `${aStr} ≈ ${va.toFixed(2).replace('.', ',')}, ${bStr} = ${vb.toFixed(2).replace('.', ',')}.`,
      ],
      solution: `${aStr} ${sign} ${bStr}`,
      estimatedSec: 15,
    };
  },
};

export const fractionGenerators: Generator[] = [
  fractionOfNumber,
  fractionFindWhole,
  fractionSameDenom,
  fractionCompare,
];

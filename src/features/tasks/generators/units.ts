import type { Difficulty } from '@/store/profile';
import type { Generator, Task } from '../types';
import { randChoice, randInt, uid } from '@/lib/random';

/** Довжина */
export const unitsLength: Generator = {
  topicId: 'units',
  subtopic: 'Одиниці довжини',
  generate(difficulty: Difficulty): Task {
    type Pair = {
      from: string;
      to: string;
      multiplier: number;
      maxValue: number;
    };
    const pairs: Record<Difficulty, Pair[]> = {
      1: [
        { from: 'м', to: 'см', multiplier: 100, maxValue: 9 },
        { from: 'см', to: 'мм', multiplier: 10, maxValue: 9 },
      ],
      2: [
        { from: 'км', to: 'м', multiplier: 1000, maxValue: 9 },
        { from: 'м', to: 'см', multiplier: 100, maxValue: 50 },
      ],
      3: [
        { from: 'км', to: 'м', multiplier: 1000, maxValue: 50 },
        { from: 'дм', to: 'мм', multiplier: 100, maxValue: 30 },
      ],
      4: [
        { from: 'км', to: 'см', multiplier: 100000, maxValue: 5 },
        { from: 'м', to: 'мм', multiplier: 1000, maxValue: 9 },
      ],
      5: [
        { from: 'км', to: 'мм', multiplier: 1000000, maxValue: 3 },
      ],
    };
    const pair = randChoice(pairs[difficulty]);
    const value = randInt(2, pair.maxValue);
    const result = value * pair.multiplier;
    return {
      id: uid('units-len-'),
      topicId: 'units',
      subtopic: 'Одиниці довжини',
      difficulty,
      question: `Перетвори: ${value} ${pair.from} = ? ${pair.to}`,
      answerType: 'number',
      correctAnswer: String(result),
      hints: [
        `1 ${pair.from} = ${pair.multiplier} ${pair.to}.`,
        `Помнож: ${value} × ${pair.multiplier} = ?`,
      ],
      solution: `${value} ${pair.from} = ${value} × ${pair.multiplier} = ${result} ${pair.to}`,
      estimatedSec: 20,
    };
  },
};

/** Маса */
export const unitsMass: Generator = {
  topicId: 'units',
  subtopic: 'Одиниці маси',
  generate(difficulty: Difficulty): Task {
    type Pair = { from: string; to: string; multiplier: number; maxValue: number };
    const pairs: Pair[] = [
      { from: 'кг', to: 'г', multiplier: 1000, maxValue: 9 },
      { from: 'т', to: 'кг', multiplier: 1000, maxValue: 9 },
      { from: 'ц', to: 'кг', multiplier: 100, maxValue: 9 },
      { from: 'т', to: 'ц', multiplier: 10, maxValue: 9 },
    ];
    const pair = randChoice(difficulty <= 2 ? pairs.slice(0, 2) : pairs);
    const value = randInt(2, pair.maxValue);
    const result = value * pair.multiplier;
    return {
      id: uid('units-mass-'),
      topicId: 'units',
      subtopic: 'Одиниці маси',
      difficulty,
      question: `Перетвори: ${value} ${pair.from} = ? ${pair.to}`,
      answerType: 'number',
      correctAnswer: String(result),
      hints: [
        `1 ${pair.from} = ${pair.multiplier} ${pair.to}.`,
        `${value} × ${pair.multiplier} = ?`,
      ],
      solution: `${value} ${pair.from} = ${result} ${pair.to}`,
      estimatedSec: 20,
    };
  },
};

/** Час */
export const unitsTime: Generator = {
  topicId: 'units',
  subtopic: 'Одиниці часу',
  generate(difficulty: Difficulty): Task {
    if (difficulty <= 2) {
      type Pair = { from: string; to: string; multiplier: number; maxValue: number };
      const pairs: Pair[] = [
        { from: 'год', to: 'хв', multiplier: 60, maxValue: 9 },
        { from: 'хв', to: 'с', multiplier: 60, maxValue: 9 },
        { from: 'доба', to: 'год', multiplier: 24, maxValue: 5 },
      ];
      const pair = randChoice(pairs);
      const value = randInt(2, pair.maxValue);
      const result = value * pair.multiplier;
      return {
        id: uid('units-time-'),
        topicId: 'units',
        subtopic: 'Одиниці часу',
        difficulty,
        question: `Перетвори: ${value} ${pair.from} = ? ${pair.to}`,
        answerType: 'number',
        correctAnswer: String(result),
        hints: [`1 ${pair.from} = ${pair.multiplier} ${pair.to}.`, `${value} × ${pair.multiplier} = ?`],
        solution: `${value} ${pair.from} = ${result} ${pair.to}`,
        estimatedSec: 20,
      };
    }
    if (difficulty === 3) {
      // 2 год 30 хв = ? хв
      const h = randInt(1, 5);
      const m = randInt(10, 50);
      const total = h * 60 + m;
      return {
        id: uid('units-time-'),
        topicId: 'units',
        subtopic: 'Одиниці часу',
        difficulty,
        question: `Перетвори: ${h} год ${m} хв = ? хв`,
        answerType: 'number',
        correctAnswer: String(total),
        hints: [
          'Спочатку переведи години у хвилини, потім додай решту хвилин.',
          `${h} × 60 = ${h * 60}. ${h * 60} + ${m} = ?`,
        ],
        solution: `${h} × 60 + ${m} = ${h * 60} + ${m} = ${total} (хв)`,
        estimatedSec: 30,
      };
    }
    if (difficulty === 4) {
      // о котрій годині
      const startH = randInt(7, 14);
      const startM = randInt(0, 50);
      const durH = randInt(1, 4);
      const durM = randInt(10, 50);
      const totalMin = startH * 60 + startM + durH * 60 + durM;
      const endH = Math.floor(totalMin / 60) % 24;
      const endM = totalMin % 60;
      const fmt = (h: number, m: number) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      return {
        id: uid('units-time-'),
        topicId: 'units',
        subtopic: 'Одиниці часу',
        difficulty,
        question: `Поїзд вирушив о ${fmt(startH, startM)}. Дорога зайняла ${durH} год ${durM} хв. О котрій годині він прибув? (формат ГГ:ХХ)`,
        answerType: 'text',
        correctAnswer: fmt(endH, endM),
        acceptedAnswers: [fmt(endH, endM), `${endH}:${String(endM).padStart(2, '0')}`],
        hints: [
          'Додай години до годин, хвилини до хвилин.',
          `${startH}:${String(startM).padStart(2, '0')} + ${durH} год ${durM} хв = ?`,
        ],
        solution: `Прибуття: ${fmt(endH, endM)}`,
        estimatedSec: 45,
      };
    }
    // 5: Скільки секунд у двох годинах і 15 хвилинах?
    const h = randInt(1, 3);
    const m = randInt(5, 45);
    const total = h * 3600 + m * 60;
    return {
      id: uid('units-time-'),
      topicId: 'units',
      subtopic: 'Одиниці часу',
      difficulty,
      question: `Скільки секунд у ${h} год ${m} хв?`,
      answerType: 'number',
      correctAnswer: String(total),
      hints: [
        '1 год = 3600 с, 1 хв = 60 с.',
        `${h} × 3600 = ${h * 3600}; ${m} × 60 = ${m * 60}; додай.`,
      ],
      solution: `${h} × 3600 + ${m} × 60 = ${h * 3600} + ${m * 60} = ${total} (с)`,
      estimatedSec: 45,
    };
  },
};

/**
 * Дії над складеними іменованими числами:
 * 17 м 47 см · 3 = 52 м 41 см
 * 5 кг 300 г + 2 кг 800 г = 8 кг 100 г
 * 6 год 25 хв − 2 год 40 хв = 3 год 45 хв
 */
export const unitsArithmetic: Generator = {
  topicId: 'units',
  subtopic: 'Дії з іменованими числами',
  generate(difficulty: Difficulty): Task {
    type Spec = {
      big: string; // більша одиниця: м, кг, год
      small: string; // менша: см, г, хв
      smallPerBig: number; // 100, 1000, 60
    };
    const specs: Spec[] = [
      { big: 'м', small: 'см', smallPerBig: 100 },
      { big: 'кг', small: 'г', smallPerBig: 1000 },
      { big: 'год', small: 'хв', smallPerBig: 60 },
      { big: 'м', small: 'дм', smallPerBig: 10 },
    ];
    const spec = randChoice(specs);

    // Тип операції
    const ops = difficulty <= 2 ? ['+'] : difficulty === 3 ? ['+', '−'] : ['+', '−', '×'];
    const op = randChoice(ops);

    if (op === '+' || op === '−') {
      // Складене 1 + Складене 2
      const big1 = randInt(2, difficulty <= 2 ? 8 : 20);
      const small1 = randInt(spec.smallPerBig / 4, spec.smallPerBig - 1);
      const big2 = randInt(2, difficulty <= 2 ? 8 : 20);
      const small2 = randInt(spec.smallPerBig / 4, spec.smallPerBig - 1);

      const total1 = big1 * spec.smallPerBig + small1;
      const total2 = big2 * spec.smallPerBig + small2;

      let result: number;
      let a1 = big1, s1 = small1, a2 = big2, s2 = small2;

      if (op === '+') {
        result = total1 + total2;
      } else {
        // гарантуємо a > b
        if (total1 >= total2) {
          result = total1 - total2;
        } else {
          result = total2 - total1;
          [a1, s1, a2, s2] = [big2, small2, big1, small1];
        }
      }

      const resBig = Math.floor(result / spec.smallPerBig);
      const resSmall = result % spec.smallPerBig;

      const fmt = (b: number, s: number) => `${b} ${spec.big} ${s} ${spec.small}`;
      const ansFull = `${resBig} ${spec.big} ${resSmall} ${spec.small}`;
      const ansShort = `${resBig}${spec.big}${resSmall}${spec.small}`;

      return {
        id: uid('units-arith-'),
        topicId: 'units',
        subtopic: 'Дії з іменованими числами',
        difficulty,
        question: `${fmt(a1, s1)} ${op} ${fmt(a2, s2)} = ?`,
        answerType: 'text',
        correctAnswer: ansFull,
        acceptedAnswers: [
          ansFull,
          ansShort,
          `${resBig}${spec.big} ${resSmall}${spec.small}`,
          `${resBig} ${spec.big}${resSmall} ${spec.small}`,
        ],
        hints: [
          op === '+'
            ? `Спочатку додай дрібніші одиниці (${spec.small}). Якщо вийшло ≥ ${spec.smallPerBig} — переведи у ${spec.big}.`
            : `Спочатку відніми дрібніші одиниці (${spec.small}). Якщо не вистачає — позич у ${spec.big}.`,
          op === '+'
            ? `${s1} + ${s2} = ${s1 + s2} ${spec.small}` +
              (s1 + s2 >= spec.smallPerBig
                ? `, це ${Math.floor((s1 + s2) / spec.smallPerBig)} ${spec.big} ${(s1 + s2) % spec.smallPerBig} ${spec.small}.`
                : '.')
            : s1 >= s2
              ? `${s1} − ${s2} = ${s1 - s2} ${spec.small}.`
              : `${s1} ${spec.small} замало, тому позичаємо: ${s1 + spec.smallPerBig} − ${s2} = ${s1 + spec.smallPerBig - s2} ${spec.small}, а ${a1} стає ${a1 - 1}.`,
        ],
        solution: `${fmt(a1, s1)} ${op} ${fmt(a2, s2)} = ${ansFull}`,
        estimatedSec: 60,
      };
    }

    // Множення на число
    const big = randInt(2, difficulty <= 3 ? 12 : 30);
    const small = randInt(spec.smallPerBig / 5, spec.smallPerBig - 1);
    const k = randInt(2, difficulty <= 3 ? 5 : 9);

    const total = big * spec.smallPerBig + small;
    const result = total * k;
    const resBig = Math.floor(result / spec.smallPerBig);
    const resSmall = result % spec.smallPerBig;

    const ansFull = `${resBig} ${spec.big} ${resSmall} ${spec.small}`;
    const ansShort = `${resBig}${spec.big}${resSmall}${spec.small}`;

    return {
      id: uid('units-arith-'),
      topicId: 'units',
      subtopic: 'Дії з іменованими числами',
      difficulty,
      question: `${big} ${spec.big} ${small} ${spec.small} × ${k} = ?`,
      answerType: 'text',
      correctAnswer: ansFull,
      acceptedAnswers: [
        ansFull,
        ansShort,
        `${resBig}${spec.big} ${resSmall}${spec.small}`,
      ],
      hints: [
        `Помнож кожну одиницю окремо: ${big} ${spec.big} × ${k} і ${small} ${spec.small} × ${k}.`,
        `${big} × ${k} = ${big * k} ${spec.big}; ${small} × ${k} = ${small * k} ${spec.small}.${
          small * k >= spec.smallPerBig
            ? ` ${small * k} ${spec.small} = ${Math.floor((small * k) / spec.smallPerBig)} ${spec.big} ${(small * k) % spec.smallPerBig} ${spec.small}, додай.`
            : ''
        }`,
      ],
      solution: `${big} ${spec.big} ${small} ${spec.small} × ${k} = ${ansFull}`,
      estimatedSec: 60,
    };
  },
};

export const unitsGenerators: Generator[] = [unitsLength, unitsMass, unitsTime, unitsArithmetic];
import type { Difficulty } from '@/store/profile';
import type { Generator, Task } from '../types';
import { randChoice, randInt, uid } from '@/lib/random';

/** Периметр */
export const geometryPerimeter: Generator = {
  topicId: 'geometry',
  subtopic: 'Периметр',
  generate(difficulty: Difficulty): Task {
    if (difficulty === 1) {
      const a = randInt(3, 20);
      return {
        id: uid('geo-per-'),
        topicId: 'geometry',
        subtopic: 'Периметр',
        difficulty,
        question: `Знайди периметр квадрата зі стороною ${a} см.`,
        answerType: 'number',
        correctAnswer: String(4 * a),
        hints: ['Периметр квадрата = 4 × сторона.', `4 × ${a} = ?`],
        solution: `P = 4 × ${a} = ${4 * a} (см)`,
        estimatedSec: 20,
      };
    }
    if (difficulty === 2) {
      const a = randInt(3, 30);
      const b = randInt(3, 30);
      return {
        id: uid('geo-per-'),
        topicId: 'geometry',
        subtopic: 'Периметр',
        difficulty,
        question: `Знайди периметр прямокутника зі сторонами ${a} см і ${b} см.`,
        answerType: 'number',
        correctAnswer: String(2 * (a + b)),
        hints: ['Периметр прямокутника = 2 × (a + b).', `2 × (${a} + ${b}) = 2 × ${a + b} = ?`],
        solution: `P = 2 × (${a} + ${b}) = 2 × ${a + b} = ${2 * (a + b)} (см)`,
        estimatedSec: 25,
      };
    }
    if (difficulty === 3) {
      const a = randInt(5, 30);
      const b = randInt(5, 30);
      const c = randInt(Math.max(2, Math.abs(a - b) + 1), a + b - 1);
      return {
        id: uid('geo-per-'),
        topicId: 'geometry',
        subtopic: 'Периметр',
        difficulty,
        question: `Знайди периметр трикутника зі сторонами ${a} см, ${b} см і ${c} см.`,
        answerType: 'number',
        correctAnswer: String(a + b + c),
        hints: ['Периметр трикутника = сума всіх трьох сторін.', `${a} + ${b} + ${c} = ?`],
        solution: `P = ${a} + ${b} + ${c} = ${a + b + c} (см)`,
        estimatedSec: 25,
      };
    }
    if (difficulty === 4) {
      // 5-кутник
      const sides = Array.from({ length: 5 }, () => randInt(3, 20));
      const sum = sides.reduce((s, n) => s + n, 0);
      return {
        id: uid('geo-per-'),
        topicId: 'geometry',
        subtopic: 'Периметр',
        difficulty,
        question: `Знайди периметр п'ятикутника зі сторонами ${sides.join(', ')} см.`,
        answerType: 'number',
        correctAnswer: String(sum),
        hints: ['Додай довжини всіх сторін.', `${sides.join(' + ')} = ?`],
        solution: `P = ${sides.join(' + ')} = ${sum} (см)`,
        estimatedSec: 30,
      };
    }
    // 5: знайти сторону за периметром
    const a = randInt(5, 25);
    const p = 4 * a;
    return {
      id: uid('geo-per-'),
      topicId: 'geometry',
      subtopic: 'Периметр',
      difficulty,
      question: `Периметр квадрата дорівнює ${p} см. Знайди довжину його сторони.`,
      answerType: 'number',
      correctAnswer: String(a),
      hints: ['Сторона квадрата = периметр ÷ 4.', `${p} ÷ 4 = ?`],
      solution: `сторона = P ÷ 4 = ${p} ÷ 4 = ${a} (см)`,
      estimatedSec: 25,
    };
  },
};

/** Площа */
export const geometryArea: Generator = {
  topicId: 'geometry',
  subtopic: 'Площа',
  generate(difficulty: Difficulty): Task {
    if (difficulty === 1) {
      const a = randInt(2, 12);
      return {
        id: uid('geo-area-'),
        topicId: 'geometry',
        subtopic: 'Площа',
        difficulty,
        question: `Знайди площу квадрата зі стороною ${a} см.`,
        answerType: 'number',
        correctAnswer: String(a * a),
        hints: ['Площа квадрата = сторона × сторона.', `${a} × ${a} = ?`],
        solution: `S = ${a} × ${a} = ${a * a} (см²)`,
        estimatedSec: 20,
      };
    }
    if (difficulty === 2) {
      const a = randInt(3, 15);
      const b = randInt(3, 15);
      return {
        id: uid('geo-area-'),
        topicId: 'geometry',
        subtopic: 'Площа',
        difficulty,
        question: `Знайди площу прямокутника зі сторонами ${a} см і ${b} см.`,
        answerType: 'number',
        correctAnswer: String(a * b),
        hints: ['Площа прямокутника = a × b.', `${a} × ${b} = ?`],
        solution: `S = ${a} × ${b} = ${a * b} (см²)`,
        estimatedSec: 20,
      };
    }
    if (difficulty === 3) {
      // знайти сторону за площею
      const a = randInt(2, 12);
      const s = a * a;
      return {
        id: uid('geo-area-'),
        topicId: 'geometry',
        subtopic: 'Площа',
        difficulty,
        question: `Площа квадрата дорівнює ${s} см². Знайди довжину його сторони.`,
        answerType: 'number',
        correctAnswer: String(a),
        hints: [
          'Тобі треба знайти таке число, що помножене саме на себе дає вказану площу.',
          `Яке число × саме на себе = ${s}?`,
        ],
        solution: `сторона = ${a} см, бо ${a} × ${a} = ${s}`,
        estimatedSec: 25,
      };
    }
    if (difficulty === 4) {
      // L-подібна фігура: великий прямокутник мінус малий
      const A = randInt(8, 20);
      const B = randInt(8, 15);
      const a = randInt(2, A - 2);
      const b = randInt(2, B - 2);
      const result = A * B - a * b;
      return {
        id: uid('geo-area-'),
        topicId: 'geometry',
        subtopic: 'Площа',
        difficulty,
        question: `Знайди площу Г-подібної фігури: великий прямокутник ${A}×${B} см, з якого вирізали кутовий прямокутник ${a}×${b} см.`,
        answerType: 'number',
        correctAnswer: String(result),
        hints: [
          'Площа фігури = площа великого прямокутника − площа вирізаного.',
          `${A} × ${B} = ${A * B}; ${a} × ${b} = ${a * b}; ${A * B} − ${a * b} = ?`,
        ],
        solution: `S = ${A} × ${B} − ${a} × ${b} = ${A * B} − ${a * b} = ${result} (см²)`,
        estimatedSec: 45,
      };
    }
    // 5: задача на ремонт
    const length = randInt(4, 10);
    const width = randInt(3, 8);
    const tileArea = randChoice([1, 4]); // 1м² або 4м²
    const tilesNeeded = Math.ceil((length * width) / tileArea);
    return {
      id: uid('geo-area-'),
      topicId: 'geometry',
      subtopic: 'Площа',
      difficulty,
      question: `Кімната має розміри ${length} м × ${width} м. Скільки потрібно плиток розміром ${tileArea === 1 ? '1 м²' : '2×2 м'}, щоб покрити підлогу?`,
      answerType: 'number',
      correctAnswer: String(tilesNeeded),
      hints: [
        `Спочатку знайди площу підлоги: ${length} × ${width}.`,
        `Потім поділи на площу однієї плитки (${tileArea} м²).`,
      ],
      solution: `Площа = ${length} × ${width} = ${length * width} м²; Плиток = ${length * width} ÷ ${tileArea} = ${tilesNeeded}`,
      estimatedSec: 50,
    };
  },
};

/** Кути */
export const geometryAngles: Generator = {
  topicId: 'geometry',
  subtopic: 'Кути',
  generate(difficulty: Difficulty): Task {
    if (difficulty === 1) {
      const angle = randChoice([
        { value: randInt(10, 89), kind: 'гострий' },
        { value: 90, kind: 'прямий' },
        { value: randInt(91, 179), kind: 'тупий' },
        { value: 180, kind: 'розгорнутий' },
      ]);
      return {
        id: uid('geo-ang-'),
        topicId: 'geometry',
        subtopic: 'Кути',
        difficulty,
        question: `Кут має ${angle.value}°. Який це кут?`,
        answerType: 'choice',
        correctAnswer: angle.kind,
        options: ['гострий', 'прямий', 'тупий', 'розгорнутий'],
        hints: [
          'Гострий < 90°, прямий = 90°, тупий 90°–180°, розгорнутий = 180°.',
          `${angle.value}° порівняй з 90° і 180°.`,
        ],
        solution: `${angle.value}° — ${angle.kind} кут`,
        estimatedSec: 15,
      };
    }
    if (difficulty === 2 || difficulty === 3) {
      // сума кутів на прямій
      const a = randInt(20, 160);
      const b = 180 - a;
      return {
        id: uid('geo-ang-'),
        topicId: 'geometry',
        subtopic: 'Кути',
        difficulty,
        question: `Два суміжні кути на прямій. Один з них ${a}°. Знайди другий.`,
        answerType: 'number',
        correctAnswer: String(b),
        hints: ['Сума суміжних кутів дорівнює 180°.', `180 − ${a} = ?`],
        solution: `180° − ${a}° = ${b}°`,
        estimatedSec: 20,
      };
    }
    if (difficulty === 4) {
      // Сума кутів трикутника. Підбираємо a і b так, щоб c = 180 − a − b
      // попав у [10..120]. Робимо це детерміновано: спочатку обираємо c,
      // потім a у безпечному діапазоні, b = 180 − a − c. Без рекурсії.
      const c = randInt(20, 110);
      const aMin = Math.max(20, 180 - c - 120);
      const aMax = Math.min(120, 180 - c - 20);
      const a = randInt(aMin, aMax);
      const b = 180 - a - c;
      return {
        id: uid('geo-ang-'),
        topicId: 'geometry',
        subtopic: 'Кути',
        difficulty,
        question: `У трикутнику два кути дорівнюють ${a}° і ${b}°. Знайди третій кут.`,
        answerType: 'number',
        correctAnswer: String(c),
        hints: ['Сума кутів трикутника = 180°.', `180 − ${a} − ${b} = ?`],
        solution: `180° − ${a}° − ${b}° = ${c}°`,
        estimatedSec: 25,
      };
    }
    // 5: рівнобедрений. Щоб основа була цілою, (180 − apex) має бути парним.
    // Обираємо apex з кроком 2 — гарантовано ціле, без рекурсії.
    const apex = randInt(10, 70) * 2; // 20..140, парне
    const base = (180 - apex) / 2;
    return {
      id: uid('geo-ang-'),
      topicId: 'geometry',
      subtopic: 'Кути',
      difficulty,
      question: `У рівнобедреному трикутнику кут між боковими сторонами дорівнює ${apex}°. Знайди кут при основі.`,
      answerType: 'number',
      correctAnswer: String(base),
      hints: [
        'Сума кутів трикутника = 180°. У рівнобедреному кути при основі рівні.',
        `(180 − ${apex}) ÷ 2 = ?`,
      ],
      solution: `(180° − ${apex}°) ÷ 2 = ${180 - apex}° ÷ 2 = ${base}°`,
      estimatedSec: 35,
    };
  },
};

/**
 * Обернена задача на площу прямокутника:
 * «Площа = 28 см², довжина = 7 см. Знайди ширину.»
 */
export const geometryRectangleSide: Generator = {
  topicId: 'geometry',
  subtopic: 'Сторона прямокутника',
  generate(difficulty: Difficulty): Task {
    const a = randInt(2, difficulty <= 2 ? 9 : 15);
    const b = randInt(2, difficulty <= 2 ? 12 : 25);
    const s = a * b;
    const known = randChoice([a, b]);
    const unknown = known === a ? b : a;
    return {
      id: uid('geo-rect-'),
      topicId: 'geometry',
      subtopic: 'Сторона прямокутника',
      difficulty,
      question: `Площа прямокутника дорівнює ${s} см², а одна зі сторін — ${known} см. Знайди другу сторону.`,
      answerType: 'number',
      correctAnswer: String(unknown),
      hints: [
        'Площа прямокутника = довжина × ширина. Якщо відомі площа і одна сторона — поділи площу на цю сторону.',
        `${s} ÷ ${known} = ?`,
      ],
      solution: `друга сторона = ${s} ÷ ${known} = ${unknown} см`,
      estimatedSec: 30,
    };
  },
};

/**
 * «Знайди розміри іншого прямокутника з тією ж площею.»
 * Дитина має дати ПАРУ a×b ≠ заданій, з a·b = S.
 */
export const geometryRectangleSameArea: Generator = {
  topicId: 'geometry',
  subtopic: 'Прямокутники з однаковою площею',
  generate(difficulty: Difficulty): Task {
    // Числа з багатьма дільниками
    const candidates = [
      12, 18, 20, 24, 28, 30, 36, 40, 42, 48, 54, 56, 60, 64, 72,
      80, 84, 90, 96, 100, 120,
    ];
    const pool =
      difficulty <= 2 ? candidates.slice(0, 8) : difficulty === 3 ? candidates.slice(4, 14) : candidates;

    // Шукаємо число з ≥ 2 парами дільників (a ≤ b). Усі числа в `candidates`
    // підібрані так, що вони складені, тому така пара завжди знайдеться.
    // Робимо до 8 спроб — і fallback на гарантовано робочий 12 = 2×6 = 3×4.
    let s = 12;
    let pairs: Array<[number, number]> = [];
    for (let attempt = 0; attempt < 8; attempt++) {
      const candidate = randChoice(pool);
      const cp: Array<[number, number]> = [];
      for (let i = 1; i * i <= candidate; i++) {
        if (candidate % i === 0) cp.push([i, candidate / i]);
      }
      if (cp.length >= 2) {
        s = candidate;
        pairs = cp;
        break;
      }
    }
    if (pairs.length < 2) {
      s = 12;
      pairs = [[1, 12], [2, 6], [3, 4]];
    }

    // Один варіант показуємо в умові, інші — приймаємо як відповідь
    const given = pairs[Math.floor(pairs.length / 2)];
    const otherPairs = pairs.filter(([x, y]) => !(x === given[0] && y === given[1]));

    const accepted: string[] = [];
    for (const [x, y] of otherPairs) {
      // Приймаємо різні формати: "2x14", "2 × 14", "2*14", "14x2"
      accepted.push(`${x}x${y}`, `${x}×${y}`, `${x}*${y}`, `${x} x ${y}`, `${x} × ${y}`);
      accepted.push(`${y}x${x}`, `${y}×${x}`, `${y}*${x}`, `${y} x ${x}`, `${y} × ${x}`);
      // "2 і 14"
      accepted.push(`${x} і ${y}`, `${y} і ${x}`);
    }

    const example = otherPairs[0];

    return {
      id: uid('geo-same-'),
      topicId: 'geometry',
      subtopic: 'Прямокутники з однаковою площею',
      difficulty,
      question: `Прямокутник має площу ${s} см² зі сторонами ${given[0]} см і ${given[1]} см. Знайди розміри іншого прямокутника з такою ж площею. (формат: 2×14)`,
      answerType: 'text',
      correctAnswer: `${example[0]}×${example[1]}`,
      acceptedAnswers: accepted,
      hints: [
        `Тобі треба знайти таку пару чисел a і b, щоб a × b = ${s}, але a ≠ ${given[0]} і a ≠ ${given[1]}.`,
        `Подумай про дільники числа ${s}. Наприклад, ${s} = ${otherPairs[0][0]} × ${otherPairs[0][1]}.`,
      ],
      solution: `Можливі варіанти: ${otherPairs.map(([x, y]) => `${x}×${y}`).join(', ')}.`,
      estimatedSec: 60,
    };
  },
};

/**
 * Об'єм прямокутного паралелепіпеда: V = a × b × c.
 * Рівні 1-2 — прямі задачі з невеликими числами;
 * 3 — середні (коробка);
 * 4 — обернена (знайти висоту за об'ємом і двома сторонами);
 * 5 — куб (знайти ребро за об'ємом).
 */
export const geometryVolume: Generator = {
  topicId: 'geometry',
  subtopic: "Об'єм паралелепіпеда",
  generate(difficulty: Difficulty): Task {
    if (difficulty <= 2) {
      const maxSide = difficulty === 1 ? 6 : 9;
      const a = randInt(2, maxSide);
      const b = randInt(2, maxSide);
      const c = randInt(2, maxSide);
      const v = a * b * c;
      return {
        id: uid('geo-vol-'),
        topicId: 'geometry',
        subtopic: "Об'єм паралелепіпеда",
        difficulty,
        question: `Знайди об'єм прямокутного паралелепіпеда: довжина ${a} см, ширина ${b} см, висота ${c} см.`,
        answerType: 'number',
        correctAnswer: String(v),
        hints: [
          "Об'єм прямокутного паралелепіпеда: V = a × b × c (довжина · ширина · висота).",
          `${a} × ${b} = ${a * b}; ${a * b} × ${c} = ?`,
        ],
        solution: `V = ${a} × ${b} × ${c} = ${a * b} × ${c} = ${v} (см³)`,
        estimatedSec: 30,
      };
    }
    if (difficulty === 3) {
      const a = randInt(4, 12);
      const b = randInt(4, 12);
      const c = randInt(4, 12);
      const v = a * b * c;
      return {
        id: uid('geo-vol-'),
        topicId: 'geometry',
        subtopic: "Об'єм паралелепіпеда",
        difficulty,
        question: `Знайди об'єм коробки розмірами ${a} × ${b} × ${c} см.`,
        answerType: 'number',
        correctAnswer: String(v),
        hints: ['V = a × b × c.', `${a} × ${b} = ${a * b}; ${a * b} × ${c} = ?`],
        solution: `V = ${a} × ${b} × ${c} = ${v} (см³)`,
        estimatedSec: 35,
      };
    }
    if (difficulty === 4) {
      // Обернена: дано V, a, b — знайти c
      const a = randInt(3, 10);
      const b = randInt(3, 10);
      const c = randInt(3, 12);
      const v = a * b * c;
      return {
        id: uid('geo-vol-'),
        topicId: 'geometry',
        subtopic: "Об'єм паралелепіпеда",
        difficulty,
        question: `Об'єм прямокутного паралелепіпеда — ${v} см³. Довжина — ${a} см, ширина — ${b} см. Знайди висоту.`,
        answerType: 'number',
        correctAnswer: String(c),
        hints: [
          'V = a × b × h, отже h = V ÷ (a × b).',
          `${a} × ${b} = ${a * b}; ${v} ÷ ${a * b} = ?`,
        ],
        solution: `h = V ÷ (a × b) = ${v} ÷ ${a * b} = ${c} (см)`,
        estimatedSec: 45,
      };
    }
    // 5: куб — знайти ребро за об'ємом
    const a = randInt(2, 10);
    const v = a ** 3;
    return {
      id: uid('geo-vol-'),
      topicId: 'geometry',
      subtopic: "Об'єм паралелепіпеда",
      difficulty,
      question: `Об'єм куба — ${v} см³. Знайди довжину ребра.`,
      answerType: 'number',
      correctAnswer: String(a),
      hints: [
        "Об'єм куба: V = a × a × a = a³. Тобі треба знайти таке a, що a × a × a = V.",
        `Спробуй: ${Math.max(1, a - 1)}³ = ${Math.max(1, a - 1) ** 3}, ${a}³ = ${a ** 3}, ${a + 1}³ = ${(a + 1) ** 3}.`,
      ],
      solution: `a = ${a} см, бо ${a} × ${a} × ${a} = ${v}`,
      estimatedSec: 45,
    };
  },
};

export const geometryGenerators: Generator[] = [
  geometryPerimeter,
  geometryArea,
  geometryAngles,
  geometryRectangleSide,
  geometryRectangleSameArea,
  geometryVolume,
];
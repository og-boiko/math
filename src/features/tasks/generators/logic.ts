import type { Difficulty } from '@/store/profile';
import type { Generator, Task } from '../types';
import { randChoice, randInt, shuffle, uid } from '@/lib/random';

/** Послідовності */
export const logicSequences: Generator = {
  topicId: 'logic',
  subtopic: 'Послідовності',
  generate(difficulty: Difficulty): Task {
    const type = difficulty <= 2
      ? randChoice(['arith', 'mul'])
      : difficulty === 3
        ? randChoice(['arith', 'mul', 'square'])
        : randChoice(['mul', 'fib', 'square']);

    if (type === 'arith') {
      const start = randInt(1, 10);
      const step = randInt(2, 7);
      const seq = Array.from({ length: 5 }, (_, i) => start + i * step);
      const next = start + 5 * step;
      return {
        id: uid('logic-seq-'),
        topicId: 'logic',
        subtopic: 'Послідовності',
        difficulty,
        question: `Знайди наступне число: ${seq.join(', ')}, ?`,
        answerType: 'number',
        correctAnswer: String(next),
        hints: [
          'Подивись, на скільки збільшується (або зменшується) кожне наступне число.',
          `${seq[1]} − ${seq[0]} = ${step}. Кожне число більше на ${step}.`,
        ],
        solution: `Крок = ${step}. Наступне: ${seq[4]} + ${step} = ${next}`,
        estimatedSec: 30,
      };
    }
    if (type === 'mul') {
      const start = randInt(1, 4);
      const factor = randInt(2, 3);
      const seq = Array.from({ length: 4 }, (_, i) => start * Math.pow(factor, i));
      const next = start * Math.pow(factor, 4);
      return {
        id: uid('logic-seq-'),
        topicId: 'logic',
        subtopic: 'Послідовності',
        difficulty,
        question: `Знайди наступне число: ${seq.join(', ')}, ?`,
        answerType: 'number',
        correctAnswer: String(next),
        hints: [
          'Кожне наступне число — у скільки разів більше за попереднє?',
          `${seq[1]} ÷ ${seq[0]} = ${factor}. Помнож на ${factor}.`,
        ],
        solution: `Множник = ${factor}. Наступне: ${seq[3]} × ${factor} = ${next}`,
        estimatedSec: 30,
      };
    }
    if (type === 'square') {
      const seq = [1, 4, 9, 16, 25];
      return {
        id: uid('logic-seq-'),
        topicId: 'logic',
        subtopic: 'Послідовності',
        difficulty,
        question: `Знайди наступне число: ${seq.join(', ')}, ?`,
        answerType: 'number',
        correctAnswer: '36',
        hints: ['Це квадрати чисел: 1², 2², 3², 4², 5².', '6² = ?'],
        solution: '6² = 36',
        estimatedSec: 30,
      };
    }
    // fib
    return {
      id: uid('logic-seq-'),
      topicId: 'logic',
      subtopic: 'Послідовності',
      difficulty,
      question: `Знайди наступне число: 1, 1, 2, 3, 5, 8, ?`,
      answerType: 'number',
      correctAnswer: '13',
      hints: [
        'Кожне число дорівнює сумі двох попередніх.',
        '5 + 8 = ?',
      ],
      solution: 'Послідовність Фібоначчі: 5 + 8 = 13',
      estimatedSec: 35,
    };
  },
};

/** На вік */
export const logicAge: Generator = {
  topicId: 'logic',
  subtopic: 'Задачі на вік',
  generate(difficulty: Difficulty): Task {
    if (difficulty <= 2) {
      const son = randInt(8, 12);
      const dadDiff = randInt(20, 30);
      const dad = son + dadDiff;
      return {
        id: uid('logic-age-'),
        topicId: 'logic',
        subtopic: 'Задачі на вік',
        difficulty,
        question: `Сину ${son} років, а тато на ${dadDiff} років старший. Скільки років татові?`,
        answerType: 'number',
        correctAnswer: String(dad),
        hints: ['Якщо тато старший на N років — додай.', `${son} + ${dadDiff} = ?`],
        solution: `${son} + ${dadDiff} = ${dad}`,
        estimatedSec: 20,
      };
    }
    if (difficulty === 3) {
      const son = randInt(8, 14);
      const dad = son + randInt(25, 35);
      return {
        id: uid('logic-age-'),
        topicId: 'logic',
        subtopic: 'Задачі на вік',
        difficulty,
        question: `Сину ${son} років, татові ${dad} років. Скільки років було татові, коли син народився?`,
        answerType: 'number',
        correctAnswer: String(dad - son),
        hints: [
          'Коли син народився, татові було стільки років, на скільки тато старший за сина.',
          `${dad} − ${son} = ?`,
        ],
        solution: `${dad} − ${son} = ${dad - son}`,
        estimatedSec: 30,
      };
    }
    // 4-5: коли тато буде в k разів старший
    // Рівняння: dad + x = k · (son + x)  →  x = (dad − k·son) / (k − 1).
    // Підбираємо параметри так, щоб x був цілим невід'ємним (інакше задача
    // не має дитячого розв'язку). Раніше тут була рекурсія+downgrade рівня;
    // тепер — детерміноване конструювання.
    const k = 2;
    // Беремо son так, щоб dad ≥ k·son (тато вже старший за k·son або рівний)
    const son = randInt(5, 12);
    // Хочемо x ≥ 0 (момент у майбутньому) → dad ≥ k·son.
    // Беремо dad = k·son + (k−1)·yearsAhead, де yearsAhead ∈ [3..15] — це і буде відповідь.
    const yearsAhead = randInt(3, 15);
    const dad = k * son + (k - 1) * yearsAhead;
    return {
      id: uid('logic-age-'),
      topicId: 'logic',
      subtopic: 'Задачі на вік',
      difficulty,
      question: `Сину ${son} років, татові ${dad}. Через скільки років тато буде вдвічі старший за сина?`,
      answerType: 'number',
      correctAnswer: String(yearsAhead),
      hints: [
        'Спробуй скласти рівняння: тато + x = 2 × (син + x).',
        `${dad} + x = 2 × (${son} + x) → ${dad} − 2 × ${son} = x → x = ?`,
      ],
      solution: `${dad} − 2 × ${son} = ${dad - 2 * son}, через ${yearsAhead} років`,
      estimatedSec: 60,
    };
  },
};

/** Комбінаторика */
export const logicCombinatorics: Generator = {
  topicId: 'logic',
  subtopic: 'Комбінаторика',
  generate(difficulty: Difficulty): Task {
    if (difficulty <= 2) {
      const n = randInt(3, 4);
      const k = randInt(2, n - 1);
      // Розміщення без повторень: n!/(n-k)!
      let result = 1;
      for (let i = 0; i < k; i++) result *= n - i;
      const digits = shuffle([1, 2, 3, 4, 5, 6]).slice(0, n);
      return {
        id: uid('logic-comb-'),
        topicId: 'logic',
        subtopic: 'Комбінаторика',
        difficulty,
        question: `Скільки ${k}-цифрових чисел можна скласти з цифр ${digits.join(', ')}, якщо цифри в числі не повторюються?`,
        answerType: 'number',
        correctAnswer: String(result),
        hints: [
          `На першу позицію є ${n} варіантів. На наступну — ${n - 1} (бо не повторюємо).`,
          `${Array.from({ length: k }, (_, i) => n - i).join(' × ')} = ?`,
        ],
        solution: `${Array.from({ length: k }, (_, i) => n - i).join(' × ')} = ${result}`,
        estimatedSec: 45,
      };
    }
    // вибір блюд
    const first = randInt(2, 4);
    const second = randInt(2, 5);
    const drink = randInt(2, 4);
    const total = first * second * drink;
    return {
      id: uid('logic-comb-'),
      topicId: 'logic',
      subtopic: 'Комбінаторика',
      difficulty,
      question: `У їдальні є ${first} перших страви, ${second} других і ${drink} напої. Скільки різних обідів (перше + друге + напій) можна замовити?`,
      answerType: 'number',
      correctAnswer: String(total),
      hints: [
        'Кожен вибір незалежний — потрібно перемножити кількості.',
        `${first} × ${second} × ${drink} = ?`,
      ],
      solution: `${first} × ${second} × ${drink} = ${total}`,
      estimatedSec: 40,
    };
  },
};

/** Числові ребуси (прості) */
export const logicCryptarithm: Generator = {
  topicId: 'logic',
  subtopic: 'Числові ребуси',
  generate(_difficulty: Difficulty): Task {
    // А + А = БВ (двозначне), А — цифра від 5 до 9 (бо сума ≥ 10).
    // У запитанні мусимо показати БВ — інакше А не визначається однозначно
    // (підходить будь-яке з 5..9), і відповідь дитини не з чим порівнювати.
    const a = randInt(5, 9);
    const sum = a + a;
    return {
      id: uid('logic-cry-'),
      topicId: 'logic',
      subtopic: 'Числові ребуси',
      difficulty: _difficulty,
      question: `У рівності А + А = БВ всі літери — цифри, а БВ = ${sum}. Чому дорівнює А?`,
      answerType: 'number',
      correctAnswer: String(a),
      hints: [
        'А + А = БВ — двозначне, отже А ≥ 5.',
        `БВ = ${sum}. Знайди таке А, щоб А + А дорівнювало ${sum}.`,
      ],
      solution: `А = ${a}, бо ${a} + ${a} = ${sum}`,
      estimatedSec: 60,
    };
  },
};

/**
 * Круги Ейлера / діаграми Венна.
 * Усі учні класу вивчають хоча б одну з двох мов.
 * Шукаємо: скільки вивчають обидві / тільки одну / лише одну зі мов.
 *  both = G₁ + G₂ − Total
 */
export const logicVennCircles: Generator = {
  topicId: 'logic',
  subtopic: 'Круги Ейлера',
  generate(difficulty: Difficulty): Task {
    const both = randInt(2, difficulty <= 2 ? 6 : 10);
    const onlyA = randInt(2, difficulty <= 2 ? 8 : 15);
    const onlyB = randInt(2, difficulty <= 2 ? 8 : 15);
    const total = both + onlyA + onlyB;
    const g1 = both + onlyA;
    const g2 = both + onlyB;

    const kind =
      difficulty <= 2 ? 'both' : randChoice(['both', 'onlyOneLang', 'onlyA']);

    if (kind === 'both') {
      return {
        id: uid('logic-venn-'),
        topicId: 'logic',
        subtopic: 'Круги Ейлера',
        difficulty,
        question: `У класі ${total} учнів. Англійську вивчають ${g1}, німецьку — ${g2}. Кожен учень вивчає хоча б одну з мов. Скільки учнів вивчають обидві мови?`,
        answerType: 'number',
        correctAnswer: String(both),
        hints: [
          `Якщо просто скласти ${g1} + ${g2}, то двомовних учнів порахуємо двічі. Різниця і є відповідь.`,
          `(${g1} + ${g2}) − ${total} = ?`,
        ],
        solution: `Обидві: ${g1} + ${g2} − ${total} = ${g1 + g2 - total} = ${both}`,
        estimatedSec: 60,
      };
    }
    if (kind === 'onlyA') {
      return {
        id: uid('logic-venn-'),
        topicId: 'logic',
        subtopic: 'Круги Ейлера',
        difficulty,
        question: `У класі ${total} учнів: ${g1} вивчають англійську, ${g2} — німецьку, ${both} — обидві мови. Скільки учнів вивчають лише англійську?`,
        answerType: 'number',
        correctAnswer: String(onlyA),
        hints: [
          'Тільки англ = усі англ − двомовні.',
          `${g1} − ${both} = ?`,
        ],
        solution: `${g1} − ${both} = ${onlyA}`,
        estimatedSec: 45,
      };
    }
    // onlyOneLang
    return {
      id: uid('logic-venn-'),
      topicId: 'logic',
      subtopic: 'Круги Ейлера',
      difficulty,
      question: `У класі ${total} учнів: ${g1} вивчають англійську, ${g2} — німецьку, ${both} — обидві мови. Скільки учнів вивчають лише одну мову (не обидві)?`,
      answerType: 'number',
      correctAnswer: String(onlyA + onlyB),
      hints: [
        'Знайди «тільки англ» і «тільки нім» окремо, потім додай.',
        `(${g1} − ${both}) + (${g2} − ${both}) = ${onlyA} + ${onlyB} = ?`,
      ],
      solution: `(${g1} − ${both}) + (${g2} − ${both}) = ${onlyA} + ${onlyB} = ${onlyA + onlyB}`,
      estimatedSec: 60,
    };
  },
};

export const logicGenerators: Generator[] = [
  logicSequences,
  logicAge,
  logicCombinatorics,
  logicCryptarithm,
  logicVennCircles,
];

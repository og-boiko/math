import type { Difficulty } from '@/store/profile';
import type { Generator, Task } from '../types';
import { randChoice, randInt, uid } from '@/lib/random';
import { formatBigNumber } from '@/lib/format';

/** Задачі на рух: s = v × t */
export const wordMotion: Generator = {
  topicId: 'word',
  subtopic: 'Задачі на рух',
  generate(difficulty: Difficulty): Task {
    const transports = [
      { name: 'Поїзд', verb: 'їхав', kind: 'наземний' },
      { name: 'Автомобіль', verb: 'їхав', kind: 'наземний' },
      { name: 'Велосипедист', verb: 'їхав', kind: 'наземний' },
      { name: 'Літак', verb: 'летів', kind: 'повітряний' },
      { name: 'Катер', verb: 'плив', kind: 'водний' },
    ];
    const t = randChoice(transports);
    const v = randInt(t.kind === 'повітряний' ? 200 : t.name === 'Велосипедист' ? 10 : 40, t.kind === 'повітряний' ? 800 : 120);
    const time = randInt(2, difficulty <= 2 ? 5 : 8);
    const s = v * time;

    // Тип задачі залежно від рівня
    const taskType = difficulty <= 2 ? 'distance' : difficulty === 3 ? randChoice(['distance', 'speed']) : randChoice(['distance', 'speed', 'time']);

    if (taskType === 'distance') {
      return {
        id: uid('word-mot-'),
        topicId: 'word',
        subtopic: 'Задачі на рух',
        difficulty,
        question: `${t.name} ${t.verb} зі швидкістю ${v} км/год протягом ${time} год. Яку відстань ${t.verb === 'летів' ? 'пролетів' : t.verb === 'плив' ? 'проплив' : 'проїхав'}?`,
        answerType: 'number',
        correctAnswer: String(s),
        hints: [
          'Згадай формулу: відстань = швидкість × час.',
          `${v} × ${time} = ?`,
        ],
        solution: `s = v × t = ${v} × ${time} = ${s} (км)`,
        estimatedSec: 30,
      };
    }
    if (taskType === 'speed') {
      return {
        id: uid('word-mot-'),
        topicId: 'word',
        subtopic: 'Задачі на рух',
        difficulty,
        question: `${t.name} проїхав ${s} км за ${time} год. З якою швидкістю він рухався?`,
        answerType: 'number',
        correctAnswer: String(v),
        hints: [
          'Швидкість = відстань ÷ час.',
          `${s} ÷ ${time} = ?`,
        ],
        solution: `v = s ÷ t = ${s} ÷ ${time} = ${v} (км/год)`,
        estimatedSec: 30,
      };
    }
    return {
      id: uid('word-mot-'),
      topicId: 'word',
      subtopic: 'Задачі на рух',
      difficulty,
      question: `${t.name} рухався зі швидкістю ${v} км/год і подолав ${s} км. Скільки часу він був у дорозі?`,
      answerType: 'number',
      correctAnswer: String(time),
      hints: ['Час = відстань ÷ швидкість.', `${s} ÷ ${v} = ?`],
      solution: `t = s ÷ v = ${s} ÷ ${v} = ${time} (год)`,
      estimatedSec: 30,
    };
  },
};

/** Задачі на вартість: ціна × кількість = вартість */
export const wordCost: Generator = {
  topicId: 'word',
  subtopic: 'Задачі на вартість',
  generate(difficulty: Difficulty): Task {
    const items = [
      { name: 'зошитів', singular: 'зошит', priceMin: 10, priceMax: 50 },
      { name: 'олівців', singular: 'олівець', priceMin: 5, priceMax: 30 },
      { name: 'книжок', singular: 'книжка', priceMin: 50, priceMax: 200 },
      { name: 'яблук', singular: 'яблуко', priceMin: 5, priceMax: 25 },
      { name: 'булочок', singular: 'булочка', priceMin: 10, priceMax: 40 },
    ];
    const item = randChoice(items);
    const price = randInt(item.priceMin, item.priceMax);
    const qty = randInt(2, difficulty <= 2 ? 6 : 12);
    const total = price * qty;
    const taskType = difficulty <= 2 ? 'total' : randChoice(['total', 'qty', 'price']);

    if (taskType === 'total') {
      return {
        id: uid('word-cost-'),
        topicId: 'word',
        subtopic: 'Задачі на вартість',
        difficulty,
        question: `Купили ${qty} ${item.name} по ${price} грн. Скільки коштує покупка?`,
        answerType: 'number',
        correctAnswer: String(total),
        hints: [
          'Вартість = ціна × кількість.',
          `${price} × ${qty} = ?`,
        ],
        solution: `${price} × ${qty} = ${total} (грн)`,
        estimatedSec: 25,
      };
    }
    if (taskType === 'qty') {
      return {
        id: uid('word-cost-'),
        topicId: 'word',
        subtopic: 'Задачі на вартість',
        difficulty,
        question: `За ${item.name} заплатили ${total} грн. Один ${item.singular} коштує ${price} грн. Скільки купили?`,
        answerType: 'number',
        correctAnswer: String(qty),
        hints: ['Кількість = вартість ÷ ціна.', `${total} ÷ ${price} = ?`],
        solution: `${total} ÷ ${price} = ${qty}`,
        estimatedSec: 25,
      };
    }
    return {
      id: uid('word-cost-'),
      topicId: 'word',
      subtopic: 'Задачі на вартість',
      difficulty,
      question: `За ${qty} ${item.name} заплатили ${total} грн. Скільки коштує один ${item.singular}?`,
      answerType: 'number',
      correctAnswer: String(price),
      hints: ['Ціна = вартість ÷ кількість.', `${total} ÷ ${qty} = ?`],
      solution: `${total} ÷ ${qty} = ${price}`,
      estimatedSec: 25,
    };
  },
};

/** Задачі на частини */
export const wordParts: Generator = {
  topicId: 'word',
  subtopic: 'Задачі на частини',
  generate(difficulty: Difficulty): Task {
    const heroes = ['Артем', 'Софія', 'Максим', 'Олена', 'Назар'];
    const items = [
      { name: 'цукерок', singular: 'цукерка' },
      { name: 'марок', singular: 'марка' },
      { name: 'наклейок', singular: 'наклейка' },
      { name: 'кубиків', singular: 'кубик' },
      { name: 'гривень', singular: 'гривня' },
    ];
    const hero = randChoice(heroes);
    const item = randChoice(items);
    const denom = randChoice([2, 3, 4, 5]);
    const multiplier = randInt(3, difficulty <= 2 ? 8 : 20);
    const total = denom * multiplier;
    const gave = total / denom;
    const left = total - gave;
    const friend = randChoice(['другу', 'сестрі', 'братові', 'сусіду']);
    return {
      id: uid('word-prt-'),
      topicId: 'word',
      subtopic: 'Задачі на частини',
      difficulty,
      question: `У ${hero} було ${total} ${item.name}. Він віддав 1/${denom} ${friend}. Скільки ${item.name} залишилось?`,
      answerType: 'number',
      correctAnswer: String(left),
      hints: [
        `Спочатку знайди, скільки це 1/${denom} від ${total} — поділи на ${denom}.`,
        `${total} ÷ ${denom} = ${gave}. Тепер відніми: ${total} − ${gave} = ?`,
      ],
      solution: `${total} ÷ ${denom} = ${gave} (віддав); ${total} − ${gave} = ${left} (залишилось)`,
      estimatedSec: 35,
    };
  },
};

/** Багатокрокові задачі (рівень 4-5) */
export const wordMultiStep: Generator = {
  topicId: 'word',
  subtopic: 'Багатокрокові задачі',
  generate(difficulty: Difficulty): Task {
    const apples = randInt(5, 15);
    const pears = randInt(3, 12);
    const pricePerApple = randInt(5, 15);
    const pricePerPear = randInt(8, 20);
    const total = apples * pricePerApple + pears * pricePerPear;
    return {
      id: uid('word-mlt-'),
      topicId: 'word',
      subtopic: 'Багатокрокові задачі',
      difficulty,
      question: `Купили ${apples} яблук по ${pricePerApple} грн і ${pears} груш по ${pricePerPear} грн. Скільки заплатили всього?`,
      answerType: 'number',
      correctAnswer: String(total),
      hints: [
        'Спочатку порахуй вартість яблук, потім груш — і додай.',
        `Яблука: ${apples} × ${pricePerApple} = ${apples * pricePerApple}. Груші: ${pears} × ${pricePerPear} = ${pears * pricePerPear}.`,
      ],
      solution: `${apples} × ${pricePerApple} + ${pears} × ${pricePerPear} = ${apples * pricePerApple} + ${pears * pricePerPear} = ${total} (грн)`,
      estimatedSec: 50,
    };
  },
};

/**
 * Складна задача на рух з однаковою швидкістю.
 * «Два потяги їхали з однаковою швидкістю. Перший — 6 год, другий — 4 год.
 *  Перший пройшов на 300 км більше. Скільки пройшов другий?»
 *
 * Логіка: різниця у часі × спільна швидкість = різниця у відстані
 *   v = diffS / (t1 - t2);  s2 = v · t2
 */
export const wordMotionCompare: Generator = {
  topicId: 'word',
  subtopic: 'Складні задачі на рух',
  generate(difficulty: Difficulty): Task {
    const transports = [
      { name: 'потяги', singular: 'потяг', verb: 'ішов' },
      { name: 'автомобілі', singular: 'автомобіль', verb: 'їхав' },
      { name: 'катери', singular: 'катер', verb: 'плив' },
    ];
    const t = randChoice(transports);

    // Підбираємо параметри так, щоб результати були цілі
    const v = randInt(40, difficulty <= 3 ? 80 : 120); // швидкість
    const t1 = randInt(4, difficulty <= 3 ? 7 : 10); // час першого
    const t2 = randInt(2, t1 - 1); // час другого (менше)
    const diffS = v * (t1 - t2);
    const s1 = v * t1;
    const s2 = v * t2;

    // Хто пройшов більше — перший (бо t1 > t2)
    return {
      id: uid('word-mot-cmp-'),
      topicId: 'word',
      subtopic: 'Складні задачі на рух',
      difficulty,
      question: `Два ${t.name} їхали з однаковою швидкістю. Перший був у дорозі ${t1} год, а другий — ${t2} год. Перший ${t.verb} на ${diffS} км більше. Скільки кілометрів пройшов другий ${t.singular}?`,
      answerType: 'number',
      correctAnswer: String(s2),
      hints: [
        'Різниця у часі: ' + `${t1} − ${t2} = ${t1 - t2} (год). За цей час перший пройшов "зайві" ${diffS} км.`,
        `Знайди швидкість: ${diffS} ÷ ${t1 - t2} = ${v} (км/год). Тепер: ${v} × ${t2} = ?`,
      ],
      solution: `v = ${diffS} ÷ (${t1} − ${t2}) = ${diffS} ÷ ${t1 - t2} = ${v} км/год.\nДругий: ${v} × ${t2} = ${s2} км.\n(Перший: ${v} × ${t1} = ${s1} км; різниця ${s1} − ${s2} = ${diffS} км ✓)`,
      estimatedSec: 120,
    };
  },
};

/**
 * Задачі на зустрічний / протилежний рух (рух у різні боки).
 * Швидкість зближення / віддалення = V₁ + V₂.
 * meeting: дано S, V₁, V₂ → знайти час t = S / (V₁+V₂).
 * diverging: дано V₁, V₂, t → знайти відстань S = (V₁+V₂)·t.
 */
export const wordMotionMeeting: Generator = {
  topicId: 'word',
  subtopic: 'Зустрічний/протилежний рух',
  generate(difficulty: Difficulty): Task {
    const transports = [
      { plur: 'потяги' },
      { plur: 'автомобілі' },
      { plur: 'велосипедисти' },
    ];
    const t = randChoice(transports);
    const v1 = randInt(30, difficulty <= 2 ? 60 : 90);
    const v2 = randInt(30, difficulty <= 2 ? 60 : 90);
    const sum = v1 + v2;
    const time = randInt(2, difficulty <= 2 ? 4 : 7);
    const S = sum * time;

    const kind = difficulty === 1 ? 'meeting' : randChoice(['meeting', 'diverging']);

    if (kind === 'meeting') {
      return {
        id: uid('word-mt-'),
        topicId: 'word',
        subtopic: 'Зустрічний/протилежний рух',
        difficulty,
        question: `З двох міст одночасно назустріч одне одному виїхали ${t.plur}. Відстань між містами — ${S} км. Швидкість першого — ${v1} км/год, другого — ${v2} км/год. Через скільки годин вони зустрінуться?`,
        answerType: 'number',
        correctAnswer: String(time),
        hints: [
          'При зустрічному русі швидкості додаються: швидкість зближення = V₁ + V₂.',
          `${v1} + ${v2} = ${sum} км/год. Час зустрічі = ${S} ÷ ${sum} = ?`,
        ],
        solution: `Швидкість зближення: ${v1} + ${v2} = ${sum} км/год.\nt = S ÷ (V₁ + V₂) = ${S} ÷ ${sum} = ${time} (год)`,
        estimatedSec: 90,
      };
    }

    // diverging — рух у різні боки з одного пункту
    return {
      id: uid('word-mt-'),
      topicId: 'word',
      subtopic: 'Зустрічний/протилежний рух',
      difficulty,
      question: `З одного міста в різні боки одночасно виїхали ${t.plur}: перший — зі швидкістю ${v1} км/год, другий — ${v2} км/год. Яка відстань буде між ними через ${time} год?`,
      answerType: 'number',
      correctAnswer: String(S),
      hints: [
        'При русі у різні боки швидкість віддалення = V₁ + V₂.',
        `${v1} + ${v2} = ${sum} км/год; S = ${sum} × ${time} = ?`,
      ],
      solution: `Швидкість віддалення: ${v1} + ${v2} = ${sum} км/год.\nS = (V₁ + V₂) × t = ${sum} × ${time} = ${S} (км)`,
      estimatedSec: 75,
    };
  },
};

/**
 * Задачі на спільну роботу. t = (T₁ · T₂) / (T₁ + T₂).
 * Використовуємо лише пари, де результат — ціле число.
 */
export const wordJointWork: Generator = {
  topicId: 'word',
  subtopic: 'Задачі на спільну роботу',
  generate(difficulty: Difficulty): Task {
    const easyPairs: Array<[number, number]> = [
      [3, 6], [6, 3], [4, 4], [4, 12], [12, 4], [6, 12], [12, 6],
    ];
    const hardPairs: Array<[number, number]> = [
      [8, 8], [10, 10], [10, 15], [15, 10], [20, 5], [5, 20], [20, 20],
      [24, 8], [8, 24], [24, 12], [12, 24],
    ];
    const pool =
      difficulty <= 2
        ? easyPairs
        : difficulty === 3
          ? [...easyPairs, ...hardPairs.slice(0, 4)]
          : hardPairs;
    const [t1, t2] = randChoice(pool);
    const together = (t1 * t2) / (t1 + t2);
    if (!Number.isInteger(together)) return wordJointWork.generate(difficulty);

    const scenarios = [
      `Майстер виконує роботу за ${t1} год, а учень — за ${t2} год. За скільки годин вони виконають цю роботу разом?`,
      `Перша труба наповнює басейн за ${t1} год, друга — за ${t2} год. За скільки годин вони наповнять басейн разом?`,
      `Один комбайн прибирає поле за ${t1} год, другий — за ${t2} год. За скільки годин вони приберуть поле разом?`,
    ];
    const question = randChoice(scenarios);

    return {
      id: uid('word-jw-'),
      topicId: 'word',
      subtopic: 'Задачі на спільну роботу',
      difficulty,
      question,
      answerType: 'number',
      correctAnswer: String(together),
      hints: [
        `Уяви, що вся робота — це 1. Перший за 1 год виконує 1/${t1}, другий — 1/${t2}.`,
        `Час разом = (T₁ · T₂) ÷ (T₁ + T₂) = (${t1} × ${t2}) ÷ (${t1} + ${t2}) = ${t1 * t2} ÷ ${t1 + t2} = ${together}.`,
      ],
      solution: `t = (T₁ · T₂) / (T₁ + T₂) = (${t1} · ${t2}) / (${t1} + ${t2}) = ${t1 * t2} / ${t1 + t2} = ${together} (год)`,
      estimatedSec: 90,
    };
  },
};

/**
 * Здача з покупки: вартість = ціна × кількість; здача = купюра − вартість.
 * Bill підбирається як найменша «гарна» купюра більша за вартість.
 */
export const wordCostChange: Generator = {
  topicId: 'word',
  subtopic: 'Здача з покупки',
  generate(difficulty: Difficulty): Task {
    const items = [
      { plural: 'зошитів', priceMin: 8, priceMax: 25 },
      { plural: 'олівців', priceMin: 5, priceMax: 15 },
      { plural: 'булочок', priceMin: 12, priceMax: 35 },
      { plural: 'яблук', priceMin: 8, priceMax: 20 },
      { plural: 'ручок', priceMin: 15, priceMax: 40 },
    ];
    const it = randChoice(items);
    const qty = randInt(2, difficulty <= 2 ? 5 : 9);
    const price = randInt(it.priceMin, it.priceMax);
    const cost = qty * price;
    const possibleBills = [50, 100, 200, 500, 1000];
    const bill = possibleBills.find((b) => b > cost + 5) ?? cost + 50;
    const change = bill - cost;
    return {
      id: uid('word-chg-'),
      topicId: 'word',
      subtopic: 'Здача з покупки',
      difficulty,
      question: `Купили ${qty} ${it.plural} по ${price} грн. Скільки здачі дадуть з ${bill} грн?`,
      answerType: 'number',
      correctAnswer: String(change),
      hints: [
        'Спочатку знайди вартість покупки (ціна × кількість), потім відніми від купюри.',
        `${price} × ${qty} = ${cost} грн. ${bill} − ${cost} = ?`,
      ],
      solution: `Вартість: ${price} × ${qty} = ${cost} грн.\nЗдача: ${bill} − ${cost} = ${change} грн.`,
      estimatedSec: 45,
    };
  },
};

/**
 * Приведення до одиниці (за зразком задачі №7 самостійної):
 *   «Купили 5 однакових обігрівачів за 129 835 грн.
 *    Скільки коштуватиме 9 таких обігрівачів?»
 *
 * Двокроковка: total₁ ÷ qty₁ → ціна за одиницю → × qty₂.
 * Числа підбираються так, щоб обидва кроки давали цілі.
 */
export const wordUnitPrice: Generator = {
  topicId: 'word',
  subtopic: 'Приведення до одиниці',
  generate(difficulty: Difficulty): Task {
    const items = [
      { plural: 'обігрівачів', singular: 'обігрівач', actor: 'школа купила' },
      { plural: 'ноутбуків', singular: 'ноутбук', actor: 'клас купив' },
      { plural: 'велосипедів', singular: 'велосипед', actor: 'магазин завіз' },
      { plural: 'столів', singular: 'стіл', actor: 'кафе замовило' },
      { plural: 'кондиціонерів', singular: 'кондиціонер', actor: 'офіс придбав' },
    ];
    const it = randChoice(items);

    // Кількість першої партії
    const qty1 = randInt(difficulty <= 2 ? 2 : 3, difficulty <= 2 ? 5 : 8);
    // Кількість другої партії — інша
    let qty2 = randInt(2, 9);
    while (qty2 === qty1) qty2 = randInt(2, 9);

    // Ціна за одиницю — «гарне» 5-значне число для високих рівнів
    let unitPrice: number;
    if (difficulty <= 2) {
      unitPrice = randInt(120, 950);
    } else if (difficulty === 3) {
      unitPrice = randInt(1200, 9800);
    } else if (difficulty === 4) {
      unitPrice = randInt(8500, 28000);
    } else {
      unitPrice = randInt(20000, 50000);
    }

    const total1 = unitPrice * qty1;
    const total2 = unitPrice * qty2;

    return {
      id: uid('word-up-'),
      topicId: 'word',
      subtopic: 'Приведення до одиниці',
      difficulty,
      question: `Для школи ${it.actor} ${qty1} однакових ${it.plural} та заплатила ${formatBigNumber(total1)} грн. Скільки коштуватиме ${qty2} таких ${it.plural}?`,
      answerType: 'number',
      correctAnswer: String(total2),
      acceptedAnswers: [String(total2), formatBigNumber(total2)],
      hints: [
        `Спочатку знайди ціну одного ${it.singular}а: поділи всю вартість на кількість.`,
        `${formatBigNumber(total1)} ÷ ${qty1} = ${formatBigNumber(unitPrice)} грн за один. Тепер: ${formatBigNumber(unitPrice)} × ${qty2} = ?`,
      ],
      solution: `1) ${formatBigNumber(total1)} ÷ ${qty1} = ${formatBigNumber(unitPrice)} (грн — ціна одного ${it.singular}а)\n2) ${formatBigNumber(unitPrice)} × ${qty2} = ${formatBigNumber(total2)} (грн)\nВідповідь: ${formatBigNumber(total2)} грн.`,
      estimatedSec: 120,
    };
  },
};

export const wordGenerators: Generator[] = [
  wordMotion,
  wordCost,
  wordParts,
  wordMultiStep,
  wordMotionCompare,
  wordMotionMeeting,
  wordJointWork,
  wordCostChange,
  wordUnitPrice,
];
import type { Difficulty } from '@/store/profile';
import type { Generator, Task } from '../types';
import { randChoice, randInt, uid } from '@/lib/random';

const addRanges: Record<Difficulty, [number, number]> = {
  1: [1, 20],
  2: [10, 99],
  3: [10, 99],
  4: [100, 999],
  5: [100, 999],
};

export const oralAddition: Generator = {
  topicId: 'oral',
  subtopic: 'Додавання',
  generate(difficulty: Difficulty): Task {
    const [min, max] = addRanges[difficulty];
    const a = randInt(min, max);
    const b = randInt(min, max);
    const sum = a + b;
    return {
      id: uid('oral-add-'),
      topicId: 'oral',
      subtopic: 'Додавання',
      difficulty,
      question: `${a} + ${b} = ?`,
      answerType: 'number',
      correctAnswer: String(sum),
      hints: [
        'Розклади більше число на десятки і одиниці.',
        `${a} + ${Math.floor(b / 10) * 10} = ${a + Math.floor(b / 10) * 10}, тепер додай ${b % 10}.`,
      ],
      solution: `${a} + ${b} = ${sum}`,
      estimatedSec: 8,
    };
  },
};

export const oralSubtraction: Generator = {
  topicId: 'oral',
  subtopic: 'Віднімання',
  generate(difficulty: Difficulty): Task {
    const [min, max] = addRanges[difficulty];
    const a = randInt(min, max);
    const b = randInt(min, a);
    const diff = a - b;
    return {
      id: uid('oral-sub-'),
      topicId: 'oral',
      subtopic: 'Віднімання',
      difficulty,
      question: `${a} − ${b} = ?`,
      answerType: 'number',
      correctAnswer: String(diff),
      hints: [
        'Спочатку відніми десятки, потім одиниці.',
        `${a} − ${Math.floor(b / 10) * 10} = ${a - Math.floor(b / 10) * 10}, тепер відніми ${b % 10}.`,
      ],
      solution: `${a} − ${b} = ${diff}`,
      estimatedSec: 8,
    };
  },
};

export const oralMultiplication: Generator = {
  topicId: 'oral',
  subtopic: 'Таблиця множення',
  generate(difficulty: Difficulty): Task {
    let a: number, b: number;
    if (difficulty <= 2) {
      a = randInt(2, 5);
      b = randInt(2, 9);
    } else if (difficulty <= 4) {
      a = randInt(2, 9);
      b = randInt(2, 9);
    } else {
      a = randChoice([10, 100, 1000]);
      b = randInt(2, 99);
    }
    const product = a * b;
    return {
      id: uid('oral-mul-'),
      topicId: 'oral',
      subtopic: 'Таблиця множення',
      difficulty,
      question: `${a} × ${b} = ?`,
      answerType: 'number',
      correctAnswer: String(product),
      hints: [
        `Згадай таблицю множення на ${Math.min(a, b)}.`,
        `${a} × ${b - 1} = ${a * (b - 1)}, додай ще ${a}.`,
      ],
      solution: `${a} × ${b} = ${product}`,
      estimatedSec: 6,
    };
  },
};

export const oralGenerators: Generator[] = [oralAddition, oralSubtraction, oralMultiplication];

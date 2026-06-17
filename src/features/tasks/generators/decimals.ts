import type { Difficulty } from '@/store/profile';
import type { Generator, Task } from '../types';
import { randChoice, randInt, uid } from '@/lib/random';
import { formatDecimal } from '@/lib/format';

/** Записати десятковий з тексту */
export const decimalRead: Generator = {
  topicId: 'decimals',
  subtopic: 'Запис десяткового',
  generate(difficulty: Difficulty): Task {
    const fractionDigits = difficulty <= 2 ? 1 : difficulty === 3 ? 2 : 3;
    const intPart = randInt(0, difficulty <= 2 ? 9 : 99);
    const fracPart = randInt(1, Math.pow(10, fractionDigits) - 1);
    const value = intPart + fracPart / Math.pow(10, fractionDigits);
    const correctAnswer = formatDecimal(value, fractionDigits);
    const altAnswer = correctAnswer.replace(',', '.');

    const intWord = (n: number): string => {
      if (n === 0) return 'нуль';
      const ones = ['', 'одна', 'дві', 'три', 'чотири', "п'ять", 'шість', 'сім', 'вісім', "дев'ять"];
      const tens = ['', '', 'двадцять', 'тридцять', 'сорок', "п'ятдесят", 'шістдесят', 'сімдесят', 'вісімдесят', "дев'яносто"];
      const teens = ['десять', 'одинадцять', 'дванадцять', 'тринадцять', 'чотирнадцять', "п'ятнадцять", 'шістнадцять', 'сімнадцять', 'вісімнадцять', "дев'ятнадцять"];
      const hundreds = [
        '', 'сто', 'двісті', 'триста', 'чотириста',
        "п'ятсот", 'шістсот', 'сімсот', 'вісімсот', "дев'ятсот",
      ];
      const under100 = (m: number): string => {
        if (m < 10) return ones[m];
        if (m < 20) return teens[m - 10];
        const t = Math.floor(m / 10);
        const o = m % 10;
        return o === 0 ? tens[t] : `${tens[t]} ${ones[o]}`;
      };
      if (n < 100) return under100(n);
      if (n < 1000) {
        const h = Math.floor(n / 100);
        const r = n % 100;
        return r === 0 ? hundreds[h] : `${hundreds[h]} ${under100(r)}`;
      }
      // Для тисячних розрядів дроби максимум 999 — сюди не доходимо.
      return String(n);
    };

    const fracName =
      fractionDigits === 1 ? 'десятих' : fractionDigits === 2 ? 'сотих' : 'тисячних';
    const intName = intPart === 1 ? 'ціла' : intPart < 5 && intPart > 0 ? 'цілі' : 'цілих';
    const question = `Запиши десятковий дріб: «${intWord(intPart)} ${intName} ${intWord(fracPart)} ${fracName}»`;

    return {
      id: uid('dec-read-'),
      topicId: 'decimals',
      subtopic: 'Запис десяткового',
      difficulty,
      question,
      answerType: 'decimal',
      correctAnswer,
      acceptedAnswers: [correctAnswer, altAnswer],
      hints: [
        'Перед комою — ціла частина, після коми — дробова. Кількість цифр після коми залежить від розряду (десяті — 1, соті — 2, тисячні — 3).',
        `Ціла частина: ${intPart}. Дробова частина: ${String(fracPart).padStart(fractionDigits, '0')}.`,
      ],
      solution: `Відповідь: ${correctAnswer}`,
      estimatedSec: 25,
    };
  },
};

/** Збільшити/зменшити в 10/100/1000 разів */
export const decimalScale: Generator = {
  topicId: 'decimals',
  subtopic: 'Множення/ділення на 10, 100, 1000',
  generate(difficulty: Difficulty): Task {
    const fractionDigits = difficulty <= 2 ? 1 : 2;
    const intPart = randInt(1, 99);
    const fracPart = randInt(1, Math.pow(10, fractionDigits) - 1);
    const value = intPart + fracPart / Math.pow(10, fractionDigits);
    const factor = randChoice(difficulty <= 2 ? [10, 100] : [10, 100, 1000]);
    const op = randChoice(['×', '÷']);
    const result = op === '×' ? value * factor : value / factor;
    // Точність до 4 знаків
    const resultStr = formatDecimal(result, Math.max(0, fractionDigits + (op === '÷' ? 3 : 0)))
      .replace(/0+$/, '')
      .replace(/,$/, '');
    const valueStr = formatDecimal(value, fractionDigits);
    return {
      id: uid('dec-scale-'),
      topicId: 'decimals',
      subtopic: 'Множення/ділення на 10, 100, 1000',
      difficulty,
      question: `${valueStr} ${op} ${factor} = ?`,
      answerType: 'decimal',
      correctAnswer: resultStr,
      acceptedAnswers: [resultStr, resultStr.replace(',', '.')],
      hints: [
        op === '×'
          ? `Множення на ${factor} переносить кому на ${Math.log10(factor)} знаки вправо.`
          : `Ділення на ${factor} переносить кому на ${Math.log10(factor)} знаки вліво.`,
        `Перенеси кому в ${valueStr} на ${Math.log10(factor)} ${op === '×' ? 'вправо' : 'вліво'}.`,
      ],
      solution: `${valueStr} ${op} ${factor} = ${resultStr}`,
      estimatedSec: 15,
    };
  },
};

/** Додавання/віднімання десяткових */
export const decimalAddSub: Generator = {
  topicId: 'decimals',
  subtopic: 'Додавання/віднімання десяткових',
  generate(difficulty: Difficulty): Task {
    const fractionDigits = difficulty <= 2 ? 1 : 2;
    const max = difficulty <= 2 ? 50 : 100;
    const factor = Math.pow(10, fractionDigits);
    const aRaw = randInt(10, max * factor);
    const bRaw = randInt(10, aRaw);
    const op = randChoice(['+', '−']);
    const resultRaw = op === '+' ? aRaw + bRaw : aRaw - bRaw;
    const a = aRaw / factor;
    const b = bRaw / factor;
    const result = resultRaw / factor;
    const aStr = formatDecimal(a, fractionDigits);
    const bStr = formatDecimal(b, fractionDigits);
    const resultStr = formatDecimal(result, fractionDigits);
    return {
      id: uid('dec-as-'),
      topicId: 'decimals',
      subtopic: 'Додавання/віднімання десяткових',
      difficulty,
      question: `${aStr} ${op} ${bStr} = ?`,
      answerType: 'decimal',
      correctAnswer: resultStr,
      acceptedAnswers: [resultStr, resultStr.replace(',', '.')],
      hints: [
        'Запиши стовпчиком: кома під комою. Дій як зі звичайними числами, потім знеси кому.',
        `Спочатку додай (відніми) дробові частини, потім — цілі.`,
      ],
      solution: `${aStr} ${op} ${bStr} = ${resultStr}`,
      estimatedSec: 25,
    };
  },
};

/** Порівняння десяткових */
export const decimalCompare: Generator = {
  topicId: 'decimals',
  subtopic: 'Порівняння десяткових',
  generate(difficulty: Difficulty): Task {
    const fractionDigits = difficulty <= 2 ? 1 : difficulty === 3 ? 2 : 3;
    const factor = Math.pow(10, fractionDigits);
    const aRaw = randInt(10, 50 * factor);
    let bRaw = randInt(10, 50 * factor);
    while (bRaw === aRaw) bRaw = randInt(10, 50 * factor);
    const a = aRaw / factor;
    const b = bRaw / factor;
    const sign = a < b ? '<' : '>';
    const aStr = formatDecimal(a, fractionDigits);
    const bStr = formatDecimal(b, fractionDigits);
    return {
      id: uid('dec-cmp-'),
      topicId: 'decimals',
      subtopic: 'Порівняння десяткових',
      difficulty,
      question: `Постав знак (<, > або =): ${aStr} ___ ${bStr}`,
      answerType: 'choice',
      correctAnswer: sign,
      options: ['<', '>', '='],
      hints: [
        'Спочатку порівняй цілі частини. Якщо рівні — порівнюй цифри після коми по черзі.',
        `Ціла частина ${aStr}: ${Math.floor(a)}, ${bStr}: ${Math.floor(b)}.`,
      ],
      solution: `${aStr} ${sign} ${bStr}`,
      estimatedSec: 15,
    };
  },
};

export const decimalGenerators: Generator[] = [
  decimalRead,
  decimalScale,
  decimalAddSub,
  decimalCompare,
];

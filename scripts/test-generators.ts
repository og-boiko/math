/**
 * Smoke-test для генераторів задач і нової логіки перевірки відповідей.
 *
 * Запуск: `npx tsx scripts/test-generators.ts`.
 * Перевіряємо:
 *   1. Жоден генератор не падає і не зависає для рівнів 1..5.
 *   2. `checkAnswer` правильно працює зі скалярами і зі списками чисел
 *      (зокрема для подвійних нерівностей — це той самий клас задач,
 *      що мав баг із комами).
 *   3. Поле `subtopic` у згенерованій задачі збігається з полем
 *      генератора (раніше у oralMultiplication було розходження).
 *   4. Кожна задача має непорожні `correctAnswer`, `hints`, `solution`.
 *
 * Не йде в продакшн-бандл.
 */

import {
  checkAnswer,
  normalizeAnswer,
  normalizeNumberList,
  normalizeNumberListUnordered,
} from '../src/lib/format';

import { oralGenerators } from '../src/features/tasks/generators/oral';
import { columnGenerators } from '../src/features/tasks/generators/column';
import { orderGenerators } from '../src/features/tasks/generators/order';
import { fractionGenerators } from '../src/features/tasks/generators/fractions';
import { decimalGenerators } from '../src/features/tasks/generators/decimals';
import { wordGenerators } from '../src/features/tasks/generators/word';
import { unitsGenerators } from '../src/features/tasks/generators/units';
import { geometryGenerators } from '../src/features/tasks/generators/geometry';
import { logicGenerators } from '../src/features/tasks/generators/logic';
import { equationsGenerators } from '../src/features/tasks/generators/equations';
import type { Difficulty } from '../src/store/profile-types';
import type { Generator } from '../src/features/tasks/types';

let pass = 0;
let fail = 0;

function check(label: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) {
    pass++;
    console.log(`  ✓ ${label}`);
  } else {
    fail++;
    console.log(`  ✗ ${label}`);
    console.log(`     expected: ${JSON.stringify(expected)}`);
    console.log(`     actual:   ${JSON.stringify(actual)}`);
  }
}

function checkTrue(label: string, actual: boolean) {
  check(label, actual, true);
}

console.log('--- normalizeAnswer ---');
check('trim spaces', normalizeAnswer('  42  '), '42');
check('comma → dot (decimal)', normalizeAnswer('3,14'), '3.14');
check('unicode minus → -', normalizeAnswer('−5'), '-5');
check('case-insensitive', normalizeAnswer('Гострий'), 'гострий');

console.log('\n--- normalizeNumberList ---');
check('comma list', normalizeNumberList('1, 2, 3'), '1,2,3');
check('semicolon list', normalizeNumberList('1; 2; 3'), '1,2,3');
check('space list', normalizeNumberList('1 2 3'), '1,2,3');
check('extra spaces', normalizeNumberList('  1 ,  2 ,3  '), '1,2,3');

console.log('\n--- normalizeNumberListUnordered ---');
check('sorts numbers', normalizeNumberListUnordered('3, 1, 2'), '1,2,3');
check('handles negatives', normalizeNumberListUnordered('-2, -10, 5'), '-10,-2,5');

console.log('\n--- checkAnswer (scalars) ---');
checkTrue('exact match', checkAnswer('42', '42'));
checkTrue('decimal comma vs dot', checkAnswer('3,14', '3.14'));
checkTrue('trim difference', checkAnswer(' 42 ', '42'));
checkTrue('case-insensitive word', checkAnswer('Гострий', 'гострий'));
checkTrue('unicode minus', checkAnswer('−5', '-5'));
check('wrong scalar → false', checkAnswer('42', '43'), false);

console.log('\n--- checkAnswer (lists — це був баг із комою) ---');
checkTrue('list same order', checkAnswer('1, 2, 3', '1, 2, 3'));
checkTrue('list reordered', checkAnswer('3, 1, 2', '1, 2, 3'));
checkTrue('list semicolons', checkAnswer('1;2;3', '1, 2, 3'));
checkTrue('list spaces', checkAnswer('1 2 3', '1, 2, 3'));
checkTrue('list mixed sep', checkAnswer('1; 2, 3', '1, 2, 3'));
check('wrong list → false', checkAnswer('1, 2, 4', '1, 2, 3'), false);
check('list vs scalar → false', checkAnswer('1', '1, 2, 3'), false);

console.log('\n--- Генератори: жодного збою/зависання, 50 запусків кожен ---');

const ALL_GENERATORS: Generator[] = [
  ...oralGenerators,
  ...columnGenerators,
  ...orderGenerators,
  ...fractionGenerators,
  ...decimalGenerators,
  ...wordGenerators,
  ...unitsGenerators,
  ...geometryGenerators,
  ...logicGenerators,
  ...equationsGenerators,
];

const difficulties: Difficulty[] = [1, 2, 3, 4, 5];

for (const gen of ALL_GENERATORS) {
  let total = 0;
  let mismatchedSubtopic = 0;
  let emptyAnswer = 0;
  let emptyHints = 0;
  let emptySolution = 0;
  let nanOrInf = 0;
  let exceptions = 0;

  for (const diff of difficulties) {
    for (let i = 0; i < 10; i++) {
      total++;
      try {
        const task = gen.generate(diff);
        if (task.subtopic !== gen.subtopic) mismatchedSubtopic++;
        if (!task.correctAnswer || task.correctAnswer.trim() === '') emptyAnswer++;
        if (!task.hints || task.hints.length === 0) emptyHints++;
        if (!task.solution || task.solution.trim() === '') emptySolution++;
        if (/NaN|Infinity|undefined/.test(task.correctAnswer)) nanOrInf++;
        if (/NaN|Infinity|undefined/.test(task.question)) nanOrInf++;
        // checkAnswer проти власної правильної відповіді — має бути true
        if (!checkAnswer(task.correctAnswer, task.correctAnswer)) {
          fail++;
          console.log(`  ✗ ${gen.topicId}/${gen.subtopic} L${diff}: self-check failed for "${task.correctAnswer}"`);
        }
      } catch (e) {
        exceptions++;
        console.log(`  ✗ ${gen.topicId}/${gen.subtopic} L${diff} #${i}: ${(e as Error).message}`);
      }
    }
  }

  const issues: string[] = [];
  if (mismatchedSubtopic) issues.push(`subtopic≠ x${mismatchedSubtopic}`);
  if (emptyAnswer) issues.push(`emptyAns x${emptyAnswer}`);
  if (emptyHints) issues.push(`noHints x${emptyHints}`);
  if (emptySolution) issues.push(`noSolution x${emptySolution}`);
  if (nanOrInf) issues.push(`NaN/Inf x${nanOrInf}`);
  if (exceptions) issues.push(`throws x${exceptions}`);

  if (issues.length === 0) {
    pass++;
    console.log(`  ✓ ${gen.topicId}/${gen.subtopic} (${total} запусків)`);
  } else {
    fail++;
    console.log(`  ✗ ${gen.topicId}/${gen.subtopic} (${total} запусків) — ${issues.join(', ')}`);
  }
}

console.log(`\n${pass} pass, ${fail} fail`);
process.exit(fail === 0 ? 0 : 1);

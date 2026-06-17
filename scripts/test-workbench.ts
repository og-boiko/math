/**
 * Швидкий smoke-test для парсерів калькулятора і стовпчика.
 * Запуск: `npx tsx scripts/test-workbench.ts`.
 * Не йде в продакшн-бандл.
 */
import { evalStripLine, formatStripNumber } from '../src/lib/calc-strip';
import { parseColumnExpression } from '../src/components/workbench/workbenchUtils';

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

console.log('--- formatStripNumber ---');
check('integer', formatStripNumber(168), '168');
check('decimal', formatStripNumber(3.14), '3,14');
check('clean float', formatStripNumber(0.1 + 0.2), '0,3');
check('zero', formatStripNumber(0), '0');
check('negative', formatStripNumber(-5.5), '-5,5');

console.log('\n--- evalStripLine (no ans) ---');
check('simple add', evalStripLine('123 + 45', undefined).value, 168);
check('with comma', evalStripLine('3,5 + 1,5', undefined).value, 5);
check('with brackets', evalStripLine('(2 + 3) * 4', undefined).value, 20);
check('thousand spaces', evalStripLine('1 000 + 2 000', undefined).value, 3000);
check('subtract unicode', evalStripLine('10 − 3', undefined).value, 7);
check('multiply unicode', evalStripLine('5 × 6', undefined).value, 30);
check('divide unicode', evalStripLine('100 ÷ 4', undefined).value, 25);
check('empty', evalStripLine('', undefined).ok, false);
check('incomplete', evalStripLine('5 +', undefined).ok, false);
check('div by zero', evalStripLine('5 / 0', undefined).ok, false);
check('display add', evalStripLine('123 + 45', undefined).display, '= 168');

console.log('\n--- evalStripLine (with ans) ---');
check('ans add', evalStripLine('ans + 100', 50).value, 150);
check('ans alone', evalStripLine('ans', 7).value, 7);
check('ans no prev', evalStripLine('ans + 1', undefined).ok, false);

console.log('\n--- parseColumnExpression ---');
check(
  'simple add',
  parseColumnExpression('123 + 45 = ?'),
  { op: '+', a: 123, b: 45 },
);
check(
  'thousand spaces',
  parseColumnExpression('12 345 + 67 890 = ?'),
  { op: '+', a: 12345, b: 67890 },
);
check(
  'subtract unicode',
  parseColumnExpression('1000 − 234 = ?'),
  { op: '-', a: 1000, b: 234 },
);
check(
  'multiply',
  parseColumnExpression('234 × 56 = ?'),
  { op: '×', a: 234, b: 56 },
);
check(
  'divide',
  parseColumnExpression('504 ÷ 56 = ?'),
  { op: '÷', a: 504, b: 56 },
);
check(
  'compound expr → null',
  parseColumnExpression('13268 + (540 − 37) · 23 = ?'),
  null,
);
check(
  'with remainder text → null',
  parseColumnExpression(
    '50 ÷ 7 = ? (з остачею; формат: число(ост.число))',
  ),
  { op: '÷', a: 50, b: 7 },
);

console.log(`\n${pass} pass, ${fail} fail`);
process.exit(fail === 0 ? 0 : 1);

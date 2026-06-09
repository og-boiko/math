/**
 * Нормалізує відповідь користувача:
 * - прибирає пробіли
 * - замінює кому на крапку (для десяткових)
 * - замінює різні мінуси на стандартний
 */
export function normalizeAnswer(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, '')
    .replace(/,/g, '.')
    .replace(/[−–—]/g, '-');
}

/** Перевірка відповіді з нормалізацією */
export function checkAnswer(userInput: string, correct: string): boolean {
  return normalizeAnswer(userInput) === normalizeAnswer(correct);
}

/** Форматує дріб для виводу: 4/8 → 1/2, 6/3 → 2 */
export function formatFraction(num: number, den: number): string {
  if (den === 0) return 'NaN';
  if (num % den === 0) return String(num / den);
  return `${num}/${den}`;
}

/** Десятковий дріб з комою (укр. стандарт) */
export function formatDecimal(value: number, fractionDigits = 2): string {
  return value.toFixed(fractionDigits).replace('.', ',');
}

/** Число з пробілами між тисячами: 1234567 → 1 234 567 */
export function formatBigNumber(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

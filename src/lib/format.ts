/**
 * Нормалізує відповідь користувача (для скаляра — числа/слова/дробу).
 * - прибирає всі пробіли
 * - замінює кому на крапку (для десяткових)
 * - замінює різні мінуси на стандартний
 * - нижній регістр
 *
 * УВАГА: НЕ застосовувати до відповідей-списків (як-от «1, 2, 3»),
 * бо кома там — роздільник елементів. Для таких випадків
 * використовуй `checkAnswer`, який сам визначає тип.
 */
export function normalizeAnswer(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/,/g, '.')
    .replace(/[−–—]/g, '-');
}

/**
 * Нормалізація відповіді-списку чисел: «1, 2, 3», «1;2;3», «1 2 3».
 * Розділює на елементи (за комою / крапкою з комою / пробілом),
 * нормалізує кожне число окремо (мінуси, кома-крапка в межах одного
 * елемента — для майбутніх десяткових списків), і повертає у канонічній
 * формі «a,b,c».
 *
 * Порядок елементів зберігається — для нерівностей це природній зростаючий
 * порядок, а порівняння працює стабільно бо генератор теж віддає так само.
 * Якщо хочемо порівнювати як множину — є `normalizeNumberListUnordered`.
 */
export function normalizeNumberList(input: string): string {
  return input
    .trim()
    .replace(/[−–—]/g, '-')
    .split(/[,;]\s*|\s+/)
    .filter((p) => p.length > 0)
    .map((p) => p.replace(/,/g, '.'))
    .join(',');
}

/** Як `normalizeNumberList`, але сортує елементи — порівняння як множин. */
export function normalizeNumberListUnordered(input: string): string {
  const parts = input
    .trim()
    .replace(/[−–—]/g, '-')
    .split(/[,;]\s*|\s+/)
    .filter((p) => p.length > 0)
    .map((p) => p.replace(/,/g, '.'));
  // Сортуємо як числа, де можливо, інакше як рядки
  parts.sort((a, b) => {
    const na = Number(a);
    const nb = Number(b);
    if (Number.isFinite(na) && Number.isFinite(nb)) return na - nb;
    return a.localeCompare(b);
  });
  return parts.join(',');
}

/**
 * Чи виглядає рядок як список чисел через кому / крапку з комою.
 * Вимагаємо ЯВНИЙ роздільник (`,` або `;`) і ≥ 2 цифрових токени.
 * `3,14` (одиничний десятковий) — НЕ список: для цього в нас scalar mode.
 *
 * Використовуємо тільки на КАНОНІЧНІЙ (правильній) відповіді —
 * вона і визначає тип задачі. Введення користувача міряємо тим самим
 * методом, що й канонічна відповідь.
 */
function looksLikeNumberList(s: string): boolean {
  if (!/[,;]/.test(s)) return false;
  const parts = s
    .trim()
    .split(/[,;]\s*|\s+/)
    .filter((p) => p.length > 0);
  // Список — це ≥ 2 цілі числа через кому/крапку з комою.
  // (Список десяткових — рідкість у 4 класі; якщо знадобиться,
  //  поточний регекс пропускає лише цілі — це бажано, щоб не
  //  плутати «3,14» з «[3, 14]».)
  if (parts.length < 2) return false;
  return parts.every((p) => /^-?\d+$/.test(p.trim()));
}

/**
 * Перевірка відповіді з нормалізацією.
 * Вибір режиму (скаляр / список) — за КАНОНІЧНОЮ відповіддю,
 * щоб «3,14» завжди був десятковим (scalar), а «1, 2, 3» — списком.
 * Для списків порівнюємо як невпорядковані множини: «3, 1, 2» = «1, 2, 3».
 */
export function checkAnswer(userInput: string, correct: string): boolean {
  if (looksLikeNumberList(correct)) {
    return normalizeNumberListUnordered(userInput) === normalizeNumberListUnordered(correct);
  }
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

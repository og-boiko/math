/** Локальний день у форматі YYYY-MM-DD (без UTC-зсуву). */
export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Різниця в днях між двома YYYY-MM-DD. b − a. */
export function dayDiff(a: string, b: string): number {
  const da = new Date(`${a}T00:00:00`).getTime();
  const db = new Date(`${b}T00:00:00`).getTime();
  return Math.round((db - da) / 86_400_000);
}

/** Зсув від ключа на N днів. */
export function addDays(key: string, days: number): string {
  const d = new Date(`${key}T00:00:00`);
  d.setDate(d.getDate() + days);
  return todayKey(d);
}

/** Останні N днів, від найдавнішого до сьогоднішнього. */
export function lastNDays(n: number): string[] {
  const out: string[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    out.push(todayKey(d));
  }
  return out;
}

/** Назва короткого дня (Пн, Вт…) */
export function shortDayName(key: string): string {
  const names = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  return names[new Date(`${key}T00:00:00`).getDay()];
}

/** Назва місяця українською. */
export function monthName(monthIdx: number): string {
  const names = ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'];
  return names[monthIdx] ?? '';
}

/** Чи цей день — сьогодні. */
export function isToday(key: string): boolean {
  return key === todayKey();
}

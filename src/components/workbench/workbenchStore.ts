/**
 * In-memory store для стейту робочого столу (Workbench).
 *
 * Не персистимо в localStorage:
 * - чернетка великого розміру (canvas image data),
 * - стейт корисний лише в межах сесії,
 * - на наступну задачу — chе очищаємо явно.
 *
 * Ключ — `taskId`. Зберігаємо до 20 останніх задач, щоб обмежити пам'ять.
 */

export type WorkbenchTab = 'calc' | 'column' | 'pad';

export interface WorkbenchTaskState {
  /** Чи юзер реально вводив щось/малював для цієї задачі. */
  used: boolean;
  /** Останній активний таб (запам'ятовуємо щоб не перемикати на default). */
  lastTab?: WorkbenchTab;
  /** CalcStrip: рядки виразів. */
  calcLines?: string[];
  /** ColumnGrid: матриця цифр { rowKey: digits[] }. */
  columnState?: ColumnGridState;
  /** Scratchpad: data-URL канваса (PNG). */
  padDataUrl?: string;
}

export interface ColumnGridState {
  /** Який тип операції зафіксовано: + − × ÷. */
  op: '+' | '-' | '×' | '÷';
  /** Цифри-операнди як рядки (з провідними пробілами для вирівнювання). */
  operands: string[];
  /** Перенесення (carry) над кожним розрядом. */
  carries: string[];
  /** Цифри відповіді. */
  answer: string[];
  /** Для віднімання — зайняті розряди (borrow). */
  borrows?: string[];
  /** Для множення — проміжні рядки (часткові добутки). */
  partials?: string[][];
  /** Для ділення — записані частина частки + rem. */
  divisionWork?: string;
}

const MAX_ENTRIES = 20;
const store = new Map<string, WorkbenchTaskState>();

export function getTaskState(taskId: string): WorkbenchTaskState {
  return store.get(taskId) ?? { used: false };
}

export function setTaskState(taskId: string, state: WorkbenchTaskState): void {
  // Прибираємо найстаріший, якщо переповнено
  if (!store.has(taskId) && store.size >= MAX_ENTRIES) {
    const firstKey = store.keys().next().value;
    if (firstKey !== undefined) store.delete(firstKey);
  }
  store.set(taskId, state);
}

export function patchTaskState(
  taskId: string,
  patch: Partial<WorkbenchTaskState>,
): WorkbenchTaskState {
  const prev = getTaskState(taskId);
  const next: WorkbenchTaskState = { ...prev, ...patch };
  setTaskState(taskId, next);
  return next;
}

export function clearTaskState(taskId: string): void {
  store.delete(taskId);
}

/** Повертає true, якщо хоч щось є в одному з табів. */
export function hasContent(state: WorkbenchTaskState): boolean {
  if (state.calcLines?.some((l) => l.trim().length > 0)) return true;
  if (state.padDataUrl) return true;
  if (state.columnState?.answer.some((d) => d.trim().length > 0)) return true;
  if (state.columnState?.carries.some((d) => d.trim().length > 0)) return true;
  return false;
}

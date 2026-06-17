/**
 * ColumnGrid — структурована сітка для розв'язку стовпчиком.
 *
 * Парсить вираз із `task.question` (наприклад "12 345 + 6 789") і будує:
 *   - рядок переносів (carry) над верхнім числом,
 *   - два числа-операнди як readonly-сітку,
 *   - порожній рядок відповіді, де дитина клацає на клітинці й вводить цифру.
 *
 * Для віднімання — додатковий рядок "позик" (borrows) над верхнім числом.
 * Для множення/ділення — поки що простий показ операції без проміжних рядків
 * (можна розширити в наступній ітерації).
 */
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Eraser } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { ColumnExpr } from './workbenchUtils';
import type { ColumnGridState } from './workbenchStore';

interface Props {
  /** Розпарсений вираз. Якщо null — показуємо порожній стан. */
  expr: ColumnExpr | null;
  /** Початковий стан (з workbenchStore). */
  initial?: ColumnGridState;
  onChange: (state: ColumnGridState) => void;
  onFirstUse?: () => void;
}

export function ColumnGrid({ expr, initial, onChange, onFirstUse }: Props) {
  if (!expr) {
    return (
      <div className="p-6 text-center text-slate-500 text-sm">
        <div className="text-4xl mb-3">📐</div>
        <p className="font-bold mb-1">Сітка для стовпчика недоступна</p>
        <p className="text-xs">
          Цю задачу зручніше рахувати в табі «🧮 Обчислення» або «✏️ Чернетка».
        </p>
      </div>
    );
  }

  const aStr = String(expr.a);
  const bStr = String(expr.b);
  const isAddSub = expr.op === '+' || expr.op === '-';
  // Кількість стовпців: для +/- — max(a,b)+1 (для перенесення/одиниць)
  // для ×/÷ — окремий простіший рендер
  const cols = Math.max(aStr.length, bStr.length) + 1;

  const buildEmpty = (): ColumnGridState => ({
    op: expr.op,
    operands: [aStr.padStart(cols, ' '), bStr.padStart(cols, ' ')],
    carries: Array(cols).fill(' '),
    borrows: Array(cols).fill(' '),
    answer: Array(cols).fill(' '),
  });

  // Якщо initial не для цього виразу (бо expr змінився) — будуємо порожній
  const [state, setState] = useState<ColumnGridState>(() => {
    if (!initial) return buildEmpty();
    if (initial.op !== expr.op) return buildEmpty();
    if (initial.operands?.[0]?.trim() !== aStr) return buildEmpty();
    if (initial.operands?.[1]?.trim() !== bStr) return buildEmpty();
    return {
      ...initial,
      // на випадок якщо carries/answer мають іншу довжину
      carries:
        initial.carries.length === cols
          ? initial.carries
          : Array(cols).fill(' '),
      answer:
        initial.answer.length === cols ? initial.answer : Array(cols).fill(' '),
      borrows:
        initial.borrows && initial.borrows.length === cols
          ? initial.borrows
          : Array(cols).fill(' '),
    };
  });

  const firedFirstUse = useRef(false);
  const fireFirstUse = () => {
    if (!firedFirstUse.current && onFirstUse) {
      firedFirstUse.current = true;
      onFirstUse();
    }
  };

  useEffect(() => {
    onChange(state);
  }, [state, onChange]);

  const updateCell = (
    row: 'carry' | 'borrow' | 'answer',
    col: number,
    digit: string,
  ) => {
    fireFirstUse();
    setState((prev) => {
      const next = { ...prev };
      if (row === 'carry') {
        const arr = [...prev.carries];
        arr[col] = digit;
        next.carries = arr;
      } else if (row === 'borrow') {
        const arr = [...(prev.borrows ?? Array(cols).fill(' '))];
        arr[col] = digit;
        next.borrows = arr;
      } else {
        const arr = [...prev.answer];
        arr[col] = digit;
        next.answer = arr;
      }
      return next;
    });
  };

  const clear = () => {
    setState(buildEmpty());
  };

  const opSymbol = expr.op;
  const showBorrows = expr.op === '-';
  const showCarries = isAddSub;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto px-3 py-4">
        <div className="mx-auto inline-block">
          {/* Рядок переносів (тільки для + −) */}
          {showCarries && (
            <Row
              label="перенос"
              cells={state.carries}
              editable
              onChange={(col, d) => updateCell('carry', col, d)}
              cellClass="text-xs h-7 w-9 text-amber-600"
            />
          )}
          {/* Позики для віднімання — окрема стрічка зверху */}
          {showBorrows && (
            <Row
              label="позики"
              cells={state.borrows ?? Array(cols).fill(' ')}
              editable
              onChange={(col, d) => updateCell('borrow', col, d)}
              cellClass="text-xs h-7 w-9 text-rose-600"
            />
          )}

          {/* Перший операнд */}
          <Row
            cells={state.operands[0].split('')}
            editable={false}
            cellClass="text-2xl h-12 w-9 font-extrabold text-slate-800"
          />
          {/* Другий операнд із оператором */}
          <div className="flex items-center justify-end">
            <span className="text-2xl font-extrabold text-brand-600 mr-1 w-6 text-center">
              {opSymbol}
            </span>
            <Row
              cells={state.operands[1].split('')}
              editable={false}
              cellClass="text-2xl h-12 w-9 font-extrabold text-slate-800"
              inline
            />
          </div>
          {/* Лінія */}
          <div className="border-t-2 border-slate-700 my-1" />
          {/* Відповідь */}
          <Row
            cells={state.answer}
            editable
            onChange={(col, d) => updateCell('answer', col, d)}
            cellClass="text-2xl h-12 w-9 font-extrabold text-emerald-600"
          />
        </div>

        <p className="text-[11px] text-slate-400 text-center mt-4">
          Натисни на клітинку та введи цифру. Це чернетка — її ніхто не перевіряє.
        </p>
      </div>

      <div className="border-t border-slate-100 bg-slate-50 p-2 flex justify-end">
        <Button variant="ghost" size="sm" onClick={clear}>
          <Eraser size={14} className="mr-1" />
          Очистити
        </Button>
      </div>
    </div>
  );
}

interface RowProps {
  cells: string[];
  editable: boolean;
  onChange?: (col: number, digit: string) => void;
  cellClass: string;
  label?: string;
  inline?: boolean;
}

function Row({ cells, editable, onChange, cellClass, label, inline }: RowProps) {
  const content = (
    <div className="flex justify-end">
      {cells.map((d, i) => (
        <Cell
          key={i}
          digit={d}
          editable={editable}
          onChange={onChange ? (v) => onChange(i, v) : undefined}
          className={cellClass}
        />
      ))}
    </div>
  );
  if (inline) return content;
  return (
    <div className="flex items-center justify-end">
      {label && (
        <span className="text-[10px] text-slate-400 mr-2 w-14 text-right shrink-0">
          {label}
        </span>
      )}
      {content}
    </div>
  );
}

interface CellProps {
  digit: string;
  editable: boolean;
  onChange?: (v: string) => void;
  className: string;
}

function Cell({ digit, editable, onChange, className }: CellProps) {
  if (!editable) {
    return (
      <div
        className={clsx(
          'flex items-center justify-center tabular-nums',
          className,
        )}
      >
        {digit.trim() === '' ? '\u00A0' : digit}
      </div>
    );
  }
  return (
    <input
      value={digit.trim()}
      onChange={(e) => {
        const v = e.target.value.slice(-1);
        if (v === '' || /[0-9]/.test(v)) onChange?.(v || ' ');
      }}
      onFocus={(e) => e.target.select()}
      inputMode="numeric"
      maxLength={1}
      className={clsx(
        'flex items-center justify-center tabular-nums text-center bg-transparent outline-none rounded border border-dashed border-slate-200 focus:border-brand-400 focus:bg-brand-50/40',
        className,
      )}
    />
  );
}

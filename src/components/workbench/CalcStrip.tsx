/**
 * CalcStrip — багаторядковий калькулятор у стилі Soulver.
 *
 * Кожен рядок — окремий вираз. Натиснула «=» → рахуємо і фіксуємо результат
 * праворуч. Можна посилатися на попередній рядок через кнопку «↑ ans» (підставляє
 * попереднє значення). Підтримує `+ − × ÷ ( )` і десятковий розділювач — кому.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { ArrowUp, CornerDownLeft, X } from 'lucide-react';
import { evalStripLine } from '@/lib/calc-strip';

interface Props {
  /** Початкові рядки (з workbenchStore). */
  initialLines: string[];
  /** Викликається на кожну зміну з новим масивом рядків. */
  onChange: (lines: string[]) => void;
  /** Викликається 1 раз при першому фактичному вводі (для лічильника). */
  onFirstUse?: () => void;
}

export function CalcStrip({ initialLines, onChange, onFirstUse }: Props) {
  const [lines, setLines] = useState<string[]>(() =>
    initialLines.length ? initialLines : [''],
  );
  const [activeIdx, setActiveIdx] = useState<number>(initialLines.length || 0);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const firedFirstUse = useRef(false);

  // Обчислюємо результати каскадно (кожен рядок бачить ans попереднього)
  const results = useMemo(() => {
    const out: ReturnType<typeof evalStripLine>[] = [];
    let prev: number | undefined;
    for (const line of lines) {
      const r = evalStripLine(line, prev);
      out.push(r);
      if (r.ok && r.value !== undefined) prev = r.value;
    }
    return out;
  }, [lines]);

  useEffect(() => {
    onChange(lines);
  }, [lines, onChange]);

  const fireFirstUse = () => {
    if (!firedFirstUse.current && onFirstUse) {
      firedFirstUse.current = true;
      onFirstUse();
    }
  };

  const updateLine = (idx: number, val: string) => {
    fireFirstUse();
    setLines((prev) => prev.map((l, i) => (i === idx ? val : l)));
  };

  const addLine = (afterIdx: number) => {
    setLines((prev) => {
      const next = [...prev];
      next.splice(afterIdx + 1, 0, '');
      return next;
    });
    setActiveIdx(afterIdx + 1);
    setTimeout(() => inputRefs.current[afterIdx + 1]?.focus(), 0);
  };

  const removeLine = (idx: number) => {
    if (lines.length === 1) {
      setLines(['']);
      return;
    }
    setLines((prev) => prev.filter((_, i) => i !== idx));
    setActiveIdx(Math.max(0, idx - 1));
  };

  const insertAtCursor = (idx: number, text: string) => {
    fireFirstUse();
    const input = inputRefs.current[idx];
    if (!input) {
      updateLine(idx, lines[idx] + text);
      return;
    }
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    const before = input.value.slice(0, start);
    const after = input.value.slice(end);
    const next = before + text + after;
    updateLine(idx, next);
    setTimeout(() => {
      input.focus();
      const pos = start + text.length;
      input.setSelectionRange(pos, pos);
    }, 0);
  };

  const insertAns = () => {
    if (activeIdx === 0) return;
    insertAtCursor(activeIdx, 'ans');
  };

  const clearAll = () => {
    setLines(['']);
    setActiveIdx(0);
    setTimeout(() => inputRefs.current[0]?.focus(), 0);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Лента рядків */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1.5">
        {lines.map((line, idx) => {
          const r = results[idx];
          const isActive = activeIdx === idx;
          return (
            <div
              key={idx}
              className={clsx(
                'flex items-center gap-2 rounded-2xl border-2 px-3 py-2 transition',
                isActive
                  ? 'border-brand-400 bg-brand-50/40'
                  : 'border-slate-200 bg-white',
              )}
            >
              <span className="text-[10px] font-bold text-slate-400 w-5 shrink-0 text-center tabular-nums">
                {idx + 1}
              </span>
              <input
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                value={line}
                onChange={(e) => updateLine(idx, e.target.value)}
                onFocus={() => setActiveIdx(idx)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addLine(idx);
                  } else if (
                    e.key === 'Backspace' &&
                    line === '' &&
                    lines.length > 1
                  ) {
                    e.preventDefault();
                    removeLine(idx);
                  }
                }}
                placeholder="Вираз…"
                inputMode="decimal"
                autoComplete="off"
                spellCheck={false}
                className="flex-1 bg-transparent outline-none text-lg font-bold tabular-nums min-w-0"
              />
              <span
                className={clsx(
                  'text-base font-extrabold tabular-nums shrink-0',
                  r.ok
                    ? 'text-emerald-600'
                    : line.trim()
                      ? 'text-slate-400'
                      : 'text-transparent',
                )}
              >
                {r.display}
              </span>
              {lines.length > 1 && (
                <button
                  onClick={() => removeLine(idx)}
                  className="p-1 -mr-1 rounded-full text-slate-300 hover:text-rose-500 hover:bg-rose-50"
                  aria-label="Видалити рядок"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Панель швидких кнопок */}
      <div className="border-t border-slate-100 bg-slate-50 p-2">
        <div className="grid grid-cols-7 gap-1.5 mb-1.5">
          {(['7', '8', '9', '+', '−', '(', ')'] as const).map((k) => (
            <CalcKey key={k} onClick={() => insertAtCursor(activeIdx, k)}>
              {k}
            </CalcKey>
          ))}
          {(['4', '5', '6', '×', '÷', ',', 'C'] as const).map((k) => (
            <CalcKey
              key={k}
              variant={k === 'C' ? 'danger' : 'op'}
              onClick={() => {
                if (k === 'C') {
                  updateLine(activeIdx, '');
                  return;
                }
                insertAtCursor(activeIdx, k);
              }}
            >
              {k}
            </CalcKey>
          ))}
          {(['1', '2', '3'] as const).map((k) => (
            <CalcKey key={k} onClick={() => insertAtCursor(activeIdx, k)}>
              {k}
            </CalcKey>
          ))}
          <CalcKey
            variant="accent"
            disabled={activeIdx === 0}
            onClick={insertAns}
            ariaLabel="Підставити попередній результат"
          >
            <ArrowUp size={14} />
            ans
          </CalcKey>
          <CalcKey
            variant="op"
            onClick={() => {
              const r = results[activeIdx];
              if (r.ok && r.value !== undefined) addLine(activeIdx);
            }}
            ariaLabel="Новий рядок"
          >
            <CornerDownLeft size={14} />
          </CalcKey>
          <CalcKey variant="ghost" onClick={clearAll}>
            Все
          </CalcKey>
          <CalcKey
            variant="primary"
            onClick={() => insertAtCursor(activeIdx, '0')}
            colSpan={2}
          >
            0
          </CalcKey>
        </div>
        <p className="text-[10px] text-slate-400 text-center">
          Enter — новий рядок · «ans» — попередній результат
        </p>
      </div>
    </div>
  );
}

interface KeyProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'op' | 'accent' | 'primary' | 'ghost' | 'danger';
  colSpan?: number;
  ariaLabel?: string;
}

function CalcKey({
  children,
  onClick,
  disabled,
  variant = 'default',
  colSpan,
  ariaLabel,
}: KeyProps) {
  const variants: Record<NonNullable<KeyProps['variant']>, string> = {
    default: 'bg-white border-slate-200 text-slate-800 hover:border-brand-300',
    op: 'bg-white border-brand-200 text-brand-700 hover:border-brand-400',
    accent: 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100',
    primary: 'bg-brand-600 border-brand-600 text-white hover:bg-brand-700',
    ghost: 'bg-transparent border-slate-200 text-slate-500 hover:bg-slate-100',
    danger: 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={clsx(
        'h-11 rounded-xl border-2 font-extrabold text-base flex items-center justify-center gap-1 transition active:scale-95 disabled:opacity-40 disabled:active:scale-100',
        variants[variant],
        colSpan === 2 && 'col-span-2',
      )}
    >
      {children}
    </button>
  );
}

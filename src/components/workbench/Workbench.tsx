/**
 * Workbench — головний компонент-парасолька з трьома інструментами.
 *
 * Відкривається як bottom-sheet із задачі. Має 3 таби:
 * - 🧮 Обчислення (CalcStrip)
 * - 📐 Стовпчик (ColumnGrid)
 * - ✏️ Чернетка (Scratchpad)
 *
 * Дефолтний таб обирається за `topicId`. Стейт зберігається в memory store
 * за `taskId` — закрив/відкрив за час задачі = все на місці.
 *
 * Виклик `onUsed(taskId, correct)` зробити має батьківський Task.tsx —
 * не в момент відкриття, а коли дитина натиснула «Перевірити» і вже
 * фактично писала в робочому столі (used = true).
 */
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Calculator, Columns3, PenLine, X } from 'lucide-react';
import type { TopicId } from '@/store/profile';
import { CalcStrip } from './CalcStrip';
import { ColumnGrid } from './ColumnGrid';
import { Scratchpad } from './Scratchpad';
import {
  getTaskState,
  patchTaskState,
  type WorkbenchTab,
} from './workbenchStore';
import { defaultTabForTopic, parseColumnExpression } from './workbenchUtils';

interface Props {
  open: boolean;
  onClose: () => void;
  taskId: string;
  topicId: TopicId | null | undefined;
  question: string;
}

export function Workbench({ open, onClose, taskId, topicId, question }: Props) {
  const initialState = getTaskState(taskId);
  const columnExpr = parseColumnExpression(question);

  // Дефолтний таб: останній використаний для цієї задачі, або вибір за темою.
  // Якщо тема — column, але вираз не парситься → fallback на calc.
  const initialTab: WorkbenchTab =
    initialState.lastTab ??
    (topicId === 'column' && !columnExpr
      ? 'calc'
      : defaultTabForTopic(topicId));

  const [tab, setTab] = useState<WorkbenchTab>(initialTab);

  // При зміні задачі — підхопити її стейт. (Сам компонент live-mounted.)
  useEffect(() => {
    const s = getTaskState(taskId);
    setTab(
      s.lastTab ??
        (topicId === 'column' && !columnExpr
          ? 'calc'
          : defaultTabForTopic(topicId)),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  // Зберігаємо обраний таб у store
  useEffect(() => {
    if (open) patchTaskState(taskId, { lastTab: tab });
  }, [tab, open, taskId]);

  // ESC закриває
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const markUsed = () => patchTaskState(taskId, { used: true });

  // Чи ColumnGrid має сенс для цієї задачі
  const columnAvailable = !!columnExpr;

  return (
    <>
      {/* Backdrop */}
      <div
        className={clsx(
          'fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={clsx(
          'fixed bottom-0 left-0 right-0 z-50 bg-slate-50 rounded-t-3xl shadow-2xl flex flex-col transition-transform duration-300',
          'h-[78vh] max-h-[640px]',
          open ? 'translate-y-0' : 'translate-y-full',
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Робочий стіл"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-2 pb-1 shrink-0">
          <div className="w-10 h-1.5 rounded-full bg-slate-300" />
        </div>

        {/* Header з табами */}
        <div className="flex items-center px-3 pb-2 gap-1 shrink-0 border-b border-slate-200">
          <TabButton
            active={tab === 'calc'}
            onClick={() => setTab('calc')}
            icon={<Calculator size={16} />}
            label="Обчислення"
          />
          <TabButton
            active={tab === 'column'}
            onClick={() => setTab('column')}
            icon={<Columns3 size={16} />}
            label="Стовпчик"
            disabled={!columnAvailable}
          />
          <TabButton
            active={tab === 'pad'}
            onClick={() => setTab('pad')}
            icon={<PenLine size={16} />}
            label="Чернетка"
          />
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 ml-auto shrink-0"
            aria-label="Закрити"
          >
            <X size={18} />
          </button>
        </div>

        {/* Контент табу */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {tab === 'calc' && (
            <CalcStrip
              key={taskId + '-calc'}
              initialLines={initialState.calcLines ?? []}
              onChange={(calcLines) => patchTaskState(taskId, { calcLines })}
              onFirstUse={markUsed}
            />
          )}
          {tab === 'column' && (
            <ColumnGrid
              key={taskId + '-column'}
              expr={columnExpr}
              initial={initialState.columnState}
              onChange={(columnState) =>
                patchTaskState(taskId, { columnState })
              }
              onFirstUse={markUsed}
            />
          )}
          {tab === 'pad' && (
            <Scratchpad
              key={taskId + '-pad'}
              initialDataUrl={initialState.padDataUrl}
              onChange={(padDataUrl) => patchTaskState(taskId, { padDataUrl })}
              onFirstUse={markUsed}
            />
          )}
        </div>
      </div>
    </>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
}

function TabButton({ active, onClick, icon, label, disabled }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'h-9 px-3 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition',
        active
          ? 'bg-brand-600 text-white'
          : 'text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-transparent',
      )}
    >
      {icon}
      {label}
    </button>
  );
}

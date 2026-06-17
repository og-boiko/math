/**
 * Scratchpad — простий canvas для рукописних обчислень.
 *
 * Підтримка:
 * - PointerEvent (мишка / тач / стілус)
 * - Pressure-sensitivity (de stylus)
 * - Олівець / гумка (товщина 4 / 30)
 * - Чотири кольори (синій за замовч.)
 * - Збереження/відновлення через PNG data-URL
 *
 * Без зовнішніх бібліотек.
 */
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Eraser, Pencil, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Props {
  initialDataUrl?: string;
  onChange: (dataUrl: string | undefined) => void;
  onFirstUse?: () => void;
}

const COLORS = ['#1d4ed8', '#0f766e', '#c2410c', '#9d174d'] as const;
type Tool = 'pen' | 'eraser';

export function Scratchpad({ initialDataUrl, onChange, onFirstUse }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const drawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const firedFirstUse = useRef(false);

  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState<string>(COLORS[0]);

  // Ініціалізація + restore + ресайз при відкритті
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    const { clientWidth, clientHeight } = wrap;
    canvas.width = clientWidth * dpr;
    canvas.height = clientHeight * dpr;
    canvas.style.width = `${clientWidth}px`;
    canvas.style.height = `${clientHeight}px`;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    // Білий фон
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, clientWidth, clientHeight);
    // Restore
    if (initialDataUrl) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, clientWidth, clientHeight);
      img.src = initialDataUrl;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fireFirstUse = () => {
    if (!firedFirstUse.current && onFirstUse) {
      firedFirstUse.current = true;
      onFirstUse();
    }
  };

  const flush = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onChange(canvas.toDataURL('image/png'));
  };

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    lastPosRef.current = getPos(e);
    fireFirstUse();
  };

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const ctx = canvasRef.current?.getContext('2d');
    const last = lastPosRef.current;
    if (!ctx || !last) return;
    const pos = getPos(e);
    const pressure = e.pressure > 0 && e.pressure !== 0.5 ? e.pressure : 0.5;
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 22;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = 2 + pressure * 4;
    }
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPosRef.current = pos;
  };

  const onUp = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    lastPosRef.current = null;
    flush();
  };

  const clearAll = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const wrap = wrapRef.current;
    if (!canvas || !ctx || !wrap) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, wrap.clientWidth, wrap.clientHeight);
    onChange(undefined);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Полотно */}
      <div ref={wrapRef} className="flex-1 relative bg-white touch-none">
        <canvas
          ref={canvasRef}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          className="absolute inset-0 w-full h-full"
          style={{
            // тонка сітка фоном (5мм)
            backgroundImage:
              'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            cursor: tool === 'eraser' ? 'cell' : 'crosshair',
          }}
        />
      </div>

      {/* Тулбар */}
      <div className="border-t border-slate-100 bg-slate-50 p-2 flex items-center gap-2">
        <button
          onClick={() => setTool('pen')}
          className={clsx(
            'h-10 px-3 rounded-xl border-2 font-bold text-sm flex items-center gap-1 transition active:scale-95',
            tool === 'pen'
              ? 'bg-brand-600 border-brand-600 text-white'
              : 'bg-white border-slate-200 text-slate-700',
          )}
          aria-label="Олівець"
        >
          <Pencil size={14} /> Олівець
        </button>
        <button
          onClick={() => setTool('eraser')}
          className={clsx(
            'h-10 px-3 rounded-xl border-2 font-bold text-sm flex items-center gap-1 transition active:scale-95',
            tool === 'eraser'
              ? 'bg-rose-500 border-rose-500 text-white'
              : 'bg-white border-slate-200 text-slate-700',
          )}
          aria-label="Гумка"
        >
          <Eraser size={14} /> Гумка
        </button>

        {/* Палітра — лише в режимі олівця */}
        {tool === 'pen' && (
          <div className="flex gap-1 ml-1">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={clsx(
                  'w-7 h-7 rounded-full border-2 transition active:scale-90',
                  color === c ? 'border-slate-900 scale-110' : 'border-white',
                )}
                style={{ backgroundColor: c }}
                aria-label={`Колір ${c}`}
              />
            ))}
          </div>
        )}

        <div className="flex-1" />

        <Button variant="ghost" size="sm" onClick={clearAll}>
          <RotateCcw size={14} className="mr-1" />
          Очистити
        </Button>
      </div>
    </div>
  );
}

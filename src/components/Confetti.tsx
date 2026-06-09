import { useEffect, useState } from 'react';

interface Piece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  rotate: number;
}

const COLORS = ['#f59e0b', '#10b981', '#ec4899', '#8b5cf6', '#3b82f6', '#ef4444'];

/**
 * Просте CSS-конфеті без зовнішніх бібліотек.
 * Не використовується @keyframes inline — додано у globals.css.
 */
export function Confetti({ count = 60, durationMs = 2500 }: { count?: number; durationMs?: number }) {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [show, setShow] = useState(true);

  useEffect(() => {
    setPieces(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 400,
        duration: 1500 + Math.random() * 1500,
        color: COLORS[i % COLORS.length],
        rotate: Math.random() * 360,
      })),
    );
    const t = setTimeout(() => setShow(false), durationMs + 1000);
    return () => clearTimeout(t);
  }, [count, durationMs]);

  if (!show) return null;

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-40">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-[-20px] w-2 h-3 rounded-sm animate-confetti"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}ms`,
            animationDuration: `${p.duration}ms`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

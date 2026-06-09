import { useEffect, useState } from 'react';
import { useProfileStore } from '@/store/profile';
import { findAchievement } from '@/features/achievements/registry';
import { playSound } from '@/lib/sounds';

/**
 * Глобальний тостер для нових ачивок.
 * Показується «згори» на 3.5с, по черзі.
 */
export function AchievementToast() {
  const pending = useProfileStore((s) => s.profile?.pendingAchievements ?? []);
  const consume = useProfileStore((s) => s.consumePendingAchievements);
  const [queue, setQueue] = useState<string[]>([]);
  const [current, setCurrent] = useState<string | null>(null);

  // Затягуємо нові ачивки в локальну чергу і одразу очищуємо з profile.
  useEffect(() => {
    if (pending.length > 0) {
      const ids = consume();
      if (ids.length) {
        setQueue((q) => [...q, ...ids]);
      }
    }
  }, [pending.length, consume]);

  useEffect(() => {
    if (!current && queue.length > 0) {
      const [next, ...rest] = queue;
      setCurrent(next);
      setQueue(rest);
      playSound('levelup');
      const t = setTimeout(() => setCurrent(null), 3500);
      return () => clearTimeout(t);
    }
  }, [current, queue]);

  if (!current) return null;
  const a = findAchievement(current);
  if (!a) return null;

  return (
    <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 max-w-sm animate-toast-in">
        <div className="text-3xl">{a.emoji}</div>
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wide font-bold opacity-90">
            Нова ачивка!
          </div>
          <div className="font-extrabold truncate">{a.title}</div>
          <div className="text-xs opacity-90 truncate">{a.description}</div>
        </div>
      </div>
    </div>
  );
}

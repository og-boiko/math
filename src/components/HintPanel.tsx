import { Eye, Lightbulb } from 'lucide-react';
import { Button } from './ui/Button';

interface Props {
  hints: string[];
  hintLevel: number;
  solution: string;
  solutionShown: boolean;
  onUseHint: () => void;
  onShowSolution: () => void;
}

export function HintPanel({
  hints,
  hintLevel,
  solution,
  solutionShown,
  onUseHint,
  onShowSolution,
}: Props) {
  const canUseHint = hintLevel < hints.length && !solutionShown;
  return (
    <div className="space-y-3">
      {hints.slice(0, hintLevel).map((h, i) => (
        <div
          key={i}
          className="rounded-2xl bg-amber-50 border border-amber-200 p-3 text-amber-900 text-sm"
        >
          <div className="flex items-start gap-2">
            <Lightbulb size={18} className="shrink-0 mt-0.5" />
            <p>{h}</p>
          </div>
        </div>
      ))}
      {solutionShown && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-emerald-900 text-sm">
          <div className="flex items-start gap-2">
            <Eye size={18} className="shrink-0 mt-0.5" />
            <p className="font-semibold">{solution}</p>
          </div>
        </div>
      )}
      {!solutionShown && (
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={onUseHint} disabled={!canUseHint}>
            <Lightbulb size={16} className="mr-1" />
            Підказка ({hintLevel}/{hints.length})
          </Button>
          <Button variant="ghost" size="sm" onClick={onShowSolution}>
            Показати рішення
          </Button>
        </div>
      )}
    </div>
  );
}

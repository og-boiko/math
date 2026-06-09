import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '@/store/profile';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function Welcome() {
  const initProfile = useProfileStore((s) => s.initProfile);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [age, setAge] = useState(10);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    initProfile({ name: name.trim(), age });
    navigate('/theme-select');
  };

  return (
    <div className="container-app min-h-screen flex flex-col justify-center">
      <div className="text-center mb-6">
        <div className="text-6xl mb-2">🧠✨</div>
        <h1 className="text-3xl font-extrabold text-brand-700">MathQuest</h1>
        <p className="text-slate-600 mt-1">Тренуйся щодня — стань майстром математики!</p>
      </div>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Як тебе звати?</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl border-2 border-slate-200 focus:border-brand-400 outline-none text-lg"
              placeholder="Артем"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Скільки тобі років?
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value) || 10)}
              min={6}
              max={14}
              className="w-full h-12 px-4 rounded-2xl border-2 border-slate-200 focus:border-brand-400 outline-none text-lg"
            />
          </div>
          <Button type="submit" fullWidth size="lg" disabled={!name.trim()}>
            Поїхали!
          </Button>
        </form>
      </Card>
    </div>
  );
}

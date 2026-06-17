import { useState, type FormEvent, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cloud, Rocket, Sparkles } from 'lucide-react';
import { useProfileStore } from '@/store/profile';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cloudEnabled } from '@/cloud/supabase';

type Mode = 'menu' | 'guest';

export function Welcome() {
  const initProfile = useProfileStore((s) => s.initProfile);
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('menu');
  const [name, setName] = useState('');
  const [age, setAge] = useState(10);

  const handleGuestSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    initProfile({ name: name.trim(), age });
    navigate('/theme-select');
  };

  return (
    <div className="container-app min-h-screen flex flex-col justify-center py-8">
      <div className="text-center mb-6">
        <div className="text-6xl mb-2">🧠✨</div>
        <h1 className="text-4xl font-extrabold text-brand-700">YaKMath</h1>
        <p className="text-slate-600 mt-1">
          Математика як гра. Щодня по трохи — і ти бос.
        </p>
      </div>

      {mode === 'guest' ? (
        <GuestForm
          name={name}
          age={age}
          onName={setName}
          onAge={setAge}
          onSubmit={handleGuestSubmit}
          onBack={() => setMode('menu')}
        />
      ) : (
        <MenuCards
          cloudOn={cloudEnabled}
          onAuth={() => navigate('/auth')}
          onGuest={() => setMode('guest')}
        />
      )}
    </div>
  );
}

function MenuCards(props: {
  cloudOn: boolean;
  onAuth: () => void;
  onGuest: () => void;
}) {
  return (
    <div className="space-y-3">
      {props.cloudOn && (
        <ChoiceCard
          icon={<Cloud size={26} />}
          tone="brand"
          title="Створити акаунт або увійти"
          desc="Прогрес у хмарі — заходь з телефону, планшета чи ноутбука."
          cta="Email + пароль"
          onClick={props.onAuth}
        />
      )}

      <ChoiceCard
        icon={<Rocket size={26} />}
        tone="emerald"
        title="Спробувати без акаунту"
        desc={
          props.cloudOn
            ? 'Швидкий старт. Прогрес залишиться лише в цьому браузері.'
            : 'Створи локальний профіль — прогрес у цьому браузері.'
        }
        cta="Поїхали"
        onClick={props.onGuest}
      />

      <p className="text-xs text-slate-500 text-center pt-3 flex items-center justify-center gap-1">
        <Sparkles size={12} />
        Без реклами. Жодних PII від дитини не збираємо.
      </p>
    </div>
  );
}

function ChoiceCard(props: {
  icon: ReactNode;
  tone: 'brand' | 'emerald';
  title: string;
  desc: string;
  cta: string;
  onClick: () => void;
}) {
  const tones = {
    brand: {
      bg: 'bg-brand-50 border-brand-200 hover:border-brand-400',
      icon: 'bg-brand-500 text-white',
      btn: 'bg-brand-600 text-white',
    },
    emerald: {
      bg: 'bg-emerald-50 border-emerald-200 hover:border-emerald-400',
      icon: 'bg-emerald-500 text-white',
      btn: 'bg-emerald-600 text-white',
    },
  }[props.tone];

  return (
    <button
      onClick={props.onClick}
      className={`w-full text-left rounded-3xl border-2 p-4 transition-all active:scale-[0.99] ${tones.bg}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${tones.icon}`}
        >
          {props.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-extrabold text-slate-900 text-lg leading-tight">
            {props.title}
          </div>
          <p className="text-sm text-slate-600 mt-0.5 leading-snug">{props.desc}</p>
          <span
            className={`inline-block mt-2 text-xs font-bold px-3 py-1.5 rounded-full ${tones.btn}`}
          >
            {props.cta} →
          </span>
        </div>
      </div>
    </button>
  );
}

function GuestForm(props: {
  name: string;
  age: number;
  onName: (v: string) => void;
  onAge: (v: number) => void;
  onSubmit: (e: FormEvent) => void;
  onBack: () => void;
}) {
  return (
    <Card>
      <button
        onClick={props.onBack}
        className="text-xs text-slate-500 mb-3 hover:text-slate-700"
      >
        ← Назад до вибору
      </button>
      <h2 className="text-xl font-extrabold mb-1">Локальний профіль</h2>
      <p className="text-xs text-slate-500 mb-4">
        Прогрес зберігатиметься лише в цьому браузері.
      </p>
      <form onSubmit={props.onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">
            Як тебе звати?
          </label>
          <input
            type="text"
            value={props.name}
            onChange={(e) => props.onName(e.target.value)}
            className="w-full h-12 px-4 rounded-2xl border-2 border-slate-200 focus:border-brand-400 outline-none text-lg"
            placeholder="Артем"
            autoFocus
            maxLength={20}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">
            Скільки тобі років?
          </label>
          <input
            type="number"
            value={props.age}
            onChange={(e) => props.onAge(Number(e.target.value) || 10)}
            min={6}
            max={14}
            className="w-full h-12 px-4 rounded-2xl border-2 border-slate-200 focus:border-brand-400 outline-none text-lg"
          />
        </div>
        <Button type="submit" fullWidth size="lg" disabled={!props.name.trim()}>
          Поїхали! 🚀
        </Button>
      </form>
    </Card>
  );
}

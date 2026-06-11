import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cloudEnabled, supabase } from '@/cloud/supabase';
import { getOrCreateMyProfile, fetchMySnapshot } from '@/cloud/api/me';
import { useProfileStore } from '@/store/profile';

type Mode = 'login' | 'signup';
type ThemeId = 'space' | 'dino' | 'world' | 'voxel' | 'blocky';

const THEMES: Array<{ id: ThemeId; emoji: string; label: string }> = [
  { id: 'space', emoji: '🚀', label: 'Космос' },
  { id: 'dino', emoji: '🦕', label: 'Динозаври' },
  { id: 'world', emoji: '🌍', label: 'Світ' },
  { id: 'voxel', emoji: '🟩', label: 'Воксель' },
  { id: 'blocky', emoji: '🟪', label: 'Блочний' },
];

export function Auth() {
  const navigate = useNavigate();
  const initProfile = useProfileStore((s) => s.initProfile);
  const setTheme = useProfileStore((s) => s.setTheme);
  const hydrateFromSnapshot = useProfileStore((s) => s.hydrateFromSnapshot);

  const [mode, setMode] = useState<Mode>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState(10);
  const [theme, setThemeLocal] = useState<ThemeId>('space');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!cloudEnabled) {
    return (
      <div className="container-app">
        <Card>
          <h2 className="text-xl font-extrabold mb-2">Хмара не підключена</h2>
          <p className="text-sm text-slate-600 mb-3">
            Задай <code>VITE_SUPABASE_URL</code> і{' '}
            <code>VITE_SUPABASE_ANON_KEY</code> у <code>.env.local</code>.
          </p>
          <Button onClick={() => navigate('/welcome')}>← Назад</Button>
        </Card>
      </div>
    );
  }

  const validate = (): string | null => {
    if (!email.includes('@')) return 'Перевір email.';
    if (password.length < 6) return 'Пароль ≥ 6 символів.';
    if (mode === 'signup') {
      if (!name.trim()) return 'Введи ім\'я.';
      if (age < 5 || age > 18) return 'Вік 5–18.';
    }
    return null;
  };

  const submit = async () => {
    setError(null);
    setInfo(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    const supa = supabase();
    if (!supa) return;

    setBusy(true);
    try {
      if (mode === 'login') {
        const { error: e1 } = await supa.auth.signInWithPassword({ email, password });
        if (e1) throw e1;
        // підтягнути існуючий профіль
        const snap = await fetchMySnapshot();
        if (!snap || !snap.child) {
          // в акаунті ще нема child_profile — попроси заповнити (як signup-форму)
          setMode('signup');
          setError(
            'У цьому акаунті ще нема профілю. Заповни ім\'я / вік / сетинг і натисни "Створити акаунт".',
          );
          setBusy(false);
          return;
        }
        hydrateFromSnapshot(snap);
        navigate('/');
      } else {
        const { data, error: e1 } = await supa.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (e1) {
          // Якщо акаунт уже існує — м'яко перемикаємось на login
          if (/already.*registered|user.*exists/i.test(e1.message)) {
            setMode('login');
            setError('Такий email уже зареєстровано. Введи пароль і натисни "Увійти".');
            setBusy(false);
            return;
          }
          throw e1;
        }

        if (!data.session) {
          setInfo('Перевір пошту для підтвердження, потім увійди.');
          setBusy(false);
          return;
        }

        // одразу маємо сесію → створюємо профіль
        const row = await getOrCreateMyProfile({
          display_name: name.trim(),
          age,
          theme,
        });
        if (!row) throw new Error('Не вдалося створити профіль.');

        // ініціалізуємо локальний store з тих самих даних
        initProfile({ name: row.display_name, age: row.age });
        setTheme(row.theme as ThemeId);
        navigate('/');
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container-app">
      <header className="text-center mb-5">
        <div className="text-5xl mb-2">🧠✨</div>
        <h1 className="text-3xl font-extrabold text-brand-700">
          {mode === 'signup' ? 'Створити акаунт' : 'Увійти'}
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          {mode === 'signup'
            ? 'Прогрес зберігатиметься в хмарі — заходь з будь-якого пристрою.'
            : 'З поверненням!'}
        </p>
      </header>

      <Card>
        <label className="block text-sm font-bold mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ти@приклад.com"
          className="w-full h-12 rounded-2xl border-2 border-slate-200 focus:border-brand-400 outline-none px-4 mb-3"
          autoComplete="email"
        />
        <label className="block text-sm font-bold mb-1">Пароль</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="мін. 6 символів"
          className="w-full h-12 rounded-2xl border-2 border-slate-200 focus:border-brand-400 outline-none px-4 mb-3"
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        />

        {mode === 'signup' && (
          <>
            <label className="block text-sm font-bold mb-1">Як тебе звати?</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Артем"
              maxLength={20}
              className="w-full h-12 rounded-2xl border-2 border-slate-200 focus:border-brand-400 outline-none px-4 mb-3"
            />
            <label className="block text-sm font-bold mb-1">Вік</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value) || 10)}
              min={5}
              max={18}
              className="w-full h-12 rounded-2xl border-2 border-slate-200 focus:border-brand-400 outline-none px-4 mb-3"
            />
            <label className="block text-sm font-bold mb-2">Сетинг гри</label>
            <div className="grid grid-cols-5 gap-2 mb-3">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setThemeLocal(t.id)}
                  className={`rounded-2xl border-2 p-2 text-xs font-bold transition ${
                    theme === t.id
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="text-2xl">{t.emoji}</div>
                  <div className="mt-0.5">{t.label}</div>
                </button>
              ))}
            </div>
          </>
        )}

        {error && <p className="text-sm text-rose-600 mb-2">{error}</p>}
        {info && <p className="text-sm text-emerald-700 mb-2">{info}</p>}

        <Button fullWidth onClick={submit} disabled={busy}>
          {busy ? 'Зачекай…' : mode === 'signup' ? 'Створити акаунт 🚀' : 'Увійти'}
        </Button>

        <button
          onClick={() => {
            setMode(mode === 'signup' ? 'login' : 'signup');
            setError(null);
            setInfo(null);
          }}
          className="block w-full mt-3 text-sm text-brand-700 underline"
        >
          {mode === 'signup' ? 'Уже є акаунт? Увійти' : 'Нема акаунта? Зареєструватись'}
        </button>
      </Card>

      <button
        onClick={() => navigate('/welcome')}
        className="mt-3 text-xs text-slate-500 underline mx-auto block"
      >
        ← Назад
      </button>

      <p className="text-xs text-slate-400 mt-4 text-center">
        Email потрібен лише для відновлення доступу.
      </p>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cloudEnabled, supabase } from '@/cloud/supabase';

type Mode = 'login' | 'signup';

/**
 * Email + password логін/реєстрація батька.
 */
export function ParentCloudLogin() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const submit = async () => {
    setError(null);
    setInfo(null);
    const supa = supabase();
    if (!supa) {
      setError('Хмара не підключена.');
      return;
    }
    if (!email.includes('@')) {
      setError('Перевір email.');
      return;
    }
    if (password.length < 6) {
      setError('Пароль має бути мінімум 6 символів.');
      return;
    }
    setBusy(true);
    try {
      if (mode === 'login') {
        const { error } = await supa.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/parent/family');
      } else {
        const { data, error } = await supa.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + '/parent/family' },
        });
        if (error) throw error;
        // Якщо в проєкті ВИМКНЕНО email confirmations — Supabase одразу віддає сесію.
        if (data.session) {
          navigate('/parent/family');
        } else {
          setInfo('Акаунт створено. Перевір пошту для підтвердження.');
        }
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (!cloudEnabled) {
    return (
      <div className="container-app">
        <Card>
          <h2 className="text-xl font-extrabold mb-2">Хмара не підключена</h2>
          <p className="text-sm text-slate-600 mb-3">
            Поки не задано <code>VITE_SUPABASE_URL</code> і{' '}
            <code>VITE_SUPABASE_ANON_KEY</code> у <code>.env.local</code>, хмара вимкнена.
          </p>
          <Button onClick={() => navigate('/parent/login')}>До PIN-логіну</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-app">
      <h1 className="text-2xl font-extrabold mb-4">
        {mode === 'login' ? 'Вхід для батьків' : 'Новий батьківський акаунт'}
      </h1>
      <Card>
        <label className="block text-sm font-bold mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="parent@example.com"
          className="w-full h-12 rounded-2xl border-2 border-slate-200 px-4 mb-3"
          autoComplete="email"
        />
        <label className="block text-sm font-bold mb-1">Пароль</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="мін. 6 символів"
          className="w-full h-12 rounded-2xl border-2 border-slate-200 px-4 mb-3"
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
          }}
        />

        {error && <p className="text-sm text-rose-600 mb-2">{error}</p>}
        {info && <p className="text-sm text-emerald-700 mb-2">{info}</p>}

        <Button fullWidth onClick={submit} disabled={busy}>
          {busy ? 'Зачекай…' : mode === 'login' ? 'Увійти' : 'Створити акаунт'}
        </Button>

        <button
          onClick={() => {
            setMode(mode === 'login' ? 'signup' : 'login');
            setError(null);
            setInfo(null);
          }}
          className="block w-full mt-3 text-sm text-brand-700 underline"
        >
          {mode === 'login'
            ? 'Ще нема акаунта? Зареєструватись'
            : 'Уже є акаунт? Увійти'}
        </button>
      </Card>

      <p className="text-xs text-slate-500 mt-4 text-center">
        Email потрібен лише для відновлення доступу. Жодних PII від дитини не збираємо.
      </p>
    </div>
  );
}

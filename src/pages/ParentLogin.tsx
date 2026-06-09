import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Lock } from 'lucide-react';
import { useProfileStore } from '@/store/profile';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { sha256 } from '@/lib/pin';

export function ParentLogin() {
  const navigate = useNavigate();
  const profile = useProfileStore((s) => s.profile)!;
  const updateSettings = useProfileStore((s) => s.updateSettings);
  const hasPin = Boolean(profile.settings.parentPinHash);

  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (pin.length < 4) {
      setError('PIN має бути від 4 цифр');
      return;
    }
    setBusy(true);
    const hash = await sha256(pin);
    setBusy(false);
    if (hash !== profile.settings.parentPinHash) {
      setError('Невірний PIN');
      return;
    }
    sessionStorage.setItem('parent-authed', '1');
    navigate('/parent');
  };

  const handleSetPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (pin.length < 4) {
      setError('Мінімум 4 цифри');
      return;
    }
    if (pin !== confirmPin) {
      setError('PIN не співпадають');
      return;
    }
    setBusy(true);
    const hash = await sha256(pin);
    updateSettings({ parentPinHash: hash });
    setBusy(false);
    sessionStorage.setItem('parent-authed', '1');
    navigate('/parent');
  };

  return (
    <div className="container-app min-h-screen flex flex-col">
      <header className="flex items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100"
          aria-label="Назад"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-extrabold ml-2">Батьківська панель</h1>
      </header>

      <Card className="flex-1">
        <div className="text-center mb-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-brand-100 flex items-center justify-center mb-2">
            <Lock size={28} className="text-brand-600" />
          </div>
          <h2 className="font-extrabold">
            {hasPin ? 'Введи PIN' : 'Налаштуй PIN'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {hasPin
              ? 'Доступ до статистики й керування'
              : 'Створи PIN, щоб захистити доступ до батьківської панелі'}
          </p>
        </div>

        {hasPin ? (
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              inputMode="numeric"
              autoFocus
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
              placeholder="PIN"
              className="w-full h-14 px-4 rounded-2xl border-2 border-slate-200 focus:border-brand-400 outline-none text-2xl text-center font-extrabold tracking-widest"
            />
            {error && <div className="text-sm text-rose-600 text-center">{error}</div>}
            <Button type="submit" fullWidth size="lg" disabled={busy || pin.length < 4}>
              Увійти
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSetPin} className="space-y-3">
            <input
              type="password"
              inputMode="numeric"
              autoFocus
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
              placeholder="Новий PIN (4–8 цифр)"
              className="w-full h-14 px-4 rounded-2xl border-2 border-slate-200 focus:border-brand-400 outline-none text-2xl text-center font-extrabold tracking-widest"
            />
            <input
              type="password"
              inputMode="numeric"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
              placeholder="Повтори PIN"
              className="w-full h-14 px-4 rounded-2xl border-2 border-slate-200 focus:border-brand-400 outline-none text-2xl text-center font-extrabold tracking-widest"
            />
            {error && <div className="text-sm text-rose-600 text-center">{error}</div>}
            <Button type="submit" fullWidth size="lg" disabled={busy || pin.length < 4}>
              Встановити PIN
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}

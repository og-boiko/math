import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Volume2, VolumeX, Target, Palette, Trash2, Shield } from 'lucide-react';
import { useProfileStore } from '@/store/profile';
import { themePacks } from '@/features/themes/registry';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { setSoundsEnabled, playSound } from '@/lib/sounds';

export function Settings() {
  const navigate = useNavigate();
  const profile = useProfileStore((s) => s.profile)!;
  const updateSettings = useProfileStore((s) => s.updateSettings);
  const updateDailyGoal = useProfileStore((s) => s.updateDailyGoal);
  const setTheme = useProfileStore((s) => s.setTheme);
  const resetProfile = useProfileStore((s) => s.resetProfile);

  const [showReset, setShowReset] = useState(false);

  const toggleSounds = () => {
    const next = !profile.settings.soundsEnabled;
    updateSettings({ soundsEnabled: next });
    setSoundsEnabled(next);
    if (next) playSound('correct');
  };

  const handleReset = () => {
    resetProfile();
    navigate('/welcome');
  };

  return (
    <div className="container-app">
      <header className="flex items-center mb-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100"
          aria-label="Назад"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-extrabold ml-2">Налаштування</h1>
      </header>

      {/* Звук */}
      <Card className="mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {profile.settings.soundsEnabled ? (
              <Volume2 size={22} className="text-brand-600" />
            ) : (
              <VolumeX size={22} className="text-slate-400" />
            )}
            <div>
              <div className="font-bold">Звукові ефекти</div>
              <div className="text-xs text-slate-500">
                Сигнали при правильних і помилкових відповідях
              </div>
            </div>
          </div>
          <button
            onClick={toggleSounds}
            className={`relative w-12 h-7 rounded-full transition ${profile.settings.soundsEnabled ? 'bg-brand-600' : 'bg-slate-300'}`}
            aria-label="toggle sounds"
          >
            <span
              className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${profile.settings.soundsEnabled ? 'translate-x-5' : ''}`}
            />
          </button>
        </div>
      </Card>

      {/* Щоденна ціль */}
      <Card className="mb-3">
        <div className="flex items-center gap-3 mb-3">
          <Target size={22} className="text-brand-600" />
          <div>
            <div className="font-bold">Щоденна ціль</div>
            <div className="text-xs text-slate-500">
              Скільки задач у день для зарахування дня
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[10, 20, 30, 50].map((n) => (
            <button
              key={n}
              onClick={() => updateDailyGoal({ type: 'tasks', value: n })}
              className={`h-12 rounded-2xl font-extrabold border-2 transition ${
                profile.dailyGoal.value === n
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-slate-200 hover:border-brand-300'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </Card>

      {/* Сетинг */}
      <Card className="mb-3">
        <div className="flex items-center gap-3 mb-3">
          <Palette size={22} className="text-brand-600" />
          <div>
            <div className="font-bold">Сетинг</div>
            <div className="text-xs text-slate-500">Візуальний світ тренувань</div>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {Object.values(themePacks).map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`flex flex-col items-center p-2 rounded-2xl border-2 transition ${
                profile.theme === t.id
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-slate-200 hover:border-brand-300'
              }`}
              title={t.name}
            >
              <span className="text-2xl">{t.emoji}</span>
              <span className="text-[10px] mt-0.5 text-slate-600 truncate w-full text-center">
                {t.name}
              </span>
            </button>
          ))}
        </div>
      </Card>

      {/* Батьківська панель */}
      <Card className="mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield size={22} className="text-brand-600" />
            <div>
              <div className="font-bold">Батьківська панель</div>
              <div className="text-xs text-slate-500">
                {profile.settings.parentPinHash
                  ? 'PIN встановлено'
                  : 'PIN ще не встановлено'}
              </div>
            </div>
          </div>
          <Button size="sm" variant="secondary" onClick={() => navigate('/parent')}>
            Відкрити
          </Button>
        </div>
      </Card>

      {/* Скидання */}
      <Card className="border-rose-200">
        <div className="flex items-center gap-3 mb-3">
          <Trash2 size={22} className="text-rose-500" />
          <div>
            <div className="font-bold text-rose-700">Скинути прогрес</div>
            <div className="text-xs text-slate-500">Видалить профіль і весь прогрес</div>
          </div>
        </div>
        {showReset ? (
          <div className="space-y-2">
            <p className="text-sm text-rose-700 font-semibold">
              Точно? Це не можна відмінити.
            </p>
            <div className="flex gap-2">
              <Button variant="danger" fullWidth onClick={handleReset}>
                Так, скинути
              </Button>
              <Button variant="ghost" fullWidth onClick={() => setShowReset(false)}>
                Скасувати
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="ghost" onClick={() => setShowReset(true)}>
            Скинути…
          </Button>
        )}
      </Card>

      <div className="text-center text-xs text-slate-400 mt-6">MathQuest v0.5</div>
    </div>
  );
}

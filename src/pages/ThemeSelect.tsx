import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useProfileStore } from '@/store/profile';
import { themePacks } from '@/features/themes/registry';

export function ThemeSelect() {
  const setTheme = useProfileStore((s) => s.setTheme);
  const profile = useProfileStore((s) => s.profile);
  const navigate = useNavigate();

  return (
    <div className="container-app">
      <h1 className="text-2xl font-extrabold text-center mt-4 mb-1">
        Привіт, {profile?.name}! 👋
      </h1>
      <p className="text-center text-slate-600 mb-6">
        Обери світ, у якому будеш тренуватися:
      </p>
      <div className="space-y-3">
        {Object.values(themePacks).map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTheme(t.id);
              navigate('/');
            }}
            className={clsx(
              'block w-full p-5 rounded-3xl text-left shadow-md active:scale-[0.98] transition',
              t.cardClass,
            )}
          >
            <div className="flex items-center gap-4">
              <div className="text-5xl">{t.emoji}</div>
              <div className="flex-1">
                <div className="text-xl font-extrabold">{t.name}</div>
                <div className="text-sm opacity-90">{t.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
      <p className="text-center text-xs text-slate-400 mt-6">
        Можна буде змінити пізніше в налаштуваннях
      </p>
    </div>
  );
}

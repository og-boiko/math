import { useEffect, type ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useProfileStore } from '@/store/profile';
import { setSoundsEnabled } from '@/lib/sounds';
import { Welcome } from '@/pages/Welcome';
import { ThemeSelect } from '@/pages/ThemeSelect';
import { Hub } from '@/pages/Hub';
import { Practice } from '@/pages/Practice';
import { TaskPage } from '@/pages/Task';
import { Results } from '@/pages/Results';
import { Exams } from '@/pages/Exams';
import { Errors } from '@/pages/Errors';
import { Settings } from '@/pages/Settings';
import { Profile } from '@/pages/Profile';
import { Calendar } from '@/pages/Calendar';
import { WorldMap } from '@/pages/WorldMap';
import { ParentLogin } from '@/pages/ParentLogin';
import { ParentPanel } from '@/pages/ParentPanel';
import { AchievementToast } from '@/components/AchievementToast';

function RequireProfile({ children }: { children: ReactNode }) {
  const profile = useProfileStore((s) => s.profile);
  if (!profile?.name) return <Navigate to="/welcome" replace />;
  if (!profile?.theme) return <Navigate to="/theme-select" replace />;
  return <>{children}</>;
}

function RequireParent({ children }: { children: ReactNode }) {
  const profile = useProfileStore((s) => s.profile);
  if (!profile?.name) return <Navigate to="/welcome" replace />;
  // Без PIN — спочатку до сторінки створення
  if (!profile.settings.parentPinHash) return <Navigate to="/parent/login" replace />;
  // PIN є, але ще не введений у поточній сесії
  if (sessionStorage.getItem('parent-authed') !== '1') {
    return <Navigate to="/parent/login" replace />;
  }
  return <>{children}</>;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function App() {
  const soundsEnabled = useProfileStore((s) => s.profile?.settings.soundsEnabled);
  useEffect(() => {
    setSoundsEnabled(soundsEnabled ?? true);
  }, [soundsEnabled]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AchievementToast />
      <Routes>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/theme-select" element={<ThemeSelect />} />
        <Route path="/" element={<RequireProfile><Hub /></RequireProfile>} />
        <Route path="/practice" element={<RequireProfile><Practice /></RequireProfile>} />
        <Route path="/exams" element={<RequireProfile><Exams /></RequireProfile>} />
        <Route path="/errors" element={<RequireProfile><Errors /></RequireProfile>} />
        <Route path="/task" element={<RequireProfile><TaskPage /></RequireProfile>} />
        <Route path="/results" element={<RequireProfile><Results /></RequireProfile>} />
        <Route path="/settings" element={<RequireProfile><Settings /></RequireProfile>} />
        <Route path="/profile" element={<RequireProfile><Profile /></RequireProfile>} />
        <Route path="/calendar" element={<RequireProfile><Calendar /></RequireProfile>} />
        <Route path="/map" element={<RequireProfile><WorldMap /></RequireProfile>} />
        <Route path="/parent/login" element={<RequireProfile><ParentLogin /></RequireProfile>} />
        <Route path="/parent" element={<RequireParent><ParentPanel /></RequireParent>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

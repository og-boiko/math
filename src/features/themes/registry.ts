import type { ThemeId } from '@/store/profile';

export interface ThemePack {
  id: ThemeId;
  name: string;
  emoji: string;
  hero: string;
  currency: string;
  cardClass: string;
  description: string;
}

export const themePacks: Record<ThemeId, ThemePack> = {
  space: {
    id: 'space',
    name: 'Космос',
    emoji: '🚀',
    hero: 'Астронавт',
    currency: 'Кристали',
    cardClass: 'bg-gradient-to-br from-indigo-900 via-purple-800 to-slate-900 text-white',
    description: 'Подорож сонячною системою. Планети — це теми, бос — чорна діра.',
  },
  dino: {
    id: 'dino',
    name: 'Динозаври',
    emoji: '🦖',
    hero: 'Палеонтолог',
    currency: 'Бурштин',
    cardClass: 'bg-gradient-to-br from-amber-200 via-orange-200 to-emerald-300 text-emerald-950',
    description: "Епохи динозаврів, розкопки, скам'янілості, тиранозавр-бос.",
  },
  world: {
    id: 'world',
    name: 'Подорож світом',
    emoji: '🌍',
    hero: 'Мандрівник',
    currency: 'Монети',
    cardClass: 'bg-gradient-to-br from-sky-300 via-cyan-200 to-blue-300 text-sky-950',
    description: 'Континенти, країни, цікаві факти й артефакти.',
  },
  voxel: {
    id: 'voxel',
    name: 'Воксельний світ',
    emoji: '🧱',
    hero: 'Будівельник',
    currency: 'Смарагди',
    cardClass: 'bg-gradient-to-br from-emerald-300 via-lime-200 to-green-400 text-emerald-950',
    description: 'Біоми, печери, нетер. Кубічний світ із пригодами.',
  },
  blocky: {
    id: 'blocky',
    name: 'Блочний світ',
    emoji: '🟦',
    hero: 'Аватар-блок',
    currency: 'Зірочки',
    cardClass: 'bg-gradient-to-br from-pink-300 via-fuchsia-300 to-violet-400 text-white',
    description: 'Обби-світи, паркур, бос-обба.',
  },
};

export function getThemePack(id: ThemeId | null | undefined): ThemePack {
  return themePacks[id ?? 'space'];
}

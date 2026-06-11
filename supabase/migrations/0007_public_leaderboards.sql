-- =====================================================================
-- 0007_public_leaderboards.sql
-- Виправлення RLS на лідерборді: чужі рядки не показувались, бо EXISTS
-- проти child_profiles підпадав під family-only RLS.
--
-- Логіка opt-in зашита в "записі" (refresh_leaderboards_for видаляє
-- рядки якщо leaderboard_opt_in=false), тому policy на читанні робимо
-- безумовною.
-- =====================================================================

drop policy if exists lw_public_read on public.leaderboard_weekly_xp;
drop policy if exists ls_public_read on public.leaderboard_streak;
drop policy if exists lsx_public_read on public.leaderboard_season_xp;

create policy lw_public_read on public.leaderboard_weekly_xp
  for select using (true);

create policy ls_public_read on public.leaderboard_streak
  for select using (true);

create policy lsx_public_read on public.leaderboard_season_xp
  for select using (true);

-- На випадок якщо в борді залишились рядки користувачів які потім
-- зробили opt-out — вичистимо одноразово
delete from public.leaderboard_weekly_xp lw
using public.child_profiles cp
where cp.id = lw.profile_id and cp.leaderboard_opt_in = false;

delete from public.leaderboard_streak ls
using public.child_profiles cp
where cp.id = ls.profile_id and cp.leaderboard_opt_in = false;

delete from public.leaderboard_season_xp lsx
using public.child_profiles cp
where cp.id = lsx.profile_id and cp.leaderboard_opt_in = false;

-- Backfill: для всіх існуючих opt-in профілів запустимо refresh,
-- щоб ті, що зареєструвались до 0007, теж з'явились
do $$
declare
  r record;
begin
  for r in select id from public.child_profiles where leaderboard_opt_in = true
  loop
    perform public.refresh_leaderboards_for(r.id);
  end loop;
end;
$$;

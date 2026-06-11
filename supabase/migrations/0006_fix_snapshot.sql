-- =====================================================================
-- 0006_fix_snapshot.sql
-- Фікс: order by + limit всередині jsonb_agg() треба робити в підзапиті,
-- інакше Postgres скаржиться "column ... must appear in the GROUP BY clause".
-- =====================================================================

create or replace function public.get_my_full_snapshot()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_profile public.child_profiles;
  v_stats   public.profile_stats;
begin
  if v_user is null then raise exception 'not_authenticated'; end if;

  select cp.* into v_profile
  from public.child_profiles cp
  join public.family_members fm on fm.family_id = cp.family_id
  where fm.user_id = v_user
  limit 1;

  if v_profile.id is null then return null; end if;

  select * into v_stats from public.profile_stats where profile_id = v_profile.id;

  return jsonb_build_object(
    'child', to_jsonb(v_profile),
    'stats', to_jsonb(v_stats),
    'topics', coalesce(
      (select jsonb_agg(to_jsonb(t)) from public.topic_progress t
        where t.profile_id = v_profile.id),
      '[]'::jsonb
    ),
    'activity', coalesce(
      (
        select jsonb_agg(to_jsonb(a))
        from (
          select *
          from public.daily_activity
          where profile_id = v_profile.id
          order by date desc
          limit 90
        ) a
      ),
      '[]'::jsonb
    ),
    'errors', coalesce(
      (select jsonb_agg(to_jsonb(e)) from public.error_queue e
        where e.profile_id = v_profile.id and e.resolved_at is null),
      '[]'::jsonb
    )
  );
end;
$$;

grant execute on function public.get_my_full_snapshot() to authenticated;

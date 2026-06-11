-- =====================================================================
-- 0003_family_helpers.sql
-- Виправлення: при створенні family RLS-policy на SELECT блокує повернення
-- щойно створеного рядка (бо ми ще не family_member). Робимо атомарну
-- security-definer функцію, яка створює family + додає creator-а як parent.
-- =====================================================================

create or replace function public.create_family(p_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_family_id uuid;
begin
  if v_user is null then
    raise exception 'not_authenticated';
  end if;

  insert into public.families (name, created_by)
  values (p_name, v_user)
  returning id into v_family_id;

  insert into public.family_members (family_id, user_id, role)
  values (v_family_id, v_user, 'parent');

  return v_family_id;
end;
$$;

grant execute on function public.create_family(text) to authenticated;

-- Аналогічно для child_profile: повертати рядок навіть якщо
-- RLS-policy на SELECT (через is_family_member) працює коректно — але
-- robusto знімаємо ризик і даємо явний RPC.
create or replace function public.create_child_profile(
  p_family_id uuid,
  p_display_name text,
  p_age int,
  p_theme text
)
returns public.child_profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_row public.child_profiles;
begin
  if v_user is null then
    raise exception 'not_authenticated';
  end if;

  if not exists (
    select 1 from public.family_members
    where family_id = p_family_id and user_id = v_user
  ) then
    raise exception 'not_family_member';
  end if;

  insert into public.child_profiles (family_id, display_name, age, theme)
  values (p_family_id, p_display_name, p_age, p_theme)
  returning * into v_row;

  return v_row;
end;
$$;

grant execute on function public.create_child_profile(uuid, text, int, text) to authenticated;

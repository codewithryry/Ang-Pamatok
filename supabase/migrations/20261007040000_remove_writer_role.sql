-- Only two roles now: admin and editor. Existing writers become editors.

-- The profile guard must not block the SQL Editor / service role (no signed-in app user).
-- Anonymous API requests still cannot update profiles because of RLS.
create or replace function public.guard_profile_admin_fields()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.has_role(array['admin']) then
    if new.role is distinct from old.role or new.is_active is distinct from old.is_active then
      raise exception 'Only admins can change roles or account approval.';
    end if;
    if new.must_change_password and not old.must_change_password then
      raise exception 'Only admins can require a password change.';
    end if;
  end if;
  return new;
end;
$$;

update public.profiles set role = 'editor' where role = 'writer';

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('admin','editor'));
alter table public.profiles alter column role set default 'editor';

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id, full_name, display_name, email, role, is_active)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'display_name', new.email, 'editor', false)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop policy if exists articles_writer_no_publish on public.articles;

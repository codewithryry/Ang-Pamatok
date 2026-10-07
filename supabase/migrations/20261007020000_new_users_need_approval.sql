-- Self-registered accounts start inactive until an admin approves them on the Users page.
-- Existing accounts are not changed.

alter table public.profiles alter column is_active set default false;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id, full_name, display_name, email, role, is_active)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'display_name', new.email, 'writer', false)
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Admin-created accounts must set their own password on first sign-in.
alter table public.profiles add column if not exists must_change_password boolean not null default false;

-- profiles_update_own lets users edit their own row; without this guard a user could
-- promote themselves or approve their own pending account through the API.
create or replace function public.guard_profile_admin_fields()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.has_role(array['admin']) then
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

drop trigger if exists guard_profile_admin_fields on public.profiles;
create trigger guard_profile_admin_fields before update on public.profiles for each row execute procedure public.guard_profile_admin_fields();

-- Writers can save drafts and submit for review, but only editors/admins can publish.
drop policy if exists articles_author_write on public.articles;
drop policy if exists articles_author_update on public.articles;
create policy articles_author_write on public.articles for insert with check (author_id = auth.uid() and public.has_role(array['writer','editor','admin']) and (status <> 'published' or public.has_role(array['editor','admin'])));
create policy articles_author_update on public.articles for update using (author_id = auth.uid() and public.has_role(array['writer','editor','admin'])) with check (author_id = auth.uid() and (status <> 'published' or public.has_role(array['editor','admin'])));

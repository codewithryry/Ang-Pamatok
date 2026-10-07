-- Lets an admin delete another account from the Users page.
-- Deleting the auth user also removes the profile (on delete cascade).

create or replace function public.admin_delete_user(target uuid)
returns void language plpgsql security definer set search_path = public, auth as $$
begin
  if not public.has_role(array['admin']) then
    raise exception 'Only admins can delete accounts.';
  end if;
  if target = auth.uid() then
    raise exception 'You cannot delete your own account.';
  end if;
  if exists(select 1 from public.articles where author_id = target) then
    raise exception 'This user still has articles. Restrict the account instead, or remove their articles first.';
  end if;
  delete from auth.users where id = target;
end;
$$;

revoke execute on function public.admin_delete_user(uuid) from public, anon;
grant execute on function public.admin_delete_user(uuid) to authenticated;

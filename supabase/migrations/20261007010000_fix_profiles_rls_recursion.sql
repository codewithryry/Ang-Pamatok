-- Fix: "infinite recursion detected in policy for relation profiles".
-- Role checks queried public.profiles from inside policies (including on profiles itself).
-- They now go through a security definer function, which reads profiles without triggering RLS.

create or replace function public.has_role(roles text[])
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and is_active and role = any(roles));
$$;

grant execute on function public.has_role(text[]) to anon, authenticated;

drop policy if exists profiles_admin_all on public.profiles;
create policy profiles_admin_all on public.profiles for all using (public.has_role(array['admin'])) with check (public.has_role(array['admin']));

-- Lets public pages show the byline of published articles.
drop policy if exists profiles_public_authors on public.profiles;
create policy profiles_public_authors on public.profiles for select using (exists(select 1 from public.articles a where a.author_id = profiles.id and a.status = 'published'));

drop policy if exists categories_admin_all on public.categories;
drop policy if exists categories_editor_all on public.categories;
create policy categories_admin_all on public.categories for all using (public.has_role(array['admin'])) with check (public.has_role(array['admin']));
create policy categories_editor_all on public.categories for all using (public.has_role(array['admin','editor'])) with check (public.has_role(array['admin','editor']));

drop policy if exists articles_author_write on public.articles;
drop policy if exists articles_author_update on public.articles;
drop policy if exists articles_writer_no_publish on public.articles;
drop policy if exists articles_editor_all on public.articles;
drop policy if exists articles_admin_all on public.articles;
create policy articles_author_write on public.articles for insert with check (author_id = auth.uid() and public.has_role(array['writer','editor','admin']));
create policy articles_author_update on public.articles for update using (author_id = auth.uid() and public.has_role(array['writer','editor','admin'])) with check (author_id = auth.uid());
create policy articles_writer_no_publish on public.articles for update using (author_id = auth.uid() and public.has_role(array['writer'])) with check (author_id = auth.uid() and status <> 'published');
create policy articles_editor_all on public.articles for all using (public.has_role(array['admin','editor'])) with check (public.has_role(array['admin','editor']));
create policy articles_admin_all on public.articles for all using (public.has_role(array['admin'])) with check (public.has_role(array['admin']));

drop policy if exists revisions_admin_all on public.article_revisions;
drop policy if exists audit_admin_read on public.audit_logs;
drop policy if exists audit_admin_insert on public.audit_logs;
create policy revisions_admin_all on public.article_revisions for all using (public.has_role(array['admin'])) with check (public.has_role(array['admin']));
create policy audit_admin_read on public.audit_logs for select using (public.has_role(array['admin']));
create policy audit_admin_insert on public.audit_logs for insert with check (actor_id = auth.uid() and public.has_role(array['admin']));

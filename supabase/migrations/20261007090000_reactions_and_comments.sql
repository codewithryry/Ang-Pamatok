-- Reader reactions and comments under published articles.

create table if not exists public.article_reactions (
  article_id uuid not null references public.articles(id) on delete cascade,
  reaction text not null check (reaction in ('like','love','wow','sad','angry')),
  count integer not null default 0 check (count >= 0),
  primary key (article_id, reaction)
);

alter table public.article_reactions enable row level security;
drop policy if exists article_reactions_public_read on public.article_reactions;
create policy article_reactions_public_read on public.article_reactions for select using (true);

-- Readers change counts only through this function (one step up or down at a time).
create or replace function public.set_article_reaction(article_id uuid, next_reaction text, previous_reaction text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists(select 1 from public.articles a where a.id = article_id and a.status = 'published') then
    raise exception 'Reactions are only available on published articles.';
  end if;
  if previous_reaction is not null then
    update public.article_reactions r set count = greatest(r.count - 1, 0)
    where r.article_id = set_article_reaction.article_id and r.reaction = previous_reaction;
  end if;
  if next_reaction is not null then
    insert into public.article_reactions(article_id, reaction, count) values (set_article_reaction.article_id, next_reaction, 1)
    on conflict on constraint article_reactions_pkey do update set count = public.article_reactions.count + 1;
  end if;
end;
$$;

grant execute on function public.set_article_reaction(uuid, text, text) to anon, authenticated;

create table if not exists public.article_comments (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 60),
  body text not null check (char_length(btrim(body)) between 1 and 1000),
  created_at timestamptz not null default now()
);

create index if not exists article_comments_article_idx on public.article_comments(article_id, created_at);

alter table public.article_comments enable row level security;

drop policy if exists article_comments_public_read on public.article_comments;
create policy article_comments_public_read on public.article_comments for select
  using (exists(select 1 from public.articles a where a.id = article_id and a.status = 'published'));

drop policy if exists article_comments_public_insert on public.article_comments;
create policy article_comments_public_insert on public.article_comments for insert
  with check (exists(select 1 from public.articles a where a.id = article_id and a.status = 'published'));

-- Editors and admins moderate comments.
drop policy if exists article_comments_staff_delete on public.article_comments;
create policy article_comments_staff_delete on public.article_comments for delete
  using (public.has_role(array['admin','editor']));

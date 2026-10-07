-- View counter shown in the article reading toolbar.
alter table public.articles add column if not exists view_count integer not null default 0;

-- Anyone reading a published article can add one view; nothing else about the article can change.
create or replace function public.increment_article_view(article_id uuid)
returns integer language sql security definer set search_path = public as $$
  update public.articles set view_count = view_count + 1
  where id = article_id and status = 'published'
  returning view_count;
$$;

grant execute on function public.increment_article_view(uuid) to anon, authenticated;

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  display_name text,
  avatar_url text,
  bio text,
  email text,
  role text not null default 'writer' check (role in ('admin','editor','writer')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  display_order integer not null default 1,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  cover_image_url text,
  category_id uuid references public.categories(id),
  author_id uuid not null references public.profiles(id) on delete restrict,
  status text not null default 'draft' check (status in ('draft','review','published','rejected','archived')),
  is_featured boolean not null default false,
  published_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (published_at is not null or status <> 'published')
);

create table if not exists public.article_revisions (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles(id) on delete cascade,
  title text not null,
  excerpt text not null,
  content text not null,
  cover_image_url text,
  category_id uuid references public.categories(id),
  changed_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references public.profiles(id) on delete restrict,
  action text not null,
  target_type text not null,
  target_id uuid,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists articles_status_idx on public.articles(status);
create index if not exists articles_category_idx on public.articles(category_id);
create index if not exists articles_author_idx on public.articles(author_id);
create index if not exists articles_published_idx on public.articles(published_at);
create index if not exists articles_slug_idx on public.articles(slug);
create index if not exists article_revisions_article_idx on public.article_revisions(article_id);
create index if not exists audit_logs_created_idx on public.audit_logs(created_at);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id, full_name, display_name, email, role)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'display_name', new.email, 'writer')
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.is_active_profile()
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and is_active);
$$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.articles enable row level security;
alter table public.article_revisions enable row level security;
alter table public.audit_logs enable row level security;

create policy profiles_select_own on public.profiles for select using (id = auth.uid());
create policy profiles_update_own on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy profiles_admin_all on public.profiles for all using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin')) with check (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));

create policy categories_public_read on public.categories for select using (is_active);
create policy categories_admin_all on public.categories for all using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin')) with check (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
create policy categories_editor_all on public.categories for all using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in ('admin','editor'))) with check (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in ('admin','editor')));

create policy articles_public_read on public.articles for select using (status='published' and published_at is not null and published_at <= now());
create policy articles_author_write on public.articles for insert with check (author_id=auth.uid() and exists(select 1 from public.profiles p where p.id=auth.uid() and p.is_active and p.role in ('writer','editor','admin')));
create policy articles_author_update on public.articles for update using (author_id=auth.uid() and exists(select 1 from public.profiles p where p.id=auth.uid() and p.is_active and p.role in ('writer','editor','admin'))) with check (author_id=auth.uid());
create policy articles_writer_no_publish on public.articles for update using (author_id=auth.uid() and exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='writer')) with check (author_id=auth.uid() and status <> 'published');
create policy articles_editor_all on public.articles for all using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in ('admin','editor'))) with check (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role in ('admin','editor')));
create policy articles_admin_all on public.articles for all using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin')) with check (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));

create policy revisions_author_read on public.article_revisions for select using (exists(select 1 from public.articles a where a.id=article_id and a.author_id=auth.uid()));
create policy revisions_admin_all on public.article_revisions for all using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin')) with check (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
create policy audit_admin_read on public.audit_logs for select using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
create policy audit_admin_insert on public.audit_logs for insert with check (actor_id=auth.uid() and exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));

insert into public.categories(name,slug,description,display_order,is_active) values
('News','news','Campus developments, community updates, and the stories shaping student life.',1,true),
('Sports','sports','Athletic achievement, training, and the people behind the competition.',2,true),
('Feature','feature','In-depth profiles and first-person reporting from the student community.',3,true),
('Opinion','opinion','Clear perspectives on education, culture, and campus life.',4,true),
('Literary','literary','Poetry, prose, and reflections from writers in our community.',5,true)
on conflict (slug) do nothing;

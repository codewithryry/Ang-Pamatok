-- Storage for article cover images and images inside article content.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('article-images', 'article-images', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

-- Anyone can view the images (they appear on public articles).
drop policy if exists article_images_public_read on storage.objects;
create policy article_images_public_read on storage.objects for select
  using (bucket_id = 'article-images');

-- Only active editors and admins can upload or remove images.
drop policy if exists article_images_staff_insert on storage.objects;
create policy article_images_staff_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'article-images' and public.has_role(array['admin','editor']));

drop policy if exists article_images_staff_delete on storage.objects;
create policy article_images_staff_delete on storage.objects for delete to authenticated
  using (bucket_id = 'article-images' and public.has_role(array['admin','editor']));

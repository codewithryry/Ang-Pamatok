-- Only admins manage categories. Everyone can still read active categories (categories_public_read).
drop policy if exists categories_editor_all on public.categories;

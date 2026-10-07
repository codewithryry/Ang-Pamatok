-- Publication sections: News, Sci-Tech, Opinion, Editorial, Feature, Literary.
-- Sports is hidden (not deleted) so any existing articles keep their category.

insert into public.categories(name, slug, description, display_order, is_active) values
('News', 'news', 'Campus developments, community updates, and the stories shaping student life.', 1, true),
('Sci-Tech', 'sci-tech', 'Science, technology, and innovation on campus and beyond.', 2, true),
('Opinion', 'opinion', 'Clear perspectives on education, culture, and campus life.', 3, true),
('Editorial', 'editorial', 'The official stand of the editorial board on issues that matter.', 4, true),
('Feature', 'feature', 'In-depth profiles and first-person reporting from the student community.', 5, true),
('Literary', 'literary', 'Poetry, prose, and reflections from writers in our community.', 6, true)
on conflict (slug) do update set name = excluded.name, display_order = excluded.display_order, is_active = true;

update public.categories set is_active = false where slug = 'sports';

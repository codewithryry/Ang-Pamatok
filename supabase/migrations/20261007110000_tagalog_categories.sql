-- Tagalog section names and URLs. Existing rows are renamed in place,
-- so articles keep their category.

update public.categories set name = 'Balita', slug = 'balita', display_order = 1, is_active = true,
  description = 'Mga kaganapan sa kampus, balitang pangkomunidad, at mga kuwentong humuhubog sa buhay-estudyante.' where slug = 'news';
update public.categories set name = 'Ag-Tek', slug = 'ag-tek', display_order = 2, is_active = true,
  description = 'Agham, teknolohiya, at inobasyon sa loob at labas ng kampus.' where slug = 'sci-tech';
update public.categories set name = 'Opinyon', slug = 'opinyon', display_order = 3, is_active = true,
  description = 'Malinaw na pananaw sa edukasyon, kultura, at buhay-kampus.' where slug = 'opinion';
update public.categories set name = 'Editoryal', slug = 'editoryal', display_order = 4, is_active = true,
  description = 'Ang opisyal na paninindigan ng patnugutan sa mahahalagang isyu.' where slug = 'editorial';
update public.categories set name = 'Lathalain', slug = 'lathalain', display_order = 5, is_active = true,
  description = 'Malalalim na profile at kuwento mula sa komunidad ng mga estudyante.' where slug = 'feature';
update public.categories set name = 'Panitikan', slug = 'panitikan', display_order = 6, is_active = true,
  description = 'Tula, prosa, at pagninilay mula sa mga manunulat ng ating komunidad.' where slug = 'literary';

insert into public.categories(name, slug, description, display_order, is_active) values
('Balita', 'balita', 'Mga kaganapan sa kampus, balitang pangkomunidad, at mga kuwentong humuhubog sa buhay-estudyante.', 1, true),
('Ag-Tek', 'ag-tek', 'Agham, teknolohiya, at inobasyon sa loob at labas ng kampus.', 2, true),
('Opinyon', 'opinyon', 'Malinaw na pananaw sa edukasyon, kultura, at buhay-kampus.', 3, true),
('Editoryal', 'editoryal', 'Ang opisyal na paninindigan ng patnugutan sa mahahalagang isyu.', 4, true),
('Lathalain', 'lathalain', 'Malalalim na profile at kuwento mula sa komunidad ng mga estudyante.', 5, true),
('Panitikan', 'panitikan', 'Tula, prosa, at pagninilay mula sa mga manunulat ng ating komunidad.', 6, true),
('Kultura', 'kultura', 'Sining, tradisyon, at pamumuhay na bumubuo sa ating pagkakakilanlan.', 7, true),
('Investigative', 'investigative', 'Masusing pag-uulat na naghuhukay sa likod ng mga isyu.', 8, true)
on conflict (slug) do nothing;

update public.categories set is_active = false where slug = 'sports';

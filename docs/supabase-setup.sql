-- Uncle CNC — Supabase kurulumu (paylaşılan DB: uc_ öneki zorunlu)
-- Supabase Studio > SQL Editor'de bir kez çalıştırın.

create table if not exists public.uc_machines (
	id uuid primary key default gen_random_uuid(),
	title text not null,
	slug text unique not null,
	machine_type text not null,
	specs jsonb not null default '{}',        -- ör: {"Model Yılı": 2018, "Tabla Boyutu": "1000x500 mm"}
	price numeric,                             -- null => "Fiyat için sorunuz"
	currency text not null default 'EUR' check (currency in ('USD','EUR','TRY')),
	status text not null default 'available' check (status in ('available','sold','hidden')),
	photos text[] not null default '{}',       -- uc-machine-photos bucket'ındaki dosya yolları
	description text,
	created_at timestamptz not null default now()
);

alter table public.uc_machines enable row level security;

drop policy if exists "uc_machines anon read visible" on public.uc_machines;
create policy "uc_machines anon read visible"
	on public.uc_machines for select
	using (status <> 'hidden');

-- Fotoğraf bucket'ı (public read). Studio > Storage'dan da oluşturulabilir.
insert into storage.buckets (id, name, public)
values ('uc-machine-photos', 'uc-machine-photos', true)
on conflict (id) do nothing;

-- Yönetici erişimi: yalnızca uc_admins'teki kullanıcılar yazabilir
-- (paylaşılan auth havuzunda "authenticated" tek başına yeterli değildir).
create table if not exists public.uc_admins (
	user_id uuid primary key references auth.users (id) on delete cascade,
	created_at timestamptz not null default now()
);
alter table public.uc_admins enable row level security;
-- Bilerek hiç policy yok: API üzerinden okunamaz/yazılamaz.

create or replace function public.uc_is_admin()
returns boolean language sql security definer set search_path = '' stable as
$$ select exists (select 1 from public.uc_admins where user_id = (select auth.uid())) $$;

create policy "uc_machines admin select" on public.uc_machines
	for select to authenticated using (public.uc_is_admin());
create policy "uc_machines admin insert" on public.uc_machines
	for insert to authenticated with check (public.uc_is_admin());
create policy "uc_machines admin update" on public.uc_machines
	for update to authenticated using (public.uc_is_admin()) with check (public.uc_is_admin());
create policy "uc_machines admin delete" on public.uc_machines
	for delete to authenticated using (public.uc_is_admin());

create policy "uc photos admin insert" on storage.objects
	for insert to authenticated with check (bucket_id = 'uc-machine-photos' and public.uc_is_admin());
create policy "uc photos admin update" on storage.objects
	for update to authenticated
	using (bucket_id = 'uc-machine-photos' and public.uc_is_admin())
	with check (bucket_id = 'uc-machine-photos' and public.uc_is_admin());
create policy "uc photos admin delete" on storage.objects
	for delete to authenticated using (bucket_id = 'uc-machine-photos' and public.uc_is_admin());

-- Yönetici eklemek: Studio > Auth > Add user, ardından:
-- insert into public.uc_admins (user_id) values ('<auth kullanıcı uid>');

-- Örnek kayıtlar (test için, silinebilir):
insert into public.uc_machines (title, slug, machine_type, specs, price, currency, status, description) values
	('Örnek Dik İşleme Merkezi 1000', 'ornek-dik-isleme-1000', 'Dik işleme',
	 '{"Model Yılı": 2018, "Tabla Boyutu": "1000x500 mm", "Kontrol": "Fanuc 0i-MF"}',
	 45000, 'EUR', 'available',
	 'Ekspertizi yapılmış, düzenli bakımlı örnek ilan. Gerçek ilanlar eklendiğinde silin.'),
	('Örnek CNC Torna 8 inch', 'ornek-torna-8inch', 'Torna',
	 '{"Model Yılı": 2015, "Ayna": "8 inch", "Kontrol": "Siemens 828D"}',
	 null, 'EUR', 'available',
	 'Fiyat için sorunuz örneği. Gerçek ilanlar eklendiğinde silin.')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Form gönderimleri (Netlify Forms yerine kendi kaydımız, bkz. /api/submit)
create table if not exists public.uc_form_submissions (
	id uuid primary key default gen_random_uuid(),
	form_name text not null check (form_name in ('contact','appraisal','consulting','maintenance','repair','machine-trading')),
	data jsonb not null default '{}' check (pg_column_size(data) < 20000),
	photos text[] not null default '{}' check (coalesce(array_length(photos, 1), 0) <= 3),
	is_read boolean not null default false,
	created_at timestamptz not null default now()
);

alter table public.uc_form_submissions enable row level security;

-- Form endpoint'i anon anahtarla yazar. Okuma/güncelleme/silme yalnızca yönetici.
create policy "uc_form_submissions anon insert" on public.uc_form_submissions
	for insert to anon with check (true);
create policy "uc_form_submissions admin select" on public.uc_form_submissions
	for select to authenticated using (public.uc_is_admin());
create policy "uc_form_submissions admin update" on public.uc_form_submissions
	for update to authenticated using (public.uc_is_admin()) with check (public.uc_is_admin());
create policy "uc_form_submissions admin delete" on public.uc_form_submissions
	for delete to authenticated using (public.uc_is_admin());

-- Müşteri fotoğrafları: private bucket, yönetici imzalı URL ile görüntüler.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('uc-submission-photos', 'uc-submission-photos', false, 4194304,
	array['image/jpeg','image/png','image/webp','image/heic','image/heif','image/gif','image/avif'])
on conflict (id) do nothing;

create policy "uc submission photos anon insert" on storage.objects
	for insert to anon with check (bucket_id = 'uc-submission-photos');
create policy "uc submission photos admin select" on storage.objects
	for select to authenticated using (bucket_id = 'uc-submission-photos' and public.uc_is_admin());
create policy "uc submission photos admin delete" on storage.objects
	for delete to authenticated using (bucket_id = 'uc-submission-photos' and public.uc_is_admin());

-- ---------------------------------------------------------------------------
-- Ana sayfa spec şeridindeki 4 istatistik. Panelden düzenlenebilir.
create table if not exists public.uc_stats (
	id uuid primary key default gen_random_uuid(),
	value text not null,
	label text not null,
	sort_order integer not null default 0,
	created_at timestamptz not null default now()
);

alter table public.uc_stats enable row level security;

create policy "uc_stats anon read" on public.uc_stats
	for select using (true);

create policy "uc_stats admin select" on public.uc_stats
	for select to authenticated using (public.uc_is_admin());
create policy "uc_stats admin insert" on public.uc_stats
	for insert to authenticated with check (public.uc_is_admin());
create policy "uc_stats admin update" on public.uc_stats
	for update to authenticated using (public.uc_is_admin()) with check (public.uc_is_admin());
create policy "uc_stats admin delete" on public.uc_stats
	for delete to authenticated using (public.uc_is_admin());

insert into public.uc_stats (value, label, sort_order) values
	('±0.01 MM', 'Hassasiyet standardı', 0),
	('32 BAŞLIK', 'Bakım kontrol listesi', 1),
	('5 HİZMET', 'Tek çatı altında', 2),
	('INT’L', 'Yurt içi + yurt dışı servis', 3)
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Duyurular: ana sayfa bölümü, /announcements arşivi ve isteğe bağlı açılır mesaj.
-- Görünürlük penceresi [starts_at, ends_at) yarı açıktır: panelde girilen "son gün"
-- ertesi günün başlangıcı olarak saklanır. Açılır mesaj penceresi
-- [starts_at, least(starts_at + popup_days gün, ends_at)) uygulama tarafında hesaplanır.
create table if not exists public.uc_announcements (
	id uuid primary key default gen_random_uuid(),
	title text not null check (char_length(title) between 1 and 120),
	body text not null check (char_length(body) between 1 and 1000),
	link_url text check (link_url is null or char_length(link_url) <= 500),
	link_label text check (link_label is null or char_length(link_label) <= 60),
	photo text,                                -- uc-machine-photos bucket'ındaki yol (announcements/{id}/…)
	starts_at timestamptz not null default now(),
	ends_at timestamptz check (ends_at is null or ends_at > starts_at),
	published boolean not null default true,
	popup boolean not null default false,
	popup_days integer not null default 7 check (popup_days between 1 and 90),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

alter table public.uc_announcements enable row level security;

-- Anon yalnızca yayında ve tarih penceresi açık kayıtları okur.
drop policy if exists "uc_announcements anon read live" on public.uc_announcements;
create policy "uc_announcements anon read live" on public.uc_announcements
	for select using (
		published and starts_at <= now() and (ends_at is null or ends_at > now())
	);

drop policy if exists "uc_announcements admin select" on public.uc_announcements;
create policy "uc_announcements admin select" on public.uc_announcements
	for select to authenticated using (public.uc_is_admin());
drop policy if exists "uc_announcements admin insert" on public.uc_announcements;
create policy "uc_announcements admin insert" on public.uc_announcements
	for insert to authenticated with check (public.uc_is_admin());
drop policy if exists "uc_announcements admin update" on public.uc_announcements;
create policy "uc_announcements admin update" on public.uc_announcements
	for update to authenticated using (public.uc_is_admin()) with check (public.uc_is_admin());
drop policy if exists "uc_announcements admin delete" on public.uc_announcements;
create policy "uc_announcements admin delete" on public.uc_announcements
	for delete to authenticated using (public.uc_is_admin());

-- Katalog PDF'i: public bucket, her yükleme yeni bir dosya adıyla gelir (CDN'de eski
-- sürüm kalmasın diye). /catalog rotası en yeni dosyayı listeleyip ona yönlendirir,
-- bu yüzden listeleme (select) herkese açıktır. Yazma yalnızca yöneticilerde.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('uc-catalog', 'uc-catalog', true, 52428800, array['application/pdf'])
on conflict (id) do nothing;

drop policy if exists "uc catalog public select" on storage.objects;
create policy "uc catalog public select" on storage.objects
	for select using (bucket_id = 'uc-catalog');
drop policy if exists "uc catalog admin insert" on storage.objects;
create policy "uc catalog admin insert" on storage.objects
	for insert to authenticated with check (bucket_id = 'uc-catalog' and public.uc_is_admin());
drop policy if exists "uc catalog admin update" on storage.objects;
create policy "uc catalog admin update" on storage.objects
	for update to authenticated
	using (bucket_id = 'uc-catalog' and public.uc_is_admin())
	with check (bucket_id = 'uc-catalog' and public.uc_is_admin());
drop policy if exists "uc catalog admin delete" on storage.objects;
create policy "uc catalog admin delete" on storage.objects
	for delete to authenticated using (bucket_id = 'uc-catalog' and public.uc_is_admin());

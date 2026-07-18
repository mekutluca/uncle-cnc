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

-- Örnek kayıtlar (test için; silinebilir):
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

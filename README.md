# Uncle CNC — International CNC Service

CNC servis firması için pazarlama sitesi. SvelteKit (Svelte 5) + Tailwind v4 + shadcn-svelte, VDS'e (Coolify) dağıtım için `adapter-node` ile yapılandırıldı. Müşteri gereksinimleri `docs/site-oneriler.pdf` içinde.

## Geliştirme

```bash
npm install
cp .env.example .env   # PUBLIC_SUPABASE_ANON_KEY değerini doldurun
npm run dev
```

- `npm run check` — svelte-check
- `npm run build` — adapter-node ile üretim derlemesi (`node build` ile çalıştırılır)

## Mimari notları

- **Rotalar İngilizce, içerik Türkçe.** `/services/<slug>` sayfaları tek dinamik rotadan (`src/routes/services/[slug]`) prerender edilir; hizmet tanımları `src/lib/data/services.ts` içindedir.
- **Makine cinsi → boyut seçenekleri** tek kaynaktan gelir: `src/lib/data/machine-options.ts`.
- **Formlar `/api/submit` endpoint'ine gönderilir.** Kayıt `uc_form_submissions` tablosuna, fotoğraflar private `uc-submission-photos` bucket'ına yazılır; ardından SMTP yapılandırılmışsa bildirim e-postası gönderilir (başarısızlığı gönderimi düşürmez). Talepler `/admin/submissions` sayfasında görüntülenir. Yeni bir form alanı eklerseniz Türkçe etiketini `src/lib/data/form-fields.ts` dosyasına da ekleyin.
- **Satılık makineler Supabase'ten gelir** (paylaşılan DB, `uc_` önekli tablolar). Kurulum: `docs/supabase-setup.sql` dosyasını Supabase Studio SQL Editor'de çalıştırın. Sayfa SSR ile yüklenir (`cache-control: s-maxage` başlıkları öne bir CDN konursa geçerli olur); rebuild gerekmez.
- **Firma bilgileri** (telefon, adres, e-posta, harita) tek yerden: `src/lib/data/site.ts` — TODO işaretli alanları müşteri bilgileriyle güncelleyin.

## Hata sayfaları

- `src/lib/components/ErrorState.svelte` ortak gövdedir; çerçeveyi kapsam belirler: `(public)/+error.svelte` header/footer içinde, `admin/(authed)/+error.svelte` panel kabuğu içinde, `admin/+error.svelte` çelik zemin (yetkisiz hesabın 403'ü buraya düşer; "Çıkış Yap" butonu login → /admin → 403 döngüsünü kırar), kök `+error.svelte` son basamak.
- Eşleşmeyen adresleri `(public)/[...path]` ve `admin/(authed)/[...path]` yakalar; böylece 404 doğru çerçevede çizilir ve `/admin/*` altındaki bilinmeyen adresler de yetki zincirinden geçer.
- `handleError` hook'ları (`hooks.server.ts`, `hooks.client.ts`) beklenmeyen hatalarda tarayıcıya yalnızca `src/lib/utils/errors.ts` içindeki genel Türkçe mesajı gönderir; ayrıntı sunucu logunda kalır. `src/error.html` uygulama kabuğu hiç çizilemediğinde sunulan statik yedek sayfadır.

## Yönetim paneli (/admin)

- `/admin/login` → Supabase Auth (e-posta + şifre). Oturum `@supabase/ssr` ile çerezde tutulur; `src/hooks.server.ts` yalnızca `/admin` rotalarında çalışır, halka açık sayfalar prerender kalır.
- **Yetki = RLS**: yalnızca `uc_admins` tablosundaki kullanıcılar `uc_machines` ve `uc-machine-photos` bucket'ına yazabilir (`public.uc_is_admin()` — paylaşılan auth havuzunda "authenticated" yeterli değildir).
- Yeni yönetici eklemek: Supabase Studio → Auth → Add user, ardından `insert into uc_admins (user_id) values ('<uid>');`
- Makine CRUD: `/admin/machines` (liste + sil), `/admin/machines/new`, `/admin/machines/[id]/edit` (fotoğraf ekle/sil/sırala — fotoğraflar tarayıcıda ~1600px'e küçültülür). Kayıtlar herkese açık `/machines` sayfasına anında yansır (öne CDN konursa en geç 5 dk); deploy gerekmez.
- Panel navigasyonuna sayfa eklemek: `src/lib/data/admin-routes.ts`.

## Coolify (VDS) dağıtımı

Kardeş projelerle (dr.villa, ustama-emanet, Saadet Rapor) aynı düzen: Dockerfile yok, Coolify Nixpacks ile derler (`npm run build`) ve `npm start` (`node build`) ile çalıştırır.

1. Coolify'da yeni kaynak olarak repo'yu bağlayın (Build Pack: Nixpacks).
2. Environment variables (Nixpacks derleme anında da görür; `PUBLIC_*` değerleri pakete gömülür):
   - `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`
   - `ORIGIN=https://unclecnc.com` — form POST'larının CSRF koruması için zorunlu; eksikse tüm form gönderimleri 403 döner.
   - `BODY_SIZE_LIMIT=16M` — form fotoğrafları için (3 × 4 MB; adapter-node varsayılanı 512K'dır).
   - `SMTP_HOST=smtp-relay.brevo.com`, `SMTP_PORT=587`, `SMTP_USER` (Brevo SMTP login'i, ör. `7xxxxx001@smtp-brevo.com`), `SMTP_PASS` (Brevo SMTP key), `SMTP_FROM=no-reply@unclecnc.com` (+ isteğe bağlı `FORM_NOTIFY_TO`, varsayılan info@unclecnc.com) — bildirim e-postası için; boşsa bildirim atlanır, kayıt yine Supabase'e düşer. Domain'in Brevo'da doğrulanmış (DKIM/DMARC) olması gerekir.
3. Coolify proxy'sinde ayrıca bir gövde sınırı varsa 16M'ye yükseltin.
4. İlk deploy sonrası her formdan bir test gönderimi yapın (fotoğraflı bir tane dahil) ve `/admin/submissions` ile bildirim e-postasını doğrulayın.

## Müşteriden beklenen içerik

- Gerçek telefon / adres / e-posta / harita konumu (`src/lib/data/site.ts`)
- Logo ve galeri fotoğrafları (`src/lib/assets/`, `src/lib/data/gallery.ts`)
- Referans firma isimleri/logoları (`src/lib/data/references.ts`)
- Bakımdaki "32 başlık" tam listesi (`src/routes/services/[slug]/+page.svelte`)
- Satılık makine ilanları (Supabase Studio → `uc_machines` + `uc-machine-photos` bucket'ı, ~1600px'e küçültülmüş JPEG)

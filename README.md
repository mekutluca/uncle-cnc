# MC ICS — International CNC Service

CNC servis firması için pazarlama sitesi. SvelteKit (Svelte 5) + Tailwind v4 + shadcn-svelte, Netlify'a dağıtım için `adapter-netlify` ile yapılandırıldı. Müşteri gereksinimleri `docs/site-oneriler.pdf` içinde.

## Geliştirme

```bash
npm install
cp .env.example .env   # SUPABASE_ANON_KEY değerini doldurun
npm run dev
```

- `npm run check` — svelte-check
- `npm run build` — adapter-netlify ile üretim derlemesi

## Mimari notları

- **Rotalar İngilizce, içerik Türkçe.** `/services/<slug>` sayfaları tek dinamik rotadan (`src/routes/services/[slug]`) prerender edilir; hizmet tanımları `src/lib/data/services.ts` içindedir.
- **Makine cinsi → boyut seçenekleri** tek kaynaktan gelir: `src/lib/data/machine-options.ts`. Formlarda ve `static/__forms.html` bildirimlerinde bu dosya esas alınır.
- **Formlar Netlify Forms ile çalışır.** Canlı formlar `data-netlify` taşımaz; kayıt `static/__forms.html` üzerinden yapılır ve her form TÜM olası alan adlarının birleşimini bildirir. Yeni bir form alanı eklerseniz oraya da eklemeyi unutmayın — yoksa gönderimlerden sessizce düşer.
- **Satılık makineler Supabase'ten gelir** (paylaşılan DB, `uc_` önekli tablolar). Kurulum: `docs/supabase-setup.sql` dosyasını Supabase Studio SQL Editor'de çalıştırın. Sayfa SSR ile yüklenir ve Netlify CDN'de 5 dk önbelleklenir; rebuild gerekmez.
- **Firma bilgileri** (telefon, adres, e-posta, harita) tek yerden: `src/lib/data/site.ts` — TODO işaretli alanları müşteri bilgileriyle güncelleyin.

## Netlify dağıtımı (manuel adımlar)

1. Site oluşturup repo'yu bağlayın (`netlify.toml` hazır).
2. Environment variables: `SUPABASE_URL`, `SUPABASE_ANON_KEY`.
3. **Forms → Enable form detection**'ı açın (varsayılan kapalı), ardından e-posta bildirimlerini ayarlayın (Forms → Notifications).
4. İlk deploy sonrası Forms sekmesinde 6 formun (contact, appraisal, consulting, maintenance, repair, machine-trading) tam alan listeleriyle göründüğünü doğrulayın ve her formdan bir test gönderimi yapın (fotoğraflı bir tane dahil).
5. Ücretsiz plan sınırı: ay başına 100 gönderim, dosya başına 8 MB. Aşılırsa geçiş yolu: form `action`'ını Resend ile e-posta atan bir Netlify function'a çevirmek (tek değişiklik `NetlifyForm.svelte`).

## Müşteriden beklenen içerik

- Gerçek telefon / adres / e-posta / harita konumu (`src/lib/data/site.ts`)
- Logo ve galeri fotoğrafları (`src/lib/assets/`, `src/lib/data/gallery.ts`)
- Referans firma isimleri/logoları (`src/lib/data/references.ts`)
- Bakımdaki "32 başlık" tam listesi (`src/routes/services/[slug]/+page.svelte`)
- Satılık makine ilanları (Supabase Studio → `uc_machines` + `uc-machine-photos` bucket'ı, ~1600px'e küçültülmüş JPEG)

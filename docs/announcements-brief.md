# Duyurular (Announcements) — design brief

Status: confirmed plan, not yet built. Produced with `/impeccable shape` on 2026-09-08.
Sunsama task 2909 "Add dynamic in-app messages and announcements".

## 1. Job and audience

- **Public visitor** (Persuade mode on the homepage, Read mode on `/announcements`): a workshop owner or maintenance manager landing on any public page. They should notice, in one glance, that something changed at Uncle CNC: a machine arrived in stock, a holiday closure, a new service. The announcement should hand them to the relevant action (listing, service form, phone).
- **Owner in `/admin`** (Operate mode): posts a notice in under a minute from a phone, optionally attaches a photo, decides whether it also fires as a popup and for how many days, and can see at a glance which notices are live, scheduled, expired or unpublished.

## 2. Outcome and proof

- Primary action: visitor clicks the announcement's link (a machine listing, a service form, or the archive) or dismisses it and continues.
- Success for the owner: the notice is visible on the site immediately after saving, without a deploy, and the popup stops on its own after the configured window.
- Reference implementation: ustama-emanet (`ue_site_announcements`, panel dialog at `/settings/website`, site `Announcements.svelte`). We borrow its data model, date semantics and validation rules. It has **no** popup concept, so that layer is new.

## 3. Selected direction

- **Visual authority:** the existing "Çelik ve İkaz" world in `src/routes/layout.css` and the homepage. This is a local extension, no new identity, no DESIGN.md change.
- **Structural thesis:** an announcement is a **notice on the workshop board**. On the page it renders as a _nameplate lane_: a mono date plate on the left (day + short month, `tr-TR`), title in `.display`, body in Barlow, optional photo thumb and a mono `.btn-label` link. The popup is the same nameplate, detached and pinned to the corner of the screen like a tag hung on the machine: `.plate` frame (foreground border, hard shadow), a safety-yellow tab carrying the eyebrow `DUYURU · 12 EYL`, close button, photo thumb, title, three-line body, one CTA.
- **Sequence on the homepage:** Hero → Spec strip → **Duyurular** (latest 3, hidden entirely when none are live) → Hizmetler → … The section sits on the ground `bg-background` with a `SectionHeader` eyebrow `Duyurular / 03` (count of live notices) and title "Atölyeden haberler". A "Tüm Duyurular" outline button links to `/announcements`.
- **Focal moment:** the popup sliding in bottom-right about one second after load, safety-yellow tab first. It never covers the hero headline or the primary CTA on desktop, and on mobile it rises as a bottom sheet under the thumb.
- **Rejected:** a centered blocking modal (kills the hero on a marketing site, and the user chose the corner plate), a top banner (competes with the sticky header's yellow rule), toast-style sonner (too small for a photo and body).

## 4. Scope and boundaries

- **Fidelity:** production-ready, shipped end to end: migration, admin CRUD, homepage section, archive page, nav + footer + sitemap entries, popup endpoint + component, README section, version bump to 1.2.0.
- **Untouched:** everything else on the homepage, the header layout, existing admin pages, the forms pipeline.
- **Anti-goals:** no rich-text editor (paragraphs split on blank lines, as in ustama-emanet), no kinds/categories or badges (declined), no manual sort order (chronological by `starts_at`), no per-user read receipts, no push or e-mail, no comments, no auto-close timer on the popup.

## 5. Data model and rules

Table `public.uc_announcements` (migration name `uc_announcements_init`, applied via Supabase MCP, mirrored into `docs/supabase-setup.sql`):

| column                 | type                               | rule                                                                                                                                                                             |
| ---------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                     | uuid pk                            | `gen_random_uuid()`                                                                                                                                                              |
| title                  | text not null                      | 1–120 chars                                                                                                                                                                      |
| body                   | text not null                      | 1–1000 chars, `\r\n`→`\n`, 3+ blank lines collapsed to 2, trimmed                                                                                                                |
| link_url               | text null                          | ≤500, `https://` auto-prefixed when schemeless, must parse with `new URL()`. Internal paths starting with `/` are allowed as-is (listing and service pages are the main targets) |
| link_label             | text null                          | ≤60, only kept when `link_url` is set                                                                                                                                            |
| photo                  | text null                          | path in `uc-machine-photos`, folder `announcements/{id}/`, thumb variant like gallery                                                                                            |
| starts_at              | timestamptz not null default now() | first visible instant, Istanbul day start                                                                                                                                        |
| ends_at                | timestamptz null                   | exclusive, `ends_at > starts_at`. Admin enters an inclusive last day, server stores start of the next day (copy ustama's `istanbulDayStart` / `addDaysToDayKey`)                 |
| published              | boolean not null default true      | "Sitede göster"                                                                                                                                                                  |
| popup                  | boolean not null default false     | "Açılır mesaj olarak göster"                                                                                                                                                     |
| popup_days             | integer not null default 7         | 1–90, meaningful only when `popup` is true                                                                                                                                       |
| created_at, updated_at | timestamptz                        | `updated_at` set by the action on update                                                                                                                                         |

- **Live** = `published and starts_at <= now() and (ends_at is null or ends_at > now())`.
- **Popup window** = `[starts_at, least(starts_at + popup_days days, ends_at))`. Computed in TypeScript, not in SQL (timestamptz + interval is not immutable, so no generated column). Counts from the start date, not from creation, so a scheduled notice pops up when it goes live.
- **Popup candidate** = the live announcement with `popup = true` whose window is open, newest `starts_at` first, then newest `created_at`. At most one per visit.
- **Admin state model** (badge in the list): `draft` "Yayında değil" · `scheduled` "Planlandı" · `live` "Yayında" · `ended` "Süresi doldu". Popup column shows "Popup · 5 gün kaldı" while its window is open, "Popup bitti" after, "—" when off.
- **RLS:** anon `select` only with the Live predicate (same idea as `uc_machines anon read visible`). Four admin policies via `public.uc_is_admin()` for select/insert/update/delete. Storage policies already cover the shared bucket.

## 6. Public surface

- `listAnnouncements()` in `src/lib/server/supabase.ts` on the anon client: re-applies the Live filter (RLS already enforces it, the filter keeps behaviour explicit), orders `starts_at desc, created_at desc`. `withAnnouncementUrls()` adds `photoUrl` / `thumbUrl`.
- **Homepage** (`(public)/+page.server.ts`): stream `announcements` like `references`. Section renders only when the resolved list is non-empty (a skeleton lane while streaming). Lane layout: one notice full width, two or more in `lg:grid-cols-2`, third alone spans full width. Body clamped to three lines on the homepage, the lane links to `/announcements#<id>` when it has no own link.
- **`/announcements`** (`(public)/announcements/`): `+layout.ts` with `prerender = false`, `+page.server.ts` with `PUBLIC_CDN_CACHE_HEADERS`, `Seo` title "Duyurular". Full bodies as paragraphs, photo at 4:3 above the text on mobile and beside it on desktop, "…'e kadar" line when `ends_at` exists, `<time datetime>` on dates, each lane `id`-anchored. Empty state: crosshair + "Şu an duyuru yok" + a line pointing to services and the phone.
- **Navigation:** add `{ href: '/announcements', label: 'Duyurular' }` to `nav` in `src/lib/data/site.ts` after "Referanslar" (always visible, the page has an empty state). Footer services column gets a "Duyurular" link. `sitemap.xml` gets the route.

## 7. Popup (in-app message)

- **Data path:** `GET /api/announcements/popup` (`+server.ts`, not prerendered, `cache-control: public, s-maxage=60, stale-while-revalidate=300`). Returns the popup candidate as `{ id, title, body, link_url, link_label, thumbUrl, starts_at } | null`. A client fetch keeps prerendered pages static and keeps the popup out of layout data.
- **Component:** `src/lib/components/site/AnnouncementPopup.svelte`, mounted once in `(public)/+layout.svelte` after `<Footer>`. On mount: skip when `page.url.pathname` starts with `/announcements`, fetch the candidate, skip when its id is in `localStorage['uc-popup-seen']` (JSON array, capped to the last 20 ids, every read/write in try/catch). Otherwise show after a 1000 ms delay.
- **Dismissal:** close button, Escape while the plate has focus, or clicking the CTA. Any of these records the id. Once per announcement per browser. A re-published or edited announcement keeps its id, so it does not re-fire: say so in the admin helper text.
- **Layout:** desktop `fixed bottom-6 right-6 w-[min(26rem,calc(100vw-3rem))] z-[60]` (above the sticky header's `z-50`). Mobile `fixed inset-x-3 bottom-3`, `max-h-[70dvh]`, body scrolls inside. Structure: yellow tab row (`eyebrow` "DUYURU · 12 EYL", close `X` icon button), optional thumb `aspect-[4/3]` (or `size-20` square beside the text when the body is short), title `.display text-lg`, body `line-clamp-3 text-sm text-muted-foreground`, CTA `Button size="sm" class="btn-label"` with `link_label ?? 'Duyuruya git'` → `link_url ?? '/announcements#<id>'`.
- **Motion:** `translateY(12px) + opacity 0 → 0 / 1`, 320 ms, ease-out, via `tw-animate-css` or a Svelte transition; no motion under `prefers-reduced-motion`.
- **Accessibility:** `role="region" aria-label="Duyuru"`, `aria-live="polite"` on the container so screen readers hear it, focus is **not** stolen, close button is the first tabbable element, contrast on the yellow tab uses `text-steel`.
- **Failure:** fetch error, 5xx or `null` → nothing renders, nothing logged to the visitor.

## 8. Admin surface

- Route entry: `{ href: '/admin/announcements', label: 'Duyurular', icon: MegaphoneIcon, group: 'Yönetim' }` in `src/lib/data/admin-routes.ts`, placed after "Talepler".
- **List** `/admin/announcements`: follows `references/+page.svelte` (Card + Table + skeleton + Empty + row click to edit + ⋮ menu with Düzenle / Sil + `ConfirmDeleteDialog`). Columns: thumb, Başlık, Durum badge, Tarih ("12 Eyl 2026'dan itibaren" / "12 Eyl 2026 · 15 Eyl 2026"), Popup, ⋮. **No move arrows**: order is chronological. Sorted `starts_at desc, created_at desc`. Empty state "Duyuru yok — İlk duyuruyu ekleyin."
- **Form** `src/lib/components/admin/announcement-form.svelte` (same skeleton as `reference-form.svelte`, cards):
  1. **Duyuru**: Başlık (Input, required, maxlength 120), Metin (Textarea rows 5, maxlength 1000, live `n / 1000` counter, helper "Boş satır paragraf açar").
  2. **Yayın**: İlk gün (`type="date"`, required, default today), Son gün (`type="date"`, `min` = first day, helper "Boş bırakılırsa süresiz görünür"), Sitede göster (switch, default on).
  3. **Bağlantı**: Bağlantı (Input `type="url"`, placeholder `/machines/…` veya `https://…`), Bağlantı yazısı (disabled until URL is non-empty, placeholder "İlana git").
  4. **Fotoğraf**: single photo, same select / pending preview / replace / delete flow as the gallery item form, thumb variant generated client-side.
  5. **Açılır mesaj**: switch "Ziyaretçiye açılır mesaj olarak göster", then Süre (gün) number input 1–90 default 7, and a live preview line "Açılır mesaj 12 Eyl – 19 Eyl arasında gösterilir" (capped by the last day when shorter). Helper: "Her ziyaretçi mesajı bir kez görür, kapattıktan sonra tekrar çıkmaz."
     Buttons: Vazgeç · "Duyuruyu Ekle" / "Değişiklikleri Kaydet".
- **Server:** `src/lib/server/announcements.ts` with `parseAnnouncementFields(formData)` (validation rules from section 5, returns fields or a Turkish error string) and `announcementsFolder(id)`. Actions mirror `references/new` and `references/[id]/edit`: `create`, `update`, `deletePhoto`, `deleteAnnouncement`. Reuse `uploadPhotoFile`, `removePhotos`. `deleteWithPhotoCleanup` currently types its table as `SortableTable`: widen to a `PhotoTable` union that includes `uc_announcements` rather than building a generic CRUD layer (see the recorded decision to keep gallery/references parallel).
- **Components to add:** shadcn-svelte `switch` (or `checkbox`) is not installed yet, add via `npx shadcn-svelte@latest add switch`.
- **Types:** `Announcement`, `AnnouncementWithPhoto`, `AnnouncementFields`, `AnnouncementState`, `announcementStateOf()` in `src/lib/types/index.ts` (+ a small `src/lib/utils/announcement-state.ts` if the function needs to be shared with the admin list).

## 9. States and ranges

- 0 announcements: homepage section absent, `/announcements` empty state, nav item still present, no popup.
- Typical: 1–4 live, 5–20 total in the admin list. Title 20–60 chars, body 80–400 chars, one paragraph or two.
- Extremes: 1000-char body with five paragraphs (clamped on homepage and popup, full on the page), 120-char title wrapping to three lines in the popup on mobile, portrait photo (letterboxed by `object-cover` in a 4:3 frame).
- Scheduled notice: invisible everywhere until its first day, popup window starts that day.
- Expired: disappears from site and popup, stays in admin as "Süresi doldu" until deleted.
- Unpublished: admin only, badge "Yayında değil".
- Popup window closed but announcement live: section shows it, no popup.
- Two popups active: newest `starts_at` wins, the other never fires unless the first is unflagged or expires.
- Save with photo upload failure: row saved, toast "Duyuru eklendi ancak fotoğraf yüklenemedi." (existing pattern).

## 10. Constraints and open decisions

- Turkish copy without semicolons, English route names, tabs + single quotes, run `npm run check` and `npm run lint`.
- Migration is applied to the **shared production** project: write it idempotent (`if not exists`, `drop policy if exists`), no seed rows.
- Version bump to `1.2.0`, README gets a "Duyurular" bullet under the admin section and the env-free note that the popup endpoint is public.
- Manual test plan after build: create a notice with photo and popup, confirm it appears on `/`, `/announcements` and as a popup on `/services`, dismiss it, reload and confirm it stays dismissed, edit the dates to yesterday and confirm it vanishes, delete it and confirm the photo is gone from the bucket.
- Nothing left for the builder to invent. If the popup's corner position collides with a future cookie banner, the popup yields (moves up), not the banner.

## 11. Build order

1. Migration + `docs/supabase-setup.sql` mirror + types.
2. `src/lib/server/announcements.ts` (parsing, folders, date helpers) + `listAnnouncements()` in `supabase.ts`.
3. Admin: route entry, list page, new/edit pages, form component, switch component.
4. Public: homepage section, `/announcements` page, nav, footer, sitemap.
5. Popup: `/api/announcements/popup` endpoint + `AnnouncementPopup.svelte` in the public layout.
6. README, version bump, `npm run check`, `npm run lint`.
7. One batched inspection round (desktop + mobile screenshots of `/`, `/announcements`, popup, admin form) and the impeccable detector over the changed files, fix in one batch, stop.

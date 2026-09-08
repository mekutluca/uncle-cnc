# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary visitor: the owner or maintenance manager of a machining workshop whose CNC machine has a fault, needs scheduled maintenance or an appraisal, or who is buying or selling a used machine. They arrive under time pressure (a stopped machine is lost production), usually on a phone from the shop floor or on a desktop in the office, and they want a competent counterpart and a fast reply, not a brochure.

Secondary: international workshops and traders reached through the "International CNC Service" positioning. Domestic visitors read Turkish, so all site copy is Turkish while routes stay English.

Internal user: the business owner, who maintains listings, gallery, references, homepage stats and announcements from `/admin` on a phone or laptop without developer help.

## Product Purpose

Marketing and lead-capture site for Uncle CNC, a CNC service firm in Ostim OSB, Ankara. It explains five services (ekspertiz, danışmanlık, bakım, servis/tamir, makine ticareti), each with its own request form, and lists used machines for sale. Success is a submitted service request or a listing inquiry that reaches the owner by e-mail and in the admin panel.

## Positioning

Whole-lifecycle responsibility for a machine under one roof: diagnosis, maintenance, repair and trading by the same team, at home and abroad. Brand line: ".every machine can work" / "Her makine çalışır". The tone is a competent technician, not an agency.

## Operating Context

- Visitors compare a handful of local service firms, mostly found through search and word of mouth, and decide quickly by phone.
- Forms post to `/api/submit`, land in `uc_form_submissions` (photos in the private `uc-submission-photos` bucket) and trigger an SMTP notification via Brevo.
- Content the owner edits (machines, sale categories, gallery, references, stats, announcements) lives in Supabase and shows on the public site without a redeploy.
- Deployed on a VDS with Coolify (Nixpacks, `adapter-node`).

## Capabilities and Constraints

- SvelteKit 2 with Svelte 5 runes, Tailwind v4, shadcn-svelte, TypeScript. Prettier with tabs and single quotes.
- Supabase is a **shared project** ("Gençlik Yönetimde", `ulrnpomzasifmcebgngy`) used by several unrelated apps. Every table is prefixed `uc_`. Schema changes are applied through the Supabase MCP `apply_migration` and mirrored into `docs/supabase-setup.sql`. There are no local migration files.
- Authorization is RLS: only members of `uc_admins` (`public.uc_is_admin()`) can write. Being authenticated is not enough, and blocked writes fail silently (0 rows). Public reads use the anon key.
- Photos share one public bucket `uc-machine-photos` with subfolders per entity (`gallery/`, `references/`), resized in the browser to ~1600px with an ~800px thumb variant.
- Public list pages are SSR with `cache-control: s-maxage=300` headers for a future CDN, streamed with skeletons. Static pages prerender.
- Routes are English, all user-facing copy is Turkish. Turkish copy avoids semicolons.
- Every commit bumps `package.json` version (shown as `REV x.y.z` in footer and admin sidebar).

## Brand Commitments

- Name: Uncle CNC — International CNC Service. Tagline ".every machine can work".
- Visual world is established in code ("Çelik ve İkaz"): cast-iron dark `#16191D`, ground surface `#F4F5F7`, machine blue `#164B9E`, safety yellow `#F5B301`, steel greys. Fonts: Archivo Variable (display, wide), Barlow (text), IBM Plex Mono (labels, numbers). Datasheet and nameplate motifs (`.plate`, `.eyebrow`, `.dim-line`, `.crosshair`). Radius 0.25rem. Dark sections flip primary to safety yellow.
- Crosshair favicon and BrandMark component.

## Evidence on Hand

- Real contact data in `src/lib/data/site.ts` (phone, e-mail, Ostim address, map).
- Service definitions and form fields from the client's requirements PDF `docs/site-oneriler.pdf` (`src/lib/data/services.ts`).
- Live Supabase content: 3 machines, 2 sale categories, 8 gallery items, 6 references, 4 homepage stats (as of 2026-09-08).
- No testimonials, case studies, certifications or press exist. Do not fabricate them.

## Product Principles

1. A stopped machine is the visitor's state of mind: every page should lead to a request form or the phone number within one step.
2. Speak like the workshop: datasheet precision, plain Turkish, numbers in mono, no marketing fluff.
3. The owner edits, nobody deploys: any content that can change month to month lives in the admin panel.
4. Shared infrastructure is a constraint, not a feature: prefix everything, gate every write, never trust "authenticated".

## Accessibility & Inclusion

Skip link, semantic landmarks and keyboard-operable navigation already exist. Motion respects `prefers-reduced-motion`. No additional standard has been mandated.

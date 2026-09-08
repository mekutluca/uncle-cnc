import {
	listAnnouncements,
	listReferences,
	listStats,
	withAnnouncementUrls,
	withLogoUrl
} from '$lib/server/supabase';
import { PUBLIC_CDN_CACHE_HEADERS } from '$lib/server/cache';
import type { PageServerLoad } from './$types';

// Referans duvarı canlı veriden geldiği için ana sayfa prerender edilmez;
// CDN önbelleği aynı hızı sağlar.
export const prerender = false;

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders(PUBLIC_CDN_CACHE_HEADERS);
	// Streamed (not awaited) so the page renders immediately with skeleton cells.
	const references = listReferences().then((rows) => rows.map(withLogoUrl));
	const stats = listStats();
	// Awaited: the section is hidden when empty, so streaming it would shift the
	// page below once it lands.
	const announcements = (await listAnnouncements()).slice(0, 3).map(withAnnouncementUrls);
	return { references, stats, announcements };
};

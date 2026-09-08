import { listAnnouncements, withAnnouncementUrls } from '$lib/server/supabase';
import { PUBLIC_CDN_CACHE_HEADERS } from '$lib/server/cache';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ setHeaders }) => {
	setHeaders(PUBLIC_CDN_CACHE_HEADERS);
	// Streamed (not awaited) so the page renders immediately with skeleton lanes.
	const announcements = listAnnouncements().then((rows) => rows.map(withAnnouncementUrls));
	return { announcements };
};

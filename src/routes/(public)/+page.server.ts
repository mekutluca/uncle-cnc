import { listReferences, withLogoUrl } from '$lib/server/supabase';
import { PUBLIC_CDN_CACHE_HEADERS } from '$lib/server/cache';
import type { PageServerLoad } from './$types';

// Referans duvarı canlı veriden geldiği için ana sayfa prerender edilmez;
// CDN önbelleği aynı hızı sağlar.
export const prerender = false;

export const load: PageServerLoad = ({ setHeaders }) => {
	setHeaders(PUBLIC_CDN_CACHE_HEADERS);
	// Streamed (not awaited) so the page renders immediately with skeleton cells.
	const references = listReferences().then((rows) => rows.map(withLogoUrl));
	return { references };
};

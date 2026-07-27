import { listReferences, withLogoUrl } from '$lib/server/supabase';
import type { PageServerLoad } from './$types';

// Referans duvarı canlı veriden geldiği için ana sayfa prerender edilmez;
// CDN önbelleği aynı hızı sağlar.
export const prerender = false;

export const load: PageServerLoad = ({ setHeaders }) => {
	setHeaders({
		'netlify-cdn-cache-control': 'public, s-maxage=300, stale-while-revalidate=3600'
	});
	// Streamed (not awaited) so the page renders immediately with skeleton cells.
	const references = listReferences().then((rows) => rows.map(withLogoUrl));
	return { references };
};

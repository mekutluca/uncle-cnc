import { listGalleryItems, withGalleryUrl } from '$lib/server/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ setHeaders }) => {
	setHeaders({
		'netlify-cdn-cache-control': 'public, s-maxage=300, stale-while-revalidate=3600'
	});
	// Streamed (not awaited) so the page renders immediately with skeleton cards.
	const items = listGalleryItems().then((rows) => rows.map(withGalleryUrl));
	return { items };
};

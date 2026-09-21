import { listMachines, listSaleCategories, withPhotoUrls } from '$lib/server/supabase';
import { getCatalog } from '$lib/server/catalog';
import { PUBLIC_CDN_CACHE_HEADERS } from '$lib/server/cache';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ setHeaders }) => {
	setHeaders(PUBLIC_CDN_CACHE_HEADERS);
	// Streamed (not awaited) so the page renders immediately with skeleton cards.
	const machines = listMachines().then((rows) => rows.map(withPhotoUrls));
	const categories = listSaleCategories();
	return { machines, categories, catalog: getCatalog() };
};

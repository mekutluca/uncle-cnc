import { error } from '@sveltejs/kit';
import { getMachine, listSaleCategories, withPhotoUrls } from '$lib/server/supabase';
import { PUBLIC_CDN_CACHE_HEADERS } from '$lib/server/cache';
import * as m from '$lib/paraglide/messages';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	setHeaders(PUBLIC_CDN_CACHE_HEADERS);
	const machine = await getMachine(params.slug);
	if (!machine) error(404, m.machine_not_found());

	const categories = await listSaleCategories();
	const categoryTitle = categories.find((c) => c.id === machine.category_id)?.title ?? null;

	return { machine: withPhotoUrls(machine), categoryTitle };
};

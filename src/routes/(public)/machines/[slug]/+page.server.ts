import { error } from '@sveltejs/kit';
import { getMachine, withPhotoUrls } from '$lib/server/supabase';
import { PUBLIC_CDN_CACHE_HEADERS } from '$lib/server/cache';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	setHeaders(PUBLIC_CDN_CACHE_HEADERS);
	const machine = await getMachine(params.slug);
	if (!machine) error(404, 'İlan bulunamadı');
	return { machine: withPhotoUrls(machine) };
};

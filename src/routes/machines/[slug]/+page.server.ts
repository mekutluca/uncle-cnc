import { error } from '@sveltejs/kit';
import { getMachine, photoUrl } from '$lib/server/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	setHeaders({
		'netlify-cdn-cache-control': 'public, s-maxage=300, stale-while-revalidate=3600'
	});
	const machine = await getMachine(params.slug);
	if (!machine) error(404, 'İlan bulunamadı');
	return {
		machine: { ...machine, photoUrls: machine.photos.map(photoUrl) }
	};
};

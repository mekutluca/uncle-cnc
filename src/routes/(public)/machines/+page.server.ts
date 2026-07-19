import { listMachines, withPhotoUrls } from '$lib/server/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		'netlify-cdn-cache-control': 'public, s-maxage=300, stale-while-revalidate=3600'
	});
	const machines = await listMachines();
	return { machines: machines.map(withPhotoUrls) };
};

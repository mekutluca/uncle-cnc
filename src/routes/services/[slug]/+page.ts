import { error } from '@sveltejs/kit';
import { serviceBySlug, services } from '$lib/data/services';
import type { PageLoad } from './$types';
import type { EntryGenerator } from './$types';

export const entries: EntryGenerator = () => services.map(({ slug }) => ({ slug }));

export const load: PageLoad = ({ params }) => {
	const service = serviceBySlug(params.slug);
	if (!service) error(404, 'Hizmet bulunamadı');
	return { service };
};

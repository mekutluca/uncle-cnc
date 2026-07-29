import type { SupabaseClient } from '@supabase/supabase-js';
import { withGalleryUrl } from '$lib/server/supabase';
import { deleteWithPhotoCleanup, moveRowAction } from '$lib/server/sortable';
import type { GalleryItem } from '$lib/types';
import type { Actions, PageServerLoad } from './$types';

async function listAllItems(supabase: SupabaseClient) {
	const { data, error } = await supabase
		.from('uc_gallery_items')
		.select('*')
		.order('sort_order', { ascending: true })
		.order('created_at', { ascending: true });
	if (error) throw new Error(error.message);
	return ((data ?? []) as GalleryItem[]).map(withGalleryUrl);
}

export const load: PageServerLoad = ({ locals }) => {
	// Akış (streaming): tablo iskeletle açılır, veri gelince dolar.
	return { items: listAllItems(locals.supabase) };
};

export const actions: Actions = {
	deleteItem: ({ request, locals }) =>
		deleteWithPhotoCleanup(
			locals.supabase,
			'uc_gallery_items',
			'photo',
			request,
			'Öğe bulunamadı.',
			'Galeri öğesi silindi.'
		),

	moveItem: ({ request, locals }) => moveRowAction(locals.supabase, 'uc_gallery_items', request)
};

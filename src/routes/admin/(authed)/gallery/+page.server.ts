import { fail } from '@sveltejs/kit';
import type { SupabaseClient } from '@supabase/supabase-js';
import { withGalleryUrl } from '$lib/server/supabase';
import { removePhotos } from '$lib/server/photo-storage';
import { moveRowAction } from '$lib/server/sortable';
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
	deleteItem: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = String(formData.get('id') ?? '');
		if (!id) return fail(400, { success: false, message: 'Öğe bulunamadı.' });

		const { data: item, error: fetchError } = await locals.supabase
			.from('uc_gallery_items')
			.select('photo')
			.eq('id', id)
			.maybeSingle();
		if (fetchError || !item) return fail(400, { success: false, message: 'Öğe bulunamadı.' });

		if (item.photo) await removePhotos(locals.supabase, [item.photo as string]);

		const { error } = await locals.supabase.from('uc_gallery_items').delete().eq('id', id);
		if (error) return fail(500, { success: false, message: `Silinemedi: ${error.message}` });

		return { success: true, message: 'Galeri öğesi silindi.' };
	},

	moveItem: ({ request, locals }) => moveRowAction(locals.supabase, 'uc_gallery_items', request)
};

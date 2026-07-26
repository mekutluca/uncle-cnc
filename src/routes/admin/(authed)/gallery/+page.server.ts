import { fail } from '@sveltejs/kit';
import type { SupabaseClient } from '@supabase/supabase-js';
import { withGalleryUrl } from '$lib/server/supabase';
import { removePhotos } from '$lib/server/machines';
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

	moveItem: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = String(formData.get('id') ?? '');
		const direction = Number(formData.get('direction'));
		if (!id || (direction !== 1 && direction !== -1))
			return fail(400, { success: false, message: 'Geçersiz istek.' });

		const { data, error } = await locals.supabase
			.from('uc_gallery_items')
			.select('id')
			.order('sort_order', { ascending: true })
			.order('created_at', { ascending: true });
		if (error || !data) return fail(500, { success: false, message: 'Liste alınamadı.' });

		const ids = data.map((row) => row.id as string);
		const index = ids.indexOf(id);
		const target = index + direction;
		if (index === -1 || target < 0 || target >= ids.length)
			return fail(400, { success: false, message: 'Geçersiz sıralama.' });

		[ids[index], ids[target]] = [ids[target], ids[index]];
		// Sıra numaraları dizin olarak baştan yazılır; eski kayıtlardaki eşit/boşluklu
		// sort_order değerleri de böylece normalize olur.
		for (const [position, rowId] of ids.entries()) {
			const { error: updateError } = await locals.supabase
				.from('uc_gallery_items')
				.update({ sort_order: position })
				.eq('id', rowId);
			if (updateError)
				return fail(500, { success: false, message: `Sıralanamadı: ${updateError.message}` });
		}

		return { success: true };
	}
};

import { fail } from '@sveltejs/kit';
import { parseGalleryFields, uploadGalleryPhoto } from '$lib/server/gallery';
import type { Actions } from './$types';

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const formData = await request.formData();
		const fields = parseGalleryFields(formData);
		if (typeof fields === 'string') return fail(400, { success: false, message: fields });

		// Yeni öğe listenin sonuna eklenir.
		const { data: last } = await locals.supabase
			.from('uc_gallery_items')
			.select('sort_order')
			.order('sort_order', { ascending: false })
			.limit(1)
			.maybeSingle();
		const sort_order = (last?.sort_order ?? -1) + 1;

		const { data: item, error } = await locals.supabase
			.from('uc_gallery_items')
			.insert({ ...fields, sort_order })
			.select('id')
			.single();
		if (error) return fail(500, { success: false, message: `Kaydedilemedi: ${error.message}` });

		const file = formData.get('photo');
		let photoFailed = false;
		if (file instanceof File && file.size) {
			const path = await uploadGalleryPhoto(locals.supabase, item.id, file);
			if (path) {
				await locals.supabase.from('uc_gallery_items').update({ photo: path }).eq('id', item.id);
			} else {
				photoFailed = true;
			}
		}

		return {
			success: true,
			message: photoFailed
				? 'Öğe eklendi ancak fotoğraf yüklenemedi.'
				: 'Galeri öğesi eklendi.'
		};
	}
};

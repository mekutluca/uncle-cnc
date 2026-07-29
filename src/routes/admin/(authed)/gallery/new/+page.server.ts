import { fail } from '@sveltejs/kit';
import { galleryFolder, parseGalleryFields } from '$lib/server/gallery';
import { uploadPhotoFile } from '$lib/server/photo-storage';
import { nextSortOrder } from '$lib/server/sortable';
import type { Actions } from './$types';

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const formData = await request.formData();
		const fields = parseGalleryFields(formData);
		if (typeof fields === 'string') return fail(400, { success: false, message: fields });

		const sort_order = await nextSortOrder(locals.supabase, 'uc_gallery_items');

		const { data: item, error } = await locals.supabase
			.from('uc_gallery_items')
			.insert({ ...fields, sort_order })
			.select('id')
			.single();
		if (error) return fail(500, { success: false, message: `Kaydedilemedi: ${error.message}` });

		const file = formData.get('photo');
		const thumb = formData.get('photo_thumb');
		let photoFailed = false;
		if (file instanceof File && file.size) {
			const path = await uploadPhotoFile(
				locals.supabase,
				galleryFolder(item.id),
				file,
				thumb instanceof File ? thumb : null
			);
			if (path) {
				await locals.supabase.from('uc_gallery_items').update({ photo: path }).eq('id', item.id);
			} else {
				photoFailed = true;
			}
		}

		return {
			success: true,
			message: photoFailed ? 'Öğe eklendi ancak fotoğraf yüklenemedi.' : 'Galeri öğesi eklendi.'
		};
	}
};

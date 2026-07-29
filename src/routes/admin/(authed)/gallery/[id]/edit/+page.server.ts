import { fail } from '@sveltejs/kit';
import { withGalleryUrl } from '$lib/server/supabase';
import { galleryFolder, parseGalleryFields } from '$lib/server/gallery';
import { removePhotos, uploadPhotoFile } from '$lib/server/photo-storage';
import type { GalleryItem, GalleryItemWithUrl } from '$lib/types';
import type { Actions, PageServerLoad } from './$types';

async function loadItem(locals: App.Locals, id: string): Promise<GalleryItemWithUrl> {
	const { data, error: fetchError } = await locals.supabase
		.from('uc_gallery_items')
		.select('*')
		.eq('id', id)
		.maybeSingle();
	if (fetchError || !data) throw new Error('Galeri öğesi bulunamadı');
	return withGalleryUrl(data as GalleryItem);
}

export const load: PageServerLoad = ({ params, locals }) => {
	// Akış (streaming): sayfa iskeletle açılır, form veri gelince kurulur.
	return { item: loadItem(locals, params.id) };
};

async function getPhoto(locals: App.Locals, id: string): Promise<string | null | undefined> {
	const { data } = await locals.supabase
		.from('uc_gallery_items')
		.select('photo')
		.eq('id', id)
		.maybeSingle();
	// undefined: kayıt yok; null: kayıt var ama fotoğrafsız.
	return data === null ? undefined : ((data.photo as string | null) ?? null);
}

export const actions: Actions = {
	update: async ({ request, params, locals }) => {
		const formData = await request.formData();
		const fields = parseGalleryFields(formData);
		if (typeof fields === 'string') return fail(400, { success: false, message: fields });

		const currentPhoto = await getPhoto(locals, params.id);
		if (currentPhoto === undefined)
			return fail(400, { success: false, message: 'Galeri öğesi bulunamadı.' });

		const file = formData.get('photo');
		const thumb = formData.get('photo_thumb');
		let newPath: string | null = null;
		let photoFailed = false;
		if (file instanceof File && file.size) {
			newPath = await uploadPhotoFile(
				locals.supabase,
				galleryFolder(params.id),
				file,
				thumb instanceof File ? thumb : null
			);
			photoFailed = newPath === null;
		}

		const { error: updateError } = await locals.supabase
			.from('uc_gallery_items')
			.update(newPath ? { ...fields, photo: newPath } : fields)
			.eq('id', params.id);
		if (updateError)
			return fail(500, { success: false, message: `Kaydedilemedi: ${updateError.message}` });

		// Yeni fotoğraf başarıyla bağlandıysa eskisi depodan temizlenir.
		if (newPath && currentPhoto) await removePhotos(locals.supabase, [currentPhoto]);

		return {
			success: true,
			message: photoFailed ? 'Kaydedildi ancak fotoğraf yüklenemedi.' : 'Değişiklikler kaydedildi.'
		};
	},

	deletePhoto: async ({ params, locals }) => {
		const currentPhoto = await getPhoto(locals, params.id);
		if (!currentPhoto) return fail(400, { success: false, message: 'Fotoğraf bulunamadı.' });

		const { error: updateError } = await locals.supabase
			.from('uc_gallery_items')
			.update({ photo: null })
			.eq('id', params.id);
		if (updateError)
			return fail(500, { success: false, message: `Silinemedi: ${updateError.message}` });

		await removePhotos(locals.supabase, [currentPhoto]);
		return { success: true, message: 'Fotoğraf silindi.' };
	}
};

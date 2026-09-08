import { fail } from '@sveltejs/kit';
import { withAnnouncementUrls } from '$lib/server/supabase';
import { announcementsFolder, parseAnnouncementFields } from '$lib/server/announcements';
import {
	deletePhotoAction,
	getPhotoPath,
	removePhotos,
	uploadPhotoFile
} from '$lib/server/photo-storage';
import type { Announcement, AnnouncementWithPhoto } from '$lib/types';
import type { Actions, PageServerLoad } from './$types';

async function loadAnnouncement(locals: App.Locals, id: string): Promise<AnnouncementWithPhoto> {
	const { data, error: fetchError } = await locals.supabase
		.from('uc_announcements')
		.select('*')
		.eq('id', id)
		.maybeSingle();
	if (fetchError || !data) throw new Error('Duyuru bulunamadı');
	return withAnnouncementUrls(data as Announcement);
}

export const load: PageServerLoad = ({ params, locals }) => {
	// Akış (streaming): sayfa iskeletle açılır, form veri gelince kurulur.
	return { announcement: loadAnnouncement(locals, params.id) };
};

export const actions: Actions = {
	update: async ({ request, params, locals }) => {
		const formData = await request.formData();
		const fields = parseAnnouncementFields(formData);
		if (typeof fields === 'string') return fail(400, { success: false, message: fields });

		const currentPhoto = await getPhotoPath(
			locals.supabase,
			'uc_announcements',
			'photo',
			params.id
		);
		if (currentPhoto === undefined)
			return fail(400, { success: false, message: 'Duyuru bulunamadı.' });

		const file = formData.get('photo');
		const thumb = formData.get('photo_thumb');
		let newPath: string | null = null;
		let photoFailed = false;
		if (file instanceof File && file.size) {
			newPath = await uploadPhotoFile(
				locals.supabase,
				announcementsFolder(params.id),
				file,
				thumb instanceof File ? thumb : null
			);
			photoFailed = newPath === null;
		}

		const updated_at = new Date().toISOString();
		const { error: updateError } = await locals.supabase
			.from('uc_announcements')
			.update(newPath ? { ...fields, photo: newPath, updated_at } : { ...fields, updated_at })
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

	deletePhoto: ({ params, locals }) =>
		deletePhotoAction(locals.supabase, 'uc_announcements', 'photo', params.id, {
			notFound: 'Fotoğraf bulunamadı.',
			success: 'Fotoğraf silindi.'
		})
};

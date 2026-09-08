import { fail } from '@sveltejs/kit';
import { announcementsFolder, parseAnnouncementFields } from '$lib/server/announcements';
import { uploadPhotoFile } from '$lib/server/photo-storage';
import type { Actions } from './$types';

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const formData = await request.formData();
		const fields = parseAnnouncementFields(formData);
		if (typeof fields === 'string') return fail(400, { success: false, message: fields });

		const { data: announcement, error } = await locals.supabase
			.from('uc_announcements')
			.insert(fields)
			.select('id')
			.single();
		if (error) return fail(500, { success: false, message: `Kaydedilemedi: ${error.message}` });

		const file = formData.get('photo');
		const thumb = formData.get('photo_thumb');
		let photoFailed = false;
		if (file instanceof File && file.size) {
			const path = await uploadPhotoFile(
				locals.supabase,
				announcementsFolder(announcement.id),
				file,
				thumb instanceof File ? thumb : null
			);
			if (path) {
				await locals.supabase
					.from('uc_announcements')
					.update({ photo: path })
					.eq('id', announcement.id);
			} else {
				photoFailed = true;
			}
		}

		return {
			success: true,
			message: photoFailed ? 'Duyuru eklendi ancak fotoğraf yüklenemedi.' : 'Duyuru eklendi.'
		};
	}
};

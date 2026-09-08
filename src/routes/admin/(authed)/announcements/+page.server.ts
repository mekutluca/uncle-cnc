import type { SupabaseClient } from '@supabase/supabase-js';
import { withAnnouncementUrls } from '$lib/server/supabase';
import { deleteWithPhotoCleanup } from '$lib/server/sortable';
import type { Announcement } from '$lib/types';
import type { Actions, PageServerLoad } from './$types';

/** Panel tüm kayıtları görür (taslak, planlı, süresi dolmuş dahil), en yeni başlangıç önce. */
async function listAllAnnouncements(supabase: SupabaseClient) {
	const { data, error } = await supabase
		.from('uc_announcements')
		.select('*')
		.order('starts_at', { ascending: false })
		.order('created_at', { ascending: false });
	if (error) throw new Error(error.message);
	return ((data ?? []) as Announcement[]).map(withAnnouncementUrls);
}

export const load: PageServerLoad = ({ locals }) => {
	// Akış (streaming): tablo iskeletle açılır, veri gelince dolar.
	return { announcements: listAllAnnouncements(locals.supabase) };
};

export const actions: Actions = {
	deleteAnnouncement: ({ request, locals }) =>
		deleteWithPhotoCleanup(
			locals.supabase,
			'uc_announcements',
			'photo',
			request,
			'Duyuru bulunamadı.',
			'Duyuru silindi.'
		)
};

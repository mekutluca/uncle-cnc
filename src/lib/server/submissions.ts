import { fail } from '@sveltejs/kit';
import type { SupabaseClient } from '@supabase/supabase-js';
import { SUBMISSION_PHOTOS_BUCKET } from '$lib/utils/storage';

/** Talebi fotoğraflarıyla birlikte siler — liste ve detay sayfaları paylaşır. */
export async function deleteSubmission(supabase: SupabaseClient, request: Request) {
	const formData = await request.formData();
	const id = String(formData.get('id') ?? '');
	if (!id) return fail(400, { success: false, message: 'Talep bulunamadı.' });

	const { data: row, error: fetchError } = await supabase
		.from('uc_form_submissions')
		.select('photos')
		.eq('id', id)
		.maybeSingle();
	if (fetchError || !row) return fail(400, { success: false, message: 'Talep bulunamadı.' });

	const photos = (row.photos ?? []) as string[];
	if (photos.length) {
		const { error: removeError } = await supabase.storage
			.from(SUBMISSION_PHOTOS_BUCKET)
			.remove(photos);
		if (removeError) console.error('Talep fotoğrafları silinemedi:', removeError.message);
	}

	const { error: deleteError } = await supabase.from('uc_form_submissions').delete().eq('id', id);
	if (deleteError)
		return fail(500, { success: false, message: `Silinemedi: ${deleteError.message}` });

	return { success: true, message: 'Talep silindi.' };
}

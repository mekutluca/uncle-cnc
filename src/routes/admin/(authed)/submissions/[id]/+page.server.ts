import { error, redirect } from '@sveltejs/kit';
import { deleteSubmission } from '$lib/server/submissions';
import { SUBMISSION_PHOTOS_BUCKET } from '$lib/utils/storage';
import type { FormSubmission } from '$lib/types';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { data, error: fetchError } = await locals.supabase
		.from('uc_form_submissions')
		.select('*')
		.eq('id', params.id)
		.maybeSingle();
	if (fetchError) error(500, `Talep alınamadı: ${fetchError.message}`);
	if (!data) error(404, 'Talep bulunamadı.');

	const submission = data as FormSubmission;

	// Görüntülenen talep okundu sayılır; hata kritik değil.
	if (!submission.is_read) {
		const { error: readError } = await locals.supabase
			.from('uc_form_submissions')
			.update({ is_read: true })
			.eq('id', submission.id);
		if (readError) console.error('Talep okundu işaretlenemedi:', readError.message);
		else submission.is_read = true;
	}

	// Private bucket: fotoğraflar 1 saatlik imzalı URL ile gösterilir.
	let photoUrls: string[] = [];
	if (submission.photos.length) {
		const { data: signed, error: signError } = await locals.supabase.storage
			.from(SUBMISSION_PHOTOS_BUCKET)
			.createSignedUrls(submission.photos, 3600);
		if (signError) console.error('İmzalı URL üretilemedi:', signError.message);
		photoUrls = (signed ?? [])
			.map((item) => item.signedUrl)
			.filter((url): url is string => Boolean(url));
	}

	return { submission, photoUrls };
};

export const actions: Actions = {
	deleteSubmission: async ({ request, locals }) => {
		const result = await deleteSubmission(locals.supabase, request);
		if ('success' in result && result.success) redirect(303, '/admin/submissions');
		return result;
	}
};

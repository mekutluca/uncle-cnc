import { error, fail } from '@sveltejs/kit';
import { deleteSubmission } from '$lib/server/submissions';
import type { FormSubmission } from '$lib/types';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { data, error: listError } = await locals.supabase
		.from('uc_form_submissions')
		.select('*')
		.order('created_at', { ascending: false });
	if (listError) error(500, `Talepler alınamadı: ${listError.message}`);
	return { submissions: (data ?? []) as FormSubmission[] };
};

export const actions: Actions = {
	deleteSubmission: ({ request, locals }) => deleteSubmission(locals.supabase, request),

	toggleRead: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = String(formData.get('id') ?? '');
		const isRead = String(formData.get('is_read') ?? '') === 'true';
		if (!id) return fail(400, { success: false, message: 'Talep bulunamadı.' });

		const { error: updateError } = await locals.supabase
			.from('uc_form_submissions')
			.update({ is_read: isRead })
			.eq('id', id);
		if (updateError)
			return fail(500, { success: false, message: `Güncellenemedi: ${updateError.message}` });
		return { success: true };
	}
};

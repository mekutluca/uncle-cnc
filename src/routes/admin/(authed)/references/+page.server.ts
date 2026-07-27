import { fail } from '@sveltejs/kit';
import type { SupabaseClient } from '@supabase/supabase-js';
import { withLogoUrl } from '$lib/server/supabase';
import { removePhotos } from '$lib/server/photo-storage';
import { moveRowAction } from '$lib/server/sortable';
import type { Reference } from '$lib/types';
import type { Actions, PageServerLoad } from './$types';

async function listAllReferences(supabase: SupabaseClient) {
	const { data, error } = await supabase
		.from('uc_references')
		.select('*')
		.order('sort_order', { ascending: true })
		.order('created_at', { ascending: true });
	if (error) throw new Error(error.message);
	return ((data ?? []) as Reference[]).map(withLogoUrl);
}

export const load: PageServerLoad = ({ locals }) => {
	// Akış (streaming): tablo iskeletle açılır, veri gelince dolar.
	return { references: listAllReferences(locals.supabase) };
};

export const actions: Actions = {
	deleteReference: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = String(formData.get('id') ?? '');
		if (!id) return fail(400, { success: false, message: 'Referans bulunamadı.' });

		const { data: reference, error: fetchError } = await locals.supabase
			.from('uc_references')
			.select('logo')
			.eq('id', id)
			.maybeSingle();
		if (fetchError || !reference)
			return fail(400, { success: false, message: 'Referans bulunamadı.' });

		if (reference.logo) await removePhotos(locals.supabase, [reference.logo as string]);

		const { error } = await locals.supabase.from('uc_references').delete().eq('id', id);
		if (error) return fail(500, { success: false, message: `Silinemedi: ${error.message}` });

		return { success: true, message: 'Referans silindi.' };
	},

	moveReference: ({ request, locals }) =>
		moveRowAction(locals.supabase, 'uc_references', request)
};

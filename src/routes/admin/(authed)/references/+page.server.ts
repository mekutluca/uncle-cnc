import type { SupabaseClient } from '@supabase/supabase-js';
import { withLogoUrl } from '$lib/server/supabase';
import { deleteWithPhotoCleanup, moveRowAction } from '$lib/server/sortable';
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
	deleteReference: ({ request, locals }) =>
		deleteWithPhotoCleanup(
			locals.supabase,
			'uc_references',
			'logo',
			request,
			'Referans bulunamadı.',
			'Referans silindi.'
		),

	moveReference: ({ request, locals }) => moveRowAction(locals.supabase, 'uc_references', request)
};

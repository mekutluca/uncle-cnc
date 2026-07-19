import { fail } from '@sveltejs/kit';
import type { SupabaseClient } from '@supabase/supabase-js';
import { photoUrl } from '$lib/server/supabase';
import { removePhotos } from '$lib/server/machines';
import type { Machine } from '$lib/types';
import type { Actions, PageServerLoad } from './$types';

async function listAllMachines(supabase: SupabaseClient) {
	const { data, error } = await supabase
		.from('uc_machines')
		.select('*')
		.order('created_at', { ascending: false });
	if (error) throw new Error(error.message);
	return ((data ?? []) as Machine[]).map((machine) => ({
		...machine,
		photoUrls: machine.photos.map(photoUrl)
	}));
}

export const load: PageServerLoad = ({ locals }) => {
	// Akış (streaming): tablo iskeletle açılır, veri gelince dolar.
	return { machines: listAllMachines(locals.supabase) };
};

export const actions: Actions = {
	deleteMachine: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = String(formData.get('id') ?? '');
		if (!id) return fail(400, { success: false, message: 'Makine bulunamadı.' });

		const { data: machine, error: fetchError } = await locals.supabase
			.from('uc_machines')
			.select('photos')
			.eq('id', id)
			.maybeSingle();
		if (fetchError || !machine)
			return fail(400, { success: false, message: 'Makine bulunamadı.' });

		await removePhotos(locals.supabase, (machine.photos as string[]) ?? []);

		const { error } = await locals.supabase.from('uc_machines').delete().eq('id', id);
		if (error) return fail(500, { success: false, message: `Silinemedi: ${error.message}` });

		return { success: true, message: 'Makine silindi.' };
	}
};

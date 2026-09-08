import { fail } from '@sveltejs/kit';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Stat } from '$lib/types';
import type { Actions, PageServerLoad } from './$types';

async function listAllStats(supabase: SupabaseClient): Promise<Stat[]> {
	const { data, error } = await supabase
		.from('uc_stats')
		.select('*')
		.order('sort_order', { ascending: true });
	if (error) throw new Error(error.message);
	return (data ?? []) as Stat[];
}

export const load: PageServerLoad = ({ locals }) => {
	// Akış (streaming): sayfa iskeletle açılır, veri gelince form kurulur.
	return { stats: listAllStats(locals.supabase) };
};

export const actions: Actions = {
	update: async ({ request, locals }) => {
		const formData = await request.formData();
		const ids = formData.getAll('id').map(String);
		if (!ids.length) return fail(400, { success: false, message: 'Kayıt bulunamadı.' });

		for (const id of ids) {
			const value = String(formData.get(`value-${id}`) ?? '').trim();
			const label = String(formData.get(`label-${id}`) ?? '').trim();
			if (!value || !label)
				return fail(400, { success: false, message: 'Tüm alanlar zorunludur.' });

			const { error } = await locals.supabase
				.from('uc_stats')
				.update({ value, label })
				.eq('id', id);
			if (error) return fail(500, { success: false, message: `Kaydedilemedi: ${error.message}` });
		}

		return { success: true, message: 'İstatistikler güncellendi.' };
	}
};

import { fail } from '@sveltejs/kit';
import { listAllSaleCategories } from '$lib/server/categories';
import { moveRowAction } from '$lib/server/sortable';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	// Akış (streaming): tablo iskeletle açılır, veri gelince dolar.
	return { categories: listAllSaleCategories(locals.supabase) };
};

export const actions: Actions = {
	deleteCategory: async ({ request, locals }) => {
		const formData = await request.formData();
		const id = String(formData.get('id') ?? '');
		if (!id) return fail(400, { success: false, message: 'Kategori bulunamadı.' });

		// Kategoriye bağlı ilan varsa silme engellenir — aksi halde ilanlar kategorisiz kalır.
		const { count, error: countError } = await locals.supabase
			.from('uc_machines')
			.select('id', { count: 'exact', head: true })
			.eq('category_id', id);
		if (countError)
			return fail(500, { success: false, message: `Silinemedi: ${countError.message}` });
		if (count)
			return fail(400, {
				success: false,
				message: `Bu kategoride ${count} ilan var. Önce ilanları başka kategoriye taşıyın.`
			});

		const { error } = await locals.supabase.from('uc_sale_categories').delete().eq('id', id);
		if (error) return fail(500, { success: false, message: `Silinemedi: ${error.message}` });

		return { success: true, message: 'Kategori silindi.' };
	},

	moveCategory: ({ request, locals }) =>
		moveRowAction(locals.supabase, 'uc_sale_categories', request)
};

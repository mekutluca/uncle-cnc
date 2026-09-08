import { fail } from '@sveltejs/kit';
import { parseSaleCategoryFields } from '$lib/server/categories';
import type { SaleCategory } from '$lib/types';
import type { Actions, PageServerLoad } from './$types';

async function loadCategory(locals: App.Locals, id: string): Promise<SaleCategory> {
	const { data, error: fetchError } = await locals.supabase
		.from('uc_sale_categories')
		.select('*')
		.eq('id', id)
		.maybeSingle();
	if (fetchError || !data) throw new Error('Kategori bulunamadı');
	return data as SaleCategory;
}

export const load: PageServerLoad = ({ params, locals }) => {
	// Akış (streaming): sayfa iskeletle açılır, form veri gelince kurulur.
	return { category: loadCategory(locals, params.id) };
};

export const actions: Actions = {
	update: async ({ request, params, locals }) => {
		const formData = await request.formData();
		const fields = parseSaleCategoryFields(formData);
		if (typeof fields === 'string') return fail(400, { success: false, message: fields });

		const { error } = await locals.supabase
			.from('uc_sale_categories')
			.update(fields)
			.eq('id', params.id);
		if (error) return fail(500, { success: false, message: `Kaydedilemedi: ${error.message}` });

		return { success: true, message: 'Değişiklikler kaydedildi.' };
	}
};

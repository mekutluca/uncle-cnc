import { fail } from '@sveltejs/kit';
import { parseSaleCategoryFields } from '$lib/server/categories';
import { nextSortOrder } from '$lib/server/sortable';
import type { Actions } from './$types';

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const formData = await request.formData();
		const fields = parseSaleCategoryFields(formData);
		if (typeof fields === 'string') return fail(400, { success: false, message: fields });

		const sort_order = await nextSortOrder(locals.supabase, 'uc_sale_categories');

		const { error } = await locals.supabase
			.from('uc_sale_categories')
			.insert({ ...fields, sort_order });
		if (error) return fail(500, { success: false, message: `Kaydedilemedi: ${error.message}` });

		return { success: true, message: 'Kategori eklendi.' };
	}
};

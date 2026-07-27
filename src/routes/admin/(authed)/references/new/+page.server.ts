import { fail } from '@sveltejs/kit';
import { parseReferenceFields, referencesFolder } from '$lib/server/references';
import { uploadPhotoFile } from '$lib/server/photo-storage';
import { nextSortOrder } from '$lib/server/sortable';
import type { Actions } from './$types';

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const formData = await request.formData();
		const fields = parseReferenceFields(formData);
		if (typeof fields === 'string') return fail(400, { success: false, message: fields });

		const sort_order = await nextSortOrder(locals.supabase, 'uc_references');

		const { data: reference, error } = await locals.supabase
			.from('uc_references')
			.insert({ ...fields, sort_order })
			.select('id')
			.single();
		if (error) return fail(500, { success: false, message: `Kaydedilemedi: ${error.message}` });

		const file = formData.get('logo');
		let logoFailed = false;
		if (file instanceof File && file.size) {
			// Logolar için küçük varyant üretilmez (zaten küçük gösterilirler).
			const path = await uploadPhotoFile(locals.supabase, referencesFolder(reference.id), file);
			if (path) {
				await locals.supabase.from('uc_references').update({ logo: path }).eq('id', reference.id);
			} else {
				logoFailed = true;
			}
		}

		return {
			success: true,
			message: logoFailed ? 'Referans eklendi ancak logo yüklenemedi.' : 'Referans eklendi.'
		};
	}
};

import { fail } from '@sveltejs/kit';
import { listAllSaleCategories } from '$lib/server/categories';
import {
	machineSaveMessage,
	parseMachineFields,
	photoUploadsFrom,
	uploadPhotos
} from '$lib/server/machines';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	return { categories: await listAllSaleCategories(locals.supabase) };
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const formData = await request.formData();
		const fields = parseMachineFields(formData);
		if (typeof fields === 'string') return fail(400, { success: false, message: fields });

		const { data: machine, error } = await locals.supabase
			.from('uc_machines')
			.insert(fields)
			.select('id')
			.single();
		if (error) return fail(500, { success: false, message: machineSaveMessage(error) });

		const { files, thumbs } = photoUploadsFrom(formData);
		const { paths, failed } = await uploadPhotos(locals.supabase, machine.id, files, thumbs);
		if (paths.length) {
			await locals.supabase.from('uc_machines').update({ photos: paths }).eq('id', machine.id);
		}

		return {
			success: true,
			message: failed
				? `İlan oluşturuldu ancak ${failed} fotoğraf yüklenemedi.`
				: 'İlan oluşturuldu.'
		};
	}
};

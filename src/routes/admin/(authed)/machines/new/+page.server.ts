import { fail } from '@sveltejs/kit';
import { parseMachineFields, uploadPhotos } from '$lib/server/machines';
import type { Actions } from './$types';

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
		if (error) {
			const message = error.code === '23505' ? 'Bu kısa ad zaten kullanılıyor.' : error.message;
			return fail(500, { success: false, message: `Kaydedilemedi: ${message}` });
		}

		const files = formData.getAll('photos').filter((f): f is File => f instanceof File);
		const { paths, failed } = await uploadPhotos(locals.supabase, machine.id, files);
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

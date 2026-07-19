import { fail } from '@sveltejs/kit';
import { withPhotoUrls } from '$lib/server/supabase';
import { parseMachineFields, removePhotos, uploadPhotos } from '$lib/server/machines';
import type { Machine, MachineWithPhotos } from '$lib/types';
import type { Actions, PageServerLoad } from './$types';

async function loadMachine(locals: App.Locals, id: string): Promise<MachineWithPhotos> {
	const { data, error: fetchError } = await locals.supabase
		.from('uc_machines')
		.select('*')
		.eq('id', id)
		.maybeSingle();
	if (fetchError || !data) throw new Error('Makine bulunamadı');
	return withPhotoUrls(data as Machine);
}

export const load: PageServerLoad = ({ params, locals }) => {
	// Akış (streaming): sayfa iskeletle açılır, form veri gelince kurulur.
	return { machine: loadMachine(locals, params.id) };
};

async function getPhotos(locals: App.Locals, id: string): Promise<string[] | null> {
	const { data } = await locals.supabase
		.from('uc_machines')
		.select('photos')
		.eq('id', id)
		.maybeSingle();
	return (data?.photos as string[]) ?? null;
}

export const actions: Actions = {
	update: async ({ request, params, locals }) => {
		const formData = await request.formData();
		const fields = parseMachineFields(formData);
		if (typeof fields === 'string') return fail(400, { success: false, message: fields });

		const currentPhotos = await getPhotos(locals, params.id);
		if (currentPhotos === null) return fail(400, { success: false, message: 'Makine bulunamadı.' });

		const files = formData.getAll('photos').filter((f): f is File => f instanceof File);
		const { paths, failed } = await uploadPhotos(locals.supabase, params.id, files);

		const { error: updateError } = await locals.supabase
			.from('uc_machines')
			.update({ ...fields, photos: [...currentPhotos, ...paths] })
			.eq('id', params.id);
		if (updateError) {
			const message =
				updateError.code === '23505' ? 'Bu kısa ad zaten kullanılıyor.' : updateError.message;
			return fail(500, { success: false, message: `Kaydedilemedi: ${message}` });
		}

		return {
			success: true,
			message: failed ? `Kaydedildi ancak ${failed} fotoğraf yüklenemedi.` : 'Değişiklikler kaydedildi.'
		};
	},

	deletePhoto: async ({ request, params, locals }) => {
		const formData = await request.formData();
		const path = String(formData.get('path') ?? '');
		const currentPhotos = await getPhotos(locals, params.id);
		if (!path || currentPhotos === null || !currentPhotos.includes(path))
			return fail(400, { success: false, message: 'Fotoğraf bulunamadı.' });

		const { error: updateError } = await locals.supabase
			.from('uc_machines')
			.update({ photos: currentPhotos.filter((p) => p !== path) })
			.eq('id', params.id);
		if (updateError)
			return fail(500, { success: false, message: `Silinemedi: ${updateError.message}` });

		await removePhotos(locals.supabase, [path]);
		return { success: true, message: 'Fotoğraf silindi.' };
	},

	reorderPhotos: async ({ request, params, locals }) => {
		const formData = await request.formData();
		let order: string[];
		try {
			order = JSON.parse(String(formData.get('paths') ?? '[]'));
		} catch {
			return fail(400, { success: false, message: 'Geçersiz sıralama.' });
		}

		const currentPhotos = await getPhotos(locals, params.id);
		if (
			currentPhotos === null ||
			order.length !== currentPhotos.length ||
			!order.every((path) => currentPhotos.includes(path))
		)
			return fail(400, { success: false, message: 'Geçersiz sıralama.' });

		const { error: updateError } = await locals.supabase
			.from('uc_machines')
			.update({ photos: order })
			.eq('id', params.id);
		if (updateError)
			return fail(500, { success: false, message: `Sıralanamadı: ${updateError.message}` });

		return { success: true };
	}
};

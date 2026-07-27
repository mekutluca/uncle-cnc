import { fail } from '@sveltejs/kit';
import { withLogoUrl } from '$lib/server/supabase';
import { parseReferenceFields, referencesFolder } from '$lib/server/references';
import { removePhotos, uploadPhotoFile } from '$lib/server/photo-storage';
import type { Reference, ReferenceWithLogo } from '$lib/types';
import type { Actions, PageServerLoad } from './$types';

async function loadReference(locals: App.Locals, id: string): Promise<ReferenceWithLogo> {
	const { data, error: fetchError } = await locals.supabase
		.from('uc_references')
		.select('*')
		.eq('id', id)
		.maybeSingle();
	if (fetchError || !data) throw new Error('Referans bulunamadı');
	return withLogoUrl(data as Reference);
}

export const load: PageServerLoad = ({ params, locals }) => {
	// Akış (streaming): sayfa iskeletle açılır, form veri gelince kurulur.
	return { reference: loadReference(locals, params.id) };
};

async function getLogo(locals: App.Locals, id: string): Promise<string | null | undefined> {
	const { data } = await locals.supabase
		.from('uc_references')
		.select('logo')
		.eq('id', id)
		.maybeSingle();
	// undefined: kayıt yok; null: kayıt var ama logosuz.
	return data === null ? undefined : ((data.logo as string | null) ?? null);
}

export const actions: Actions = {
	update: async ({ request, params, locals }) => {
		const formData = await request.formData();
		const fields = parseReferenceFields(formData);
		if (typeof fields === 'string') return fail(400, { success: false, message: fields });

		const currentLogo = await getLogo(locals, params.id);
		if (currentLogo === undefined)
			return fail(400, { success: false, message: 'Referans bulunamadı.' });

		const file = formData.get('logo');
		let newPath: string | null = null;
		let logoFailed = false;
		if (file instanceof File && file.size) {
			// Logolar için küçük varyant üretilmez (zaten küçük gösterilirler).
			newPath = await uploadPhotoFile(locals.supabase, referencesFolder(params.id), file);
			logoFailed = newPath === null;
		}

		const { error: updateError } = await locals.supabase
			.from('uc_references')
			.update(newPath ? { ...fields, logo: newPath } : fields)
			.eq('id', params.id);
		if (updateError)
			return fail(500, { success: false, message: `Kaydedilemedi: ${updateError.message}` });

		// Yeni logo başarıyla bağlandıysa eskisi depodan temizlenir.
		if (newPath && currentLogo) await removePhotos(locals.supabase, [currentLogo]);

		return {
			success: true,
			message: logoFailed ? 'Kaydedildi ancak logo yüklenemedi.' : 'Değişiklikler kaydedildi.'
		};
	},

	deleteLogo: async ({ params, locals }) => {
		const currentLogo = await getLogo(locals, params.id);
		if (!currentLogo) return fail(400, { success: false, message: 'Logo bulunamadı.' });

		const { error: updateError } = await locals.supabase
			.from('uc_references')
			.update({ logo: null })
			.eq('id', params.id);
		if (updateError)
			return fail(500, { success: false, message: `Silinemedi: ${updateError.message}` });

		await removePhotos(locals.supabase, [currentLogo]);
		return { success: true, message: 'Logo silindi.' };
	}
};

import { fail } from '@sveltejs/kit';
import type { SupabaseClient } from '@supabase/supabase-js';
import { removePhotos } from '$lib/server/photo-storage';
import type { SortableTable } from '$lib/types';

/** Yeni kayıt listenin sonuna eklenir: mevcut en büyük sıra numarası + 1. */
export async function nextSortOrder(
	supabase: SupabaseClient,
	table: SortableTable
): Promise<number> {
	const { data: last } = await supabase
		.from(table)
		.select('sort_order')
		.order('sort_order', { ascending: false })
		.limit(1)
		.maybeSingle();
	return (last?.sort_order ?? -1) + 1;
}

/**
 * Ortak sıralama aksiyonu: formdan id + direction (±1) alır, komşusuyla takas
 * eder ve sıra numaralarını dizin olarak baştan yazar — eski kayıtlardaki
 * eşit/boşluklu sort_order değerleri de böylece normalize olur.
 */
export async function moveRowAction(
	supabase: SupabaseClient,
	table: SortableTable,
	request: Request
) {
	const formData = await request.formData();
	const id = String(formData.get('id') ?? '');
	const direction = Number(formData.get('direction'));
	if (!id || (direction !== 1 && direction !== -1))
		return fail(400, { success: false, message: 'Geçersiz istek.' });

	const { data, error } = await supabase
		.from(table)
		.select('id')
		.order('sort_order', { ascending: true })
		.order('created_at', { ascending: true });
	if (error || !data) return fail(500, { success: false, message: 'Liste alınamadı.' });

	const ids = data.map((row) => row.id as string);
	const index = ids.indexOf(id);
	const target = index + direction;
	if (index === -1 || target < 0 || target >= ids.length)
		return fail(400, { success: false, message: 'Geçersiz sıralama.' });

	[ids[index], ids[target]] = [ids[target], ids[index]];
	for (const [position, rowId] of ids.entries()) {
		const { error: updateError } = await supabase
			.from(table)
			.update({ sort_order: position })
			.eq('id', rowId);
		if (updateError)
			return fail(500, { success: false, message: `Sıralanamadı: ${updateError.message}` });
	}

	return { success: true };
}

/**
 * Ortak silme aksiyonu: kaydı fotoğraf/logo kolonuyla birlikte siler — dosya
 * varsa önce depodan temizlenir, sonra satır silinir.
 */
export async function deleteWithPhotoCleanup(
	supabase: SupabaseClient,
	table: SortableTable,
	photoColumn: 'photo' | 'logo',
	request: Request,
	notFoundMessage: string,
	successMessage: string
) {
	const formData = await request.formData();
	const id = String(formData.get('id') ?? '');
	if (!id) return fail(400, { success: false, message: notFoundMessage });

	const { data: row, error: fetchError } = await supabase
		.from(table)
		.select(photoColumn)
		.eq('id', id)
		.maybeSingle();
	if (fetchError || !row) return fail(400, { success: false, message: notFoundMessage });

	const photo = (row as Record<string, string | null>)[photoColumn];
	if (photo) await removePhotos(supabase, [photo]);

	const { error } = await supabase.from(table).delete().eq('id', id);
	if (error) return fail(500, { success: false, message: `Silinemedi: ${error.message}` });

	return { success: true, message: successMessage };
}

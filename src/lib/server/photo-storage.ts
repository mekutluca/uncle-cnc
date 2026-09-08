import type { SupabaseClient } from '@supabase/supabase-js';
import { PHOTOS_BUCKET, thumbPath } from '$lib/utils/storage';

/**
 * Tek fotoğrafı küçük varyantıyla birlikte depoya yükler, yolu döner.
 * Yol düzeni: {folder}/{uuid}.{uzantı}. Varyant `thumbPath` ile aynı klasöre
 * gider. Varyant yüklemesi başarısız olsa da fotoğraf kabul edilir —
 * görüntüleme tarafı tam boyuta düşer (onerror).
 */
export async function uploadPhotoFile(
	supabase: SupabaseClient,
	folder: string,
	file: File,
	thumb: File | null = null
): Promise<string | null> {
	if (!file.size) return null;
	const ext = file.name.includes('.') ? file.name.split('.').pop() : 'jpg';
	const path = `${folder}/${crypto.randomUUID()}.${ext}`;
	const { error } = await supabase.storage
		.from(PHOTOS_BUCKET)
		.upload(path, file, { contentType: file.type });
	if (error) {
		console.error('Fotoğraf yüklenemedi:', error.message);
		return null;
	}

	if (thumb?.size) {
		const { error: thumbError } = await supabase.storage
			.from(PHOTOS_BUCKET)
			.upload(thumbPath(path), thumb, { contentType: thumb.type });
		if (thumbError) console.error('Küçük varyant yüklenemedi:', thumbError.message);
	}

	return path;
}

export async function removePhotos(supabase: SupabaseClient, paths: string[]): Promise<void> {
	if (!paths.length) return;
	// Küçük varyantlar da silinir. Olmayan yol hata üretmez.
	const allPaths = paths.flatMap((path) => [path, thumbPath(path)]);
	const { error } = await supabase.storage.from(PHOTOS_BUCKET).remove(allPaths);
	if (error) console.error('Fotoğraflar depodan silinemedi:', error.message);
}

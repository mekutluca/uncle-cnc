import type { SupabaseClient } from '@supabase/supabase-js';
import { serviceBySlug } from '$lib/data/services';
import { PHOTOS_BUCKET } from '$lib/utils/storage';
import type { GalleryFields } from '$lib/types';

/** Form alanlarını doğrular; hata durumunda kullanıcıya gösterilecek metin döner. */
export function parseGalleryFields(formData: FormData): GalleryFields | string {
	const label = String(formData.get('label') ?? '').trim();
	if (!label) return 'Etiket zorunludur.';

	const description = String(formData.get('description') ?? '').trim();
	if (!description) return 'Açıklama zorunludur.';

	const service_slug = String(formData.get('service_slug') ?? '').trim() || null;
	if (service_slug && !serviceBySlug(service_slug)) return 'Geçerli bir hizmet seçin.';

	return { label, description, service_slug };
}

/**
 * Galeri fotoğrafını depoya yükler, yolu döner.
 * Yol düzeni: gallery/{itemId}/{uuid}.{uzantı} — makine fotoğraflarıyla aynı bucket.
 */
export async function uploadGalleryPhoto(
	supabase: SupabaseClient,
	itemId: string,
	file: File
): Promise<string | null> {
	if (!file.size) return null;
	const ext = file.name.includes('.') ? file.name.split('.').pop() : 'jpg';
	const path = `gallery/${itemId}/${crypto.randomUUID()}.${ext}`;
	const { error } = await supabase.storage
		.from(PHOTOS_BUCKET)
		.upload(path, file, { contentType: file.type });
	if (error) {
		console.error('Galeri fotoğrafı yüklenemedi:', error.message);
		return null;
	}
	return path;
}

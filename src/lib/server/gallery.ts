import { serviceBySlug } from '$lib/data/services';
import type { GalleryFields } from '$lib/types';

/** Form alanlarını doğrular. Hata durumunda kullanıcıya gösterilecek metin döner. */
export function parseGalleryFields(formData: FormData): GalleryFields | string {
	const label = String(formData.get('label') ?? '').trim();
	if (!label) return 'Etiket zorunludur.';

	const description = String(formData.get('description') ?? '').trim();
	if (!description) return 'Açıklama zorunludur.';

	const service_slug = String(formData.get('service_slug') ?? '').trim() || null;
	if (service_slug && !serviceBySlug(service_slug)) return 'Geçerli bir hizmet seçin.';

	return { label, description, service_slug };
}

/** Galeri fotoğraflarının depo klasörü: gallery/{itemId} — makine fotoğraflarıyla aynı bucket. */
export const galleryFolder = (itemId: string) => `gallery/${itemId}`;

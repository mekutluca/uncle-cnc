import { PUBLIC_SUPABASE_URL } from '$env/static/public';

/** Makine fotoğraflarının tutulduğu herkese açık bucket — tek doğruluk kaynağı. */
export const PHOTOS_BUCKET = 'uc-machine-photos';

/** Depodaki yolun herkese açık URL'i (istemci ve sunucuda kullanılabilir). */
export function publicPhotoUrl(path: string): string {
	return `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/${PHOTOS_BUCKET}/${path}`;
}

/** Bir fotoğraf yolunun küçük varyantının yolu: {ad}.thumb.{uzantı}. Şemasızdır —
 * varyant, ana yoldan türetilir; ayrı bir sütunda tutulmaz. */
export function thumbPath(path: string): string {
	const dot = path.lastIndexOf('.');
	return dot > path.lastIndexOf('/') ? `${path.slice(0, dot)}.thumb${path.slice(dot)}` : `${path}.thumb`;
}

/** Küçük varyantın herkese açık URL'i. Varyantı olmayan (eski) fotoğraflarda
 * görüntüleme tarafı onerror ile tam boyuta düşer. */
export function publicThumbUrl(path: string): string {
	return publicPhotoUrl(thumbPath(path));
}

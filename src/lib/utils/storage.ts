import { PUBLIC_SUPABASE_URL } from '$env/static/public';

/** Makine fotoğraflarının tutulduğu herkese açık bucket — tek doğruluk kaynağı. */
export const PHOTOS_BUCKET = 'uc-machine-photos';

/** Depodaki yolun herkese açık URL'i (istemci ve sunucuda kullanılabilir). */
export function publicPhotoUrl(path: string): string {
	return `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/${PHOTOS_BUCKET}/${path}`;
}

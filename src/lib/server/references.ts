import type { ReferenceFields } from '$lib/types';

/** Form alanlarını doğrular. Hata durumunda kullanıcıya gösterilecek metin döner. */
export function parseReferenceFields(formData: FormData): ReferenceFields | string {
	const name = String(formData.get('name') ?? '').trim();
	if (!name) return 'Firma adı zorunludur.';

	const sector = String(formData.get('sector') ?? '').trim() || null;

	return { name, sector };
}

/** Logoların depo klasörü: references/{referenceId} — makine fotoğraflarıyla aynı bucket. */
export const referencesFolder = (referenceId: string) => `references/${referenceId}`;

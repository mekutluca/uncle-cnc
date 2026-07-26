import type { SupabaseClient } from '@supabase/supabase-js';
import { MACHINE_TYPES } from '$lib/data/machine-options';
import { uploadPhotoFile } from '$lib/server/photo-storage';
import type { Machine, MachineFields } from '$lib/types';

const STATUSES: Machine['status'][] = ['available', 'sold', 'hidden'];
const CURRENCIES: Machine['currency'][] = ['EUR', 'USD', 'TRY'];

/** Form alanlarını doğrular; hata durumunda kullanıcıya gösterilecek metin döner. */
export function parseMachineFields(formData: FormData): MachineFields | string {
	const title = String(formData.get('title') ?? '').trim();
	if (!title) return 'Başlık zorunludur.';

	const slug = String(formData.get('slug') ?? '').trim();
	if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug))
		return 'Kısa ad yalnızca küçük harf, rakam ve tire içerebilir.';

	const machine_type = String(formData.get('machine_type') ?? '');
	if (!(MACHINE_TYPES as readonly string[]).includes(machine_type))
		return 'Geçerli bir makine cinsi seçin.';

	const status = String(formData.get('status') ?? '') as Machine['status'];
	if (!STATUSES.includes(status)) return 'Geçerli bir durum seçin.';

	const currency = String(formData.get('currency') ?? '') as Machine['currency'];
	if (!CURRENCIES.includes(currency)) return 'Geçerli bir para birimi seçin.';

	const priceRaw = String(formData.get('price') ?? '').trim();
	let price: number | null = null;
	if (priceRaw !== '') {
		price = Number(priceRaw);
		if (!Number.isFinite(price) || price < 0) return 'Fiyat geçerli bir sayı olmalıdır.';
	}

	const description = String(formData.get('description') ?? '').trim() || null;

	const specKeys = formData.getAll('spec_key').map(String);
	const specValues = formData.getAll('spec_value').map(String);
	const specs: Record<string, string> = {};
	specKeys.forEach((key, index) => {
		const trimmedKey = key.trim();
		const value = (specValues[index] ?? '').trim();
		if (trimmedKey && value) specs[trimmedKey] = value;
	});

	return { title, slug, machine_type, status, price, currency, description, specs };
}

/**
 * Yeni fotoğrafları küçük varyantlarıyla birlikte depoya yükler, başarıyla
 * yüklenen yolları döner. Yol düzeni: {machineId}/{uuid}.{uzantı}.
 */
export async function uploadPhotos(
	supabase: SupabaseClient,
	machineId: string,
	files: File[],
	thumbs: File[] = []
): Promise<{ paths: string[]; failed: number }> {
	const paths: string[] = [];
	let failed = 0;

	for (const [index, file] of files.entries()) {
		if (!file.size) continue;
		const path = await uploadPhotoFile(supabase, machineId, file, thumbs[index] ?? null);
		if (path) paths.push(path);
		else failed += 1;
	}

	return { paths, failed };
}

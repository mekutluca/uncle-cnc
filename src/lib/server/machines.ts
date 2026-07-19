import type { SupabaseClient } from '@supabase/supabase-js';
import { MACHINE_TYPES } from '$lib/data/machine-options';
import type { Machine, MachineFields } from '$lib/types';

const BUCKET = 'uc-machine-photos';

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
 * Yeni fotoğrafları depoya yükler, başarıyla yüklenen yolları döner.
 * Yol düzeni: {machineId}/{uuid}.{uzantı}
 */
export async function uploadPhotos(
	supabase: SupabaseClient,
	machineId: string,
	files: File[]
): Promise<{ paths: string[]; failed: number }> {
	const paths: string[] = [];
	let failed = 0;

	for (const file of files) {
		if (!file.size) continue;
		const ext = file.name.includes('.') ? file.name.split('.').pop() : 'jpg';
		const path = `${machineId}/${crypto.randomUUID()}.${ext}`;
		const { error } = await supabase.storage
			.from(BUCKET)
			.upload(path, file, { contentType: file.type });
		if (error) {
			console.error('Fotoğraf yüklenemedi:', error.message);
			failed += 1;
			continue;
		}
		paths.push(path);
	}

	return { paths, failed };
}

export async function removePhotos(supabase: SupabaseClient, paths: string[]): Promise<void> {
	if (!paths.length) return;
	const { error } = await supabase.storage.from(BUCKET).remove(paths);
	if (error) console.error('Fotoğraflar depodan silinemedi:', error.message);
}

import type { MachineType } from '$lib/types';

/**
 * Tek doğruluk kaynağı: makine cinsleri ve cinse bağlı boyut seçenekleri.
 * Formlar ve static/__forms.html buradan türetilir — alan adları Türkçe kalır
 * çünkü Netlify e-posta bildirimlerinde müşteriye bu adlar görünür.
 */
export const MACHINE_TYPES = [
	'Dik işleme',
	'Torna',
	'Otomat',
	'5 eksen',
	'Köprü tipi',
	'Yatay işleme',
	'Diğer'
] as const;

/** Dizi → seçim listesi, 'text' → serbest metin, null → boyut alanı yok */
export const SIZE_OPTIONS: Record<MachineType, readonly string[] | 'text' | null> = {
	Torna: ['6 inch', '8 inch', '10 inch', '12 inch', 'Diğer'],
	'Dik işleme': ['400 mm’den küçük', '400–800 mm', '800–1000 mm', '1000–1200 mm', '1200 mm’den büyük'],
	'5 eksen': ['400 mm’den küçük', '400–500 mm', '500–600 mm', '600 mm’den büyük'],
	'Köprü tipi': 'text',
	'Yatay işleme': 'text',
	Otomat: 'text',
	Diğer: null
};

export const CURRENCIES = ['€', '$', 'TL'] as const;

export const CURRENT_YEAR = new Date().getFullYear();
export const MIN_MODEL_YEAR = 1980;

import type { MACHINE_TYPES } from '$lib/data/machine-options';

export type MachineType = (typeof MACHINE_TYPES)[number];

export type Service = {
	slug: string;
	/** Netlify form adı */
	formName: string;
	/** Plaka üzerindeki form kodu, ör. FORM NO: BAK-03 */
	code: string;
	title: string;
	/** Ana sayfa kartı için kısa açıklama */
	short: string;
	/** Hizmet sayfası giriş metni (PDF'ten) */
	intro: string;
	/** Formda bulunan alan grupları */
	fields: {
		machine: boolean;
		modelYear: 'none' | 'single' | 'range-by-intent';
		priceRange: boolean;
		photos: boolean | 'sell-only';
		faultDescription: boolean;
	};
};

/** Supabase `uc_machines` satırı */
export type Machine = {
	id: string;
	title: string;
	slug: string;
	machine_type: string;
	specs: Record<string, string | number>;
	price: number | null;
	currency: 'USD' | 'EUR' | 'TRY';
	status: 'available' | 'sold' | 'hidden';
	photos: string[];
	description: string | null;
	created_at: string;
};

export type Reference = { name: string; sector?: string };

export type GalleryItem = {
	label: string;
	description: string;
	/** Görselden ilgili hizmet formuna yönlendirme (PDF isteği) */
	serviceSlug: string;
};

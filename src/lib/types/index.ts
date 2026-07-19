import type WrenchIcon from '@lucide/svelte/icons/wrench';
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

/* ---------- Yönetim paneli ---------- */

export type SortOrder = 'asc' | 'desc';

/** Form aksiyonlarından dönen standart veri şekli */
export interface FormActionData {
	message?: string;
	success?: boolean;
	/** create aksiyonunun ürettiği kaydın id'si */
	id?: string;
}

export interface FormEnhanceOptions {
	beforeSubmit?: (formData: FormData) => void;
	onStart?: () => void;
	onFinish?: () => void;
	onSuccess?: (data?: FormActionData) => void;
	successMessage?: string;
	loadingMessage?: string;
}

/** Formda seçilmiş ama henüz yüklenmemiş fotoğraf */
export interface PendingPhoto {
	id: string;
	file: File;
	url: string;
}

export interface AdminRoute {
	href: string;
	label: string;
	icon: typeof WrenchIcon;
	group: string;
}

export type GalleryItem = {
	label: string;
	description: string;
	/** Görselden ilgili hizmet formuna yönlendirme (PDF isteği) */
	serviceSlug: string;
};

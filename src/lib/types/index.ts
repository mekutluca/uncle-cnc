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

/** Supabase `uc_references` satırı */
export type Reference = {
	id: string;
	name: string;
	sector: string | null;
	/** `uc-machine-photos` bucket'ındaki yol (references/{id}/…); boşsa yalnız isim gösterilir */
	logo: string | null;
	sort_order: number;
	created_at: string;
};

/** Görüntüleme için herkese açık logo URL'i eklenmiş referans kaydı */
export type ReferenceWithLogo = Reference & { logoUrl: string | null };

/** Referans formunun doğrulanmış alanları (id/logo/sort_order hariç) */
export type ReferenceFields = {
	name: string;
	sector: string | null;
};

/** Görüntüleme için herkese açık fotoğraf URL'leri eklenmiş makine kaydı */
export type MachineWithPhotos = Machine & { photoUrls: string[]; thumbUrls: string[] };

/** Talep formundaki ilan önizlemesi için gereken alanlar */
export type MachinePreview = Pick<
	Machine,
	'title' | 'price' | 'currency' | 'machine_type' | 'photos'
>;

/* ---------- Yönetim paneli ---------- */

/** Makine formunun doğrulanmış alanları (id/photos/created_at hariç) */
export type MachineFields = {
	title: string;
	slug: string;
	machine_type: string;
	status: Machine['status'];
	price: number | null;
	currency: Machine['currency'];
	description: string | null;
	specs: Record<string, string>;
};

export type SortOrder = 'asc' | 'desc';

/** `sort_order` kolonuyla panelden sıralanabilen tablolar */
export type SortableTable = 'uc_gallery_items' | 'uc_references';

/** Form aksiyonlarından dönen standart veri şekli */
export interface FormActionData {
	message?: string;
	success?: boolean;
}

export interface FormEnhanceOptions {
	beforeSubmit?: (formData: FormData) => void;
	onStart?: () => void;
	onFinish?: () => void;
	onSuccess?: (data?: FormActionData) => void;
	successMessage?: string;
	loadingMessage?: string;
}

/** Formda seçilmiş ama henüz yüklenmemiş logo (küçük varyant üretilmez) */
export type PendingLogo = { file: File; url: string };

/** Formda seçilmiş ama henüz yüklenmemiş fotoğraf */
export interface PendingPhoto {
	id: string;
	file: File;
	/** Kart/liste görünümleri için ~800px varyant; ana dosyayla birlikte yüklenir */
	thumb: File;
	url: string;
}

export interface AdminRoute {
	href: string;
	label: string;
	icon: typeof WrenchIcon;
	group: string;
}

/** Supabase `uc_gallery_items` satırı */
export type GalleryItem = {
	id: string;
	label: string;
	description: string;
	/** Görselden ilgili hizmet formuna yönlendirme (PDF isteği); boşsa bağlantı gösterilmez */
	service_slug: string | null;
	/** `uc-machine-photos` bucket'ındaki yol (gallery/{id}/…); boşsa yer tutucu gösterilir */
	photo: string | null;
	sort_order: number;
	created_at: string;
};

/** Görüntüleme için herkese açık fotoğraf URL'i eklenmiş galeri kaydı */
export type GalleryItemWithUrl = GalleryItem & {
	photoUrl: string | null;
	thumbUrl: string | null;
};

/** Galeri formunun doğrulanmış alanları (id/photo/sort_order hariç) */
export type GalleryFields = {
	label: string;
	description: string;
	service_slug: string | null;
};

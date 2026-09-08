import type { Component } from 'svelte';
import type WrenchIcon from '@lucide/svelte/icons/wrench';
import type { MACHINE_TYPES } from '$lib/data/machine-options';

export type MachineType = (typeof MACHINE_TYPES)[number];

/* ---------- shadcn-svelte bileşen yardımcıları (`$lib/utils` yeniden dışa aktarır) ---------- */

export type WithoutChild<T> = 'child' extends keyof T ? Omit<T, 'child'> : T;
export type WithoutChildren<T> = 'children' extends keyof T ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export type Service = {
	slug: string;
	/** Form adı (gönderimlerde `form-name` alanı) */
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
	category_id: string;
	specs: Record<string, string | number>;
	price: number | null;
	currency: 'USD' | 'EUR' | 'TRY';
	status: 'available' | 'sold' | 'hidden';
	photos: string[];
	description: string | null;
	created_at: string;
};

/** Supabase `uc_sale_categories` satırı — satış ilanlarının (makine, vb.) gruplandığı kategori */
export type SaleCategory = {
	id: string;
	title: string;
	sort_order: number;
	created_at: string;
};

/** Kategori formunun doğrulanmış alanları (id/sort_order hariç) */
export type SaleCategoryFields = {
	title: string;
};

/** Supabase `uc_references` satırı */
export type Reference = {
	id: string;
	name: string;
	sector: string | null;
	/** `uc-machine-photos` bucket'ındaki yol (references/{id}/…). Boşsa yalnız isim gösterilir */
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
	category_id: string;
	status: Machine['status'];
	price: number | null;
	currency: Machine['currency'];
	description: string | null;
	specs: Record<string, string>;
};

export type SortOrder = 'asc' | 'desc';

/** `sort_order` kolonuyla panelden sıralanabilen tablolar */
export type SortableTable = 'uc_gallery_items' | 'uc_references' | 'uc_sale_categories';

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
	/** Kart/liste görünümleri için ~800px varyant. Ana dosyayla birlikte yüklenir */
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
	/** Görselden ilgili hizmet formuna yönlendirme (PDF isteği). Boşsa bağlantı gösterilmez */
	service_slug: string | null;
	/** `uc-machine-photos` bucket'ındaki yol (gallery/{id}/…). Boşsa yer tutucu gösterilir */
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

/** Supabase `uc_stats` satırı — ana sayfa spec şeridi */
export type Stat = {
	id: string;
	value: string;
	label: string;
	sort_order: number;
	created_at: string;
};

/** Supabase `uc_form_submissions` satırı */
export type FormSubmission = {
	id: string;
	form_name: string;
	/** Form alanları anahtar-değer olarak (ör. ad_soyad, telefon…) */
	data: Record<string, string>;
	/** `uc-submission-photos` bucket'ındaki yollar. Görüntüleme imzalı URL ile */
	photos: string[];
	is_read: boolean;
	created_at: string;
};

/* ---------- Hata sayfaları ---------- */

export type ErrorKind = 'notFound' | 'forbidden' | 'server';

/** Hata türü başına ikon, sekme başlığı (`tab`) ve sayfa manşeti (`title`) */
export interface ErrorCopy {
	icon: Component;
	tab: string;
	title: string;
}

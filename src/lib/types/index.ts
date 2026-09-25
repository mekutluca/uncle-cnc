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

/** Tek fotoğraf/logo kolonu taşıyan tablolar (silmede depo temizliği yapılır) */
export type PhotoTable = 'uc_gallery_items' | 'uc_references' | 'uc_announcements';
export type PhotoColumn = 'photo' | 'logo';

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

/** Supabase `uc_announcements` satırı — duyurular ve isteğe bağlı açılır mesaj */
export type Announcement = {
	id: string;
	title: string;
	body: string;
	/** Mutlak URL ya da `/` ile başlayan site içi yol. Boşsa kart arşive bağlanır */
	link_url: string | null;
	link_label: string | null;
	/** `uc-machine-photos` bucket'ındaki yol (announcements/{id}/…). Boşsa görsel alanı çizilmez */
	photo: string | null;
	/** Görünürlük penceresi [starts_at, ends_at) yarı açıktır, ends_at null ise süresiz */
	starts_at: string;
	ends_at: string | null;
	published: boolean;
	/** Ziyaretçiye açılır mesaj olarak da gösterilsin mi */
	popup: boolean;
	/** Açılır mesajın ilk günden itibaren kaç gün süreceği (son günü aşamaz) */
	popup_days: number;
	created_at: string;
	updated_at: string;
};

/** Görüntüleme için herkese açık fotoğraf URL'leri eklenmiş duyuru */
export type AnnouncementWithPhoto = Announcement & {
	photoUrl: string | null;
	thumbUrl: string | null;
};

/** Duyuru formunun doğrulanmış alanları (id/photo/zaman damgaları hariç) */
export type AnnouncementFields = Omit<Announcement, 'id' | 'photo' | 'created_at' | 'updated_at'>;

/** Panel rozetinde gösterilen türetilmiş yayın durumu */
export type AnnouncementState = 'draft' | 'scheduled' | 'live' | 'ended';

/** Yayın penceresini belirleyen alanlar */
export type AnnouncementWindow = Pick<Announcement, 'published' | 'starts_at' | 'ends_at'>;

/** Açılır mesaj penceresini belirleyen alanlar */
export type AnnouncementPopupWindow = AnnouncementWindow &
	Pick<Announcement, 'popup' | 'popup_days'>;

/** `/api/announcements/popup` uç noktasının döndürdüğü özet */
export type PopupAnnouncement = Pick<
	Announcement,
	'id' | 'title' | 'body' | 'link_url' | 'link_label' | 'starts_at'
> & { photoUrl: string | null; thumbUrl: string | null };

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

/* ---------- Katalog ---------- */

/** `uc-catalog` bucket'ındaki geçerli (en yeni) PDF. */
export type CatalogFile = { name: string; size: number; uploadedAt: string | null };

/* ---------- Talep formları ---------- */

/** RequestForm'un içindeki SubmitButton'a context ile ilettiği gönderim durumu. */
export type RequestFormState = { readonly submitting: boolean };

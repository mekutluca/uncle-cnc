import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { publicPhotoUrl, publicThumbUrl } from '$lib/utils/storage';
import type {
	GalleryItem,
	GalleryItemWithUrl,
	Machine,
	MachineWithPhotos,
	Reference,
	ReferenceWithLogo
} from '$lib/types';

/** Halka açık sayfalar için anon (salt-okunur RLS) istemci — oturum tutmaz. */
export const supabaseAnon = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
	auth: { persistSession: false }
});

export function withPhotoUrls(machine: Machine): MachineWithPhotos {
	return {
		...machine,
		photoUrls: machine.photos.map(publicPhotoUrl),
		thumbUrls: machine.photos.map(publicThumbUrl)
	};
}

export async function listMachines(): Promise<Machine[]> {
	const { data, error } = await supabaseAnon
		.from('uc_machines')
		.select('*')
		.neq('status', 'hidden')
		.order('created_at', { ascending: false });
	if (error) {
		console.error('uc_machines listesi alınamadı:', error.message);
		return [];
	}
	return (data ?? []) as Machine[];
}

export function withGalleryUrl(item: GalleryItem): GalleryItemWithUrl {
	return {
		...item,
		photoUrl: item.photo ? publicPhotoUrl(item.photo) : null,
		thumbUrl: item.photo ? publicThumbUrl(item.photo) : null
	};
}

export async function listGalleryItems(): Promise<GalleryItem[]> {
	const { data, error } = await supabaseAnon
		.from('uc_gallery_items')
		.select('*')
		.order('sort_order', { ascending: true })
		.order('created_at', { ascending: true });
	if (error) {
		console.error('uc_gallery_items listesi alınamadı:', error.message);
		return [];
	}
	return (data ?? []) as GalleryItem[];
}

export function withLogoUrl(reference: Reference): ReferenceWithLogo {
	return { ...reference, logoUrl: reference.logo ? publicPhotoUrl(reference.logo) : null };
}

export async function listReferences(): Promise<Reference[]> {
	const { data, error } = await supabaseAnon
		.from('uc_references')
		.select('*')
		.order('sort_order', { ascending: true })
		.order('created_at', { ascending: true });
	if (error) {
		console.error('uc_references listesi alınamadı:', error.message);
		return [];
	}
	return (data ?? []) as Reference[];
}

export async function getMachine(slug: string): Promise<Machine | null> {
	const { data, error } = await supabaseAnon
		.from('uc_machines')
		.select('*')
		.eq('slug', slug)
		.neq('status', 'hidden')
		.maybeSingle();
	if (error) {
		console.error('uc_machines kaydı alınamadı:', error.message);
		return null;
	}
	return (data as Machine) ?? null;
}

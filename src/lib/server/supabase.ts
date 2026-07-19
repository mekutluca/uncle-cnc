import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { publicPhotoUrl } from '$lib/utils/storage';
import type { Machine, MachineWithPhotos } from '$lib/types';

/** Halka açık sayfalar için anon (salt-okunur RLS) istemci — oturum tutmaz. */
const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
	auth: { persistSession: false }
});

export function withPhotoUrls(machine: Machine): MachineWithPhotos {
	return { ...machine, photoUrls: machine.photos.map(publicPhotoUrl) };
}

export async function listMachines(): Promise<Machine[]> {
	const { data, error } = await supabase
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

export async function getMachine(slug: string): Promise<Machine | null> {
	const { data, error } = await supabase
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

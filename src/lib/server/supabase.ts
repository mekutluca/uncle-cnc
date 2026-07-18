import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';
import type { Machine } from '$lib/types';

const BUCKET = 'uc-machine-photos';

let client: SupabaseClient | null = null;

/** Env eksikse (örn. lokal geliştirme) site patlamaz; ilan listesi boş görünür. */
export function getSupabase(): SupabaseClient | null {
	if (client) return client;
	if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) return null;
	client = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
		auth: { persistSession: false }
	});
	return client;
}

export function photoUrl(path: string): string {
	const supabase = getSupabase();
	if (!supabase) return '';
	return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function listMachines(): Promise<Machine[]> {
	const supabase = getSupabase();
	if (!supabase) return [];
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
	const supabase = getSupabase();
	if (!supabase) return null;
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

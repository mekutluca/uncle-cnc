import type { SupabaseClient } from '@supabase/supabase-js';
import { CATALOG_BUCKET } from '$lib/utils/storage';
import type { CatalogFile } from '$lib/types';
import { supabaseAnon } from './supabase';

/** Bucket'taki en yeni PDF geçerli katalogdur. Yoksa null. */
export async function getCatalog(
	supabase: SupabaseClient = supabaseAnon
): Promise<CatalogFile | null> {
	const { data, error } = await supabase.storage
		.from(CATALOG_BUCKET)
		.list('', { limit: 1, sortBy: { column: 'created_at', order: 'desc' } });
	if (error) {
		console.error('Katalog listesi alınamadı:', error.message);
		return null;
	}
	const file = data?.find((entry) => entry.name.toLowerCase().endsWith('.pdf'));
	if (!file) return null;
	return {
		name: file.name,
		size: Number(file.metadata?.size ?? 0),
		uploadedAt: file.created_at
	};
}

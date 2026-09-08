import type { SupabaseClient } from '@supabase/supabase-js';
import type { SaleCategory, SaleCategoryFields } from '$lib/types';

/** Form alanlarını doğrular. Hata durumunda kullanıcıya gösterilecek metin döner. */
export function parseSaleCategoryFields(formData: FormData): SaleCategoryFields | string {
	const title = String(formData.get('title') ?? '').trim();
	if (!title) return 'Kategori adı zorunludur.';

	return { title };
}

/** Yönetim panelindeki tüm kategoriler, sıra numarasına göre — makine formu ve kategori listesi paylaşır. */
export async function listAllSaleCategories(supabase: SupabaseClient): Promise<SaleCategory[]> {
	const { data, error } = await supabase
		.from('uc_sale_categories')
		.select('*')
		.order('sort_order', { ascending: true })
		.order('created_at', { ascending: true });
	if (error) throw new Error(error.message);
	return (data ?? []) as SaleCategory[];
}

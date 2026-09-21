import { redirect } from '@sveltejs/kit';
import { getCatalog } from '$lib/server/catalog';
import { publicCatalogUrl } from '$lib/utils/storage';
import type { RequestHandler } from './$types';

export const prerender = false;

/**
 * Kalıcı katalog bağlantısı: basılı kartlardaki QR kod bu yolu gösterir. Dosya
 * nerede durursa dursun bu yol sabit kalır, en yeni PDF'e yönlendirir (indirme olarak).
 * Katalog yoksa taranan kod boşa düşmesin diye satılık makinelere gider.
 */
export const GET: RequestHandler = async ({ setHeaders }) => {
	setHeaders({ 'cache-control': 'no-store' });
	const catalog = await getCatalog();
	redirect(302, catalog ? publicCatalogUrl(catalog.name) : '/machines');
};

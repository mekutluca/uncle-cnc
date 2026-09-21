import QRCode from 'qrcode';
import { getCatalog } from '$lib/server/catalog';
import { site } from '$lib/data/site';
import { CATALOG_ROUTE } from '$lib/utils/storage';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const link = `${site.url}${CATALOG_ROUTE}`;
	// Baskı için vektör QR: kalıcı bağlantıyı gösterir, dosya değişse de geçerli kalır.
	const qrSvg = await QRCode.toString(link, {
		type: 'svg',
		errorCorrectionLevel: 'Q',
		margin: 2
	});
	return { link, qrSvg, catalog: getCatalog(locals.supabase) };
};

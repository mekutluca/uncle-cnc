import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies, setHeaders }) => {
	// Panel arama motorlarına kapalı; gizlilik değil görünürlük önlemi (güvenlik = RLS).
	setHeaders({ 'x-robots-tag': 'noindex' });

	const { session } = await safeGetSession();
	return { session, cookies: cookies.getAll() };
};
